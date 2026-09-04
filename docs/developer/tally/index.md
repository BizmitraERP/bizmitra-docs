# Tally

TallyPrime is the first system Bizmitra connects to, and the one the platform is currently deepest in.

This section covers how the Tally side behaves in practice — not just which endpoint to call, but what the software on the other end is actually doing and why it sometimes says no.

## The environment you are integrating with

Some properties of TallyPrime shape everything else here:

- **It is desktop software.** It runs on a Windows machine in the customer's office, often the one under someone's desk.
- **It is usually not always-on.** People close it. Machines sleep. Offices lose power.
- **A company must be open** in Tally for work against it to run.
- **Masters are user-defined.** Ledger names, stock items, voucher types — all created and renamed by the customer.
- **Statutory configuration is per-company.** GST enabled or not, registration type, state.

An integration that assumes a permanently available, uniformly configured server will fail in ways that look mysterious. Designing for intermittency from the start costs very little and saves a great deal.

## Pages in this section

- **[The Connector App](/developer/tally/connector-app)** — what it is, what it needs, and how it behaves.
- **[Pairing a company](/developer/tally/pairing)** — connecting a Bizmitra company to a real Tally company.
- **[Company health](/developer/tally/company-health)** — checking readiness before you act.
- **[Voucher kinds and types](/developer/tally/voucher-kinds)** — what you can read and write.
- **[Masters](/developer/tally/masters)** — ledgers, stock items, and creating them through the API.

## What you can do with a paired company

**Write** — invoices, sales orders, credit notes, debit notes, purchases, receipts, payments, contras, and journals.

**Read** — vouchers that originated in Tally, through the pulled-voucher queue.

**Report** — stock summary, stock movement per item, stock group tree, funds flow, profit and loss, and TDS.

**Manage** — masters, connector state, and company connectivity.

Full endpoint list in the [API reference](/developer/api/reference).

## A note on Tally's own behaviour

Bizmitra does not override Tally's validation, and would not want to. If Tally rejects a voucher because a required statutory field is missing or a ledger is of the wrong type, that rejection surfaces to you largely intact.

This is the right default. Tally is the system of record and the thing the customer's accountant, auditor, and tax filings depend on. A layer that made invalid vouchers succeed would be doing real damage while appearing helpful.
