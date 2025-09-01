export default defineNuxtRouteMiddleware((to) => {
  // 检查是否需要身份验证
  if (to.meta.middleware === 'auth') {
    // 客户端身份验证检查
    if (process.client) {
      try {
        // 检查用户是否已登录
        const authToken = useCookie('auth_token')
        
        if (!authToken.value) {
          return navigateTo('/login')
        }
      } catch (error) {
        console.error('Auth middleware error:', error)
        return navigateTo('/login')
      }
    }
  }
})
