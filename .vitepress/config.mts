import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  
  themeConfig: {
    outline: {
      level: [2, 3]
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'DataGrid',
        items: [
          { text: '简介', link: '/DataGrid/overview' },
          { text: 'API', link: '/DataGrid/api' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Form',
        items: [
          { text: '简介', link: '/Form/overview' },
          { text: 'API', link: '/Form/api' },
        ]
      },
      {
        text: 'Net',
        items: [
          { text: '笔记', link: '/Net/overview' },
          { text: 'API', link: '/Net/api' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
