import type { User } from '~/types'

// Cookie配置选项
const COOKIE_OPTIONS = {
  httpOnly: false, // 客户端需要访问token进行API调用
  secure: process.env.NODE_ENV === 'production', // 生产环境使用HTTPS
  sameSite: 'strict' as const, // 防止CSRF攻击
  maxAge: 60 * 60 * 24 * 7, // 7天过期
}

export const useAuth = () => {
  // Token cookie
  const tokenCookie = useCookie('auth_token', {
    ...COOKIE_OPTIONS,
    default: () => null,
  })

  // User info cookie
  const userCookie = useCookie('user_info', {
    ...COOKIE_OPTIONS,
    default: () => null,
  })

  // 设置token到cookie
  const setTokenCookie = (token: string) => {
    tokenCookie.value = token
  }

  // 设置用户信息到cookie
  const setUserCookie = (user: User) => {
    userCookie.value = JSON.stringify(user)
  }

  // 获取token
  const getToken = () => {
    return tokenCookie.value
  }

  // 获取用户信息
  const getUser = (): User | null => {
    if (!userCookie.value) return null
    try {
      return JSON.parse(userCookie.value)
    } catch {
      return null
    }
  }

  // 清除所有认证cookie
  const clearAuthCookies = () => {
    tokenCookie.value = null
    userCookie.value = null
  }

  return {
    setTokenCookie,
    setUserCookie,
    getToken,
    getUser,
    clearAuthCookies,
  }
}
