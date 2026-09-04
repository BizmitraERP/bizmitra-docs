# Sandbox and test data

There is no simulated Tally. Bizmitra talks to a real TallyPrime instance through a real Connector, so "sandbox" here means **an isolated company you are allowed to break**, not a mock server.

## Set up a test company

1. Create a fresh company in TallyPrime on the machine that will run the Connector. Name it clearly — `Bizmitra Test Co` beats `Test`.
2. Enable the statutory features your integration depends on. If you are pushing GST invoices, GST must be enabled on the company, or every write will fail validation for reasons that look like API errors but are not.
3. Create the masters your test payloads reference: at least one party ledger, one stock item with a unit, one sales ledger, and the tax ledgers.
4. Create a matching Bizmitra company and pair the Connector to it.

## Why masters matter more than you expect

Bizmitra resolves the names in your payload against the masters that actually exist in the target company. A payload naming `"Example Customer"` requires a ledger called exactly that.

This is the single most common cause of a first integration failing. The request is well-formed, the API accepts it, and the job fails at the Tally boundary because a ledger name has a trailing space or the stock item was never created.

Two ways to handle it:

- **Pre-create masters** in the test company by hand while you are developing.
- **Push masters through the API** so your integration creates what it needs:

  ```http
  POST /api/v1/masters/{type}
  ```

  See [Masters](/developer/tally/masters).

## Keys and isolation

Use a **separate API key** for development. Not a separate account — a separate key under the same application. That gives you a credential you can rotate the moment it leaks into a log or a screenshot without taking production down.

| Environment | Key | Tally company |
|---|---|---|
| Development | Dedicated dev key | Dedicated test company |
| Production | Production key, in a secret manager | Customer's live company |

## Test data hygiene

Use obviously fictional values. Real GSTINs, real party names, and real invoice numbers have a way of ending up in a screenshot, a support ticket, or a committed Postman example.

The examples in these docs use placeholders like `INV-DEMO-001`, `Example Customer`, and `24AAAAA0000A1Z5` for exactly this reason.

## What to verify before you trust the setup

Work through this list once. If all five pass, your environment is real enough to build against.

- [ ] `GET /api/v1/ping` authenticates successfully.
- [ ] `GET /api/v1/companies/{id}/health` reports the Connector and Tally as available.
- [ ] A voucher created by hand in Tally appears in `GET /api/v1/pulled-vouchers`.
- [ ] An invoice submitted through the API appears correctly in Tally.
- [ ] Submitting the same invoice twice does not produce two vouchers.

That last one is not optional. Duplicate-write behaviour is the failure mode that hurts most in production, and it is far cheaper to understand it now. See [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).
