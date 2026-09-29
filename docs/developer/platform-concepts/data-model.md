# Data model

This is where most of Bizmitra's value sits. The transport is straightforward; the modelling is not.

## The shape of a voucher

Every accounting document Bizmitra handles — invoice, purchase, receipt, journal — is a **voucher**. They share one structure:

```json
{
  "voucher_type": "Sales",
  "voucher_number": "INV-DEMO-002",
  "date": "2026-06-01",
  "reference": "PO-DEMO-001",
  "party_ledger": "Example Customer",
  "gst": { "...": "statutory context" },
  "buyer": { "...": "who is billed" },
  "consignee": { "...": "where the goods went" },
  "dispatch": { "...": "how they travelled" },
  "inventory_entries": [ "...what moved" ],
  "ledger_entries": [ "...where the money went" ]
}
```

Two lists do the real work, and they answer different questions.

**`inventory_entries`** — what physically moved. Stock item, quantity, rate, unit, godown, HSN code, taxability, and the GST rates that apply to it. Each entry also carries `accounting_allocations`, saying which revenue ledger that line's value lands in.

**`ledger_entries`** — the double-entry effect. Every ledger touched, with a signed amount. The party ledger, the tax ledgers, any rounding.

A service invoice has no `inventory_entries` at all. A stock transfer has no meaningful `ledger_entries`. Most sales invoices have both.

## Signs

Amounts in `ledger_entries` are **signed**, and the signs are not decorative — they are the debits and credits.

```json
"ledger_entries": [
  { "ledger_name": "Example Customer", "amount": -1416, "is_party": true },
  { "ledger_name": "CGST", "amount": 108, "is_tax": true },
  { "ledger_name": "SGST", "amount": 108, "is_tax": true }
]
```

Get a sign wrong and you have not made a formatting mistake — you have posted the opposite transaction. Tally may accept it. The customer's accountant will find it later.

## Bill-wise allocations

A ledger entry can carry `bill_allocations` — the bills that line opens or settles.

```json
{
  "ledger_name": "Acme Pvt Ltd", "amount": 10000, "is_debit": false, "is_party": true,
  "bill_allocations": [
    { "name": "Bm/26-27/1", "bill_type": "Agst Ref", "amount": 5000 },
    { "name": "Bm/26-27/2", "bill_type": "Agst Ref", "amount": 5000 }
  ]
}
```

This is a different question from the amount. The amount says ten thousand rupees arrived from Acme; the allocations say five of it clears one invoice and five clears another. Tally tracks those separately, and only the allocations feed Bills Outstanding and ageing.

Omit them and nothing errors. The ledger balance is right, the receipt appears in the day book, and the money sits unallocated — so the customer's outstanding report still shows both invoices unpaid. That is the failure mode: silent, and visible only to whoever chases the debtors.

`bill_type` is Tally's four-valued type of reference.

| `bill_type` | Means | Typical on |
|---|---|---|
| `New Ref` | Opens a new bill | Sales, purchase |
| `Agst Ref` | Settles an existing bill | Receipt, payment |
| `Advance` | Money moved before the bill exists | Receipt, payment |
| `On Account` | Deliberately unallocated — carries no `name` | Any |

Two rules worth knowing before you send one:

- An `Agst Ref` `name` must match a bill **actually outstanding for that party**. It is not a free-text reference. Send one Tally cannot find and it parks the whole voucher as an import exception rather than posting it partially.
- The allocation `amount` is a magnitude; its sign is taken from the ledger line. You can omit it when a line settles exactly one bill, and the whole line is allocated.

There is no credit-period or due-date field. Tally accepts one on import and ignores it, and does not export it on the voucher — so it is omitted rather than offered as a key that quietly does nothing.

## `voucher_kind` vs `voucher_type`

This distinction catches people out constantly.

| Field | Owned by | Example | Stable? |
|---|---|---|---|
| `voucher_kind` | Bizmitra | `sales`, `purchase`, `receipt`, `sales_order` | Yes — normalized |
| `voucher_type` | The customer's Tally company | `Sales`, `Tax Invoice`, `Retail Bill` | No — user-configurable |

Tally lets users create and rename voucher types freely. One customer's sales invoices are `Sales`; another's are `GST Sales Invoice`; a third renamed theirs in 2019 and nobody remembers why.

**Filter and branch on `voucher_kind`.** Use `voucher_type` when you need the exact name — displaying it, or matching a specific configured type in a known company.

Code that switches on `voucher_type` works perfectly against your test company and breaks on your first real customer.

## Master names are exact

Ledgers, stock items, godowns, units, and voucher types are referenced **by name**, and the name must match the target company exactly.

```json
{ "party_ledger": "Example Customer" }
```

This requires a ledger called precisely `Example Customer`. Not `example customer`. Not `Example Customer ` with a trailing space.

Bizmitra does not invent masters to make a payload work — silently creating a ledger in someone's books because a string did not match would be worse than failing. Either pre-create them, or create them deliberately through [Masters](/developer/tally/masters).

