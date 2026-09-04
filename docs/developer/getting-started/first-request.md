# Your first request

Three calls, in order. Each one rules out a different class of problem, so run them in sequence rather than jumping to the interesting one.

## 1. Ping — is my credential valid?

```http
GET https://bizmitra.io/api/v1/ping
Authorization: Bearer {key_id}:{secret}
Accept: application/json
```

::: code-group

```bash [curl]
curl https://bizmitra.io/api/v1/ping \
  -H "Authorization: Bearer $KEY_ID:$SECRET" \
  -H "Accept: application/json"
```

```js [Node.js]
const res = await fetch('https://bizmitra.io/api/v1/ping', {
  headers: {
    Authorization: `Bearer ${process.env.BIZMITRA_KEY_ID}:${process.env.BIZMITRA_SECRET}`,
    Accept: 'application/json',
  },
})
console.log(res.status, await res.json())
```

```php [PHP]
$response = Http::withHeaders([
    'Authorization' => 'Bearer '.config('bizmitra.key_id').':'.config('bizmitra.secret'),
    'Accept'        => 'application/json',
])->get('https://bizmitra.io/api/v1/ping');
```

```python [Python]
import os, requests

r = requests.get(
    "https://bizmitra.io/api/v1/ping",
    headers={
        "Authorization": f"Bearer {os.environ['BIZMITRA_KEY_ID']}:{os.environ['BIZMITRA_SECRET']}",
        "Accept": "application/json",
    },
)
print(r.status_code, r.json())
```

:::

A `401` here means the credential is wrong, not that anything is misconfigured further down. Check that you sent `key_id` and `secret` joined by a colon, with no whitespace.

If you are testing from a browser-based tool, make sure no session cookie is being sent. A logged-in browser session can make a broken key look like it works.

## 2. Company health — is Tally reachable?

```http
GET https://bizmitra.io/api/v1/companies/{company_id}/health
Authorization: Bearer {key_id}:{secret}
Accept: application/json
```

This is the call that tells you whether the Connector is online and whether it can currently see the Tally company. Everything downstream depends on it.

Do not skip it and go straight to a write. A failed write against an offline Connector produces an error that looks like a payload problem, and you will spend an hour on the wrong thing.

See [Company health](/developer/tally/company-health) for how to interpret the response and what to do about each state.

## 3. Read something real

Reads are safe. Start there.

```http
GET https://bizmitra.io/api/v1/pulled-vouchers?company_id={company_id}&limit=5
Authorization: Bearer {key_id}:{secret}
Accept: application/json
```

If your test company has vouchers, you will get them back in a normalized form. If it does not, create one by hand in Tally and call again.

An empty list with `"success": true` is a successful response, not a failure. It means the query worked and matched nothing.

## Then, a write

Once reads work and health is green, follow [Create an invoice in Tally](/developer/examples/push-invoice).

The important habit to build now: **an accepted write is not a completed write.** A `success: true` response to a `POST` means Bizmitra queued the job. Tally has not necessarily created anything yet. You must check the transaction status before telling your user the invoice exists.

This trips up nearly every new integration. [Jobs and transactions](/developer/platform-concepts/jobs-and-transactions) explains the model.

## If something is wrong

| Symptom | Most likely cause |
|---|---|
| `401` on ping | Malformed `Authorization` header, or a revoked key |
| `403` on a company call | The key's application is not authorized for that company |
| Health reports Connector offline | Connector service stopped, or the machine is asleep |
| Health reports Tally unavailable | TallyPrime is closed, or the company is not open in it |
| Write accepted, then fails | A master named in the payload does not exist in the company |

Full breakdown in [Errors](/developer/api/errors).
