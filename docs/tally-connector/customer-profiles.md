# Several customers on one computer

One Connector install can hold pairings for **more than one customer** — several unrelated businesses — and switch between them. This is for the accountant's office or the shared back-office machine that keeps books for multiple clients.

It is not how you add a second company to the same business. For that, see [Adding and changing companies](/tally-connector/companies): one customer's companies all sync at once, with no switching.

::: warning Only one profile is active at a time
Switching is not a way to sync two customers simultaneously. The profile you switch to is the one that syncs; the other sits parked until you switch back. If two businesses both need continuous syncing, they need two computers — or two installs' worth of availability, which is really the same thing.
:::

## What a profile is

A **customer profile** is one complete pairing:

| Belongs to the profile | Shared across profiles |
|---|---|
| The pairing with your provider's server | The Connector program itself |
| Which Bizmitra companies it is authorized for | The computer, and its TallyPrime |
| Which Tally companies are linked to them | — |
| Its sync history and activity | — |

The list of profiles lives on the server, not on the computer. That is deliberate: it means the arrangement survives a reinstall, and your provider can see it.

## Where it lives

**Settings → Advanced → Customer profiles**, with four actions:

| Action | What happens |
|---|---|
| **Switch…** | Pick another profile. The Connector restarts under it |
| **Rename…** | Give a profile a name you will recognise. Worth doing immediately — a profile you cannot identify is a profile you will switch into by mistake |
| **Remove…** | Removes a profile other than the one you are using. Its companies are unlinked on the server and stop syncing; pairing that customer again needs a new code. The profile you are on is unaffected |
| **Pair another customer…** | Adds a new one — see below |

**Switch…** needs at least two profiles to be useful; with only one, the app tells you to use **Pair another customer…** instead.

## Adding a second customer

1. Get a pairing code for the new customer from your provider — the same kind of code as a first-time install.
2. **Settings → Advanced → Pair another customer…**
3. Confirm. The Connector restarts and opens unpaired, ready for the new code.
4. Enter the code, then link that customer's Tally companies as usual.

The customer you were on **stays on the server** and is parked when the new code is redeemed. You can switch back to it any time; nothing about it was discarded.

::: tip The restart is expected, not a failure
Both switching and adding restart the Connector. Syncing resumes under the profile you landed on once it is back.
:::

## Switching between them

1. **Settings → Advanced → Customer profiles → Switch…**
2. Pick the profile. The one you are on is marked as current.
3. Confirm. The Connector restarts as that profile.

What you will see afterwards: that customer's linked companies on **Companies**, that customer's history on **Sync** and **Health → Activity**. Nothing from the other profile is visible, which is the point.

## What this does not change

- **Tally is still one Tally.** Every profile on the machine reaches the same TallyPrime, so the relevant companies must be open there. See [Sync settings](/tally-connector/sync-settings) if that starts to strain Tally.
- **No profile can see another's books.** Authorization is enforced on the server per pairing, exactly as with one customer per machine.
- **Companies still cannot be moved between profiles.** A company belongs to the customer your provider created it under. If it is under the wrong customer, that is a change your provider makes.

## For software providers

Each profile is a separate pairing against your API, and the server owns the list. Nothing special is needed to support this arrangement beyond issuing a pairing code per customer as usual — the Connector handles parking and switching.

API-level detail is in [Pairing a company](/developer/tally/pairing#one-machine-several-customers).

## Related

- [How it all fits together](/tally-connector/how-it-works) — customer, company, Connector
- [Adding and changing companies](/tally-connector/companies) — several companies for one customer
- [Install and pair](/tally-connector/install-and-pair) — the first pairing
