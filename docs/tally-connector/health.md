# Health checks

The **Health** screen is the Connector explaining its own state. Before this existed, status was spread across several screens that could contradict each other — this is the one place that answers "is it working, and if not, which part."

Open it when **Home** says something needs attention, or when you are about to contact support.

## The three tabs

| Tab | What it is for |
|---|---|
| **Checks** | Live tests of each part, worst first. Start here |
| **Activity** | What has happened, filterable by **Sync**, **Tally**, **Company** and **Connection**. It survives restarts |
| **Logs** | The Connector's own log, on this computer. Used when support asks for it |

## The eight checks

They run in this order, which is also the order in which a failure matters — a Connector that cannot reach the server cannot be expected to pass anything below it.

| Check | Healthy means |
|---|---|
| **Connector ↔ server** | Check-ins are getting through to your provider's server |
| **Network** | This computer is online, the server's name resolves, and nothing blocks the secure connection |
| **Authentication** | The server recognises this Connector and accepts its sign-in |
| **Tally** | TallyPrime is running and answering at the configured address |
| **Company loaded** | The linked company is open in Tally |
| **Sync queue** | Work is being collected and carried out |
| **Reports** | Each report that is switched on is actually running |
| **Connector version** | You are on a current build |

Anything failing is expanded at the top with what it means, what usually causes it, and what to do. A healthy check stays collapsed to a single line.

::: tip "Reports" is the check worth reading even when nothing is broken
A report that is switched on but never running looks exactly like a report with nothing to say. This check distinguishes them, which is why it is listed separately from the sync queue.
:::

## Buttons a check can offer

A failing check offers only the actions that apply to it:

| Button | What it does |
|---|---|
| **Check again** | Re-runs the checks now, rather than waiting for the next cycle |
| **Retry now** | Retries the connection or the failed work immediately |
| **Sync now** | Starts a sync cycle |
| **Pair again** | Re-pairs this computer. Offered when the pairing is the problem — for example when the Connector is paired to a different server than the one configured |
| **Go to Companies** | Takes you to where a company link is fixed |
| **View in Sync** / **View reports** / **View vouchers** | Opens the relevant Sync tab |
| **Copy diagnostics** | Copies the current state to your clipboard, to paste into a message to support |
| **Troubleshooting** | Opens the in-app guide for that problem |

## When a check says the server rejected the Connector

This is different from being offline, and it is worth knowing the difference because the fix is different.

- **Offline** — the Connector cannot reach the server. It keeps retrying and catches up on its own.
- **Rejected** — the server reached the Connector and refused its sign-in. Sync stops and says so rather than retrying in a loop.

A rejection usually means the pairing was removed or disabled by your provider, or the computer is paired to a different server. Ask your provider before re-pairing; if they disabled it deliberately, re-pairing will not help.

## Related

- [Troubleshooting](/tally-connector/troubleshooting) — symptom-first, when you would rather not read checks
- [Sharing logs with support](/tally-connector/support-logs) — the **Logs** tab, and what support can ask for
- [Sync settings](/tally-connector/sync-settings) — if the sync queue is healthy but slow
