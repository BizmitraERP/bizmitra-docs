# Create a developer account

## 1. Register

Create a developer account at the [Bizmitra developer portal](https://bizmitra.io/developer-portal/register).

A developer account is the top-level container. Everything else — applications, API keys, customers, companies, connectors — belongs to it.

## 2. Create an application

An **application** represents one product you are integrating. If you ship two separate products, create two applications; they get separate keys, separate branding, and separate connector builds.

You can list your applications through the API:

```http
GET /api/v1/applications
Authorization: Bearer {key_id}:{secret}
Accept: application/json
```

See [Applications](/developer/platform-concepts/applications) for what an application controls.

## 3. Create an API key

An API key is a pair:

| Part | Meaning |
|---|---|
| `key_id` | Public identifier for the key. Safe to log. |
| `secret` | The credential. Shown **once**, at creation. |

::: danger The secret is shown only once
Bizmitra does not store the secret in a form it can show you again. If you lose it, create a new key and retire the old one. Copy it directly into your secret manager — not into a scratch file, a chat message, or a `.env` you plan to tidy up later.
:::

Both values are used together in the `Authorization` header:

```http
Authorization: Bearer {key_id}:{secret}
```

Treat `key_id` and `secret` together as one credential. Full details in [Authentication](/developer/api/authentication).

## 4. Create a customer

A **customer** is one of your end users — the business whose accounting data you will be touching. Create one per business, not one per person.

```http
POST /api/v1/customers
Authorization: Bearer {key_id}:{secret}
Content-Type: application/json
```

## 5. Create a company

A **company** is a specific set of books belonging to a customer, mapping one-to-one with a company inside TallyPrime. A customer with three Tally companies gets three Bizmitra companies.

```http
POST /api/v1/companies
Authorization: Bearer {key_id}:{secret}
Content-Type: application/json
```

The response contains the `company_id` you will use in nearly every subsequent call.

Companies and customers are linked explicitly, and the link can be changed:

```http
POST   /api/v1/companies/{id}/customer     # attach
DELETE /api/v1/companies/{id}/customer     # detach
```

See [Customers and companies](/developer/platform-concepts/customers-and-companies) for the full model.

## 6. Pair a Connector

With a company created, generate a pairing code and install the Connector on the Windows machine that can reach Tally:

```http
POST /api/v1/connectors/pairing-code
```

Walk through this in [Pairing a company](/developer/tally/pairing).

## Doing all of this from your own product

Nothing above requires a human in the Bizmitra portal. Every step has an API endpoint, which means you can provision customers and companies from inside your own onboarding flow. Your users never need to know Bizmitra exists as a separate destination.

The one step that always touches the customer's environment is installing and pairing the Connector, because it runs on their machine.
