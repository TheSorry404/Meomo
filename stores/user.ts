import { defineStore } from 'pinia'
import type { User } from '../types'
import { apiService, API_ENDPOINTS, type LoginRequest, type RegisterRequest, type LoginResponse, type ApiResponse } from '../services/api'

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// Cookie管理工具函数
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  let cookieString = `${name}=${encodeURIComponent(value)}`
  cookieString += `; expires=${expires.toUTCString()}`
  cookieString += `; path=/`
  cookieString += `; SameSite=Strict`
  
  if (process.env.NODE_ENV === 'production') {
    cookieString += `; Secure`
  }
  
  document.cookie = cookieString
}

const getCookie = (name: string): string | null => {
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

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
      
      // 同步到cookie
      if (typeof window !== 'undefined') {
        setCookie('user_info', JSON.stringify(user))
      }
    },

    setToken(token: string) {
      this.token = token
      
      // 同步到cookie
      if (typeof window !== 'undefined') {
        setCookie('auth_token', token)
      }
    },

    async login(email: string, password: string) {
      try {
        const loginData: LoginRequest = { email, password }
        const response = await apiService.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, loginData)
        
        // 根据响应格式获取数据
        let token: string
        let user: User
        
        if ('data' in response && response.data) {
          // 标准API响应格式
          token = response.data.token
          user = response.data.user
        } else {
          // 直接响应格式 - 先转换为unknown再转换
          const directResponse = response as unknown as LoginResponse
          token = directResponse.token
          user = directResponse.user
        }
        
        this.setToken(token)
        this.setUser(user)
        
        return { success: true }
      } catch (error: unknown) {
        console.error('Login failed:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Login failed'
        }
      }
    },

    async register(userData: { username: string; email: string; password: string }) {
      try {
        const registerData: RegisterRequest = userData
        const response = await apiService.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.REGISTER, registerData)
        
        // 根据响应格式获取数据
        let token: string
        let user: User
        
        if ('data' in response && response.data) {
          // 标准API响应格式
          token = response.data.token
          user = response.data.user
        } else {
          // 直接响应格式
          const directResponse = response as unknown as LoginResponse
          token = directResponse.token
          user = directResponse.user
        }
        
        this.setToken(token)
        this.setUser(user)
        
        return { success: true }
      } catch (error: unknown) {
        console.error('Registration failed:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Registration failed'
        }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // 清除cookie
      if (typeof window !== 'undefined') {
        removeCookie('auth_token')
        removeCookie('user_info')
        
        // 可选：调用后端登出API
        try {
          apiService.post(API_ENDPOINTS.AUTH.LOGOUT)
        } catch (error) {
          console.warn('Failed to notify backend of logout:', error)
        }
        
        window.location.href = '/login'
      }
    },

    async fetchUserProfile() {
      try {
        const response = await apiService.get<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE)
        
        // 根据响应格式获取用户数据
        let user: User
        
        if ('data' in response && response.data) {
          // 标准API响应格式
          user = response.data
        } else {
          // 直接响应格式
          user = response as unknown as User
        }
        
        this.setUser(user)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        this.logout()
      }
    },

    // 初始化用户状态（从cookie恢复）
    initializeAuth() {
      if (typeof window !== 'undefined') {
        const token = getCookie('auth_token')
        const userStr = getCookie('user_info')
        
        if (token) {
          this.token = token
          
          if (userStr) {
            try {
              this.user = JSON.parse(userStr)
              this.isAuthenticated = true
            } catch (error) {
              console.error('Failed to parse user info from cookie:', error)
              // 清除无效的cookie
              removeCookie('auth_token')
              removeCookie('user_info')
            }
          } else {
            // 如果有token但没有用户信息，尝试获取用户资料
            this.fetchUserProfile()
          }
        }
      }
    },
  },
})
