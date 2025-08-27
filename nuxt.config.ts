// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 启用 pages 模式用于SPA
  pages: true,
  
  // SPA模式配置 - 前后端分离
  ssr: false, // 禁用服务端渲染，纯客户端应用

  // 基础模块
  modules: [
    '@pinia/nuxt',
    '@unocss/nuxt',
  ],
  
  // css: [
  //   './assets/css/main.css'
  // ],

  runtimeConfig: {
    // 服务端运行时配置
    jwtSecret: process.env.JWT_SECRET || 'meomo-secret-key-2024',
    
    // 客户端可访问的配置
    public: { 
      appName: 'Meomo'
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
    },
    baseURL: '/', // 部署时的基础URL
  },

  // 构建配置
  build: {
    transpile: []
  },

  // Pinia配置
  pinia: {
    storesDirs: ['./stores/**']
  }
})