module.exports = {
  base: '/blog/',
  title: 'yyf的组件库',
  themeConfig: {
    nav: [
      {
        text: '生态',
        items: [
          { text: '组件', link: '/components/' },
          { text: '插件', link: '/plugins/magic-area' },
        ],
      },
    ],
    sidebar: {
      '/components/': [
        {
          title: '表单系列',
          collapsable: false,
          children: [
            'form/testComponent',
            'form/select',
          ],
        },
      ],
      '/plugins/': [
        'magic-area',
      ],
    },
  }
}