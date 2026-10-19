# API reference

Base URL: `https://bizmitra.io` · Version prefix: `/api/v1`

All endpoints require `Authorization: Bearer {key_id}:{secret}`.

::: info Public preview
This page lists the endpoint surface. Detailed per-endpoint request and response schemas are being published progressively. The [Postman collection](/developer/examples/postman) is the most complete executable reference today.
:::

## Utility

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/ping` | Verify authentication |
| `GET` | `/api/v1/tally/{resource}` | Tally bridge passthrough |

## Writing vouchers

All are asynchronous and return a `transaction_id`. See [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).

| Method | Endpoint | Creates |
|---|---|---|
| `POST` | `/api/v1/invoices` | Sales invoice |
| `POST` | `/api/v1/orders` | Sales order |
| `POST` | `/api/v1/credit-notes` | Credit note |
| `POST` | `/api/v1/debit-notes` | Debit note |
| `POST` | `/api/v1/purchases` | Purchase |
| `POST` | `/api/v1/receipts` | Receipt |
| `POST` | `/api/v1/payments` | Payment |
| `POST` | `/api/v1/contras` | Contra |
| `POST` | `/api/v1/journals` | Journal |

## Transactions

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/transactions?company_id={id}` | List transaction status |
| `GET` | `/api/v1/transactions/{job}` | Status of one transaction |

## Reading vouchers

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/pulled-vouchers?company_id={id}` | List vouchers from Tally |
| `GET` | `/api/v1/pulled-vouchers/{transaction_id}?company_id={id}` | Fetch one voucher in full |
| `POST` | `/api/v1/pulled-vouchers/ack` | Acknowledge consumption |

List filters: `voucher_kind`, `voucher_type`, `status`, `start_date`, `end_date`, `limit`, `offset`.

Walkthrough: [Pull vouchers from Tally](/developer/examples/pull-vouchers).

## Reports

Every report is a `GET`. There is nothing to request or refresh: the Connector reads each report from Tally on its own schedule and stores it, for every company whose application has that report enabled. Your read returns the latest stored copy.

Every report needs the company: send `X-Bizmitra-Company`, or `company_reference` (your `cmp_…` reference) as a query parameter.

| Method | Endpoint | Returns | Enabled by |
|---|---|---|---|
| `GET` | `/api/v1/balance-sheet` | Balance Sheet, every head opened down to its ledgers | `report.financial_statements` |
| `GET` | `/api/v1/trial-balance` | Trial Balance (closing Dr / Cr), every group opened down to its ledgers | `report.financial_statements` |
| `GET` | `/api/v1/profit-loss-statement` | Profit & Loss, every income and expense group opened down to its ledgers | `report.financial_statements` |
| `GET` | `/api/v1/ledger?ledger_name={name}` | One ledger's vouchers, as Tally's Ledger report shows them | `report.ledger` |
| `GET` | `/api/v1/stock-summary` | Stock summary, all items | `report.stock` |
| `GET` | `/api/v1/stock/monthly?item_name={name}` | Monthly movement for one item | `report.stock` |
| `GET` | `/api/v1/stock/vouchers?item_name={name}` | Vouchers affecting one item | `report.stock` |
| `GET` | `/api/v1/stock-tree` | Stock group tree | `report.stock` |
| `GET` | `/api/v1/funds-flow` | Funds flow, 12 months | `report.financials` |
| `GET` | `/api/v1/cash-flow` | Cash flow, 12 months | `report.cash_flow` |
| `GET` | `/api/v1/cash-bank-book` | Closing balance of every cash and bank ledger, with its group | `report.cash_bank_book` |
| `GET` | `/api/v1/bank-recon` | Uncleared bank entries. `bank_ledger` narrows to one bank | `report.bank_recon` |
| `GET` | `/api/v1/gst` | GSTR-1 and GSTR-3B return view. Filters: `statement_type`, `period_key`, `section_key` | `report.gst` |
| `GET` | `/api/v1/gst/stats` | Which GST periods are held, and when they last refreshed | `report.gst` |
| `GET` | `/api/v1/tds-summary` | TDS outstanding per party | `report.tds` |
| `GET` | `/api/v1/tds/bills?party={name}` | One party's TDS bills | `report.tds` |
| `GET` | `/api/v1/bills-receivable` | Pending bills the company is owed. `party` narrows to one party | `report.bills_receivable` |
| `GET` | `/api/v1/bills-payable` | Pending bills the company owes. `party` narrows to one party | `report.bills_payable` |

A report your application does not have enabled answers `403` with `capability_not_allowed`. If the application has it but the company's customer was not given it, the answer is `403` with `sync_capability_not_assigned`. Once it is enabled, the Connector picks it up within a few minutes and its first pull follows.

### How current a report is

Each read carries a `freshness` block. `data_status` says what you are reading: `current` or `available` (stored and usable), `partial`, `stale`, `no_data` (pulled, and Tally held nothing), `never_synced`, `failed` or `disabled`. `data_as_of` is when the stored copy was taken. The Connector refreshes most reports about every 15 minutes while Tally is open with the company loaded. On a computer set to business hours, the heavier reports refresh after hours, and GST about hourly during the day.

### Balance Sheet, Trial Balance and Profit & Loss

These three come in Tally's detailed view. Every row has `name`, `row_type` (`group` or `ledger`) and `parent_group` (the group it sits under; `null` for a main head), so the tree can be rebuilt. For example, **Sundry Debtors** is followed by each debtor and their balance, and sub-groups are opened the same way. A group's figure is the sum of the rows beneath it.

- They are read for Tally's current period, as Tally shows them, and stored under `range_key` `current`. A read without `range_key` returns the latest.
- The Balance Sheet and Profit & Loss give one signed `amount` per row (Dr negative, Cr positive; take `abs()` to match Tally's screen). The Trial Balance gives `closing_debit` and `closing_credit`.
- Tally does not export its "Difference in opening balances" line. When a company has one, the Balance Sheet and Trial Balance totals differ by exactly that amount.

::: tip One Profit & Loss
`GET /api/v1/profit-loss-statement` is the Profit & Loss. The older `/api/v1/profit-loss` and every `…/refresh` endpoint have been removed.
:::

## Masters

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/masters/{type}` | Create a master |
| `GET` | `/api/v1/masters/{type}?company_id={id}` | List master jobs |
| `GET` | `/api/v1/masters/{type}/{job}` | Status of one master job |
| `GET` | `/api/v1/pulled-masters/{type}?company_id={id}` | List masters read back from Tally |

