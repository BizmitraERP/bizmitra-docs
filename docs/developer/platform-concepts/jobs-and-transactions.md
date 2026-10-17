# Jobs and transactions

Everything that touches Tally is asynchronous. Understanding this properly is the difference between an integration that works and one that quietly creates duplicate vouchers.

## Two responses, not one

When you submit a write, you get an answer immediately — but it answers a narrow question.

```mermaid
sequenceDiagram
    participant App as Your application
    participant API as Bizmitra API
    participant Con as Connector
    participant T as TallyPrime

    App->>API: POST /api/v1/invoices
    API-->>App: 200 { success: true, transaction_id } 
    Note over App,API: "Accepted" — not "created"
    Con->>API: collects job
    Con->>T: writes voucher
    T-->>Con: voucher GUID
    Con->>API: reports result
    App->>API: GET /api/v1/transactions/{id}
    API-->>App: { status: "completed", tally_voucher_guid }
    Note over App,API: Now it exists in Tally
```

| Response | Question it answers |
|---|---|
| `POST` response | Did Bizmitra accept and queue this? |
| Transaction status | What did Tally actually do? |

Never tell your user an invoice was created on the strength of the first response. It means the request was well-formed and authorized. Tally may not have run yet, and when it does it may reject the voucher.

## The accepted response

```json
{
  "success": true,
  "transaction_id": "11111111-1111-1111-1111-111111111111",
  "company_id": 123,
  "request_type": "in"
}
```

Persist `transaction_id` against your own record before doing anything else. If your process dies here and you did not store it, you have submitted a write you can no longer track — and retrying blindly is how duplicates happen.

### What "accepted" guarantees

