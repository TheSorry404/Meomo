// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // // 显式启用 pages 模式
  // pages: true,

  // 简化配置，先移除可能冲突的模块
  modules: [
    // 只保留最基础的模块
    '@pinia/nuxt',
    '@unocss/nuxt',
  ],
  css: [
    // AntD 样式（v4 可直接引入；如需定制主题用 less 配置）
    // 'ant-design-vue/dist/antd.css',
  ],
  vite: {
    // plugins: [
    //   // 按需引入 AntD 组件
    //   Components({
    //     resolvers: [AntDesignVueResolver({ importStyle: 'css' })],
    //   }),
    //   AutoImport({
    //     imports: ['vue', 'vue/macros', 'vue-router', 'pinia', 'vue-i18n'],
    //     dts: true,
    //   }),
    // ],
    // 如果你要用 less 定制 antd 主题：
    // css: { preprocessorOptions: { less: { javascriptEnabled: true, modifyVars: { 'primary-color': '#1677ff' } } } }
  },
  runtimeConfig: {
    apiBase: '',                // 私有（只在服务端）
    public: { apiBase: '/api' } // 客户端可读；默认走本域代理
  },
  nitro: {
    // 将 /api/* 代理到真正后端（开发期最省心；部署可配 Nginx/Platform 的映射）
    routeRules: {
      '/api/**': { proxy: { to: process.env.TARGET_API ?? 'http://localhost:3000/**' } }
    }
  },
  // 应用配置
  app: {
    head: {
      title: 'Meomo - 随时随地记录你的想法',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Meomo 是一个简洁而强大的备忘录应用。' }
      ]
    }
    ,
    router: {
        // 自定义路由配置（可选）
        // base: '/my-app/', // 如果应用部署在子路径
        // trailingSlash: false // 是否在URL末尾添加斜杠
        base: '/',
      }
  }
})