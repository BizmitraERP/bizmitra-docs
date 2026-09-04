# Postman collection

The Postman collection is currently the most complete executable reference to the Bizmitra API. It covers the full endpoint surface, including areas these docs describe only in outline.

## Get it

Download [`postman/bizmitra-tally-api.postman_collection.json`](https://github.com/BizmitraERP/bizmitra-tally-api-examples/blob/master/postman/bizmitra-tally-api.postman_collection.json) from the examples repository and import it into Postman.

## Configure

Set the collection variables:

| Variable | Value |
|---|---|
| `base_url` | `https://bizmitra.io` |
| `key_id` | Your API key ID |
| `secret` | The secret shown when the key was created |
| `company_id` | Your Bizmitra Developer Company ID |
| `application_id` | Your application ID |

::: warning Use development credentials
Postman stores variable values locally and includes them in exports. Use a dedicated development key and a test company, never production credentials.
:::

## First three requests

1. **Ping** — confirms authentication.
2. **Company connector health** — confirms the Connector and Tally are available.
3. **List pulled vouchers** — a safe read against real data.

If ping fails, check the `Authorization` header format. If health fails, the problem is on the Tally machine, not in your request.

## What is in it

| Group | Contents |
|---|---|
| Vouchers | Invoices, orders, credit and debit notes, purchases, receipts, payments, contras, journals |
| Transactions | Status lookup, list |
| Pulled vouchers | List, detail, acknowledge |
| Reports | Stock summary, monthly stock, stock tree, stock vouchers, funds flow, P&L, TDS |
| Masters | Push master, list jobs, job status |
| Provisioning | Applications, customers, companies |
| Connectors | Pairing codes, fleet management, health, disconnect |
| Webhooks | CRUD, secret rotation, test event, deliveries |

Full list in the [API reference](/developer/api/reference).

## Session cookie pitfall

If you are logged into Bizmitra in the same browser Postman shares cookies with, a request can succeed on the session rather than on your API key — which makes a broken credential look fine until you deploy.

Disable cookie sending for the collection, or test from a clean profile.

## Before sharing or committing an export

Postman exports include variable values and saved example responses. Both routinely carry credentials and customer data.

- [ ] `key_id`, `secret`, `company_id`, and `application_id` are empty.
- [ ] No cookies, tokens, or pairing codes are embedded.
- [ ] Saved examples contain only fictional data.
- [ ] No real GSTINs, party names, or invoice numbers.

See [Security](/developer/production/security).

## Keeping it current

The collection is updated as the API grows. Re-import periodically rather than working from a copy you downloaded months ago — new endpoints appear within `v1`, and the collection is usually where they show up first.
