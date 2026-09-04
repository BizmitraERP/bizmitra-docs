# Security

You are handling other people's financial records. Treat the material accordingly.

## Credentials

| Credential | Handling |
|---|---|
| `secret` | Secret manager or protected environment variable. Never in source control. |
| `key_id` | Public identifier. Safe to log. |
| Webhook signing secret | Same protection as the API secret |
| Pairing codes | Short-lived. Revoke unused ones. |
| Customer tokens | Rotatable. Treat as credentials. |

**Never commit** any of these — nor session cookies, production identifiers, or customer data — to a repository.

Run a secret scanner in CI. Secrets reach repositories through paths nobody plans: a debug log pasted into a fixture, a `.env` copied for a colleague, a Postman export with the environment attached.

## If a secret leaks

1. Create a replacement key.
2. Deploy it.
3. Revoke the exposed one.
4. Review recent activity for anything you did not initiate.

Do this even when the exposure looks harmless — a private repository, an internal chat. Rotating an API key costs minutes.

## Rotation

Rotate on a schedule, and immediately after any suspected exposure. Multiple keys per application make this zero-downtime: create, deploy, verify, revoke.

Webhook secrets rotate the same way, accepting both values during the changeover. See [Managing endpoints](/developer/webhooks/endpoints).

## Webhook endpoints

Your webhook URL is a public endpoint that mutates your data.

- **Always verify signatures**, against the raw body, with a constant-time comparison. See [Verifying signatures](/developer/webhooks/signatures).
- Serve over HTTPS.
- Return `401` on verification failure, and log it.
- Delete development tunnel endpoints when you are finished with them.

## Logging

**Never log:** the API secret, webhook signing secrets, pairing codes, full `Authorization` headers, customer tax identifiers, or complete voucher payloads containing party details.

**Do log:** `key_id`, `company_id`, `transaction_id`, request path, status code, and error messages from failed transactions.

Financial data has a way of ending up in log aggregators that a lot of people can read, and staying there past any retention policy anyone remembers agreeing to.

Redact at the point of logging, not by filtering downstream — downstream filters miss the one field nobody thought of.

## Data handling

You are processing:

- Party names and addresses
- Tax registration numbers
- Transaction values and dates
- Stock and pricing data

Apply your own obligations to it — retention limits, access control, encryption at rest, deletion on request. These are your customers' records held on their behalf, and applicable privacy and tax-record law follows them.

Store what your product needs. Resist accumulating full voucher payloads indefinitely because storage is cheap; the liability is not.

## Access control

- Least privilege on who in your organization can read production credentials.
- Separate keys for development and production.
- Audit who can access customer data through your admin tooling.
- Give support staff read-only views of connector state — not credentials.

## Writing to live books

- Never point a test harness at a customer's live company.
- Do not auto-create masters from unvalidated input. A typo in your product becomes a permanent ledger in someone's accounts.
- Enforce idempotency so a retry cannot duplicate a voucher.
- Preserve `tally_voucher_guid` so updates target the existing voucher.

## Transport

All API traffic is HTTPS. The Connector connects outbound only — Bizmitra never initiates a connection into a customer's network, and no inbound firewall rule is required.

If a customer's IT team asks what needs opening, the honest and reassuring answer is: nothing.

## Before you publish anything

When sharing examples, screenshots, or Postman collections:

- [ ] Credential variables are empty.
- [ ] No cookies, tokens, or pairing codes are embedded.
- [ ] Saved examples contain only fictional data.
- [ ] No real GSTINs, party names, or invoice numbers.
- [ ] A secret scan has been run over the whole repository.
