# Troubleshooting

Start with **Home**. It shows one status and, when something needs you, the next step to take. If that is not enough, **Health → Checks** tests each part separately and explains whatever is failing at the top of the list.

## Quick triage

| Symptom | Most likely cause | Go to |
|---|---|---|
| Tally freezes or feels slow | Tally is busy answering the Connector | [Tally hangs](#tally-hangs-or-feels-slow) |
| Nothing syncing at all | Machine asleep, Tally closed, or sync paused | [Nothing is syncing](#nothing-is-syncing) |
| One company not syncing | That company is paused, or closed in Tally | [One company](#one-company-is-not-syncing) |
| Data going to the wrong place | Wrong link | [Wrong company](#data-in-the-wrong-company) |
| Company missing from a list | Depends which list | [Adding and changing companies](/tally-connector/companies#when-a-company-does-not-appear) |
| Vouchers showing as failed | Usually a missing master in Tally | [Failed vouchers](#vouchers-are-failing) |
| A message you cannot interpret | — | [Health checks](/tally-connector/health) |

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

1. **Update the Connector.** Several fixes that materially reduce how long it holds Tally have shipped. An old build is the single most common reason for this complaint. Check for updates in **Settings → Updates**.

2. **Check the sync mode is Business hours.** Settings → Sync schedule. Set the window to your real working day. Heavy work — the bulk pull, master scans, report snapshots — then defers to off-hours while invoices and changed vouchers keep flowing all day. See [Sync settings](/tally-connector/sync-settings).

3. **Narrow the sync window** to the current financial year. Syncing the entire book re-reads closed years on every full pass.

4. **Lengthen the check interval** to 120 seconds or more.

5. **Check what is actually linked.** Every linked company shares one TallyPrime. If companies are linked that nobody needs synced, unlink them on **Companies → Linked**.

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

**Health → Checks** answers most of this list in one screen — it reports the server connection, the network, authentication, Tally, the loaded company, the sync queue, reports and the version. Work down the list below for anything it does not settle.

| Check | Where |
|---|---|
| Is the machine on and awake? | Windows power settings — sleep stops everything |
| Is the Connector running? | It should be open, or running in the background |
| Do the **Health** checks pass? | Health → Checks |
| Is TallyPrime running with the company open? | TallyPrime |
| Is the sync mode **Paused**? | Settings → Sync schedule |
| Is the company itself paused? | **Companies → Linked** |
| Is the internet working? | Any browser |

If the checks are healthy but **Sync → Now** stays quiet, there may genuinely be nothing to do. Make a change in Tally and watch for it.

### After an office move or a new router

The machine may have come back on a different network connection, or with Tally on a new address. Check **Settings → Tally connection** and re-test the connection.

## One company is not syncing

| Check | Fix |
|---|---|
| Status on **Companies → Linked** | If paused, select it and choose **Resume syncing** |
| Is that company open in Tally? | A closed company cannot be synced even while it stays listed |
| Was it unlinked? | If it is not on **Linked** at all, re-link it from the **Available** tab |
| Is the whole Connector paused? | Settings → Sync schedule |

## Data in the wrong company

Stop syncing first, investigate second.

1. Open **Companies → Linked**, select the company, choose **Pause syncing**.
2. Confirm which account company it is linked to — the **Linked** tab shows the Tally name and the account name side by side.
3. If the link is wrong, choose **Stop syncing…** and re-link correctly from the **Available** tab.
4. Tell your provider what was written where. Vouchers already sent are in Tally, and correcting them is an accounting task, not a Connector one.

Prevention: check the pair carefully at link time. See [Adding and changing companies](/tally-connector/companies).

## Vouchers are failing

The **Sync** screen holds this, split by what you are looking for:

| Tab | What it shows |
|---|---|
| **Now** | What is running at this moment, and what just ran |
| **History** | Completed cycles — time, status, scope, direction, records, duration |
| **Vouchers** | Individual vouchers pulled and pushed, with their status |
| **Needs attention** | Pushes that failed and failed cycles from today — the list to work from |
| **Reports** | Each report and whether it last ran |

| Pattern | Usual cause |
|---|---|
| A single voucher fails, the rest succeed | Something it refers to is missing in Tally — a ledger, a stock item, a voucher type |
| Everything fails from one moment on | Tally closed, the company closed, or the connection dropped |
| Everything fails from the start | Wrong company linked, or the book is not set up for what is being sent |

Most failures are a missing master. Tally will not accept a voucher naming a ledger that does not exist, and the name must match exactly — trailing spaces and differing capitalisation both count.

Failed pushes are retried from **Needs attention** once the underlying cause is fixed: select the rows and choose **Retry selected**, or use **Retry** on a single row.

### Reading an error

Each failure shows **What went wrong** in plain language, with an **Error code** beneath it. The code is a support reference, not the explanation — quote it when you report the problem, but work from the sentence above it. Older versions showed only the bare code.

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

**Help → Contact support** assembles most of this for you. Describe the problem and the Connector attaches its version, the state of each part with Health's checks and error codes, and the last sync result. It lists exactly what will be shared and what never is, and nothing leaves the computer until you press send.

If you are writing to support yourself instead, have these ready:

- The Connector version, from **Settings → About**.
- What **Health → Checks** shows, and anything expanded at the top of it.
- The company name, and its status on **Companies → Linked**.
- The failure from **Sync → Needs attention** — the plain-language reason and the error code beneath it.
- When it started, and what changed around then (a Tally upgrade, an office move, a new machine).

Support may also ask for the Connector's log, or ask you to switch on detailed logging for a few hours. Both arrive as a card you approve or decline, and both are covered in [Sharing logs with support](/tally-connector/support-logs).

## Still stuck

Contact whoever provided your Bizmitra connection. They can see your Connector's status and its full job history, which is more than the app shows you.

For anything else, [contact Bizmitra](https://bizmitra.io/contact).
