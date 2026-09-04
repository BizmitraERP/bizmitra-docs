# Examples

Working end-to-end flows you can follow against a test company.

## The two directions

Nearly every integration is one of these, or both.

| Direction | Walkthrough | What it covers |
|---|---|---|
| Tally → your product | [Pull vouchers from Tally](/developer/examples/pull-vouchers) | List, fetch, process idempotently, acknowledge |
| Your product → Tally | [Create an invoice in Tally](/developer/examples/push-invoice) | Submit, retain the transaction, verify the Tally result |

Plus the [Postman collection](/developer/examples/postman), which is the most complete executable reference to the API today.

## Before you run them

- A paired company, verified with [company health](/developer/tally/company-health).
- A dedicated Tally **test** company. Not a customer's live books.
- The masters your payloads reference already created. See [Masters](/developer/tally/masters).

## Open source examples

The example repository is public:

**[github.com/BizmitraERP/bizmitra-tally-api-examples](https://github.com/BizmitraERP/bizmitra-tally-api-examples)**

It contains the Postman collection and the source of these walkthroughs, MIT licensed. Use of the hosted API and Connector App is governed separately by Bizmitra's commercial terms.

## Habits worth building now

Both walkthroughs are written to demonstrate the same three things, because they are what separate a demo from an integration:

**Verify, do not assume.** An accepted write is not a completed write. Check the transaction.

**Persist identifiers immediately.** `transaction_id` before anything else; `tally_voucher_guid` when it arrives.

**Make it safe to run twice.** Every step should tolerate being repeated, because eventually it will be.
