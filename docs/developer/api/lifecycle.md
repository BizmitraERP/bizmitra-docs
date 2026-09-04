# Versioning and lifecycle

The public API is versioned in the path. Everything documented here targets `/api/v1`.

## What can change within v1

Bizmitra may add, without a new major version:

- New endpoints
- Optional request fields
- New response fields
- New voucher kinds
- New filters and query parameters
- New webhook event types

::: warning Your client must ignore unknown fields
This is a requirement of integrating, not advice. A parser configured to reject unknown properties will break on a routine additive release, and it will present as an outage on your side.

Configure leniency explicitly — most JSON libraries reject or warn by default in strict modes.
:::

Similarly, do not treat an unfamiliar `voucher_kind` or webhook event type as an error. Log it and move on.

## What counts as breaking

A change is breaking when an existing, correct integration would need code changes to keep working:

- Removing or renaming a field
- Changing a field's type or meaning
- Removing an endpoint
- Changing authentication
- Materially changing error semantics

Breaking changes require a new major API version, unless an urgent security or legal issue makes that impossible.

## Deprecation

For a normal deprecation, Bizmitra will:

1. Mark the endpoint or field deprecated.
2. Document the supported replacement and the migration path.
3. Announce a planned retirement date through developer channels.
4. Maintain the old contract through the announced transition period.
5. Monitor remaining usage before removal, where practical.

::: info Notice period
The final minimum notice period and the official notification channels are being confirmed and will be published here before the first stable release.
:::

## Preview status

The platform is in public preview. Endpoint shapes are stable; some response envelopes are still being finalized against production.

Pages describing a provisional contract say so directly. Currently that applies to:

- The successful transaction envelope — [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions)
- Pulled-voucher `status` values and `last_synced_at`

The identifiers you are told to persist — `transaction_id` and `tally_voucher_guid` — are not in flux. Build against those with confidence.

## Historical wire names

Some names are retained for compatibility rather than because they are accurate:

| Name | Reality |
|---|---|
| `invoices` (list key) | Any voucher kind, not only invoices |
| `invoice` (detail key) | Any voucher kind |
| `invoice_json` | The normalized voucher document |

Renaming them would be a breaking change for existing integrations, so they stay. New surfaces use accurate names.

## Staying current

- Watch the [documentation repository](https://github.com/BizmitraERP/bizmitra-docs).
- Re-import the [Postman collection](/developer/examples/postman) periodically.
- Subscribe a webhook endpoint and log unrecognized event types rather than discarding them — it is a cheap early signal that something new exists.

## Building for change

Three habits that make additive change a non-event:

1. **Ignore unknown fields.** Everywhere, deliberately.
2. **Handle unknown enum values.** New `voucher_kind` values and event types should log, not throw.
3. **Pin nothing you do not need to.** Do not assert on full response bodies in tests; assert on the fields you actually use.
