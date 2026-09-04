import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Bizmitra Docs',
  titleTemplate: ':title | Bizmitra Docs',
  description:
    'Bizmitra provides a business-data interoperability layer for Tally, ERP, and third-party applications.',

  srcDir: 'docs',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  head: [
    ['link', { rel: 'icon', href: '/images/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
  ],

  sitemap: {
    hostname: 'https://docs.bizmitra.io',
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
          items: [{ text: 'Overview', link: '/tally-connector/' }],
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
          items: [{ text: 'Overview', link: '/erp/' }],
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
