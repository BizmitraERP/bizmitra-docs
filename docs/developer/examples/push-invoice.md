# Create an invoice in Tally

This walkthrough submits a normalized sales invoice and verifies the final Tally result.

::: warning Use a test company
Writes are real and there is no undo. Run this against a dedicated Tally test company.
:::

## The flow

```mermaid
flowchart LR
    A["Check health"] --> B["Submit invoice"]
    B --> C["Persist transaction_id"]
    C --> D["Poll status"]
    D --> E["Persist tally_voucher_guid"]
```

Step 3 before step 4. If your process dies between submitting and persisting, you have made a write you can no longer track — and retrying blind is how duplicates appear.

## 0. Check health first

```http
GET {{base_url}}/api/v1/companies/{{company_id}}/health
```

One cheap request that removes an entire category of confusing failure. See [Company health](/developer/tally/company-health).

## 1. Submit

```http
POST {{base_url}}/api/v1/invoices
Authorization: Bearer {{key_id}}:{{secret}}
X-Bizmitra-Company: {{company_id}}
Accept: application/json
Content-Type: application/json
```

```json
{
  "event_type": "invoice_create",
  "request_type": "in",
  "invoice": {
    "voucher_type": "Sales",
    "voucher_number": "INV-DEMO-002",
    "date": "2026-06-01",
    "reference": "PO-DEMO-001",
    "party_ledger": "Example Customer",
    "gst": {
      "registration_type": "Regular",
      "place_of_supply": "Gujarat",
      "state": "Gujarat",
      "party_gstin": "24AAAAA0000A1Z5"
    },
    "inventory_entries": [
      {
        "stock_item": "Example Item",
        "qty": 100,
        "rate": 12,
        "amount": 1200,
        "unit": "Nos",
        "godown": "Main Location",
        "hsn": "33345",
        "taxability": "Taxable",
        "gst_rates": [
          { "duty_head": "CGST", "rate": 9 },
          { "duty_head": "SGST/UTGST", "rate": 9 }
        ],
        "accounting_allocations": [
          { "ledger_name": "Sales", "amount": 1200 }
        ]
      }
    ],
    "ledger_entries": [
      { "ledger_name": "Example Customer", "amount": -1416, "is_party": true },
      { "ledger_name": "CGST", "amount": 108, "is_tax": true },
      { "ledger_name": "SGST", "amount": 108, "is_tax": true }
    ]
  }
}
```

### What the payload is doing

**`inventory_entries`** — what moved. The `accounting_allocations` inside each line say which revenue ledger that line's value lands in.

**`ledger_entries`** — the double-entry effect, with signed amounts. The party is negative; the tax ledgers are positive. These signs are the debits and credits — reversing one posts the opposite transaction.

**`gst`** — the statutory context. `place_of_supply` against the company's own state decides whether tax splits into CGST + SGST or becomes a single IGST line. Same goods, same value, different ledgers.

**Every name must exist.** `Example Customer`, `Example Item`, `Nos`, `Main Location`, `Sales`, `CGST`, `SGST` must all exist in the target company, matching exactly. This is the most common cause of a first write failing. See [Masters](/developer/tally/masters).

### The voucher reference

`reference` is the one free-text reference Tally keeps per voucher, and **what it means depends on the voucher type**. On a sales invoice it is the buyer's order or reference number. On a purchase it is the **Supplier Invoice No.** — your supplier's own invoice number, which Tally matches against GSTR-2B when the customer claims input credit. Sending it there is not cosmetic; without it that reconciliation has nothing to match on.

`reference_date` is its date — the Supplier Invoice date on a purchase:

```json
{
  "voucher": {
    "voucher_type": "Purchase",
    "voucher_number": "PUR-DEMO-001",
    "date": "2026-04-01",
    "reference": "SUP/2026/0042",
    "reference_date": "2026-03-28",
    "party_ledger": "Example Supplier"
  }
}
```

Both fields are optional and both work on every voucher family — invoices, orders, purchases, credit and debit notes, receipts, payments, contras and journals.

**`reference_date` defaults to the voucher date.** Send `reference` alone and Tally stores the voucher's own date beside it, which is what it does when someone types a supplier invoice number in the UI and leaves the date alone. Send it explicitly whenever the supplier's invoice predates your entry, as it usually does — a wrong Supplier Invoice date is a reconciliation mismatch in the same way a missing one is.

The pull side returns both under the same names, so a voucher read out of Tally pushes back with its reference intact.

::: warning Requires connector v0.0.44
Earlier connectors accepted `reference` and silently discarded it: the request succeeded, the job completed, and the stored voucher came back with the tag empty. If a customer is on an older build, the field will not land — check the connector version before concluding the value was wrong.

Sales orders are the partial exception: they carried `reference` before v0.0.44, but never `reference_date`.
:::

### Bill-to, ship-to and dispatch

Three optional blocks — `buyer`, `consignee` and `dispatch` — carry who is billed, where the goods go, and how they travelled. Add them beside `gst`:

