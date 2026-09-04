# Go-live checklist

Work through this before the first real customer. Most items take minutes; the ones that do not are the ones that matter.

## Credentials

- [ ] Production key is separate from the development key.
- [ ] Secrets are in a secret manager or protected environment variables.
- [ ] Nothing sensitive is committed — verified by a secret scan over the full history.
- [ ] A rotation procedure is written down and has been tested at least once.
- [ ] Logs contain no secrets, full `Authorization` headers, or customer tax identifiers.

## Correctness

- [ ] `GET /api/v1/ping` succeeds with the production key.
- [ ] Company health is checked before every write.
- [ ] Transaction status is polled before reporting success to a user.
- [ ] `transaction_id` is persisted **before** any further processing.
- [ ] `tally_voucher_guid` is persisted so updates target the existing voucher.
- [ ] Submitting the same operation twice produces exactly one voucher. **Tested, not assumed.**
- [ ] Pulled vouchers are acknowledged only after your own transaction commits.
- [ ] Reprocessing an already-consumed voucher updates rather than inserts.

## Resilience

- [ ] Connector-offline is handled as an expected state with a clear user-facing message.
- [ ] Tally-unavailable and company-not-open are distinguished from each other.
- [ ] Retries use exponential backoff with jitter.
- [ ] An ambiguous write failure polls the transaction before resubmitting.
- [ ] Validation failures are not retried blindly.
- [ ] Pagination is implemented — `total`, `limit`, `offset` are respected.

## Compatibility

- [ ] The JSON parser ignores unknown fields.
- [ ] Unknown `voucher_kind` values are logged, not thrown.
- [ ] Unknown webhook event types return `200`.
- [ ] Business logic branches on `voucher_kind`, never on `voucher_type`.
- [ ] Date conversion between ISO and `YYYYMMDD` is handled at one boundary.

## Webhooks

- [ ] Signatures are verified against the **raw** body, with a constant-time comparison.
- [ ] A deliberately invalid signature is rejected with `401`. **Tested.**
- [ ] The handler acknowledges immediately and processes out of band.
- [ ] Events are deduplicated on a stable identifier.
- [ ] Handlers are order-independent.
- [ ] Development tunnel endpoints have been deleted.
- [ ] A reconciliation sweep exists as a safety net.

## Operations

- [ ] Connector fleet state is visible to your support team.
- [ ] Transaction failure rates are monitored per company.
- [ ] Webhook delivery failures are alerted on.
- [ ] Reconciliation catches are tracked — a rising count means the fast path is broken.
- [ ] Support documentation covers: switch the computer on, open TallyPrime, open the company.
- [ ] Customers are pointed at the [Tally Connector](/tally-connector/) docs for installation.

## Provisioning

- [ ] Customers and companies are created through the API, not by hand.
- [ ] Connectors are renamed during onboarding to something identifiable.
- [ ] Unused pairing codes are revoked.
- [ ] `company_id` is stored on your own records — never resolved by company name.
- [ ] Offboarding disconnects the company and revokes access.

## The end-to-end test

Do this once, in full, against a dedicated test company, with a fresh production-shaped key:

1. Provision a customer and company through the API.
2. Generate a pairing code and pair a Connector.
3. Verify health.
4. Pull a voucher list, fetch one, process it, acknowledge it.
5. Submit an invoice and confirm it in Tally.
6. Capture the final successful transaction response.
7. **Submit the same invoice again and confirm no duplicate appears.**
8. Take the Connector offline and confirm your product degrades gracefully.
9. Bring it back and confirm queued work completes.
10. Trigger a webhook and confirm it verifies, processes, and deduplicates.

Step 7 and step 8 are the two people skip. They are also the two that produce the incidents.
