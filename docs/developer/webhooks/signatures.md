# Verifying signatures

Every webhook delivery is signed. Verify the signature before you act on the payload.

## Why this is not optional

Your webhook URL is a public HTTPS endpoint that changes data in your system based on what it receives. It is not protected by being hard to guess — URLs leak through logs, proxies, browser history, screenshots, and error trackers.

Without verification, anyone who learns the URL can post a fabricated Connector or Tally status event into your application. Whether that is merely annoying or genuinely damaging depends entirely on what your handler does next.

::: danger Verify before parsing
Verify against the **raw request body**, before any JSON parsing or middleware transformation.

Most frameworks parse and re-serialize the body by default. Re-serialized JSON is byte-for-byte different from what was signed — different key order, different whitespace — so verification fails against the reconstructed body even when the request is genuine. Configure your route to retain the raw body.
:::

## The verification steps

Whatever the exact scheme, the shape is the same:

1. Capture the **raw** request body.
2. Read the signature header.
3. Compute the expected signature using your endpoint's signing secret.
4. Compare using a **constant-time** comparison.
5. Reject on mismatch with `401`, and log it.

Step 4 matters: a naive `==` on strings leaks timing information that can be used to recover a valid signature. Every language has a constant-time comparison in its standard library — use it.

## Signature scheme

Every delivery includes:

```http
X-Bizmitra-Signature: t=<unix timestamp>,v1=<hex HMAC-SHA256>
X-Bizmitra-Event: <event type>
X-Bizmitra-Delivery: <unique delivery id>
```

Bizmitra calculates `v1` as:

```text
HMAC-SHA256(signing_secret, "{timestamp}.{raw_request_body}")
```

Parse `t` and `v1` from `X-Bizmitra-Signature`, reject stale timestamps, calculate the digest over the timestamp plus the exact raw body, and compare the hexadecimal digests in constant time.

## Reference implementation

```js
import crypto from 'node:crypto'

function verifyBizmitraWebhook(rawBody, header, secret, now = Math.floor(Date.now() / 1000)) {
  const parts = Object.fromEntries(
    header.split(',').map(piece => piece.trim().split('=', 2))
  )
  const timestamp = Number(parts.t)
  const supplied = parts.v1 || ''

  if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > 300) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  return supplied.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
}
```

Retain the raw request body in your framework. Do not parse and re-serialize JSON before calculating the signature.

## Common mistakes

| Mistake | Result |
|---|---|
| Verifying re-serialized JSON | Fails on genuine requests |
| `==` instead of constant-time compare | Timing side channel |
| Skipping verification in development | The gap ships to production |
| Logging the raw signature or secret | Credential in your logs |
| Returning `200` on a bad signature | Silently accepts forgeries |

That last one deserves attention: returning `200` when verification fails means an attacker gets no feedback, but neither do you. Return `401` and log it. Repeated verification failures are a signal worth seeing.

## Rotating secrets

Accept both the current and previous secret during a rotation window, then drop the old one. See [Managing endpoints](/developer/webhooks/endpoints).

## Beyond the signature

Signature verification proves the payload came from Bizmitra and was not altered. It does not prove the event is new.

A valid signed payload replayed later is still valid. Deduplicate on the event identifier, and treat any timestamp in the payload as a freshness check — reject events far outside a reasonable clock skew. See [Delivery and retries](/developer/webhooks/delivery).
