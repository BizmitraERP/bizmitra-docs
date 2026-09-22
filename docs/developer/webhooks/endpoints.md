# Managing webhook endpoints

## Create an endpoint

```http
POST /api/v1/webhooks
Authorization: Bearer {key_id}:{secret}
Content-Type: application/json
```

The endpoint URL must be HTTPS and reachable from the public internet. A signing secret is issued when the endpoint is created — store it immediately, the same way you store your API secret.

## Requirements for your receiver

| Requirement | Why |
|---|---|
| HTTPS | Payloads describe a customer's financial activity |
| Publicly reachable | Bizmitra must be able to connect to it |
| Responds quickly | Slow responses are treated as failures and redelivered |
| Returns `2xx` on receipt | Anything else counts as a failed delivery |
| Idempotent | Events can arrive more than once |

## Test before you rely on it

```http
POST /api/v1/webhooks/{id}/test
```

Sends a test event to the endpoint. Use it to confirm the URL resolves, TLS is valid, and your signature verification accepts a genuine request.

Also confirm the negative case: send a request with a deliberately wrong signature and check that your handler **rejects** it. A verification bug that accepts everything looks identical to working code until someone finds your URL.

## Inspect deliveries

```http
GET /api/v1/webhooks/{id}/deliveries
```

Delivery history is the first place to look when your application seems to be missing events. It distinguishes between:

- Bizmitra never sent it — no event occurred.
- Bizmitra sent it and your endpoint failed — a problem on your side.
- Bizmitra sent it and your endpoint accepted it — the event arrived and something downstream in your system dropped it.

Those have completely different fixes, and guessing between them wastes time.

## Rotate the signing secret

```http
POST /api/v1/webhooks/{id}/rotate-secret
```

Rotate on a schedule, and immediately if the secret may have been exposed.

To rotate without dropping events, accept either the old or the new secret during the changeover:

```js
function verify(payload, signature) {
  return check(payload, signature, process.env.WEBHOOK_SECRET) ||
         (process.env.WEBHOOK_SECRET_PREVIOUS &&
          check(payload, signature, process.env.WEBHOOK_SECRET_PREVIOUS))
}
```

Remove the previous secret once you have confirmed nothing is still signing with it.

## Update and delete

```http
PATCH  /api/v1/webhooks/{id}
DELETE /api/v1/webhooks/{id}
```

Deleting an endpoint stops delivery. Events that occur while no endpoint exists are not queued for a future one, so if you are moving to a new URL, create it before deleting the old one and tolerate the brief overlap where both receive.

## How many endpoints

One per application is the usual answer, with your own routing behind it.

Separate endpoints can make sense when different systems own different presence events—for example, Connector availability going to operations while company link/unlink events go to onboarding support. Transaction results and voucher arrivals are not webhook events today.

## Local development

Your development machine is not publicly reachable. Use a tunnelling tool to expose a local port, and point a **development-only** webhook endpoint at it.

Delete the tunnel endpoint when you are done. A stale endpoint pointing at a tunnel URL that now belongs to somebody else is a data leak, and an easy one to forget about.
