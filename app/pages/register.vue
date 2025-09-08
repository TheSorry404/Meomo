<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>📝 Meomo</h1>
          <h2>创建你的账户</h2>
          <p>开始你的创作之旅</p>
        </div>

        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              required
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <label for="email">邮箱地址</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="请输入邮箱地址"
              required
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="请输入密码（至少6位）"
              required
              :disabled="loading"
            >
            <div class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :data-strength="passwordStrength" />
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              required
              :disabled="loading"
            >
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="form.agreeToTerms" type="checkbox" required>
              <span class="checkmark" />
              我同意
              <a href="/terms" target="_blank" class="terms-link">服务条款</a>
              和
              <a href="/privacy" target="_blank" class="terms-link">隐私政策</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
            <span v-if="loading" class="loading-spinner" />
            {{ loading ? '注册中...' : '创建账户' }}
          </button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            注册成功！正在跳转到登录页面...
          </div>
        </form>

        <div class="auth-footer">
          <p>
            已有账户？
            <NuxtLink to="/login" class="auth-link">
              立即登录
            </NuxtLink>
          </p>
        </div>

        <!-- <div class="divider">
          <span>或者</span>
        </div>

        <div class="social-login">
          <button type="button" class="btn btn-social" @click="registerWithGoogle">
            <svg class="social-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            使用 Google 注册
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义组件名称
defineOptions({
  name: 'RegisterPage'
})

// 页面 meta
definePageMeta({
  layout: false,
  auth: false
})

// 响应式数据
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.value.password
  if (password.length === 0) return 0
  if (password.length < 6) return 1
  if (password.length < 8) return 2
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 4
  if (/^(?=.*[a-z])(?=.*\d)/.test(password) || /^(?=.*[A-Z])(?=.*\d)/.test(password)) return 3
  return 2
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  const texts = ['', '弱', '一般', '良好', '强']
  return texts[strength] || ''
})

// 表单验证
const isFormValid = computed(() => {
  return form.value.username.trim() &&
         form.value.email.trim() &&
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword &&
         form.value.agreeToTerms
})

// 注册处理
const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = '请检查所有字段是否正确填写'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const userStore = useUserStore();
    const result = await userStore.register(form.value.username, form.value.email, form.value.password);    
    
    if (result.success) {
      success.value = true
      
      // 3秒后跳转到登录页面
      setTimeout(() => {
        navigateTo('/login')
      }, 1000)
    } else {
      error.value = result.message || '注册失败'
    }
  } catch (err) {
    error.value = '网络错误，请稍后重试'
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}

// Google 注册
const registerWithGoogle = () => {
  // TODO: 实现 Google OAuth 注册
  console.log('Google register not implemented yet')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 2rem;
  color: #4338ca;
  margin-bottom: 0.5rem;
}

.auth-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6b7280;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4338ca;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
}

.form-group input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill[data-strength="0"] { width: 0%; background: transparent; }
.strength-fill[data-strength="1"] { width: 25%; background: #ef4444; }
.strength-fill[data-strength="2"] { width: 50%; background: #f59e0b; }
.strength-fill[data-strength="3"] { width: 75%; background: #eab308; }
.strength-fill[data-strength="4"] { width: 100%; background: #22c55e; }

.strength-text {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.form-options {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.4;
}

.checkbox-label input {
  margin-right: 0.5rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.terms-link {
  color: #4338ca;
  text-decoration: none;
  margin: 0 0.2rem;
}

.terms-link:hover {
  text-decoration: underline;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #4338ca;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3730a3;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-social {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-social:hover {
  background: #f9fafb;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
}

.success-message {
  background: #f0f9ff;
  color: #0369a1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  border: 1px solid #bae6fd;
}

.auth-footer {
  text-align: center;
  color: #6b7280;
}

.auth-link {
  color: #4338ca;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.social-login {
  margin-top: 1rem;
}

.social-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-header h1 {
    font-size: 1.8rem;
  }
  
  .auth-header h2 {
    font-size: 1.3rem;
  }
}
</style>