```json
{
  "invoice": {
    "party_ledger": "Example Customer",
    "gst": {
      "registration_type": "Regular",
      "place_of_supply": "Rajasthan",
      "state": "Rajasthan",
      "party_gstin": "24AAAAA0000A1Z5"
    },
    "buyer": {
      "name": "Example Customer",
      "mailing_name": "Example Customer Pvt Ltd",
      "address": ["1st Road", "2nd Road"],
      "pincode": "444444",
      "country": "India"
    },
    "consignee": {
      "name": "Example Warehouse",
      "pincode": "382110",
      "state": "Gujarat",
      "country": "India",
      "gstin": "24BBBBB0000B1Z5"
    },
    "dispatch": {
      "doc_no": "DC-9",
      "date": "2026-06-01",
      "through": "Blue Dart",
      "destination": "Ahmedabad",
      "place_of_receipt": "Gandhinagar",
      "vessel_flight_no": null,
      "delivery_note_no": "DN-3",
      "delivery_note_date": "2026-05-31",
      "payment_terms": "30 Days"
    }
  }
}
```

**Everything here is optional, at every level.** Omit a block and Tally keeps inferring those fields from the party ledger master, exactly as it did before these blocks existed. Inside a block, a field you send as `null` or `""` is treated as absent rather than as an instruction to clear the value — so a partly-populated customer record never blanks out what Tally already knows. There is no "clear this field" form of these blocks; to change a stored value, send the new one.

**`buyer` is the bill-to party.** It fills the block the printed invoice puts under *Buyer (Bill to)*. `name` defaults to `party_ledger`, so you only set it when billing under a different name from the ledger's; `mailing_name` is the longer legal name where the two differ.

**`consignee` is the ship-to party, and `consignee.state` is the field that earns the block.** It is the *delivery* state, held independently of the buyer's state in `gst` — which is what makes a "bill to Rajasthan, deliver to Gujarat" sale representable at all, and what an e-way bill and any ship-to GST determination are read from. The block does **not** default to the buyer: when goods go to the buyer's own address, leave it out and let Tally use the party's address.

::: warning The consignee's street lines are not a voucher field
`consignee` takes `name`, `pincode`, `state`, `country` and `gstin` — but **not** usable street lines. Tally does not store a consignee address on the voucher: it keeps the lines in the party ledger's address book and the voucher references the chosen entry by id. Ten candidate tags were tested against a live TallyPrime 7 and all were discarded.

`consignee.address` is still accepted rather than rejected, so a payload built from a full address record does not error — but the lines will not appear in Tally or on the printed invoice, and they come back empty on the pull side. Put the ship-to street address on the ledger master if you need it to print.
:::

**`dispatch` is the shipping record** — carrier, destination, dispatch document, and the delivery-note reference this invoice is raised against. Dates are ISO `YYYY-MM-DD`; a date that cannot be parsed drops that single field rather than failing the push, so a bad `dispatch.date` never costs you the voucher.

::: tip `state` and `gstin` can go in either block
`buyer.state` and `buyer.gstin` are the same two voucher fields as `gst.state` and `gst.party_gstin`. Send them wherever they fit your data model — next to the rest of the address, or next to the rest of the GST context. If you set both, `gst` wins. They are written to Tally once either way.
:::

The same three blocks come back on the [pull side](/developer/examples/pull-vouchers) under the same names, so a voucher read out of Tally can be pushed back without remapping.

### The same body covers purchases, credit notes and debit notes

`POST /api/v1/purchases`, `/credit-notes` and `/debit-notes` take this identical body — `gst`, `buyer`, `consignee` and `dispatch` blocks included — under `voucher` instead of `invoice`. They are one shape with one builder behind them; only the accounting direction differs, and the endpoint applies it. Send positive magnitudes and do not encode signs yourself.

`POST /api/v1/orders` takes them too. On an order, `consignee` is often the whole point: the delivery address is agreed when the order is placed, and it carries through to the invoice that follows.

On a purchase the `gst` block carries the **supplier's** registration type, state and GSTIN, and stamps them on the voucher. Send them. Omit them and the voucher falls back to whatever the party ledger master happens to hold. `buyer` likewise describes the supplier on a purchase, and `consignee` the place you received the goods.

::: tip `gst` does not control input credit
The block is party and place-of-supply context, nothing more. Whether ITC is claimed follows from the ledgers you post to — the purchase or expense ledger in each item's `accounting_allocations`, and the tax ledgers in `ledger_entries`. A purchase where the buyer absorbs the tax is expressed by posting to a ledger configured that way, not by dropping `gst`.
:::

### An invoice with no stock items

A consultancy fee, room revenue, an expense bill booked straight to a ledger — anything with nothing to put in an inventory block. **Omit `inventory_entries` entirely** and put the income or expense ledger in `ledger_entries` beside the party and the tax lines:

