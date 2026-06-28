import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Dirar',
  titleTemplate: ':title ✦ Dirar',
  description: 'Editing Resources.',
  appearance: 'force-dark',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/logo.ico' }],
    ['meta', { property: 'og:image', content: '/giphy (2).gif' }],
  ],

  themeConfig: {
    logo: '/giphy (2).gif',
    siteTitle: 'Dirar',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: [
      {
        text: '📂 Downloads',
        collapsed: false,
        items: [
          { text: 'Windows', link: '/windows' },
          { text: 'MacOS', link: '/mac' },
          { text: 'Extensions & Scripts', link: '/extensions' },
          { text: 'Archive', link: '/archived' },
        ]
      },
      {
        text: '❔ FAQ',
        collapsed: false,
        items: [
          { text: 'Frequently Asked Questions', link: '/faq' },
          { text: 'Visual Installation Tutorials', link: '/tutorials' },
          { text: 'Adobe Ungenuine Popup Fix', link: '/gcc' },
          { text: 'Maxon (Red Giant) Fixes', link: '/maxon' },
          { text: 'How To Extract Zip/7z files', link: '/extract' },
        ]
      },
      {
        text: '🪐 Guides',
        collapsed: false,
        items: [
          { text: 'After Effects Beginners Guide', link: '/beginnersguide' },
          { text: 'Changing After Effects Version', link: '/versionswapguide' },
          { text: 'After Effects Installation Paths', link: '/ae-paths' },
          { text: 'MacKed Adobe Activation', link: '/macked' },
          { text: 'GenP Adobe Activation', link: '/genp' },
          { text: 'Rosetta (M1+) Guide', link: '/rosetta' },
        ]
      },
      {
        text: '🔗 Other Links',
        collapsed: false,
        items: [
          { text: 'Helpful Websites', link: '/websites' },
          { text: 'AMV Footage', link: '/footage' },
          { text: 'Safety Inquiries', link: '/safety' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/7U8j4rcXqw' }
    ],

    outline: [2, 3],

    footer: {
      message: 'Archived from satvrn.li — Preserved for the editing community.',
    }
  }
})
