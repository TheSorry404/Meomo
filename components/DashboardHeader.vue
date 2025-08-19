<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">
          ☰
        </button>
        <h1 class="app-title">📝 Meomo</h1>
      </div>
      
      <div class="header-center">
        <div class="quick-search">
          <input
            v-model="quickSearchQuery"
            type="text"
            placeholder="快速搜索..."
            class="quick-search-input"
            @keyup.enter="performQuickSearch"
          >
          <button class="quick-search-btn" @click="performQuickSearch">
            🔍
          </button>
        </div>
      </div>
      
      <div class="header-right">
        <div class="header-actions">
          <button class="action-btn" title="通知" @click="showNotifications">
            🔔
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount }}
            </span>
          </button>
          
          <div class="user-menu" @click="toggleUserMenu">
            <div class="user-avatar">
              <img v-if="user?.avatar" :src="user.avatar" :alt="user.username">
              <span v-else>{{ userInitials }}</span>
            </div>
            <span class="username">{{ user?.username }}</span>
            <span class="dropdown-arrow">▾</span>
            
            <div v-if="showUserDropdown" class="user-dropdown">
              <NuxtLink to="/profile" class="dropdown-item">
                👤 个人资料
              </NuxtLink>
              <NuxtLink to="/settings" class="dropdown-item">
                ⚙️ 设置
              </NuxtLink>
              <div class="dropdown-divider" />
              <button class="dropdown-item logout-btn" @click="handleLogout">
                🚪 退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props & Emits
const emit = defineEmits(['toggle-sidebar'])

// 响应式数据
const quickSearchQuery = ref('')
const showUserDropdown = ref(false)
const unreadCount = ref(3) // 示例通知数量

// 模拟用户数据
const user = ref({
  id: '1',
  username: '张三',
  email: 'zhangsan@example.com',
  avatar: null
})

// 计算用户名首字母
const userInitials = computed(() => {
  if (!user.value?.username) return 'U'
  return user.value.username.charAt(0).toUpperCase()
})

// 方法
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const performQuickSearch = () => {
  if (quickSearchQuery.value.trim()) {
    // TODO: 实现快速搜索逻辑
    console.log('Quick search:', quickSearchQuery.value)
  }
}

const showNotifications = () => {
  // TODO: 显示通知面板
  console.log('Show notifications')
}

const toggleUserMenu = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    // TODO: 实现退出登录逻辑
    console.log('Logout')
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserDropdown.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dashboard-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  max-width: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.sidebar-toggle:hover {
  background: #f3f4f6;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4338ca;
  margin: 0;
}

.header-center {
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;
}

.quick-search {
  position: relative;
  width: 100%;
}

.quick-search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 2rem;
  font-size: 0.9rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.quick-search-input:focus {
  outline: none;
  border-color: #4338ca;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
}

.quick-search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #f3f4f6;
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  min-width: 1.25rem;
  text-align: center;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-menu:hover {
  background: #f3f4f6;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4338ca;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: #374151;
}

.dropdown-arrow {
  color: #6b7280;
  font-size: 0.875rem;
  transition: transform 0.3s ease;
}

.user-menu:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.logout-btn {
  color: #dc2626;
}

.logout-btn:hover {
  background: #fef2f2;
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .sidebar-toggle {
    display: block;
  }
  
  .header-left {
    gap: 0.5rem;
  }
  
  .header-actions {
    gap: 0.5rem;
  }
}
</style>
