# API

The Bizmitra API is HTTPS and JSON, versioned under `/api/v1`.

```
https://bizmitra.io/api/v1
```

## Quick orientation

```http
GET https://bizmitra.io/api/v1/ping
Authorization: Bearer {key_id}:{secret}
Accept: application/json
```

Three things appear in almost every request:

| Element | Value |
|---|---|
| Base URL | `https://bizmitra.io` |
| Auth header | `Authorization: Bearer {key_id}:{secret}` |
| Company | `company_id` query parameter, or the `X-Bizmitra-Company` header |

## Pages in this section

- **[Authentication](/developer/api/authentication)** — keys, headers, and rotation.
- **[Conventions](/developer/api/conventions)** — response envelopes, pagination, dates, identifiers.
- **[Errors](/developer/api/errors)** — what failures mean and how to respond.
- **[API reference](/developer/api/reference)** — the full endpoint surface.
- **[Versioning and lifecycle](/developer/api/lifecycle)** — compatibility guarantees and deprecation.

## Endpoint families

| Family | Purpose |
|---|---|
| **Write** | `invoices`, `orders`, `credit-notes`, `debit-notes`, `purchases`, `receipts`, `payments`, `contras`, `journals` |
| **Read** | `pulled-vouchers`, and its detail and acknowledgement endpoints |
| **Transactions** | Status of asynchronous work |
| **Reports** | `stock-summary`, `stock/monthly`, `stock-tree`, `stock/vouchers`, `funds-flow`, `profit-loss`, `tds-summary`, `tds/bills` |
| **Masters** | Create and track master jobs |
| **Provisioning** | `applications`, `customers`, `companies` |
| **Connectors** | Pairing codes, connector fleet, company health |
| **Webhooks** | Endpoints, secrets, test events, delivery history |
| **Utility** | `ping`, and the Tally bridge passthrough |

## Two things to internalize before you build

**Writes are asynchronous.** A `success: true` on a `POST` means accepted, not completed. Check the transaction. See [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).

**Responses grow.** New fields are added within `v1`. Ignore what you do not recognize rather than rejecting it, or a routine additive change will look like an outage on your side.
