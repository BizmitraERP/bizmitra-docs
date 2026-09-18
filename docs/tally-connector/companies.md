# Adding and changing companies

Everything on this page happens inside the Connector you already have installed.

::: tip The short answer
**No, you never need a new installer or a new pairing code to change which companies sync.** Pairing registers the *machine*; linking companies is a separate, repeatable action you can do as often as you like.
:::

Worth reading [How it all fits together](/tally-connector/how-it-works) first if "Tally company" versus "Bizmitra company" is not yet clear — the rest of this page depends on it.

## Add a company for sync

1. Open **Companies**. It lists Tally companies the Connector can see that are **not yet linked**, with their name, GUID and Company #.
2. If the one you want is not listed, open it in TallyPrime and choose **Refresh**.
3. Select it and choose **Add selected for sync**.
4. A picker opens listing the Bizmitra companies this machine is authorized for. Search for the right one and choose **Link company**.

It now appears under **Synced** as *Active*, and syncing starts.

::: warning Link the right pair
The link decides which books data is written into. Match on the business, not on a similar-looking name — a wrong link sends real vouchers into the wrong company's books. If two names are close, confirm with your provider before linking.
:::

## Replace one company with another

The common case: yesterday you linked the wrong Tally company, and today you want a different one instead.

Nothing needs reinstalling. Unlink the first, link the second.

1. Open **Synced** and select the company you linked by mistake.
2. Choose **Unsync** and confirm. You can note a reason; it is optional.
3. Open **Companies** and choose **Refresh**. The unlinked company reappears in the list, and so should the one you actually want.
4. Select the correct company, choose **Add selected for sync**, and link it to the right Bizmitra company.

**Worked example.** Yesterday you added Tally company **60**. Today you want **ABC Infoweb** instead.

| Step | Where | Action |
|---|---|---|
| 1 | **Synced** | Select company 60 → **Unsync** |
| 2 | TallyPrime | Make sure ABC Infoweb is open |
| 3 | **Companies** | **Refresh** |
| 4 | **Companies** | Select ABC Infoweb → **Add selected for sync** |
| 5 | Picker | Choose the matching Bizmitra company → **Link company** |

No new download, no new code, no call to your provider — unless ABC Infoweb is missing from one of the two lists, which is covered below.

### What Unsync does

| | |
|---|---|
| New sync jobs for that company | Stop being sent to Tally |
| Jobs already pending for it | Stop being processed |
| Data already synced | Unaffected — nothing is deleted |
| Re-linking it later | Allowed, from **Companies**, any time |

## Pause instead of unlinking

If the interruption is temporary — a month-end close, an audit, a data repair in Tally — **Pause** is the better tool.

On the **Synced** screen, select the company and choose **Pause**; choose **Resume** when you are ready. The link stays intact, so you do not have to find and re-link the right pair afterwards.

| Use | When |
|---|---|
| **Pause** | Temporary. You intend to resume this same company |
| **Unsync** | Permanent, or you linked the wrong thing |

To stop **all** syncing rather than one company, use the sync mode instead — see [Sync settings](/tally-connector/sync-settings).

## When a company does not appear

Two lists, two different causes. Find which list is missing it and the fix follows.

### Missing from the Tally list (Companies screen)

This list is read live from TallyPrime.

| Cause | Fix |
|---|---|
| The company is not open in Tally | Open it, then **Refresh** |
| TallyPrime is not running | Start it, then **Refresh** |
| It is already linked | Look under **Synced** — a linked company is deliberately hidden here |
| Tally is on another machine and unreachable | Check **Tally Settings** and the network |

### Missing from the Bizmitra picker

This list is the set of companies your provider has authorized for this machine.

| Cause | Fix |
|---|---|
| The company has not been created in Bizmitra yet | Ask your provider to create it under your customer record |
| It exists, but is not attached to your customer | Ask your provider to attach it |
| It is already linked to another Tally company on this machine | Unlink that one first, or ask for a separate Bizmitra company |

When your provider creates or attaches a company, it is granted to your already-paired machines automatically. Reopen the picker — or restart the Connector if it has been sitting open a long time — and it will be there.

::: tip Still no re-pairing
A newly created company reaching a machine that is already paired is an automatic flow. If a provider asks you to re-pair for this, they can instead attach the company to your customer record and it will arrive on its own.
:::

## Running several companies on one machine

Supported and normal. Link as many as you need; each syncs independently and can be paused on its own.

Two things to know:

- **All of them share one TallyPrime.** Tally handles one request at a time, so more linked companies means more work queued against the same instance. If Tally starts feeling slow, [Sync settings](/tally-connector/sync-settings) is where you fix it.
- **They must all be open in Tally.** A company that is closed in Tally cannot be synced, even though it stays listed under **Synced**.

## For software providers

Adding a company for a customer who is already paired:

1. Create the company under that customer.
2. Nothing else. It is granted to their paired machines automatically.

Onboarding a brand-new customer:

1. Create the customer.
2. Create their companies and attach them to that customer.
3. Generate a pairing code for the customer — it authorizes all of their companies at once.
4. Send them the Connector and the code.

API-level detail is in [Pairing a company](/developer/tally/pairing) and [Customers and companies](/developer/platform-concepts/customers-and-companies).
