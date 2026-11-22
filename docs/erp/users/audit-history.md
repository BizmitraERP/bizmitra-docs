---
title: Audit history
description: Learn how to view changes to vouchers and masters, review Tally sync activity, and understand audit retention and rollback.
---

# Audit history — Frequently asked questions

Bizmitra's audit trail helps authorized users understand **who changed a record, what changed, and when**. For financial records, the history can show previous and updated values, so changes can be reviewed without relying on memory or manual comparisons.

## How do I view the audit history of a voucher?

1. Open the relevant **voucher register** (for example, the Sales Invoice register).
2. Find the voucher you want to inspect.
3. Click the **voucher type/link** for that entry to open its **Audit History** report.
4. In the audit history, review the chronological list of events.
5. Click or expand an event to see the **detailed changes**, including the values before and after the change where available.

Depending on the event, the details may include the user, timestamp, action, narration, item or bill-allocation changes, and Tally synchronization activity.

## Is audit history available for masters as well as vouchers?

**Yes.** Audit history covers masters, vouchers, and other Bizmitra records whose changes affect financial data.

For example, an authorized user can investigate relevant changes to a master record or the amounts, items, narration, and bill allocations of a voucher.

## How long is audit history available?

Bizmitra's stated audit-history retention period is **7 years**, provided the relevant subscription remains active and the customer has not requested deletion of the data.

The available history is limited to the period for which the relevant data was recorded and retained. A 7-year retention period does not mean that records from before audit tracking began will be reconstructed.

## Can every user view the audit log?

**No.** Audit history is available only to authorized users with the appropriate permission. Permissions are granted by the **Super Admin** or another user authorized to manage access.

A user who can open a voucher does not necessarily have permission to view its audit history or perform recovery actions.

## What makes the Bizmitra audit trail different?

The audit trail goes beyond a basic activity log. It is designed to show:

- **Who, what, and when:** who created or modified a record, what action occurred, and the time of the event.
- **Before-and-after comparisons:** the previous and updated values for supported fields, such as voucher totals, item rates, narration, and bill allocations.
- **Tally synchronization context:** when applicable, changes included in a sync and a comparison of values held in Tally before and after synchronization.
- **Rollback and recovery:** supported cancelled or edited vouchers can be restored to an earlier state through an authorized rollback action, where that action is available.

**Important:** Rollback is a controlled recovery action, not a way to erase audit history. Availability depends on the record, action, and the user's permissions; do not assume every edit or cancellation can be reversed.

## Does an audit event show exactly what changed?

For supported changes, **yes**. Expand an event to inspect the field-level differences. For example, an invoice audit may show an earlier and updated grand total, changes to the narration, modified item rates, or updated bill allocations.

An event may also distinguish **edits made in Bizmitra** from **changes sent to Tally**, helping users trace how a voucher reached its current state.

## Can I filter or search audit events?

The **Universal Activity Log** provides search and filters to help locate events, including by record, action, and date where those filters are available. Select a matching event to open its detailed history.

## Does viewing an audit event change the voucher?

**No.** Opening or expanding an event is a viewing action. A rollback, if offered, is a separate action subject to the relevant authorization controls.
