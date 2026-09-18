# Troubleshooting

Start with the **Home** screen. It tells you whether the Connector is paired and whether Tally is reachable, which separates most problems into the right half straight away.

## Quick triage

| Symptom | Most likely cause | Go to |
|---|---|---|
| Tally freezes or feels slow | Tally is busy answering the Connector | [Tally hangs](#tally-hangs-or-feels-slow) |
| Nothing syncing at all | Machine asleep, Tally closed, or sync paused | [Nothing is syncing](#nothing-is-syncing) |
| One company not syncing | That company is paused, or closed in Tally | [One company](#one-company-is-not-syncing) |
| Data going to the wrong place | Wrong link | [Wrong company](#data-in-the-wrong-company) |
| Company missing from a list | Depends which list | [Adding and changing companies](/tally-connector/companies#when-a-company-does-not-appear) |
| Jobs showing as failed | Usually a missing master in Tally | [Failed jobs](#jobs-are-failing) |

## Tally hangs or feels slow

The most reported problem, and the most misunderstood.

### What is actually happening

TallyPrime serves its HTTP gateway on the same thread that draws its window. While Tally is generating an export for the Connector it cannot repaint, and other requests to it wait.

**So a Tally that stops responding during a sync is usually a Tally that is working.** It is not a crash, nothing is corrupted, and the sync is progressing. On a large book a single export can legitimately hold Tally for tens of seconds.

::: warning Do not force-close Tally mid-export
Tally does not stop building an export because you stopped waiting for it. Killing and restarting Tally discards the work, and the Connector will begin it again — usually with more to do than before. Wait for it to come back.
:::

### What to do

**First — is it a genuine problem, or Tally doing its job?** If freezes last a few seconds and then clear, that is normal operation on a busy book. If they last minutes, or happen continuously through the working day, work through the list below.

1. **Update the Connector.** Several fixes that materially reduce how long it holds Tally have shipped. An old build is the single most common reason for this complaint. Check for updates in **Settings**.

2. **Switch to Business Hours mode.** Settings → Synchronization. Set the window to your real working day. Heavy work — the bulk pull, master scans, report snapshots — then defers to off-hours while invoices and changed vouchers keep flowing all day. See [Sync settings](/tally-connector/sync-settings).

3. **Narrow the sync window** to the current financial year. Syncing the entire book re-reads closed years on every full pass.

4. **Lengthen the background interval** to 120 seconds or more.

5. **Check what is actually linked.** Every linked company shares one TallyPrime. If companies are linked that nobody needs synced, unlink them.

6. **Ask your provider to tune it.** They can adjust how large a share of Tally's time the Connector may take and how large each export chunk is, remotely. Smaller chunks turn one long freeze into several short ones — often the difference between unusable and unnoticeable. Tell them:
   - which Connector version you are on,
   - roughly how big the book is,
   - when the freezes happen, and how long they last.

::: tip Turning the Connector off makes tomorrow worse
Backlog is what makes a run heavy. A Connector switched off for a week meets a week of catch-up. Pausing briefly to get through a deadline is reasonable; leaving it off is not a fix.
:::

### If Tally freezes when the Connector is not running

Then it is not the Connector. Confirm by setting the sync mode to **Paused** and watching for the rest of the day — if the freezes continue, take it up with your Tally support.

## Nothing is syncing

Work down this list in order.

| Check | Where |
|---|---|
| Is the machine on and awake? | Windows power settings — sleep stops everything |
| Is the Connector running? | It should be open, or running in the background |
| Does **Home** show paired? | Home screen |
| Does **Home** show Tally online? | Home screen |
| Is TallyPrime running with the company open? | TallyPrime |
| Is the sync mode **Paused**? | Settings → Synchronization |
| Is the company itself paused? | **Synced** screen — status should be *Active* |
| Is the internet working? | Any browser |

If **Home** shows paired and Tally online but the **Jobs** screen is still empty, there may genuinely be nothing to do. Make a change in Tally and watch for it.

### After an office move or a new router

The machine may have come back on a different network connection, or with Tally on a new address. Check **Tally Settings** and re-test the connection.

## One company is not syncing

| Check | Fix |
|---|---|
| Status on the **Synced** screen | If *Paused*, select it and choose **Resume** |
| Is that company open in Tally? | A closed company cannot be synced even while it stays listed |
| Was it unlinked? | If it is not on **Synced** at all, re-link it from **Companies** |
| Is the whole Connector paused? | Settings → Synchronization |

## Data in the wrong company

Stop syncing first, investigate second.

1. Open **Synced**, select the company, choose **Pause**.
2. Confirm which Bizmitra company it is linked to.
3. If the link is wrong, **Unsync** it and re-link correctly from **Companies**.
4. Tell your provider what was written where. Vouchers already sent are in Tally, and correcting them is an accounting task, not a Connector one.

Prevention: check the pair carefully at link time. See [Adding and changing companies](/tally-connector/companies).

## Jobs are failing

The **Jobs** screen lists what was attempted and what came back from Tally.

| Pattern | Usual cause |
|---|---|
| A single voucher fails, the rest succeed | Something it refers to is missing in Tally — a ledger, a stock item, a voucher type |
| Everything fails from one moment on | Tally closed, the company closed, or the connection dropped |
| Everything fails from the start | Wrong company linked, or the book is not set up for what is being sent |

Most failures are a missing master. Tally will not accept a voucher naming a ledger that does not exist, and the name must match exactly — trailing spaces and differing capitalisation both count.

Failed jobs can be retried from the **Jobs** screen once the underlying cause is fixed.

## The Connector shows as offline to my provider

They see what the machine last reported.

| Cause | Fix |
|---|---|
| Machine off, asleep, or restarted | Switch it on; check Windows sleep settings |
| Connector not running | Start it |
| Internet down | Check any browser |
| Connector disabled by your provider | Ask them — disabling is deliberate and reversible |

Office machines get switched off. It is not usually an incident.

## Collecting information for support

Have these ready:

- The Connector version, from **Settings**.
- What **Home** shows: paired, and Tally online.
- The company name, and its status on **Synced**.
- What the **Jobs** screen shows — the error text as it appears.
- When it started, and what changed around then (a Tally upgrade, an office move, a new machine).

The Connector can send diagnostics when something goes wrong; the preference for that lives in **Settings**, and asking before sending is the default.

## Still stuck

Contact whoever provided your Bizmitra connection. They can see your Connector's status and its full job history, which is more than the app shows you.

For anything else, [contact Bizmitra](https://bizmitra.io/contact).
