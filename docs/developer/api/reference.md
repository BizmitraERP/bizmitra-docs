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

| Method | Endpoint | Returns |
|---|---|---|
| `GET` | `/api/v1/stock-summary?company_id={id}` | Stock summary, all items |
| `GET` | `/api/v1/stock/monthly?company_id={id}&item_name={name}` | Monthly movement for one item |
| `GET` | `/api/v1/stock-tree` | Stock group tree |
| `GET` | `/api/v1/stock/vouchers?company_id={id}&item_name={name}` | Vouchers affecting one item |
| `GET` | `/api/v1/funds-flow` | Funds flow, 12 months |
| `POST` | `/api/v1/profit-loss/refresh` | Refresh Profit & Loss |
| `GET` | `/api/v1/profit-loss` | Read Profit & Loss |
| `GET` | `/api/v1/tds-summary` | TDS summary per party |
| `POST` | `/api/v1/tds/bills/refresh` | Refresh TDS bills for one party |
| `GET` | `/api/v1/tds/bills?party={name}` | TDS bills for one party |

::: tip Refresh-then-read
Profit & Loss and TDS bills follow a two-step pattern: `POST …/refresh` asks the Connector to recompute from Tally, then `GET` reads the result. The refresh is asynchronous, so allow it to complete before reading, or you will read the previous figures.
:::

## Masters

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/masters/{type}` | Create a master |
| `GET` | `/api/v1/masters/{type}?company_id={id}` | List master jobs |
| `GET` | `/api/v1/masters/{type}/{job}` | Status of one master job |

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