## Statutory context

The `gst` block carries what the tax treatment depends on:

```json
"gst": {
  "registration_type": "Regular",
  "place_of_supply": "Gujarat",
  "state": "Gujarat",
  "party_gstin": "24AAAAA0000A1Z5"
}
```

`place_of_supply` against the company's own state determines whether tax splits into CGST + SGST or becomes a single IGST line. Same goods, same value, different ledgers entirely.

This is the knowledge gap the platform is meant to close. If you are integrating an order system and have never had to reason about place of supply, that is exactly the point — but the field still has to be right, because only your system knows where the goods went.

Per-line rates live with the line, not the document, because a single invoice can mix rates:

```json
"gst_rates": [
  { "duty_head": "CGST", "rate": 9 },
  { "duty_head": "SGST/UTGST", "rate": 9 }
]
```

## Who is billed, and where the goods went

`gst` says how the transaction is taxed. Three further blocks say who and where — and they are separate from `gst` because a sale can be billed to one party and delivered to another.

```json
"buyer":     { "name": "...", "mailing_name": "...", "address": ["..."],
               "pincode": "...", "state": "...", "country": "...", "gstin": "..." },
"consignee": { "name": "...", "pincode": "...", "state": "...",
               "country": "...", "gstin": "..." },
"dispatch":  { "doc_no": "...", "date": "2026-06-01", "through": "...",
               "destination": "...", "place_of_receipt": "...",
               "vessel_flight_no": "...", "order_reference": "...",
               "payment_terms": "...", "delivery_note_no": "...",
               "delivery_note_date": "2026-05-31" }
```

**`buyer`** is the bill-to party — the block a printed invoice puts under *Buyer (Bill to)*. `name` falls back to `party_ledger`, so it only needs setting when the billing name differs from the ledger name.

**`consignee`** is the ship-to party, and `consignee.state` is the field that makes the block worth having: it is the **delivery** state, held independently of the buyer's state in `gst`. Without it a "bill to Rajasthan, deliver to Gujarat" sale cannot be represented at all — and it is what an e-way bill and any ship-to GST determination are read from. Only your system knows where the goods actually went.

**`dispatch`** is the shipping record: carrier, destination, dispatch document, and the delivery note the voucher was raised against. `buyer.address` is an array of lines; on a write, a single newline-separated string is accepted too.

::: warning A consignee has no street address on the voucher
Tally keeps consignee street lines in the party ledger's **address book** and stores only a reference to the chosen entry on the voucher. So `consignee` carries the name, pincode, state, country and GSTIN — the fields that drive reporting — and no usable address lines. A `consignee.address` you send is accepted rather than rejected, but it does not reach Tally, and it reads back as an empty array. Put a ship-to street address on the ledger master.
:::

::: warning Optional writing, `null` reading
All three blocks are optional on a write, field by field, and an omitted or `null` field means "I have nothing for this" — never "clear what Tally holds". Omit a block and Tally keeps inferring those fields from the party ledger master.

Reading, a block is `null` — not an empty object — when the voucher carries none of that data, which is the common case and always true for a journal or a payment. Test the block before reaching into it.
:::

`buyer.state` and `buyer.gstin` are the same two voucher fields as `gst.state` and `gst.party_gstin`. Send them in whichever block fits your data model; `gst` wins if both are set.

These blocks are **symmetric**: the names you write are the names you read back, so a voucher pulled from Tally can be pushed again without remapping. That is not true of everything — see below.

## Reading vs writing

The two directions are not mirror images.

**Writing**, you supply a normalized document and Bizmitra resolves it against the company's masters and statutory configuration.

**Reading**, you receive a normalized representation under `invoice_json`, plus Tally's own identifiers:

```json
{
  "transaction_id": "00000000-0000-0000-0000-000000000001",
  "tally_voucher_guid": "00000000-0000-0000-0000-000000000001-00000001",
  "tally_master_id": "334",
  "tally_alter_id": 1254,
  "voucher_kind": "sales",
  "voucher_type": "Sales",
  "invoice_json": { "...": "the normalized voucher" }
}
```

::: tip A historical wire name
The list endpoint returns its results under the key `invoices`, and the detail endpoint under `invoice`, regardless of voucher kind. A purchase voucher arrives under `invoices` too. The names are historical and retained for compatibility — read them as "vouchers".
:::

## Practical modelling advice

- **Store `transaction_id` and `tally_voucher_guid`** on your own records. Both. The first correlates, the second targets.
- **Never match on names.** Names change; identifiers do not.
- **Ignore fields you do not recognize.** New fields are added within `v1`, and a strict parser will break on one. See [Versioning](/developer/api/lifecycle).
- **Round explicitly.** Decide where rounding lives and apply it consistently, or your totals will drift by a rupee and nobody will be able to say why.
- **Keep the raw response.** When a customer disputes a figure six months from now, having what Bizmitra actually returned is worth a great deal.
