# Sharing logs with support

The Connector keeps a log on the computer it runs on. Some problems — a sync that fails only sometimes, a report Tally answers oddly — cannot be diagnosed without it.

**Nothing in that log leaves the computer automatically.** Support has to ask, and you have to agree. This page describes both directions: sending something yourself, and answering a request.

## Contacting support yourself

**Help → Contact support.** Choose a topic, describe what happened, and the Connector assembles the technical half for you.

| | |
|---|---|
| **Shared** | The Connector version and environment; the state of each part, with Health's checks and error codes; the last sync result and error code |
| **Shared only if you tick it** | The Connector log, for the period you choose |
| **Never shared** | Passwords, tokens and keys. And nothing at all until you press send |

You see the assembled request before it goes. If you would rather send it through your own email, you can copy it out instead.

::: tip Attach the log if you were asked to, or if the problem is intermittent
For "it failed once yesterday afternoon", the log is usually the only record of what happened. For "it has never worked", the checks alone are normally enough.
:::

## When support asks for your log

A request appears as a card on the **Help** screen, showing who asked, when, and the reason they gave. It carries a reference — quote it if you talk to support about the request itself.

Three options:

| | |
|---|---|
| **Preview what's sent** | Opens the exact content, so you can read it before deciding. The card also tells you how many log lines fall in the period |
| **Send log** | Uploads it to support |
| **Decline** | Tells support you would rather not. The request closes |

Declining is a legitimate answer and it is recorded as your answer, not as a failure. If a period contains no log lines at all, sending simply tells support that.

### What the log can contain

The log can include company, voucher and ledger names, and parts of Tally's replies. GSTIN, PAN, email addresses and phone numbers are masked.

It does not contain passwords, tokens or keys.

If that is still more than you want to share, decline and ask support what specifically they are looking for — they can often work from the Health checks and an error code.

## When support asks for detailed logging

Some problems only show up with more detail than the Connector normally records. Support can ask for detailed logging **for a set number of hours**, and that arrives as its own card: *Support asked to turn on detailed logging*, with the reason and the duration.

| | |
|---|---|
| **Turn on for *n* hours** | Starts detailed logging for that period |
| **Decline** | Declines the request |
| **Turn off now** | Available while it is on, if you change your mind |

Two things worth being clear about:

- **While it is on, the log records more.** Routine steps, and the start of what Tally answers — which can include item names, quantities and amounts.
- **Approving sends nothing.** It changes only what is written to the log on this computer. The log still leaves the machine only if you send it.

It switches itself off when the time is up. You do not have to remember to turn it off, and support's request itself expires if you never answer it.

## Reading the log yourself

**Health → Logs** shows the log in the app. Worth a look before sending it — both to see whether it contains anything you would rather not share, and because the failure is sometimes obvious in it.

## Related

- [Health checks](/tally-connector/health) — what support will read first
- [Troubleshooting](/tally-connector/troubleshooting#collecting-information-for-support) — what to have ready