`{type}` is one of `group`, `ledger`, `currency`, `unit`, `godown`, `stock_group`, `stock_category`, `stock_item`, `voucher_type`. Hyphens are accepted (`stock-item`).

The first three endpoints report **your pushes**. `pulled-masters` reports **what exists in the customer's company** — it requires the `pull.master` capability and the masters pull enabled for that company. List filters: `limit` (max 200), `offset`.

See [Masters](/developer/tally/masters).

## Applications

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/applications` | List applications |

## Customers

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/customers` | List customers |
| `POST` | `/api/v1/customers` | Create a customer |
| `POST` | `/api/v1/customers/{token}/rotate` | Rotate a customer token |

## Companies

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/companies` | List companies |
| `POST` | `/api/v1/companies` | Create a company |
| `POST` | `/api/v1/companies/{id}/customer` | Attach a company to a customer |
| `DELETE` | `/api/v1/companies/{id}/customer` | Detach a company from a customer |
| `GET` | `/api/v1/companies/{id}/health` | Connector and Tally readiness |
| `POST` | `/api/v1/companies/{id}/disconnect` | Disconnect from its Connector |

## Pairing

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/connectors/pairing-code` | Generate a pairing code |
| `GET` | `/api/v1/connectors/pairing-codes` | List outstanding codes |
| `POST` | `/api/v1/connectors/pairing-codes/{id}/revoke` | Revoke a code |

See [Pairing a company](/developer/tally/pairing).

## Connectors

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/connectors` | List the fleet |
| `GET` | `/api/v1/connectors/{machine}` | One connector |
| `GET` | `/api/v1/connectors/{machine}/companies` | Companies it serves |
| `GET` | `/api/v1/connectors/{machine}/jobs` | Sync history |
| `PATCH` | `/api/v1/connectors/{machine}` | Rename |
| `POST` | `/api/v1/connectors/{machine}/disable` | Stop it taking work |
| `POST` | `/api/v1/connectors/{machine}/enable` | Resume |
| `DELETE` | `/api/v1/connectors/{machine}` | Remove |

See [Connectors](/developer/platform-concepts/connectors).

## Webhooks

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/webhooks` | List endpoints |
| `POST` | `/api/v1/webhooks` | Create an endpoint |
| `GET` | `/api/v1/webhooks/{id}` | Get one endpoint |
| `PATCH` | `/api/v1/webhooks/{id}` | Update an endpoint |
| `DELETE` | `/api/v1/webhooks/{id}` | Delete an endpoint |
| `POST` | `/api/v1/webhooks/{id}/rotate-secret` | Rotate the signing secret |
| `POST` | `/api/v1/webhooks/{id}/test` | Send a test event |
| `GET` | `/api/v1/webhooks/{id}/deliveries` | Delivery history |

See [Webhooks](/developer/webhooks/).
