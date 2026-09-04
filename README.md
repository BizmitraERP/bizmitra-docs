# Bizmitra Docs

Public documentation for the Bizmitra platform — published at **[docs.bizmitra.io](https://docs.bizmitra.io)**.

Built with [VitePress](https://vitepress.dev).

## Running locally

```bash
npm install
npm run docs:dev      # http://localhost:5173
```

```bash
npm run docs:build    # static output in .vitepress/dist
npm run docs:preview  # preview the production build
```

## Structure

```
bizmitra-docs/
├── .vitepress/
│   └── config.ts              # nav, sidebars, site config
├── docs/                      # srcDir — content lives here
│   ├── index.md               # docs.bizmitra.io/
│   ├── developer/             # /developer/
│   ├── tally-connector/       # /tally-connector/
│   ├── integrations/          # /integrations/
│   └── erp/                   # /erp/
├── public/
│   └── images/                # served at /images/…
├── package.json
└── README.md
```

`docs/` is the VitePress `srcDir`, so `docs/developer/index.md` publishes to `/developer/`. `cleanUrls` is enabled — links omit the `.md` extension.

## The four sections

| Section | Audience | Status |
|---|---|---|
| **Developer** | Engineers and SaaS companies building on Bizmitra | Published |
| **Tally Connector** | People installing and running the Connector | Landing page only |
| **Integrations** | Businesses using ready-made connections | Landing page only |
| **ERP** | Bizmitra ERP users | Landing page only |

### Two integration layers

Worth keeping straight when writing, because the two are easy to conflate:

- **`/integrations`** — Bizmitra builds the connection to a third party. The reader is a business owner who configures it.
- **`/developer`** — the reader builds the connection themselves, on Bizmitra as an interoperability layer. The reader is an engineer.

## Developer section

Currently published:

```
developer/
├── getting-started/     registration, sandbox, first request
├── platform-concepts/   applications, customers & companies,
│                        connectors, jobs & transactions, data model
├── tally/               connector app, pairing, health,
│                        voucher kinds, masters
├── api/                 authentication, conventions, errors,
│                        reference, lifecycle
├── webhooks/            endpoints, signatures, delivery
├── production/          security, go-live checklist
└── examples/            pull vouchers, push invoice, postman
```

Deferred, with sidebar entries commented out in [`.vitepress/config.ts`](.vitepress/config.ts):

- `connectors/` — building and distributing branded Connectors
- `building-integrations/` — connecting Bizmitra to third-party services
- `migrations/` — moving data between two systems

> **Naming note.** The developer-facing integrations section is `building-integrations`, not `integrations`, so it does not collide with the top-level `/integrations/` section — which means something different. Keep the distinction.

To activate a deferred section: write its pages under `docs/developer/<section>/` and uncomment the matching sidebar block in the config.

## Writing conventions

**Ground claims in the API.** Endpoints and payloads here come from the [examples repository](https://github.com/BizmitraERP/bizmitra-tally-api-examples) and its Postman collection. Do not document behaviour that has not been verified.

**Mark provisional contracts.** Where a response envelope is still being finalized, say so in an `::: info` block. Readers will build against these pages.

**Never commit real data.** No credentials, real GSTINs, party names, invoice numbers, or company identifiers. Examples use `INV-DEMO-001`, `Example Customer`, `24AAAAA0000A1Z5`.

**Match audience to section.** Developer pages assume an engineer. Connector, Integrations, and ERP pages assume a business user with no interest in the API.

**Cross-link.** Concepts are explained once and linked to, not repeated.

**Diagrams.** Mermaid renders natively; use it for flows and sequences.

## Deployment

Build output is static, in `.vitepress/dist`. Deploy to any static host and point `docs.bizmitra.io` at it.

`sitemap.hostname` is set to `https://docs.bizmitra.io` in the config — update it if the domain changes.

## Related repositories

- [bizmitra-tally-api-examples](https://github.com/BizmitraERP/bizmitra-tally-api-examples) — Postman collection and runnable examples

## Licence

Documentation is MIT licensed. Use of the Bizmitra API, Connector App, and hosted services is governed separately by Bizmitra's commercial terms.