```json
{
  "event_type": "invoice_create",
  "request_type": "in",
  "invoice": {
    "voucher_type": "Sales",
    "voucher_number": "INV-SRV-001",
    "date": "2026-06-01",
    "party_ledger": "Example Customer",
    "gst": {
      "registration_type": "Regular",
      "place_of_supply": "Gujarat",
      "state": "Gujarat",
      "party_gstin": "24AAAAA0000A1Z5"
    },
    "ledger_entries": [
      { "ledger_name": "Example Customer",   "amount": -29500, "is_party": true },
      { "ledger_name": "Consultancy Income", "amount":  25000 },
      { "ledger_name": "CGST",               "amount":   2250, "is_tax": true },
      { "ledger_name": "SGST",               "amount":   2250, "is_tax": true }
    ]
  }
}
```

Tally calls this an **accounting invoice**, as opposed to the *item invoice* above, and the two are genuinely different voucher shapes inside Tally. You do not select between them: the connector decides from whether you sent inventory lines, and sets Tally's mode accordingly. There is no field for it — anything you send named `is_item_invoice` is ignored.

**The lines must sum to zero.** `-29500 + 25000 + 2250 + 2250 = 0`. On an item invoice the revenue side rides inside `accounting_allocations`, so the top-level lines do not balance on their own; here they are the entire voucher, so they must.

::: danger `is_party` belongs on the party line, and only there
It does two things at once: it supplies the voucher total, and it removes that line from the lines being posted. Put it on `Consultancy Income` and you delete the income side and give the party the wrong total — an invoice for ₹25,000 with no particulars.

Tally does **not** reject that. It answers `200` with `Errors: 0, Exceptions: 1` and parks an incomplete voucher carrying the party name and nothing else, which reads as a successful push from your side and is only visible by opening the voucher in Tally. Bizmitra now refuses such a payload before sending and names the mis-flagged ledger, but the rule is worth knowing: **one `is_party`, on the party.**
:::

The same applies to `/purchases`, `/credit-notes` and `/debit-notes`. It does **not** apply to orders — Tally has no accounting-only Sales Order or Purchase Order, so an order without `inventory_entries` is rejected.

::: info Requires connector v0.0.42
Earlier connectors could not post an accounting invoice at all: a payload with no inventory failed outright, and one with `"inventory_entries": []` was accepted and then silently discarded by Tally.
:::

## 2. Retain the transaction

```json
{
  "success": true,
  "transaction_id": "11111111-1111-1111-1111-111111111111",
  "company_id": 123,
  "request_type": "in"
}
```

::: danger This is not proof the voucher exists
`success: true` means Bizmitra accepted and queued the request. Tally has not necessarily run yet, and when it does it may reject the voucher.

Persist `transaction_id` against your record now, before anything else.
:::

## 3. Verify the result

```http
GET {{base_url}}/api/v1/transactions/{{transaction_id}}
```

```json
{
  "success": true,
  "status": "completed",
  "transaction_id": "11111111-1111-1111-1111-111111111111",
  "tally_voucher_guid": "22222222-2222-2222-2222-222222222222-00000001",
  "tally_master_id": "335"
}
```

::: info Provisional envelope
This is the intended contract, being finalized against production. A successful result will always expose `transaction_id` and the Tally voucher GUID.
:::

Poll with backoff — a couple of seconds initially, widening. Better still, use [webhooks](/developer/webhooks/) and poll only as a fallback.

**Persist `tally_voucher_guid`.** Without it, a later update has no way to target the existing voucher and will create a second one.

## 4. Handle failure

```json
{
  "success": true,
  "status": "failed",
  "transaction_id": "11111111-1111-1111-1111-111111111111"
}
```

Note `success: true` with `status: "failed"` — the query succeeded, the work did not. Branch on `status`.

| Cause | Fix |
|---|---|
| A named master does not exist | Create it, or correct the name |
| Name mismatch — case, trailing space | Match the company exactly |
| GST validation | Check the `gst` block and that the company has GST enabled |
| Unbalanced entries | Debits and credits must net correctly |
| Voucher type not configured | The company has no such type |

Do not retry a validation failure automatically. Tally rejected it once and will reject it identically forever.

## Putting it together

```js
async function pushInvoice(record, companyId) {
  // Already submitted? Poll, do not resubmit.
  if (record.transaction_id) {
    return pollUntilSettled(record.transaction_id)
  }

  const health = await api.get(`/api/v1/companies/${companyId}/health`)
  if (!health.ready) throw new ConnectorUnavailable(health)

  let accepted
  try {
    accepted = await api.post('/api/v1/invoices', buildPayload(record), {
      headers: { 'X-Bizmitra-Company': companyId },
    })
  } catch (err) {
    // Ambiguous failure: the job may have been created. Never blind-retry.
    if (isTimeout(err)) throw new NeedsReconciliation(record.id)
    throw err
  }

  await db.records.update(record.id, { transaction_id: accepted.transaction_id })

  const result = await pollUntilSettled(accepted.transaction_id)

  if (result.status === 'completed') {
    await db.records.update(record.id, {
      tally_voucher_guid: result.tally_voucher_guid,
      synced_at: result.completed_at,
    })
  }

  return result
}
```

The two lines that matter most are the early return at the top and the timeout branch. Together they are the reason this function cannot create a duplicate voucher.

## Updating an invoice later

Target the stored `tally_voucher_guid`. An update that identifies the voucher by number or by party name will not find it reliably, and will create a second voucher instead of amending the first.
