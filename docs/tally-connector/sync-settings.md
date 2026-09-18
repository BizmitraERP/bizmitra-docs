# Sync settings

These settings control **how hard the Connector works Tally**. They exist because of one fact about TallyPrime, and everything here follows from it.

## Why this matters

Tally's HTTP gateway is not a background service. It is served on the same thread that draws Tally's window, so **while Tally is producing data for the Connector it can do nothing else** — the window stops repainting and other requests wait.

That leads to the single most useful insight in this documentation:

::: warning A "frozen" Tally is usually a working Tally
Tally not repainting during a sync is not a crash. It is Tally busy answering the Connector. The freeze is the symptom of sync progressing, not of something being broken.
:::

So the goal is never "sync less". It is **sync the heavy things when nobody is using Tally**.

## Light work and heavy work

The Connector separates its own work into two classes, and the settings below treat them differently.

| | What it is | Cost to Tally |
|---|---|---|
| **Light** | The regular check for changed vouchers, plus invoices and orders pushed into Tally by a user | Small, frequent |
| **Heavy** | The first bulk pull of a book, full master scans, and the stock / GST / TDS / cash-flow style report snapshots | Large, occasional |

Light work is what makes the integration feel live. Heavy work is what makes Tally stutter. Business Hours mode keeps the first and defers the second.

## Sync modes

**Settings → Synchronization → Sync mode.**

| Mode | Behaviour |
|---|---|
| **Normal** | Everything runs whenever it is due. The default |
| **Business Hours** | Inside your window, only light work runs; heavy work waits for off-hours. Outside the window, everything runs |
| **Paused** | No new automatic work starts |

### Normal

Fine for most installations — small books, a quiet Tally, or a machine nobody works on directly.

### Business Hours

The right answer whenever someone is using Tally interactively on the same machine. Your team keeps a responsive Tally all day, and the expensive passes run after hours.

### Paused

Stops new automatic work. What it does **not** do:

- It does not cancel work already in flight — the current cycle finishes.
- It does not discard pending jobs. They stay queued and run when you unpause.
- It does not unlink anything.

Use it while repairing data in Tally, during a Tally version upgrade, or when asked to by support. Unpausing restores your previous schedule exactly — pausing does not overwrite your business-hours configuration.

## Configuring business hours

These fields become editable once the mode is **Business Hours**.

| Field | Default | Notes |
|---|---|---|
| **Business hours** | `09:00` – `19:00` | 24-hour clock. A window that crosses midnight (e.g. `22:00`–`06:00`) is handled correctly |
| **Business days** | Mon – Sat | Days the window applies to. A day left unticked is treated as entirely off-hours |
| **Timezone** | Blank | Blank means the machine's own clock — right for a Connector sitting in your office. Set an IANA name such as `Asia/Kolkata` when the machine's clock is not in your business's timezone |
| **Run full sync & heavy reports during off-hours** | On | Leave it on. Turning it off means heavy work only ever runs when someone triggers it |

::: tip Set the window wider than your working day
If people occasionally work until 20:00, set the window to 20:00. Heavy work starting while one person is still in Tally is exactly what this mode exists to prevent.
:::

### A worked example

A six-day office, 09:30 to 19:30, machine clock correct:

| Setting | Value |
|---|---|
| Sync mode | Business Hours |
| Business hours | `09:30` to `19:30` |
| Business days | Mon, Tue, Wed, Thu, Fri, Sat |
| Timezone | *(blank)* |
| Off-hours full sync | On |

Result: invoices and orders keep flowing all day and changed vouchers are picked up continuously; the bulk pull, master scans and report snapshots run from 19:30 and all day Sunday.

## Background sync interval

**Settings → Synchronization → Background sync interval**, in seconds. Default 90; permitted range 15 to 3600.

This is how often the light cycle runs. Shorter is not better — each cycle takes a turn at Tally's single request slot.

| Interval | Suitable for |
|---|---|
| 15 – 30s | Only where near-real-time matters and the book is small. The app warns below 30s |
| 60 – 120s | The sensible range for most installations |
| 300s+ | Large books, or a busy Tally where responsiveness beats freshness |

## How much history to sync

**Settings → Sync window** decides how far back the Connector reads.

| Option | Use |
|---|---|
| **Financial year** | The default and the right answer almost always |
| **Date range (from – to)** | A specific period |
| **From a date onwards** | Everything since a cutover date |
| **Entire book (all years)** | Rarely. Prior years nobody asked for get carried through every full scan |

::: warning "Entire book" scales with your history, not your needs
On one production book this meant 21,000 vouchers from a closed prior year being re-read on every full pass, on top of the 19,000 anyone cared about. Choose the narrowest window that covers what you actually need.
:::

## If Tally still feels slow

In order:

1. **Update the Connector.** Several fixes specifically reducing its load on Tally have shipped; an old build can hold Tally far longer than a current one.
2. **Switch to Business Hours mode** and set the window to your real working day.
3. **Narrow the sync window** to the current financial year.
4. **Lengthen the background interval** to 120s or more.
5. **Contact your provider.** Finer controls — how large a share of Tally's time the Connector may take, and how large each export chunk is — can be tuned remotely. The change reaches the Connector on its next check-in, with no reinstall and no restart.

::: tip Leaving it running is safer than switching it off
Backlog is what makes the next run heavy. A Connector stopped for a week faces a week of catch-up when it starts. If the machine must be shut down — an instance you power up for an hour each evening, say — tell your provider, because that shapes how they tune it.
:::

## Related

- [Troubleshooting](/tally-connector/troubleshooting) — when Tally freezes or nothing syncs
- [FAQ](/tally-connector/faq)
