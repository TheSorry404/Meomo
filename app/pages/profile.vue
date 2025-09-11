<template>
  <div class="dashboard" :class="{ 'sidebar-collapsed': uiStore.isSidebarCollapsed }">
    <DashboardHeader />

    <div class="dashboard-container">
      <DashboardSidebar />
      
      <main class="dashboard-main">

        <div class="content-section">
          <div class="profile-container">
            <!-- 用户头像和基本信息 -->
            <div class="profile-header">
              <div class="avatar-section">
                <div class="avatar-container">
                  <img 
                    v-if="user.avatar" 
                    :src="user.avatar" 
                    :alt="user.name || '用户头像'"
                    class="avatar-image"
                  >
                  <div v-else class="avatar-placeholder">
                    <svg class="avatar-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button class="avatar-upload-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  更换头像
                </button>
              </div>
              
              <div class="user-info">
                <h2 class="user-name">{{ user.name || '用户名' }}</h2>
                <p class="user-email">{{ user.email || 'user@example.com' }}</p>
                <div class="user-stats">
                  <span class="stat-item">
                    <span class="stat-value">{{ user.memoCount || 0 }}</span>
                    <span class="stat-label">备忘录</span>
                  </span>
                  <span class="stat-item">
                    <span class="stat-value">{{ formatDate(user.joinDate) }}</span>
                    <span class="stat-label">加入时间</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 编辑表单 -->
            <div class="profile-form">
              <form @submit.prevent="saveProfile">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">用户名</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="user.name"
                      class="form-input"
                      placeholder="请输入用户名"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">邮箱地址</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="email" 
                      v-model="user.email"
                      class="form-input"
                      placeholder="请输入邮箱地址"
                      required
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="label-text">个人简介</span>
                  </label>
                  <textarea 
                    v-model="user.bio"
                    rows="4"
                    class="form-textarea"
                    placeholder="介绍一下自己..."
                  ></textarea>
                  <div class="form-help">
                    {{ user.bio?.length || 0 }}/200 字符
                  </div>
                </div>

                <div class="form-actions">
                  <button 
                    type="button"
                    @click="resetForm"
                    class="btn btn-secondary"
                  >
                    重置
                  </button>
                  <button 
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="loading-spinner"></span>
                    {{ isSubmitting ? '保存中...' : '保存更改' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- 账户安全 -->
            <div class="security-section">
              <h3 class="section-title">账户安全</h3>
              <div class="security-items">
                <div class="security-item">
                  <div class="security-info">
                    <h4 class="security-title">密码</h4>
                    <p class="security-desc">上次更新: {{ formatDate(user.passwordUpdated) }}</p>
                  </div>
                  <button class="btn btn-outline">修改密码</button>
                </div>
                
                <div class="security-item">
                  <div class="security-info">
                    <h4 class="security-title">两步验证</h4>
                    <p class="security-desc">为您的账户添加额外的安全保护</p>
                  </div>
                  <button class="btn btn-outline">设置</button>
                </div>
              </div>
            </div>

            <!-- 危险操作 -->
            <div class="danger-section">
              <h3 class="section-title danger">危险操作</h3>
              <div class="danger-items">
                <div class="danger-item">
                  <div class="danger-info">
                    <h4 class="danger-title">删除账户</h4>
                    <p class="danger-desc">永久删除您的账户和所有数据，此操作不可撤销</p>
                  </div>
                  <button class="btn btn-danger" @click="showDeleteConfirmation">删除账户</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '~/stores/ui';

definePageMeta({
  middleware: 'auth'
})

const uiStore = useUiStore();

const user = ref({
  name: '',
  email: '',
  bio: '',
  avatar: '',
  memoCount: 0,
  joinDate: new Date(),
  passwordUpdated: new Date()
})

const isSubmitting = ref(false)

const saveProfile = async () => {
  isSubmitting.value = true
  
  try {
    // TODO: 实现保存用户档案的逻辑
    console.log('保存用户档案:', user.value)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: 显示成功消息
    alert('保存成功!')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  // TODO: 实现重置表单的逻辑，恢复到上次保存的状态
  user.value = {
    name: '示例用户',
    email: 'user@example.com',
    bio: '这是一个示例用户的个人简介。',
    avatar: '',
    memoCount: 42,
    joinDate: new Date('2024-01-15'),
    passwordUpdated: new Date('2024-08-01')
  }
}

const showDeleteConfirmation = () => {
  if (confirm('确定要删除账户吗？此操作不可撤销，所有数据将被永久删除。')) {
    // TODO: 实现删除账户的逻辑
    console.log('删除账户')
  }
}

const formatDate = (date) => {
  if (!date) return '未设置'
  return new Date(date).toLocaleDateString('zh-CN')
}

// TODO: 从API获取用户信息
onMounted(() => {
  // 模拟加载用户数据
  user.value = {
    name: '示例用户',
    email: 'user@example.com',
    bio: '这是一个示例用户的个人简介。',
    avatar: '',
    memoCount: 42,
    joinDate: new Date('2024-01-15'),
    passwordUpdated: new Date('2024-08-01')
  }
})
</script>

<style scoped>
.dashboard-main {
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .dashboard-main {
  margin-left: 64px;
}

/* Profile Layout */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #f3f4f6;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e5e7eb;
}

.avatar-icon {
  width: 3rem;
  height: 3rem;
  color: #6b7280;
}

.avatar-upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-upload-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.user-email {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Profile Form */
.profile-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.label-required {
  color: #ef4444;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-help {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-outline {
  background: white;
  color: #374151;
  border-color: #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
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

/* Security Section */
.security-section, .danger-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.section-title.danger {
  color: #ef4444;
}

.security-items, .danger-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-item, .danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.danger-item {
  border-color: #fecaca;
  background: #fef2f2;
}

.security-info, .danger-info {
  flex: 1;
}

.security-title, .danger-title {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.danger-title {
  color: #ef4444;
}

.security-desc, .danger-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.danger-desc {
  color: #991b1b;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .security-item, .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
