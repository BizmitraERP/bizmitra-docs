# Authentication

Every request carries an API key as a bearer credential.

```http
Authorization: Bearer {key_id}:{secret}
Accept: application/json
```

The two values are joined by a colon, with no whitespace.

## The key pair

| Part | Sensitivity | Notes |
|---|---|---|
| `key_id` | Public identifier | Safe to log and to show in a support ticket |
| `secret` | Credential | Shown once, at creation. Never log it. |

Together they are one credential. Possession of both grants full access to the application's customers, companies, and data.

::: danger The secret is shown once
Bizmitra cannot show it to you again. If it is lost, create a new key and retire the old one — which is straightforward, because an application can hold several keys at once.
:::

## Storing it

Use a secret manager, or environment variables that are protected in your deployment. Not a config file in the repository, not a `.env` you intend to clean up later, not a note in your issue tracker.

::: code-group

```bash [Environment]
export BIZMITRA_KEY_ID="..."
export BIZMITRA_SECRET="..."
```

```php [Laravel]
// config/services.php
'bizmitra' => [
    'key_id' => env('BIZMITRA_KEY_ID'),
    'secret' => env('BIZMITRA_SECRET'),
    'base_url' => env('BIZMITRA_BASE_URL', 'https://bizmitra.io'),
],
```

```js [Node.js]
const auth = `Bearer ${process.env.BIZMITRA_KEY_ID}:${process.env.BIZMITRA_SECRET}`
```

:::

## Identifying the company

Most endpoints act on one company, identified in one of two ways depending on the endpoint:

```http
GET /api/v1/pulled-vouchers?company_id=123
```

```http
POST /api/v1/invoices
X-Bizmitra-Company: 123
```

Follow what each endpoint documents. The value is the Bizmitra **Developer Company ID**, not a Tally GUID — see [Customers and companies](/developer/platform-concepts/customers-and-companies).

## Authorization is relational

Authentication proves who you are. Authorization depends on the chain:

```
API key → application → customer → company
```

A `403` on a company endpoint usually means a broken link in that chain rather than a bad credential. The key is valid; the company is not reachable from it. Check that the company exists and is attached to a customer under your application.

## Rotation

Rotate with no downtime by overlapping keys:

1. Create a new key.
2. Deploy it.
3. Confirm traffic has moved to it.
4. Revoke the old key.

Rotate on a schedule, and immediately if a secret has appeared anywhere it should not — a log, a screenshot, a shared terminal, a commit.

Customer tokens rotate separately:

```http
POST /api/v1/customers/{token}/rotate
```

## Testing pitfalls

**Browser session cookies.** If you test from a tool that shares your logged-in browser session, a broken key can appear to work — the session authenticates you instead. Test with cookies cleared, or from a plain HTTP client.

**Whitespace in the header.** A trailing newline from a copied secret produces a `401` that looks inexplicable. Trim what you read from files and environment variables.

**Wrong environment's key.** Symptoms are usually `403` rather than `401`: the key is valid but its application does not own the company you named.
