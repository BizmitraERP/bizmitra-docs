---
layout: home

hero:
  name: Bizmitra
  text: Business-data interoperability
  tagline: Connect accounting, commerce, and business software without rebuilding statutory knowledge from scratch.
  actions:
    - theme: brand
      text: Developer Platform
      link: /developer/
    - theme: alt
      text: Tally Connector
      link: /tally-connector/

features:
  - title: Developer Platform
    details: Build on Bizmitra as an interoperability layer. Provision applications, customers, and companies, read and write accounting data, and receive webhooks.
    link: /developer/
    linkText: Start building
  - title: Tally Connector
    details: A Windows application that carries authorized work between Bizmitra and a locally accessible TallyPrime company. No public exposure of Tally required.
    link: /tally-connector/
    linkText: Learn more
  - title: Integrations
    details: Ready-made connections between Bizmitra and the software you already use, set up without writing code.
    link: /integrations/
    linkText: Browse integrations
  - title: Bizmitra ERP
    details: Sales, inventory, and user management in the Bizmitra ERP product.
    link: /erp/
    linkText: Open ERP docs
---

## Which section do I need?

Bizmitra is documented in four sections, split by what you are trying to do rather than by product internals.

| I want to&nbsp;… | Go to |
|---|---|
| Connect my SaaS, ERP, mobile app, or AI product to a customer's accounting data | [Developer Platform](/developer/) |
| Install, pair, or troubleshoot the Windows Connector on a customer machine | [Tally Connector](/tally-connector/) |
| Switch on a ready-made connection such as Shopify, with no code | [Integrations](/integrations/) |
| Use the Bizmitra ERP application | [ERP](/erp/) |

### Two layers, two audiences

The distinction between **Integrations** and the **Developer Platform** matters, because they are different products rather than one product described twice.

**Integrations** are finished. Bizmitra builds and maintains the connection to a specific third-party service, and a business owner switches it on. The audience is the person running the business.

**The Developer Platform** is a foundation. You build the connection, and Bizmitra supplies the parts that are genuinely hard — normalized accounting semantics, statutory handling, and a safe path into software that was never designed to be reached over the internet. The audience is an engineer, usually at a SaaS company, integrating on behalf of many customers at once.

If you are integrating two systems that both belong to somebody else, or migrating a customer between them, you want the Developer Platform.
