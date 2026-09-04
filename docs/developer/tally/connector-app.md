# The Connector App

The Bizmitra Connector App is a Windows application installed on a machine that can reach TallyPrime over the local network.

## What it does

1. Maintains an outbound connection to Bizmitra.
2. Collects work it is authorized to perform.
3. Executes that work against the local TallyPrime instance.
4. Reports results back.

That is the whole job. It holds no business logic of yours and makes no decisions about your data.

## Requirements

| Requirement | Detail |
|---|---|
| Operating system | Windows |
| Network | Outbound HTTPS to Bizmitra |
| Tally access | Able to reach the TallyPrime instance over the local network |
| Tally state | Running, with the target company open |
| Availability | Online when work needs to run |

**No inbound connectivity is required.** No port forwarding, no static IP, no firewall exception for incoming traffic. This is usually the deciding factor for a customer's IT policy, and worth saying explicitly when you ask them to install it.

## Where to install it

On the machine that runs Tally, or one on the same network that can reach it.

In practice the Tally machine itself is the safer choice for smaller customers — fewer moving parts, no dependency on a network path that someone will change. Larger customers running Tally on a server should install the Connector there rather than on a workstation that gets shut down at night.

## Availability and its consequences

The Connector must be online for work to run. When it is not:

- Reads return stale data or nothing.
- Writes queue rather than fail outright.
- Health checks report the Connector as unavailable.

This is the operational reality of integrating with desktop software. Design for it:

- Check [company health](/developer/tally/company-health) before acting.
- Treat "Connector offline" as a distinct, recoverable state in your product — not a generic error.
- Tell the user something useful. "Your accounting connection is offline — check that the Tally computer is switched on" is actionable. "Sync failed" is not.

## Branding

A Connector generated for your application carries your product's identity. Your customer installs something recognizable rather than an unfamiliar utility, which materially reduces onboarding friction.

Generation and distribution are covered in the **Connectors** section, not yet published.

## Managing installations

Once paired, a Connector is manageable through the API — list, inspect, review job history, rename, disable, enable, remove. See [Connectors](/developer/platform-concepts/connectors).

Two habits worth adopting from the first customer:

**Rename every connector during onboarding.** `DESKTOP-4F9J2K1` is useless in a support ticket. `Acme Ltd — Accounts PC` answers the question immediately.

**Expose job history to your support team.** `GET /api/v1/connectors/{machine}/jobs` usually contains the answer to "it stopped working" before anyone has to contact the customer.

## Security posture

- The Connector runs inside the customer's network and reaches out. Bizmitra never initiates a connection into their environment.
- It performs only work authorized for the paired application, customer, and company.
- Pairing uses a short-lived code, so your API secret never touches the customer's machine.
- Disabling a Connector stops it taking work without destroying the pairing.

## Installation and troubleshooting for end users

Customer-facing installation steps live in the [Tally Connector](/tally-connector/) section, written for the person doing the installing rather than for you. Link your customers there rather than reproducing the steps in your own documentation — that way they stay current.
