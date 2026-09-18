# FAQ

## Companies

### I added the wrong company yesterday. Do I need a new Connector installer?

No. Pairing registers the **machine**, not a company. Once a machine is paired you can link, unlink and re-link companies as often as you like.

Open **Synced**, select the wrong company, choose **Unsync**. Then open **Companies**, choose **Refresh**, select the right one and link it.

Step by step in [Adding and changing companies](/tally-connector/companies#replace-one-company-with-another).

### Do I need a new pairing code to add a company?

No. A pairing code is used once, when the machine is first set up. Adding companies afterwards needs no code.

### My provider created a new company for me. How do I get it?

It reaches your machine automatically — companies created under your customer record are granted to your already-paired machines with no re-pairing.

Open **Companies**, choose **Add selected for sync** on the Tally company you want, and the new Bizmitra company will be in the picker. If the Connector has been open for a long time, restart it first.

### Can one Connector sync several companies?

Yes, and it is the normal arrangement. Each company syncs independently and can be paused on its own.

They all share one TallyPrime, though, so more linked companies means more work queued against the same instance. If Tally starts feeling slow, see [Sync settings](/tally-connector/sync-settings).

### What is "Company Number"?

Tally's own number for a company in its company list. It is meaningful only inside your Tally installation — it is not a Bizmitra identifier and two unrelated businesses can both have a company Number.

The Connector shows it purely so you can tell similarly-named companies apart.

### The company I want is not in the list

Which list is missing it tells you who fixes it.

| Missing from | Cause | Fix |
|---|---|---|
| The Tally list on **Companies** | Not open in Tally | Open it in Tally, then **Refresh** |
| The Bizmitra picker | Not created or not attached to your customer | Ask your provider |

Full table in [Adding and changing companies](/tally-connector/companies#when-a-company-does-not-appear).

### What is the difference between Pause and Unsync?

**Pause** is temporary and keeps the link — use it for a month-end close or an audit, then **Resume**. **Unsync** removes the link entirely; you re-link from **Companies** if you want it back.

Neither deletes any data.

## Tally performance

### Tally hangs when the Connector is running. What do I do?

Most often, Tally is not hanging — it is working.

Tally serves its data gateway on the same thread that draws its window, so while it is producing an export it cannot repaint. A freeze during sync is the symptom of sync progressing.

If the freezes are long or constant, in order:

1. Update the Connector — fixes that cut how long it holds Tally ship regularly.
2. Switch to **Business Hours** mode so heavy work defers to off-hours.
3. Narrow the sync window to the current financial year.
4. Lengthen the background interval to 120 seconds or more.
5. Ask your provider to tune it remotely — smaller export chunks turn one long freeze into several short ones.

Detail in [Troubleshooting](/tally-connector/troubleshooting#tally-hangs-or-feels-slow).

### Should I close Tally when it freezes during a sync?

No. Tally does not stop building an export because you stopped waiting for it, so force-closing discards the work and the Connector starts it again — with more to do than before. Wait for it to come back.

### Should I switch the Connector off during busy periods?

Pausing briefly to get through a deadline is reasonable. Leaving it off is not, because backlog is what makes the next run heavy — a week switched off means a week of catch-up.

Use **Business Hours** mode instead. It keeps light sync running all day and moves only the expensive work to off-hours.

### Does the Connector slow Tally down because of CPU or memory?

No. Its footprint is negligible. What matters is the share of time it holds Tally's single request slot, which is exactly what the sync settings control.

## Sync settings

### How do I set business hours?

**Settings → Synchronization.** Set **Sync mode** to *Business Hours*, then set the window, the days, and a timezone if the machine's clock is not in your business's timezone. Leave *Run full sync & heavy reports during off-hours* ticked.

Defaults are 09:00–19:00, Monday to Saturday. Full detail in [Sync settings](/tally-connector/sync-settings#configuring-business-hours).

### How do I pause syncing during business hours?

You probably want **Business Hours** mode rather than a pause — it keeps invoices and changed vouchers flowing while deferring only the heavy work. A full pause stops everything, including invoices your team is trying to push into Tally.

If you do want everything stopped: **Settings → Synchronization → Sync mode → Paused**.

### What happens to work in progress when I pause?

The cycle already running finishes. No new automatic work starts. Pending jobs stay queued and run when you unpause. Nothing is lost.

### Does pausing lose my business-hours settings?

No. Pause and the schedule are separate settings, so unpausing restores your configuration exactly as it was.

### What counts as "heavy" work?

The first bulk pull of a book, full master scans, and report snapshots — stock, GST, TDS, cash flow and similar.

"Light" work is the regular check for changed vouchers and the invoices and orders pushed into Tally by a user. Light work keeps running during business hours; heavy work is what defers.

### How often should the Connector sync?

60 to 120 seconds suits most installations. Below 30 seconds the app warns you, because frequent cycles compete with your own use of Tally. Large or busy books are usually better at 300 seconds or more.

### How far back does it sync?

The current financial year by default, which is the right answer almost always. You can set a date range, a start date, or the entire book in **Settings → Sync window** — but syncing the entire book re-reads closed years on every full pass.

## Setup and machines

### Where should the Connector be installed?

On the machine running TallyPrime, or another on the same network that can reach it. If Tally runs on a server, install it there rather than on a workstation someone switches off at the end of the day.

### Do I need to open a firewall port?

No. The Connector makes outbound connections only. No port forwarding, no static IP, no inbound rule. Bizmitra never connects into your network.

### Does Tally have to be open?

Yes. The Connector reads from and writes to a running TallyPrime, with the relevant company open. If Tally closes, syncing pauses and resumes by itself when it comes back.

### Can I install it on more than one machine?

Yes — each machine pairs with its own code. Link each company to one machine; two machines syncing the same company would duplicate work.

### What if I change the machine?

Install on the new one, pair it with a fresh code from your provider, and link the companies again. Ask your provider to remove the old machine. Your data and history are unaffected.

### My pairing code was rejected

Codes are short-lived and single-use. Rejection almost always means it has expired or has already been redeemed. Ask your provider for a fresh one rather than retyping the old one.

### Is the Connector specific to my company?

No — it is one universal program. Even a build carrying your provider's branding is the same application with a small branding file alongside it. Nothing about it is generated per company, so there is nothing to regenerate when your company list changes.

### Should I let it update automatically?

Yes. Updates regularly include fixes that reduce the load the Connector puts on Tally, and an out-of-date build is the first thing support will ask about.

## Data and security

### Can this Connector see other businesses' data?

No. When it is paired it is authorized for your companies only, and that authorization is enforced on the server. It cannot list or reach another business's books.

### Does Bizmitra store my Tally data?

Your provider's integration determines what is synced and retained. Ask them what their product stores and for how long — they own that relationship and that answer.

### What does the Connector send back?

The data the operation calls for, plus operational information: whether Tally is reachable, what jobs ran, and what Tally returned. Diagnostics after a crash are sent only according to the preference in **Settings**, which asks before sending by default.

### Does it change anything in Tally on its own?

It performs only the work it has been authorized and asked to do — writing vouchers your product sent, and reading what has been granted. It makes no unprompted changes to your books or your Tally configuration.

## Getting help

### Who do I contact?

Whoever provided your Bizmitra connection — usually the software company whose product you are connecting to Tally. They can see whether your Connector is online and its full job history, which is more than the app shows you.

For anything else, [contact Bizmitra](https://bizmitra.io/contact).

### What should I tell them?

- The Connector version, from **Settings**
- What **Home** shows: paired, and Tally online
- The company name and its status on **Synced**
- The error text from the **Jobs** screen, as it appears
- When it started, and what changed around then
