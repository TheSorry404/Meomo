import { defineStore } from 'pinia'
import type { User } from '~/types'

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
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
    },

    setToken(token: string) {
      this.token = token
      // 在客户端保存 token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
      }
    },

    async login(email: string, password: string) {
      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        })
        
        this.setToken(data.token)
        this.setUser(data.user)
        
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
        const { data } = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
        })
        
        this.setToken(data.token)
        this.setUser(data.user)
        
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
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
      
      navigateTo('/login')
    },

    async fetchUserProfile() {
      try {
        const { data } = await $fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        
        this.setUser(data)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        this.logout()
      }
    },

    // 初始化用户状态（从 localStorage 恢复）
    initializeAuth() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.setToken(token)
          this.fetchUserProfile()
        }
      }
    },
  },
})
