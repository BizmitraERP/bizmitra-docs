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

Reports come in two kinds, and which kind decides whether your figures are current:

- **Kept current by the Connector.** The Connector re-reads these from Tally on its own schedule. Just `GET` them.
- **Pulled on request.** Nothing refreshes these on its own. `POST …/refresh` asks the Connector to read the report from Tally, and `GET` reads what it stored. If you never refresh, every read returns the last pull, however old.

Every report needs the company: send `X-Bizmitra-Company`, or `company_reference` (your `cmp_…` reference) as a query parameter on a read or in the body of a refresh.

### Kept current by the Connector

| Method | Endpoint | Returns |
|---|---|---|
| `GET` | `/api/v1/stock-summary?company_id={id}` | Stock summary, all items |
| `GET` | `/api/v1/stock/monthly?company_id={id}&item_name={name}` | Monthly movement for one item |
| `GET` | `/api/v1/stock-tree` | Stock group tree |
| `GET` | `/api/v1/stock/vouchers?company_id={id}&item_name={name}` | Vouchers affecting one item |
| `GET` | `/api/v1/funds-flow` | Funds flow, 12 months |
| `GET` | `/api/v1/cash-flow` | Cash flow, 12 months |
| `GET` | `/api/v1/cash-bank-book` | Closing balance of every cash and bank ledger, with its group |
| `GET` | `/api/v1/bank-recon` | Uncleared bank entries. `bank_ledger` narrows to one bank |
| `GET` | `/api/v1/gst` | GSTR-1 and GSTR-3B return view. Filters: `statement_type`, `period_key`, `section_key` |
| `GET` | `/api/v1/gst/stats` | Which GST periods are held, and when they last refreshed |
| `GET` | `/api/v1/tds-summary` | TDS summary per party |
| `GET` | `/api/v1/bills-receivable` | Pending bills the company is owed. `party` narrows to one party |
| `GET` | `/api/v1/bills-payable` | Pending bills the company owes. `party` narrows to one party |

Each read carries a `freshness` block: `data_status` and `data_as_of` say how current the stored snapshot is.

### Pulled on request

| Report | Refresh (queue a pull) | Read the result |
|---|---|---|
| Balance Sheet | `POST /api/v1/balance-sheet/refresh` | `GET /api/v1/balance-sheet` |
| Trial Balance | `POST /api/v1/trial-balance/refresh` | `GET /api/v1/trial-balance` |
| Profit & Loss statement | `POST /api/v1/profit-loss-statement/refresh` | `GET /api/v1/profit-loss-statement` |
| Profit & Loss (full period) | `POST /api/v1/profit-loss/refresh` | `GET /api/v1/profit-loss` |
| Ledger (one ledger) | `POST /api/v1/ledger/refresh` | `GET /api/v1/ledger?ledger_name={name}` |
| TDS bills (one party) | `POST /api/v1/tds/bills/refresh` | `GET /api/v1/tds/bills?party={name}` |

A pull takes three steps:

1. **Refresh.** `POST …/refresh` answers `202` straight away with a `job_id`. Nothing has been read from Tally yet.
2. **Wait for the job.** The Connector picks it up on its next poll (every 30 seconds by default) and reads the report from Tally, which can take a few minutes on a large company. Follow it with `GET /api/v1/transactions/{job_id}` until `status` is `completed`, or `failed` / `dead_letter`. The Connector has to be online, with TallyPrime running and the company open.
3. **Read.** `GET` the read endpoint. A read made before the job completes returns the previous pull. On the statements and the Ledger, `fetch.updated_at` is when the pull you are reading was stored.

What each refresh takes in its body:

| Refresh | Body |
|---|---|
| Balance Sheet, Trial Balance, Profit & Loss statement | `from_date`, `to_date` (Tally `yyyymmdd`), `month_wise` (one export per calendar month; needs both dates), `detailed` (each group's ledgers as well as the group totals), `transaction_id` (optional; reuse it to avoid queueing the same pull twice) |
| Profit & Loss (full period) | `transaction_id` only. The report ignores dates and always covers the full company period |
| Ledger | `ledger_name`, `from_date` and `to_date` (all required), `transaction_id` |
| TDS bills | `tds_ledger` and `party` (required), `from_date` / `to_date` (optional), `transaction_id` |

The Balance Sheet and Trial Balance are as at `to_date`: send today's date for current figures. Their figures are cumulative from the start of the financial year, so a month-wise pull also carries `*_movement` on each row, which is that month's own change. Before charting any month-wise statement, check `fetch.window_ignored`. When it is `true`, Tally returned the same figures for every month, so the monthly split is not real.

::: warning Two Profit & Loss endpoints
`/api/v1/profit-loss-statement` is the statement: it takes `from_date` / `to_date` and can be month-wise. `/api/v1/profit-loss` is the full-period P&L from the funds-flow report, and it ignores dates. For a P&L for a period, use the statement.
:::

::: tip Building an agent or a dashboard
A tool that only calls the `GET` of an on-demand report keeps showing the same figures. Put the refresh, the wait and the read behind one call, so every answer is pulled fresh.
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
