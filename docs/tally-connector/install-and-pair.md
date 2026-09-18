# Install and pair

You do this once per machine. Adding companies later does not repeat any of it.

## Before you start

| | |
|---|---|
| **The machine** | Windows, on the same network as TallyPrime — ideally the machine Tally itself runs on |
| **TallyPrime** | Installed and running, with at least one company open |
| **A pairing code** | From your software provider |
| **Internet** | Ordinary outbound access. No firewall change, no port forwarding |

::: tip Pick the machine that stays on
Syncing only happens while the machine is awake and Tally is open. A server or an always-on accounts PC is a far better host than a laptop someone takes home.
:::

## 1. Install

Run the installer your provider gave you and let it finish. It needs no special privileges beyond an ordinary Windows install, and it makes no changes to Tally.

## 2. Check Tally is reachable

Open the Connector and go to **Tally Settings**. It defaults to `localhost` and Tally's usual port.

Use the connection check there before pairing. If it fails, fix that first — pairing will succeed but nothing will sync.

| Problem | Fix |
|---|---|
| Tally is on another machine | Enter that machine's name or IP instead of `localhost` |
| Connection refused | In Tally, check that the HTTP/XML gateway is enabled and note the port it uses |
| Port is different | Set the same port in **Tally Settings** |

## 3. Enter the pairing code

Paste the code your provider sent you and confirm.

Codes are short-lived by design. If yours is rejected, it has almost certainly expired or already been used — ask for a fresh one rather than retyping it.

| Message | Meaning |
|---|---|
| Code expired | Too much time passed since it was generated. Ask for a new one |
| Code already used | It was redeemed on another machine. Ask for a new one |
| Code not found | Mistyped, or revoked. Check it character by character, then ask for a new one |

Once accepted, the machine is registered and holds its own credentials. **You will not need a pairing code again on this machine.**

## 4. Link your first company

Pairing establishes *who you are*. Linking establishes *which books to sync*.

1. Open the **Companies** screen. It lists the Tally companies it can see that are not yet linked.
2. Select one and choose **Add selected for sync**.
3. Pick the matching Bizmitra company from the list that appears, and choose **Link company**.

The company then appears under **Synced**, and syncing begins.

Full detail — including swapping one company for another — is in [Adding and changing companies](/tally-connector/companies).

## 5. Confirm it is working

| Screen | What good looks like |
|---|---|
| **Home** | Paired, Tally online |
| **Synced** | Your company listed as *Active* |
| **Jobs** | Entries appearing as work is processed |

Give it a few minutes. The first sync on a large book does the most work it will ever do; after that it only picks up what changed.

::: tip Install during working hours
Counter-intuitive, but deliberate. If you set the Connector to **Business Hours** mode first, the heavy first pass is deferred until the office closes — so the install itself barely touches Tally, and the bulk of the work happens overnight. See [Sync settings](/tally-connector/sync-settings).
:::

## Keeping it updated

Leave automatic updates on in **Settings**. Fixes that reduce the load the Connector puts on Tally ship regularly, and an out-of-date Connector is the first thing support will ask about.

## Moving to a different machine

Install on the new machine and pair it with a fresh code from your provider, then link the companies again. Ask your provider to remove the old machine so it stops appearing in their list.

Your data and history are unaffected — only the route to Tally is rebuilt.
