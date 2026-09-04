# Pull vouchers from Tally

This walkthrough lists Tally-originated vouchers, fetches one in full, processes it idempotently, and acknowledges it.

::: info Provisional fields
`status` values and `last_synced_at` are being finalized against production. The identifiers and overall structure are stable.
:::

## The flow

```mermaid
flowchart LR
    A["List vouchers"] --> B["Fetch one in full"]
    B --> C["Process idempotently"]
    C --> D["Commit"]
    D --> E["Acknowledge"]
```

Acknowledgement comes **after** your commit. That ordering is the whole point of the queue.

## 1. List vouchers

```http
GET {{base_url}}/api/v1/pulled-vouchers?company_id={{company_id}}
Authorization: Bearer {{key_id}}:{{secret}}
Accept: application/json
```

Filters:

| Parameter | Purpose |
|---|---|
| `company_id` | Required. Bizmitra Developer Company ID. |
| `voucher_kind` | Normalized kind — `sales`, `purchase`, `receipt`, … |
| `voucher_type` | Exact Tally voucher-type name |
| `status` | Consumption status |
| `start_date`, `end_date` | Inclusive voucher-date window |
| `limit`, `offset` | Pagination |

Use `voucher_kind` for filtering. `voucher_type` is whatever the customer named it and varies between companies — see [Voucher kinds and types](/developer/tally/voucher-kinds).

```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "limit": 50,
  "offset": 0,
  "invoices": [
    {
      "bizmitra_company_id": 123,
      "transaction_id": "00000000-0000-0000-0000-000000000001",
      "tally_voucher_guid": "00000000-0000-0000-0000-000000000001-00000001",
      "tally_master_id": "334",
      "tally_alter_id": 1254,
      "voucher_date": "20260601",
      "voucher_kind": "sales",
      "voucher_type": "Sales",
      "voucher_number": "INV-DEMO-001",
      "status": "pulled",
      "last_synced_at": null
    }
  ]
}
```

Two things to notice:

**`invoices` is a historical wire name.** It contains any voucher kind — purchases arrive here too.

**Respect `total`, `limit`, and `offset`.** One page is not all the vouchers. A company with three years of history has tens of thousands.

## 2. Fetch one voucher

```http
GET {{base_url}}/api/v1/pulled-vouchers/{{transaction_id}}?company_id={{company_id}}
Authorization: Bearer {{key_id}}:{{secret}}
Accept: application/json
```

```json
{
  "success": true,
  "invoice": {
    "bizmitra_company_id": 123,
    "transaction_id": "00000000-0000-0000-0000-000000000001",
    "voucher_kind": "sales",
    "voucher_type": "Sales",
    "voucher_number": "INV-DEMO-001",
    "invoice_json": {
      "date": "2026-06-01",
      "party_ledger": "Example Customer",
      "inventory_entries": [
        {
          "stock_item": "Example Item",
          "qty": 100,
          "rate": 12,
          "amount": 1200,
          "unit": "Nos"
        }
      ],
      "totals": {
        "taxable": 1200,
        "tax": 216,
        "invoice_total": 1416
      }
    }
  }
}
```

The list gives you metadata; the detail gives you `invoice_json`, the normalized document. See [Data model](/developer/platform-concepts/data-model).

## 3. Process idempotently

Use `transaction_id` as the external key on your own record.

```js
async function ingest(voucher) {
  const existing = await db.vouchers.findByExternalId(voucher.transaction_id)

  if (existing) {
    // Seen before. Update if Tally's alter id moved; otherwise ignore.
    if (voucher.tally_alter_id > existing.tally_alter_id) {
      await db.vouchers.update(existing.id, mapFrom(voucher))
    }
    return existing.id
  }

  return db.vouchers.insert({
    external_id: voucher.transaction_id,
    tally_voucher_guid: voucher.tally_voucher_guid,
    tally_alter_id: voucher.tally_alter_id,
    ...mapFrom(voucher),
  })
}
```

`tally_alter_id` increments when a voucher is edited in Tally. Comparing it is how you tell a genuine update from a redelivery of something you already have.

Never key on `voucher_number`. Tally's numbering is configured per voucher type per company, can restart annually, and is not guaranteed unique.

## 4. Acknowledge

```http
POST {{base_url}}/api/v1/pulled-vouchers/ack
Authorization: Bearer {{key_id}}:{{secret}}
Content-Type: application/json
```

Acknowledgement moves processed vouchers out of the default pending queue. It is idempotent, so acknowledging twice is harmless.

::: warning Acknowledge after your commit, never before
If you acknowledge first and your own transaction then fails, the voucher has left the pending queue and your database does not have it. You will not see it again in the default query.

Order: process → commit → acknowledge.
:::

## Putting it together

```js
async function sync(companyId) {
  let offset = 0
  const limit = 100

  for (;;) {
    const page = await api.get('/api/v1/pulled-vouchers', {
      company_id: companyId, status: 'pulled', limit, offset,
    })

    for (const summary of page.invoices) {
      const { invoice } = await api.get(
        `/api/v1/pulled-vouchers/${summary.transaction_id}`,
        { company_id: companyId },
      )

      await db.transaction(async () => {
        await ingest({ ...summary, ...invoice })
      })

      await api.post('/api/v1/pulled-vouchers/ack', {
        company_id: companyId,
        transaction_id: summary.transaction_id,
      })
    }

    offset += limit
    if (offset >= page.total) break
  }
}
```

## Moving off polling

Once this works, subscribe to [webhooks](/developer/webhooks/) so you are told when vouchers arrive, and keep a version of this loop as a daily reconciliation sweep rather than your primary path.
