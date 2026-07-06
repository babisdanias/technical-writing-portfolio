// @ts-check

const config = {
  title: 'Babis Danias — Technical Writer',
  tagline: 'API documentation and developer guides',
  url:'https://babisdanias.com',
  baseUrl: '/',

  organizationName: 'babisdanias',
  projectName: 'my-portfolio',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  favicon: 'img/favicon.ico',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Babis Danias',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Portfolio',
        },
        {
          to: '/about',
          label: 'About',
          position: 'left',
        },
        {
          href: 'https://github.com/babisdanias',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'mailto:BabisDanias@tutamail.com',
          label: 'Contact',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
     copyright: `© ${new Date().getFullYear()} Babis Danias · Technical Writing Portfolio`,
    },
  },
};

module.exports = config;