# Voucher kinds and types

## The two fields

| Field | Owned by | Stable | Use for |
|---|---|---|---|
| `voucher_kind` | Bizmitra | Yes | Filtering, branching, business logic |
| `voucher_type` | The customer's Tally company | No | Display, and matching an exact configured type |

Tally lets users create and rename voucher types. Your customers will have done so. Any logic that switches on `voucher_type` works against your test company and fails on a real one.

**Branch on `voucher_kind`.**

## Writing vouchers

Each kind has its own endpoint:

| Endpoint | Creates |
|---|---|
| `POST /api/v1/invoices` | Sales invoice |
| `POST /api/v1/orders` | Sales order |
| `POST /api/v1/credit-notes` | Credit note |
| `POST /api/v1/debit-notes` | Debit note |
| `POST /api/v1/purchases` | Purchase |
| `POST /api/v1/receipts` | Receipt |
| `POST /api/v1/payments` | Payment |
| `POST /api/v1/contras` | Contra |
| `POST /api/v1/journals` | Journal |

All of them are asynchronous. All return a `transaction_id` you must check. See [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).

The document shape is common across kinds — see [Data model](/developer/platform-concepts/data-model). What differs is which parts are meaningful:

| Kind | `inventory_entries` | `ledger_entries` | Notes |
|---|---|---|---|
| Invoice, purchase | Usually | Always | Goods invoices carry both; service invoices carry only ledger entries |
| Credit / debit note | Usually | Always | Should reference the original document |
| Receipt, payment | No | Always | Money movement only |
| Contra | No | Always | Between the business's own accounts |
| Journal | No | Always | Adjustments; must balance |
| Sales order | Usually | Rarely | An order is not yet a financial posting |

## Reading vouchers

Vouchers created in Tally arrive through the pulled-voucher queue:

```http
GET /api/v1/pulled-vouchers?company_id={company_id}
```

Filter with either field:

| Parameter | Purpose |
|---|---|
| `voucher_kind` | Normalized kind — `sales`, `purchase`, `receipt`, … |
| `voucher_type` | Exact Tally type name |
| `status` | Consumption status |
| `start_date`, `end_date` | Inclusive voucher-date window |
| `limit`, `offset` | Pagination |

Use `voucher_kind` unless you have a specific reason not to.

::: tip The `invoices` response key
List responses return results under `invoices`, and detail responses under `invoice`, whatever the voucher kind. A purchase arrives under `invoices` too. Historical wire names, retained for compatibility — read them as "vouchers".
:::

## Dates

Pulled vouchers carry `voucher_date` in Tally's compact form:

```json
"voucher_date": "20260601"
```

That is `YYYYMMDD` — 1 June 2026. Payloads you submit use ISO dates (`"date": "2026-06-01"`). Convert deliberately at your boundary rather than passing strings through and hoping.

Filter parameters `start_date` and `end_date` are inclusive on both ends.

## Voucher numbers

`voucher_number` comes from Tally, and Tally's numbering is configured per voucher type per company. Some are automatic, some manual, some restart annually.

Do not assume voucher numbers are unique across a company, sequential, or gap-free. They are none of those things in general. Use `transaction_id` and `tally_voucher_guid` as identifiers; treat the number as a human-facing label.

## Discovering what a company actually uses

Before building against a customer's data, look at what is there. Pull a page of recent vouchers and inspect the distinct `voucher_type` values against their `voucher_kind`.

You will find things like:

| `voucher_type` in the wild | `voucher_kind` |
|---|---|
| `Sales` | `sales` |
| `GST Sales Invoice` | `sales` |
| `Retail Bill` | `sales` |
| `Tax Invoice - Branch` | `sales` |

Four names, one kind. This is normal, and it is the entire reason `voucher_kind` exists.
