# Verifying signatures

Every webhook delivery is signed. Verify the signature before you act on the payload.

## Why this is not optional

Your webhook URL is a public HTTPS endpoint that changes data in your system based on what it receives. It is not protected by being hard to guess — URLs leak through logs, proxies, browser history, screenshots, and error trackers.

Without verification, anyone who learns the URL can post a fabricated "invoice completed" event into your application. Whether that is merely annoying or genuinely damaging depends entirely on what your handler does next.

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

::: warning Scheme details pending
The exact header name and hashing algorithm are being finalized for the first stable release and will be documented here.

Confirm them against your webhook endpoint's settings in the developer portal before implementing. The structure below is correct; the header name is a placeholder.
:::

## Reference implementations

The examples assume an HMAC-SHA256 hex digest over the raw body. Adjust the header name and algorithm to the confirmed scheme.

::: code-group

```js [Node.js / Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()

// Retain the raw body — required for verification.
app.post('/webhooks/bizmitra',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.get('X-Bizmitra-Signature')
    const expected = crypto
      .createHmac('sha256', process.env.BIZMITRA_WEBHOOK_SECRET)
      .update(req.body)
      .digest('hex')

    const ok =
      signature &&
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

    if (!ok) return res.status(401).end()

    const event = JSON.parse(req.body.toString('utf8'))
    queue.push(event)      // process asynchronously
    res.status(200).end()  // acknowledge immediately
  })
```

```php [Laravel]
public function handle(Request $request)
{
    $signature = $request->header('X-Bizmitra-Signature', '');
    $expected  = hash_hmac(
        'sha256',
        $request->getContent(),          // raw body
        config('services.bizmitra.webhook_secret')
    );

    if (! hash_equals($expected, $signature)) {
        abort(401);
    }

    ProcessBizmitraEvent::dispatch($request->json()->all());

    return response()->noContent();
}
```

```python [Python / Flask]
import hmac, hashlib, os
from flask import request, abort

@app.post("/webhooks/bizmitra")
def bizmitra_webhook():
    raw = request.get_data()          # raw body, not request.json
    signature = request.headers.get("X-Bizmitra-Signature", "")
    expected = hmac.new(
        os.environ["BIZMITRA_WEBHOOK_SECRET"].encode(),
        raw,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        abort(401)

    enqueue(request.get_json())
    return "", 200
```

:::

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
