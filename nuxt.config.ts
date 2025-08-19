// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // // 显式启用 pages 模式
  // pages: true,

  // 简化配置，先移除可能冲突的模块
  modules: [
    // 只保留最基础的模块
  ],

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