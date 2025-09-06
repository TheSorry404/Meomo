<template>
  <div class="memo-card" :class="[`memo-card-${viewMode}`, { pinned: memo.isPinned }]" :style="cardStyle">
    <div class="memo-card-content">
      <!-- 卡片头部 -->
      <div class="memo-header">
        <h3 class="memo-title" @click="openMemo">{{ memo.title }}</h3>
        <div class="memo-actions">
          <button 
            class="action-btn pin-btn" 
            :class="{ active: memo.isPinned }"
            @click="$emit('toggle-pin', memo.id)"
            :title="memo.isPinned ? '取消置顶' : '置顶'"
          >
            📌
          </button>
          <button class="action-btn edit-btn" @click="$emit('edit', memo)" title="编辑">
            ✏️
          </button>
          <button class="action-btn delete-btn" @click="confirmDelete" title="删除">
            🗑️
          </button>
        </div>
      </div>

      <!-- 备忘录内容 -->
      <div class="memo-content" @click="openMemo">
        <p class="memo-text">{{ truncatedContent }}</p>
      </div>

      <!-- 标签 -->
      <div v-if="memo.tags && memo.tags.length > 0" class="memo-tags">
        <span 
          v-for="tag in visibleTags" 
          :key="tag"
          class="memo-tag"
          @click="$emit('filter-tag', tag)"
        >
          {{ tag }}
        </span>
        <span v-if="hiddenTagsCount > 0" class="more-tags">
          +{{ hiddenTagsCount }}
        </span>
      </div>

      <!-- 卡片底部信息 -->
      <div class="memo-footer">
        <div class="memo-meta">
          <span class="memo-date" :title="formatFullDate(memo.updatedAt)">
            {{ formatRelativeDate(memo.updatedAt) }}
          </span>
          <span class="memo-word-count">{{ wordCount }} 字</span>
        </div>
        <div class="memo-status">
          <span v-if="memo.isPinned" class="status-badge pinned-badge">置顶</span>
          <span v-if="isRecent" class="status-badge recent-badge">最近</span>
        </div>
      </div>
    </div>

    <!-- 悬停时的快捷操作 -->
    <div class="memo-hover-actions">
      <button class="quick-action-btn" @click="quickEdit" title="快速编辑">
        ✏️
      </button>
      <button class="quick-action-btn" @click="duplicateMemo" title="复制">
        📋
      </button>
      <button class="quick-action-btn" @click="shareMemo" title="分享">
        📤
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Memo } from '~/types'

// Props
interface Props {
  memo: Memo
  viewMode: 'grid' | 'list'
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  edit: [memo: Memo]
  delete: [id: string] 
  'toggle-pin': [id: string]
  'filter-tag': [tag: string]
  open: [memo: Memo]
  duplicate: [memo: Memo]
  share: [memo: Memo]
}>()

// 计算属性
const cardStyle = computed(() => ({
  '--memo-color': props.memo.color || '#ffffff',
  borderLeft: props.memo.isPinned ? '4px solid #f59e0b' : undefined
}))

const truncatedContent = computed(() => {
  const maxLength = props.viewMode === 'grid' ? 120 : 200
  if (props.memo.content.length <= maxLength) {
    return props.memo.content
  }
  return props.memo.content.slice(0, maxLength) + '...'
})

const wordCount = computed(() => {
  return props.memo.content.length
})

const visibleTags = computed(() => {
  const maxTags = props.viewMode === 'grid' ? 3 : 5
  return props.memo.tags.slice(0, maxTags)
})

const hiddenTagsCount = computed(() => {
  const maxTags = props.viewMode === 'grid' ? 3 : 5
  return Math.max(0, props.memo.tags.length - maxTags)
})

const isRecent = computed(() => {
  const updatedAt = new Date(props.memo.updatedAt)
  const now = new Date()
  const diffHours = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60)
  return diffHours < 24
})

// 方法
const openMemo = () => {
  emit('open', props.memo)
}

const confirmDelete = () => {
  if (confirm(`确定要删除备忘录"${props.memo.title}"吗？`)) {
    emit('delete', props.memo.id)
  }
}

const quickEdit = () => {
  emit('edit', props.memo)
}

const duplicateMemo = () => {
  emit('duplicate', props.memo)
}

const shareMemo = () => {
  emit('share', props.memo)
}

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.memo-card {
  background: var(--memo-color, white);
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.memo-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.memo-card.pinned {
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.memo-card-grid {
  height: auto;
  min-height: 200px;
}

.memo-card-list {
  display: flex;
  align-items: stretch;
  height: 120px;
}

.memo-card-content {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.memo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.memo-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 0.5rem;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.3s ease;
}

.memo-title:hover {
  color: #4338ca;
}

.memo-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.memo-card:hover .memo-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.action-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

.pin-btn.active {
  opacity: 1;
  color: #f59e0b;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.memo-content {
  flex: 1;
  margin-bottom: 0.75rem;
}

.memo-text {
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
  cursor: pointer;
}

.memo-card-list .memo-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.memo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.memo-tag {
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.memo-tag:hover {
  background: #c7d2fe;
}

.more-tags {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.memo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.memo-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.memo-date {
  color: #6b7280;
  font-size: 0.8rem;
  cursor: help;
}

.memo-word-count {
  color: #9ca3af;
  font-size: 0.8rem;
}

.memo-status {
  display: flex;
  gap: 0.25rem;
}

.status-badge {
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.pinned-badge {
  background: #fef3c7;
  color: #92400e;
}

.recent-badge {
  background: #dbeafe;
  color: #1e40af;
}

.memo-hover-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.memo-card:hover .memo-hover-actions {
  opacity: 1;
}

.quick-action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.375rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.quick-action-btn:hover {
  background: white;
  border-color: #d1d5db;
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .memo-card-grid {
    min-height: 150px;
  }
  
  .memo-card-list {
    height: 100px;
  }
  
  .memo-actions {
    opacity: 1;
  }
  
  .memo-hover-actions {
    display: none;
  }
  
  .memo-title {
    font-size: 1rem;
  }
  
  .memo-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .memo-card-content {
    padding: 0.75rem;
  }
  
  .memo-meta {
    gap: 0.5rem;
  }
  
  .memo-word-count {
    display: none;
  }
}
</style>