A `202` means the job is a **committed row**, before the response is written.
From that point it is ours to deliver: it survives a restart or deploy of the
API, the Connector being offline, Tally being closed, and the customer's PC
being switched off for a week. It is not held in memory and nothing discards it
for age — see [How long a queued job waits](#how-long-a-queued-job-waits).

What a `202` does **not** promise is that Tally accepted the voucher. Delivery is
guaranteed; the outcome is reported. A job can still end `failed` or
`dead_letter` — a missing master, a duplicate voucher number, a Tally dialog
nobody dismissed — and the only way to learn which is to follow the
`transaction_id`.

So there are exactly two states you must handle, and the difference between them
is whether you got a `202`:

| You received | Then | Do |
|---|---|---|
| A `202` | The job exists and will be attempted | Poll `transaction_id` for the outcome |
| No response, or a `5xx` | The job **may or may not** exist | Read `outcome` on the error: `not_sent` means it does not; `result_unknown` means look it up before re-sending. Or re-send with the same idempotency key, which is safe either way |

::: info This is about the push queue, not the reports
The same guarantee covers master pushes. It does not apply to the read side:
pulled vouchers and pulled masters are a refreshed cache, and a report that
could not run is reported as not having run rather than queued.
:::

## Checking status

```http
GET /api/v1/transactions/{transaction_id}
GET /api/v1/transactions?company_id={company_id}
```

A completed write (the transaction record is nested under `transaction`):

```json
{
  "success": true,
  "transaction": {
    "job_id": "11111111-1111-1111-1111-111111111111",
    "transaction_id": "invoice-2026-0042",
    "status": "completed",
    "tally_voucher_guid": "22222222-2222-2222-2222-222222222222-00000001",
    "tally_master_id": "335",
    "error_code": null,
    "error_label": null,
    "error_message": null
  }
}
```

::: info Provisional contract
This envelope is the intended contract and is being finalized against production. A successful result will always expose `transaction_id` and the Tally voucher GUID. Field names elsewhere in the envelope may still change before the first stable release.
:::

## How long a queued job waits

An accepted push is a durable row, not an in-memory handoff. Nothing discards it
because time passed.

| Status | What it means | Does it expire? |
|---|---|---|
| `pending` | Queued, waiting for a Connector to pick it up | **No.** It waits indefinitely — Tally closed for the weekend, the PC switched off, the Connector uninstalled and reinstalled. It runs when a Connector next collects work for that company |
| `reserved` | A Connector has it and is working on it | The *reservation* lapses if that Connector goes quiet, and the job returns to `pending` for redelivery. The job itself is not discarded |
| `completed` / `failed` | Terminal | — |
| `dead_letter` | Terminal. Delivered too many times without a result | — |

So the answer to "does a job ever expire while Tally is closed?" is no. A job can
still die, but only from being *attempted* too often, never from waiting: each
delivery that ends without a result — including a reservation that lapses because
the Connector went offline mid-push — counts as an attempt, and after five the
job is dead-lettered rather than redelivered forever.

That bound exists because the alternative is worse. A job that is redelivered
indefinitely starts a fresh Tally read or write every time, and a `dead_letter`
row is something an operator can see and act on.

::: tip Queue depth is worth watching
A customer whose Tally stays closed accumulates `pending` jobs that will all run
at once when it opens. If your product queues continuously, check queue depth
and the company's health rather than pushing blindly into a machine that has
been offline for a week.
:::

## Identifiers, and which one to keep

| Identifier | Issued by | Use it for |
|---|---|---|
| `transaction_id` | Bizmitra | Correlating your record with the operation. Your primary key for this. |
| `tally_voucher_guid` | Tally | Pointing at the actual voucher, for later updates |
| `tally_master_id` | Tally | The Tally master ID |
| `tally_alter_id` | Tally | Detecting that a voucher changed in Tally |

Store `transaction_id` and `tally_voucher_guid` on your own record. The GUID is how you recognise the voucher again in the pulled feed, and how a future update will target it — note that pushing an edit is [not supported yet](/developer/tally/voucher-kinds#updating-and-deleting-vouchers), so re-sending a corrected voucher today creates a second one.

`tally_alter_id` increments when a voucher is edited in Tally. If you are syncing bidirectionally, it is how you notice someone changed the books underneath you.

## Polling

Poll `GET /api/v1/transactions/{id}` with backoff — a couple of seconds initially, widening from there. Do not poll in a tight loop; the Connector may be busy, offline, or waiting on a Tally dialog.

Transaction outcomes are currently poll-based. Poll at a sensible interval with backoff until the job reaches a terminal state. Webhooks currently cover only Connector, Tally, and company-presence state changes; they do not report transaction completion or failure.

## Idempotency

Retries are normal. Networks time out, processes restart, queues redeliver. Assume any write may be submitted more than once and design so that it does not matter.

**Writing to Tally**

- Send an idempotency key with every push. Bizmitra de-duplicates on it, so the same key returns the original job instead of queueing a second voucher — see [Idempotency in Conventions](/developer/api/conventions#idempotency) for where to put it and how to confirm it was read.
- Keep that key on your own record too, so a retry after a crash reuses it rather than minting a new one.
- Before submitting, check whether the record already has a `transaction_id`. If it does, poll that transaction instead of submitting again.
- On an ambiguous failure — timeout, connection reset — poll before retrying, unless you sent a key, in which case re-sending the identical request is safe.
- Corrections cannot be pushed as edits yet — see [Updating and deleting vouchers](/developer/tally/voucher-kinds#updating-and-deleting-vouchers). Keep the `tally_voucher_guid` regardless.

**Reading from Tally**

- Treat `transaction_id` as the external key on the pulled voucher.
- If a voucher you have already stored appears again, update it or ignore it. Do not insert.
- Acknowledge only **after** your own transaction commits. Acknowledging first, then failing to save, loses the voucher from the pending queue.

```http
POST /api/v1/pulled-vouchers/ack
```

Acknowledgement is itself idempotent, so acknowledging twice is harmless. Acknowledging too early is not.

## Failure handling

When a transaction fails, the cause is usually in the payload or the target company's masters rather than in Bizmitra.

```json
{
  "success": true,
  "transaction": {
    "job_id": "11111111-1111-1111-1111-111111111111",
    "transaction_id": "invoice-2026-0042",
    "bizmitra_company_id": 123,
    "job_type": "invoice_sync",
    "event_type": "invoice_create",
    "status": "failed",
    "retry_count": 1,
    "max_retries": 5,
    "tally_voucher_guid": null,
    "error_code": "TALLY_IMPORT_FAILED",
    "error_label": "Tally import failed",
    "error_message": "Ledger 'Online Sales' does not exist!",
    "payload": {
      "voucher_number": "INV-0042",
      "voucher_type": "Sales"
    },
    "created_at": "2026-09-20T10:20:00Z",
    "updated_at": "2026-09-20T10:20:08Z",
    "completed_at": null
  }
}
```

`success: true` means the status request succeeded; `transaction.status: "failed"` means the Tally write failed. Use `error_code` for program logic, `error_label` in compact UI, and `error_message` for the useful rejection reason. When Tally returns XML, Bizmitra extracts the meaningful rejection text (for example `LINEERROR`) but does not expose the raw XML envelope, stack traces, credentials, or internal service details.

The show endpoint accepts either the public `job_id` or your own `transaction_id` in `{job}`:

```http
GET /api/v1/transactions/{job}
```

1. Read `error_code` and the sanitized `error_message`.
2. Fix the payload, or create the missing master.
3. Resubmit under your idempotency policy.

Do not build a blind automatic retry for validation failures. A payload Tally rejected once will be rejected identically the second time, and an unbounded retry loop against a live company generates noise for the customer and for you.

### Dashboard visibility

The transaction API is the source of truth for an individual pushed voucher and its failure reason. The connector's Sync History is an operational event feed and is useful for connector, Tally, and report activity, but it is not guaranteed to contain every failed transaction. Poll or reconcile through `GET /api/v1/transactions` for application correctness.

Report freshness is available separately through the company-scoped sync-statistics endpoint:

```http
GET /api/v1/pulled-vouchers/statistics?company_id=42&start_date=2026-09-01&end_date=2026-09-30
```

Its `reports` collection identifies whether each report is enabled, its current status, row count, and latest stored snapshot:

```json
{
  "reports": [
    {
      "key": "stock",
      "label": "Stock summary",
      "enabled": true,
      "capability": "report.stock",
      "status": "available",
      "rows": 54,
      "last_updated_at": "2026-09-20T08:25:00Z"
    },
    {
      "key": "gst",
      "label": "GST",
      "enabled": false,
      "capability": "report.gst",
      "status": "disabled",
      "rows": 0,
      "last_updated_at": null
    }
  ]
}
```

This lets an integration distinguish a fresh report from a disabled or unavailable report without relying on the connector UI. The endpoint is always scoped by `company_id`; it does not aggregate unrelated companies.
