import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// Placeholder pages declare `stub: true` in their frontmatter. They are real
// routes — the sidebar links to them and a reader can land on one — but they
// hold no answer yet, so they are kept out of Google and out of the sitemap.
// Removing the flag from a page's frontmatter is all it takes to publish it.
const stubRoutes = new Set<string>()

export default withMermaid(defineConfig({
  title: 'Bizmitra Docs',
  titleTemplate: ':title | Bizmitra Docs',
  description:
    'Bizmitra provides a business-data interoperability layer for Tally, ERP, and third-party applications.',

  srcDir: 'docs',
  // Shared markdown fragments pulled in with <!--@include:-->. They are not
  // pages, so they must not be built or indexed as pages.
  srcExclude: ['**/_partials/**'],
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  head: [
    ['link', { rel: 'icon', href: '/images/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
  ],

  sitemap: {
    hostname: 'https://docs.bizmitra.io',
    transformItems: (items) => items.filter((item) => !stubRoutes.has(item.url)),
  },

  transformPageData(pageData) {
    if (!pageData.frontmatter.stub) return

    // sitemap urls are the built path without a leading slash
    stubRoutes.add(pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, ''))

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['meta', { name: 'robots', content: 'noindex, follow' }])

    // A scaffolded page has never been written, so a "Last updated" date on it
    // would only date the scaffolding. The footer returns once the flag goes.
    pageData.frontmatter.lastUpdated = false
  },

  themeConfig: {
    siteTitle: 'Bizmitra Docs',

    nav: [
      { text: 'Developer', link: '/developer/', activeMatch: '/developer/' },
      { text: 'Tally Connector', link: '/tally-connector/', activeMatch: '/tally-connector/' },
      { text: 'Integrations', link: '/integrations/', activeMatch: '/integrations/' },
      { text: 'ERP', link: '/erp/', activeMatch: '/erp/' },
      {
        text: 'Bizmitra',
        items: [
          { text: 'Website', link: 'https://bizmitra.io' },
          { text: 'Developer portal', link: 'https://bizmitra.io/developer-portal/register' },
          { text: 'Status', link: 'https://bizmitra.io/status' },
        ],
      },
    ],

    sidebar: {
      '/developer/': [
        {
          text: 'Developer Platform',
          link: '/developer/',
        },
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/getting-started/' },
            { text: 'Create a developer account', link: '/developer/getting-started/registration' },
            { text: 'Sandbox and test data', link: '/developer/getting-started/sandbox' },
            { text: 'Your first request', link: '/developer/getting-started/first-request' },
          ],
        },
        {
          text: 'Platform Concepts',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/platform-concepts/' },
            { text: 'Applications', link: '/developer/platform-concepts/applications' },
            { text: 'Customers and companies', link: '/developer/platform-concepts/customers-and-companies' },
            { text: 'Connectors', link: '/developer/platform-concepts/connectors' },
            { text: 'Jobs and transactions', link: '/developer/platform-concepts/jobs-and-transactions' },
            { text: 'Data model', link: '/developer/platform-concepts/data-model' },
          ],
        },
        {
          text: 'Tally',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/tally/' },
            { text: 'The Connector App', link: '/developer/tally/connector-app' },
            { text: 'Pairing a company', link: '/developer/tally/pairing' },
            { text: 'Company health', link: '/developer/tally/company-health' },
            { text: 'Voucher kinds and types', link: '/developer/tally/voucher-kinds' },
            { text: 'Masters', link: '/developer/tally/masters' },
          ],
        },
        {
          text: 'API',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/api/' },
            { text: 'Authentication', link: '/developer/api/authentication' },
            { text: 'Conventions', link: '/developer/api/conventions' },
            { text: 'Errors', link: '/developer/api/errors' },
            { text: 'API reference', link: '/developer/api/reference' },
            { text: 'Versioning and lifecycle', link: '/developer/api/lifecycle' },
          ],
        },
        {
          text: 'Webhooks',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/webhooks/' },
            { text: 'Managing endpoints', link: '/developer/webhooks/endpoints' },
            { text: 'Verifying signatures', link: '/developer/webhooks/signatures' },
            { text: 'Delivery and retries', link: '/developer/webhooks/delivery' },
          ],
        },
        {
          text: 'Production',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/production/' },
            { text: 'Security', link: '/developer/production/security' },
            { text: 'Go-live checklist', link: '/developer/production/go-live-checklist' },
          ],
        },
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/developer/examples/' },
            { text: 'Pull vouchers from Tally', link: '/developer/examples/pull-vouchers' },
            { text: 'Create an invoice in Tally', link: '/developer/examples/push-invoice' },
            { text: 'Settle invoices with a receipt', link: '/developer/examples/push-receipt' },
            { text: 'Postman collection', link: '/developer/examples/postman' },
          ],
        },

        // ---------------------------------------------------------------
        // Deferred sections. Uncomment a block when its pages are written.
        // Keep the order: Connectors and Integrations sit after Tally,
        // Migrations sits before Webhooks.
        // ---------------------------------------------------------------
        //
        // {
        //   text: 'Connectors',
        //   collapsed: true,
        //   items: [
        //     { text: 'Overview', link: '/developer/connectors/' },
        //   ],
        // },
        // {
        //   text: 'Building Integrations',
        //   collapsed: true,
        //   items: [
        //     { text: 'Overview', link: '/developer/building-integrations/' },
        //   ],
        // },
        // {
        //   text: 'Migrations',
        //   collapsed: true,
        //   items: [
        //     { text: 'Overview', link: '/developer/migrations/' },
        //   ],
        // },
      ],

      '/tally-connector/': [
        {
          text: 'Tally Connector',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/tally-connector/' },
            { text: 'How it all fits together', link: '/tally-connector/how-it-works' },
            { text: 'Install and pair', link: '/tally-connector/install-and-pair' },
            { text: 'Adding and changing companies', link: '/tally-connector/companies' },
            { text: 'Sync settings', link: '/tally-connector/sync-settings' },
            { text: 'Troubleshooting', link: '/tally-connector/troubleshooting' },
            { text: 'FAQ', link: '/tally-connector/faq' },
          ],
        },
      ],

      '/integrations/': [
        {
          text: 'Integrations',
          items: [{ text: 'Overview', link: '/integrations/' }],
        },
      ],

      '/erp/': [
        {
          text: 'Bizmitra ERP',
          link: '/erp/',
        },
        {
          text: 'Getting Started',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/getting-started/' },
            { text: 'Create your Bizmitra account', link: '/erp/getting-started/create-account' },
            { text: 'Create your first company', link: '/erp/getting-started/create-company' },
            { text: 'Configure company details', link: '/erp/getting-started/company-details' },
            { text: 'Invite users', link: '/erp/users/invite' },
            { text: 'Create your first invoice', link: '/erp/getting-started/first-invoice' },
          ],
        },
        {
          text: 'GST & Tax',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/gst/' },
            { text: 'Set up GST', link: '/erp/gst/setup' },
            { text: 'GST registration types', link: '/erp/gst/registration-types' },
            { text: 'Configure HSN/SAC', link: '/erp/gst/hsn-sac' },
            { text: 'Configure tax rates', link: '/erp/gst/tax-rates' },
            { text: 'Intra-state vs inter-state GST', link: '/erp/gst/intra-vs-inter-state' },
            { text: 'Reverse charge', link: '/erp/gst/reverse-charge' },
            { text: 'Generate an e-Invoice', link: '/erp/gst/e-invoice' },
            { text: 'Cancel an e-Invoice', link: '/erp/gst/e-invoice-cancel' },
            { text: 'Generate an e-Way Bill', link: '/erp/gst/e-way-bill' },
            { text: 'Credit Notes', link: '/erp/sales/credit-notes' },
            { text: 'Debit Notes', link: '/erp/purchase/debit-notes' },
          ],
        },
        {
          text: 'Sales',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/sales/' },
            { text: 'Customers', link: '/erp/sales/customers' },
            { text: 'Quotations', link: '/erp/sales/quotations' },
            { text: 'Sales Orders', link: '/erp/sales/orders' },
            { text: 'Delivery Challans', link: '/erp/sales/delivery-challans' },
            { text: 'Sales Invoices', link: '/erp/sales/invoices' },
            { text: 'Service Invoices', link: '/erp/sales/service-invoices' },
            { text: 'Credit Notes', link: '/erp/sales/credit-notes' },
            { text: 'Receipts', link: '/erp/sales/receipts' },
            { text: 'Outstanding Receivables', link: '/erp/sales/outstanding-receivables' },
          ],
        },
        {
          text: 'Purchase',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/purchase/' },
            { text: 'Suppliers', link: '/erp/purchase/suppliers' },
            { text: 'Purchase Orders', link: '/erp/purchase/orders' },
            { text: 'Purchase Bills', link: '/erp/purchase/bills' },
            { text: 'Debit Notes', link: '/erp/purchase/debit-notes' },
            { text: 'Payments', link: '/erp/purchase/payments' },
            { text: 'Outstanding Payables', link: '/erp/purchase/outstanding-payables' },
          ],
        },
        {
          text: 'Inventory',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/inventory/' },
            { text: 'Stock Items', link: '/erp/inventory/stock-items' },
            { text: 'Units', link: '/erp/inventory/units' },
            { text: 'Categories', link: '/erp/inventory/categories' },
            { text: 'Warehouses', link: '/erp/inventory/warehouses' },
            { text: 'Opening Stock', link: '/erp/inventory/opening-stock' },
            { text: 'Stock Transfers', link: '/erp/inventory/stock-transfers' },
            { text: 'Batch/Serial Numbers', link: '/erp/inventory/batch-serial' },
            { text: 'Inventory Reports', link: '/erp/inventory/reports' },
          ],
        },
        {
          text: 'Banking',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/banking/' },
            { text: 'Add Bank Accounts', link: '/erp/banking/bank-accounts' },
            { text: 'Import Bank Statements', link: '/erp/banking/import-statements' },
            { text: 'Match Transactions', link: '/erp/banking/match-transactions' },
            { text: 'Bank Reconciliation', link: '/erp/banking/reconciliation' },
            { text: 'Bank Reports', link: '/erp/banking/reports' },
          ],
        },
        {
          text: 'Online Payments',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/payments/' },
            { text: 'Payment Gateway Setup', link: '/erp/payments/gateway-setup' },
            { text: 'Payment Links', link: '/erp/payments/payment-links' },
            { text: 'Online Collections', link: '/erp/payments/online-collections' },
            { text: 'Payment Status', link: '/erp/payments/payment-status' },
            { text: 'Refunds', link: '/erp/payments/refunds' },
            { text: 'Reconciliation', link: '/erp/payments/reconciliation' },
          ],
        },
        {
          text: 'Tally',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/tally/' },
            { text: 'Connect Bizmitra to Tally', link: '/erp/tally/connect' },
            { text: 'Configure company sync', link: '/erp/tally/company-sync' },
            { text: 'Sync masters', link: '/erp/tally/sync-masters' },
            { text: 'Sync transactions', link: '/erp/tally/sync-transactions' },
            { text: 'Understanding sync status', link: '/erp/tally/sync-status' },
            { text: 'Troubleshooting', link: '/tally-connector/troubleshooting' },
          ],
        },
        {
          text: 'Shopify',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/shopify/' },
            { text: 'Connect Shopify', link: '/erp/shopify/connect' },
            { text: 'Import orders', link: '/erp/shopify/import-orders' },
            { text: 'Prepaid orders', link: '/erp/shopify/prepaid-orders' },
            { text: 'COD orders', link: '/erp/shopify/cod-orders' },
            { text: 'Refunds', link: '/erp/shopify/refunds' },
            { text: 'Shopify → Tally workflow', link: '/erp/shopify/shopify-to-tally' },
          ],
        },
        {
          text: 'Reports',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/reports/' },
            { text: 'Sales Reports', link: '/erp/reports/sales' },
            { text: 'Purchase Reports', link: '/erp/reports/purchase' },
            { text: 'GST Reports', link: '/erp/reports/gst' },
            { text: 'Receivables', link: '/erp/reports/receivables' },
            { text: 'Payables', link: '/erp/reports/payables' },
            { text: 'Inventory Reports', link: '/erp/inventory/reports' },
            { text: 'Financial Reports', link: '/erp/reports/financial' },
          ],
        },
        {
          text: 'Users & Security',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/users/' },
            { text: 'Invite users', link: '/erp/users/invite' },
            { text: 'Roles', link: '/erp/users/roles' },
            { text: 'Permissions', link: '/erp/users/permissions' },
            { text: 'Branch access', link: '/erp/users/branch-access' },
            { text: 'Audit history', link: '/erp/users/audit-history' },
          ],
        },
        {
          text: 'Troubleshooting',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/erp/troubleshooting/' },
            { text: 'Invoice not generating', link: '/erp/troubleshooting/invoice-not-generating' },
            { text: 'GST calculation incorrect', link: '/erp/troubleshooting/gst-calculation' },
            { text: 'E-Invoice rejected', link: '/erp/troubleshooting/e-invoice-rejected' },
            { text: 'Tally not syncing', link: '/erp/troubleshooting/tally-not-syncing' },
            { text: 'Bank statement import failed', link: '/erp/troubleshooting/bank-import-failed' },
            { text: 'Payment not reconciled', link: '/erp/troubleshooting/payment-not-reconciled' },
          ],
        },
      ],
    },

    outline: { level: [2, 3] },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/BizmitraERP' },
    ],

    editLink: {
      pattern: 'https://github.com/BizmitraERP/bizmitra-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    footer: {
      message:
        'Documentation content is all rights reserved; code samples are MIT licensed. Use of the Bizmitra API, Connector App, and hosted services is governed separately by Bizmitra’s commercial terms.',
      copyright: '© Drushtant Infoweb Pvt. Ltd.',
    },
  },

  // Mermaid diagrams follow the reader's light/dark theme.
  mermaid: {
    theme: 'default',
  },
}))
