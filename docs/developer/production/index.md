# Production

Moving from a working prototype to a live integration is mostly about the cases you have not hit yet.

A development integration talks to one Tally company on a machine you control. A production integration talks to hundreds of machines you do not control, in offices that close, on networks that change, with books that matter to the people who own them.

## What actually changes

| | Development | Production |
|---|---|---|
| Companies | One | Hundreds |
| Connector availability | You control it | Offices, laptops, power cuts |
| Data | Fictional | Real books, real filings |
| A bad write | Delete it and move on | Someone's accountant finds it |
| Failure | You notice | The customer notices first |

## The three that matter most

**Availability is not a fault.** Connectors will be offline routinely. Treat it as an expected state with a clear message to the user, not an error to log and forget. See [Company health](/developer/tally/company-health).

**Writes are real.** There is no undo. Verify transaction status before telling anyone something exists, and never point a test harness at a live company.

**Duplicates are the expensive failure.** Every other failure is visible and fixable. A duplicate voucher is silent, arrives in the customer's books, and is discovered weeks later. Get idempotency right before launch, not after. See [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions).

## Pages in this section

- **[Security](/developer/production/security)** — credentials, data handling, and webhook safety.
- **[Go-live checklist](/developer/production/go-live-checklist)** — verify before launch.

## Operating the integration

Once live, three things need visibility:

**Connector fleet** — `GET /api/v1/connectors` and `GET /api/v1/connectors/{machine}/jobs`. Most support tickets are answered here before you contact the customer.

**Transaction outcomes** — track completion and failure rates per company. A single company failing every write usually means a missing master, which is a five-minute fix once you can see it.

**Webhook health** — delivery failures and reconciliation catches. See [Delivery and retries](/developer/webhooks/delivery).

## Supporting your customers

Your users will not distinguish between your product, Bizmitra, the Connector, and Tally. When something breaks, they contact you.

Build for that:

- Show connection status in plain language, in your own UI.
- Give your support team read access to connector state and job history.
- Write the three most common fixes into your own help documentation: switch the computer on, open TallyPrime, open the company.
- Link customers to the [Tally Connector](/tally-connector/) docs for installation rather than duplicating them.

Nearly every "it stopped working" report resolves to one of those three fixes. A status message that says which one saves a support cycle every time.
