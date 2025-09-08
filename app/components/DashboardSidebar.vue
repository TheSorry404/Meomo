<template>
  <aside class="dashboard-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-content">
      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-title">主要功能</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <NuxtLink to="/dashboard" class="nav-link" active-class="active">
                <span class="nav-icon">📊</span>
                <span class="nav-text">仪表板</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/memos" class="nav-link" active-class="active">
                <span class="nav-icon">📝</span>
                <span class="nav-text">我的备忘录</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/memos/new" class="nav-link" active-class="active">
                <span class="nav-icon">➕</span>
                <span class="nav-text">新建备忘录</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/search" class="nav-link" active-class="active">
                <span class="nav-icon">🔍</span>
                <span class="nav-text">搜索</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="nav-title">快速访问</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <button class="nav-link nav-button" @click="showPinned">
                <span class="nav-icon">📌</span>
                <span class="nav-text">置顶备忘录</span>
                <span class="nav-count">{{ pinnedCount }}</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link nav-button" @click="showRecent">
                <span class="nav-icon">🕒</span>
                <span class="nav-text">最近编辑</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link nav-button" @click="showFavorites">
                <span class="nav-icon">⭐</span>
                <span class="nav-text">收藏夹</span>
              </button>
            </li>
            <li class="nav-item">
              <NuxtLink to="/trash" class="nav-link" active-class="active">
                <span class="nav-icon">🗑️</span>
                <span class="nav-text">回收站</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="nav-title">标签</h3>
          <ul class="nav-list tags-list">
            <li v-for="tag in popularTags" :key="tag.name" class="nav-item">
              <button class="nav-link nav-button tag-link" @click="filterByTag(tag.name)">
                <span class="nav-icon">🏷️</span>
                <span class="nav-text">{{ tag.name }}</span>
                <span class="nav-count">{{ tag.count }}</span>
              </button>
            </li>
            <li class="nav-item">
              <NuxtLink to="/tags" class="nav-link view-all-link" active-class="active">
                <span class="nav-icon">👁️</span>
                <span class="nav-text">查看所有标签</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="nav-title">设置</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <NuxtLink to="/profile" class="nav-link" active-class="active">
                <span class="nav-icon">👤</span>
                <span class="nav-text">个人资料</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/settings" class="nav-link" active-class="active">
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">应用设置</span>
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/help" class="nav-link" active-class="active">
                <span class="nav-icon">❓</span>
                <span class="nav-text">帮助中心</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- 存储使用情况 -->
      <div v-if="!isCollapsed" class="storage-info">
        <div class="storage-header">
          <span class="storage-icon">💾</span>
          <span class="storage-title">存储空间</span>
        </div>
        <div class="storage-bar">
          <div class="storage-fill" :style="{ width: storagePercentage + '%' }" />
        </div>
        <div class="storage-text">{{ usedStorage }} / {{ totalStorage }} 已使用</div>
        <button class="upgrade-btn" @click="showUpgradeOptions">升级存储</button>
      </div>
    </div>

    <!-- 折叠按钮 -->
    <button class="collapse-btn" @click="toggleCollapse">
      <span :class="{ rotated: isCollapsed }">◀</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Props
interface Props {
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
});

// Emits
const emit = defineEmits(['toggle-collapse', 'filter-by-tag']);

// 响应式数据
const isCollapsed = ref(props.collapsed);
const pinnedCount = ref(5);
const usedStorage = ref('2.3 GB');
const totalStorage = ref('10 GB');

// 示例标签数据
const popularTags = ref([
  { name: '工作', count: 15 },
  { name: '个人', count: 8 },
  { name: '学习', count: 12 },
  { name: '项目', count: 6 },
  { name: '想法', count: 20 }
]);

// 计算存储使用百分比
const storagePercentage = computed(() => {
  const used = parseFloat(usedStorage.value.replace(' GB', ''));
  const total = parseFloat(totalStorage.value.replace(' GB', ''));
  return Math.round((used / total) * 100);
});

// 方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse', isCollapsed.value);
};

const showPinned = () => {
  // TODO: 显示置顶备忘录
  console.log('Show pinned memos');
};

const showRecent = () => {
  // TODO: 显示最近编辑的备忘录
  console.log('Show recent memos');
};

const showFavorites = () => {
  // TODO: 显示收藏的备忘录
  console.log('Show favorite memos');
};

const filterByTag = (tagName: string) => {
  emit('filter-by-tag', tagName);
  console.log('Filter by tag:', tagName);
};

const showUpgradeOptions = () => {
  // TODO: 显示升级选项
  console.log('Show upgrade options');
};
</script>

<style scoped>
.dashboard-sidebar {
  width: 256px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e5e7eb;
  position: fixed;
  top: 64px;
  left: 0;
  transition: all 0.3s ease;
  z-index: 50;
  overflow: hidden;
}

.dashboard-sidebar.collapsed {
  width: 64px;
}

.sidebar-content {
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 80px;
}

.dashboard-sidebar.collapsed .sidebar-content {
  padding: 1rem 0.5rem;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
  letter-spacing: 0.05em;
}

.dashboard-sidebar.collapsed .nav-title {
  display: none;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #374151;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-link.active {
  background: #e0e7ff;
  color: #4338ca;
  font-weight: 500;
}

.nav-icon {
  font-size: 1.1rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.dashboard-sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.nav-text {
  flex: 1;
  transition: opacity 0.3s ease;
}

.dashboard-sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.nav-count {
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  font-weight: 500;
}

.dashboard-sidebar.collapsed .nav-count {
  display: none;
}

.nav-button {
  justify-content: flex-start;
}

.tag-link {
  position: relative;
}

.tags-list {
  max-height: 200px;
  overflow-y: auto;
}

.view-all-link {
  font-size: 0.85rem;
  color: #6b7280;
  font-style: italic;
}

.storage-info {
  position: absolute;
  left: 1rem;
  right: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  transition: opacity 0.3s ease;
}

.dashboard-sidebar.collapsed .storage-info {
  opacity: 0;
  pointer-events: none;
}

.storage-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.storage-icon {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.storage-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.storage-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.storage-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.storage-text {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.upgrade-btn {
  width: 100%;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upgrade-btn:hover {
  background: #3730a3;
}

.collapse-btn {
  position: absolute;
  bottom: 2rem;
  right: -12px;
  width: 24px;
  height: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  color: #6b7280;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: #f3f4f6;
  transform: scale(1.1);
}

.collapse-btn span {
  transition: transform 0.3s ease;
}

.collapse-btn span.rotated {
  transform: rotate(180deg);
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.tags-list::-webkit-scrollbar {
  width: 3px;
}

.tags-list::-webkit-scrollbar-track {
  background: transparent;
}

.tags-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 1.5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-sidebar {
    transform: translateX(-100%);
    width: 280px;
  }

  .dashboard-sidebar.mobile-open {
    transform: translateX(0);
  }

  .collapse-btn {
    display: none;
  }
}

@media (max-width: 480px) {
  .dashboard-sidebar {
    width: 100vw;
    max-width: 320px;
  }
}
</style>
