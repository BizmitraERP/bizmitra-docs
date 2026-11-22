---
title: Audit History – Frequently Asked Questions
description: Learn how to view Bizmitra audit history for vouchers and masters, inspect changes, and understand permissions, retention and rollback.
---

# Audit History – Frequently Asked Questions

Bizmitra's Audit History helps authorized users understand **what changed, who made the change, and when it happened**. For supported records, it also shows detailed before-and-after values and synchronization-related changes.

## How can I view the audit history of a voucher?

1. Open the relevant **voucher register**, such as the **Sales Invoice Register**.
2. Find the voucher you want to inspect.
3. Click the **voucher type / audit-history link** in the register to open its history in the **Universal Activity Log**.
4. Review the events associated with that voucher. **Click or expand an event** to see its detailed history, including changed fields and previous and updated values where available.

The activity log includes filters to help you find events by entity, action, date and other available criteria.

## Can I see exactly what changed in a voucher?

**Yes.** Expand an event to inspect the changes recorded for that action. Depending on the voucher and event, details can include amounts, narration, bill allocations, line items, status changes, the user responsible and the event time.

For Tally-connected vouchers, the log can also show synchronization events and differences recorded during a sync. This helps distinguish edits made in Bizmitra from the state sent to Tally.

## Is audit history available for masters as well?

**Yes.** Bizmitra provides audit history for masters and vouchers, including records whose changes affect financial or business data. The details available depend on the record type and the actions recorded.

## Is there a limit to the period for which audit history is available?

Audit history is designed for long-term review. **There is no stated limit on the number of audit entries users can inspect within the available history.** However, the period available is subject to the system's configured retention policy. The current Audit Log screen displays **7 years** of retention; do not interpret “no entry limit” as indefinite storage.

## Can every user view audit history?

**No.** Audit logs are visible only to users with the relevant permission. The **Super Admin or another authorized administrator** can grant access according to their permitted role-management capabilities.

## What is special about Bizmitra's audit trail?

Bizmitra's audit trail does more than list who changed a record and when. It can show **field-level before-and-after values**, voucher-level activity, and relevant Tally synchronization history.

Bizmitra also supports **rollback or restoration for eligible actions**, such as supported voucher edits or cancellations. This is distinct from simply viewing a historical event: the action must be supported and the user must be authorized. Rollback should not be assumed to be available for every record or change.

## Does rollback erase the original audit history?

Rollback and viewing history serve different purposes. A rollback restores an eligible business record to an earlier permitted state; it should **not** be presented as a way to erase or conceal the original audit trail. Check the applicable permissions and action details before proceeding.

> **Note for administrators:** Review audit-log access permissions and the retention policy for your deployment. If you need to restore a voucher, confirm that the specific rollback action is available and authorized.
