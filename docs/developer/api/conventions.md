# Conventions

Behaviour that holds across the API. Reading this once is faster than rediscovering each item endpoint by endpoint.

## Response envelope

Responses carry a `success` flag alongside their payload:

```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "limit": 50,
  "offset": 0,
  "invoices": [ "..." ]
}
```

`success: true` on a write means **accepted**, not completed. See [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).

## Pagination

List endpoints paginate. Respect it.

| Field | Meaning |
|---|---|
| `count` | Items in this response |
| `total` | Items matching the query overall |
| `limit` | Page size |
| `offset` | Starting position |

Never assume one response contains everything. A company with three years of history has tens of thousands of vouchers, and the first page is not a representative sample.

```js
async function all(params) {
  const out = []
  let offset = 0
  const limit = 100

  for (;;) {
    const page = await get('/api/v1/pulled-vouchers', { ...params, limit, offset })
    out.push(...page.invoices)
    offset += limit
    if (offset >= page.total) break
  }
  return out
}
```

For large ranges, prefer narrowing by date over paging through everything.

## Dates

Two formats, in different places. Convert deliberately at your boundary.

| Context | Format | Example |
|---|---|---|
| Payloads you submit | ISO `YYYY-MM-DD` | `"2026-06-01"` |
| `voucher_date` from Tally | Compact `YYYYMMDD` | `"20260601"` |
| Filter parameters | ISO, inclusive both ends | `start_date`, `end_date` |

## Identifiers

| Identifier | Source | Meaning |
|---|---|---|
| `company_id` | Bizmitra | Developer Company ID. Integer. Not a Tally GUID. |
| `transaction_id` | Bizmitra | Correlates one operation. Your primary key for it. |
| `tally_voucher_guid` | Tally | The voucher itself. Needed to update it later. |
| `tally_master_id` | Tally | Tally's master ID |
| `tally_alter_id` | Tally | Increments when the voucher is edited in Tally |

Store `transaction_id` and `tally_voucher_guid` against your own records.

## Ignore unknown fields

Bizmitra adds fields within `v1`. Your parser must tolerate them.

This is a real compatibility requirement, not a style preference. A strict schema that rejects unknown properties will break on a routine additive release, and it will look like an outage. Configure your client to ignore extras.

## Names are exact

Ledger, stock item, godown, unit, and voucher-type names must match the target company exactly — including case and whitespace. Bizmitra does not fuzzy-match, because guessing which ledger you meant is not a safe thing to do with someone's accounts.

## `voucher_kind` over `voucher_type`

Branch on `voucher_kind`. It is Bizmitra's normalized category. `voucher_type` is whatever the customer named it in Tally and varies between companies. See [Voucher kinds and types](/developer/tally/voucher-kinds).

## Historical wire names

Pulled-voucher responses use `invoices` (list) and `invoice` (detail) regardless of kind. A purchase voucher arrives under `invoices`. Retained for compatibility; read them as "vouchers".

## Rate limiting

Be a reasonable client:

- Back off exponentially on retry, with jitter.
- Poll transactions at a sensible interval with backoff until they reach a terminal state. Transaction completion/failure webhooks are not currently available.
- Batch date-ranged reads rather than requesting voucher-by-voucher.
- Remember the far end is one desktop machine, not a datacentre. There is a real limit to how fast a single Connector can work through a queue.

## Idempotency

Assume any request may be delivered more than once. Design writes so that a duplicate submission does not produce a duplicate voucher. Covered in [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).
