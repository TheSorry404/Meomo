import type { User } from '../types'

// Cookie管理工具类
class AuthCookieManager {
  private cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7, // 7天
  }

  setCookie(name: string, value: string): void {
    if (typeof document === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + this.cookieOptions.maxAge * 1000)
    
    let cookieString = `${name}=${encodeURIComponent(value)}`
    cookieString += `; expires=${expires.toUTCString()}`
    cookieString += `; path=/`
    
    if (this.cookieOptions.secure) {
      cookieString += '; secure'
    }
    
    cookieString += `; samesite=${this.cookieOptions.sameSite}`
    
    document.cookie = cookieString
  }

  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + '='
    const cookies = document.cookie.split(';')
    
    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }
    return null
  }

  removeCookie(name: string): void {
    if (typeof document === 'undefined') return
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  // 认证相关的便捷方法
  setAuthToken(token: string): void {
    this.setCookie('auth_token', token)
  }

  getAuthToken(): string | null {
    return this.getCookie('auth_token')
  }

  setUserInfo(user: User): void {
    this.setCookie('user_info', JSON.stringify(user))
  }

  getUserInfo(): User | null {
    const userStr = this.getCookie('user_info')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  clearAuth(): void {
    this.removeCookie('auth_token')
    this.removeCookie('user_info')
  }
}

// 单例实例
const authCookieManager = new AuthCookieManager()

// Composable
export const useAuthCookie = () => {
  return {
    setAuthToken: (token: string) => authCookieManager.setAuthToken(token),
    getAuthToken: () => authCookieManager.getAuthToken(),
    setUserInfo: (user: User) => authCookieManager.setUserInfo(user),
    getUserInfo: () => authCookieManager.getUserInfo(),
    clearAuth: () => authCookieManager.clearAuth(),
  }
}
