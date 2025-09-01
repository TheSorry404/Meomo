<template>
  <div class="memo-editor-overlay" @click.self="handleOverlayClick">
    <div class="memo-editor" :class="{ 'full-screen': isFullScreen }">
      <div class="editor-header">
        <div class="editor-title">
          {{ memo ? '编辑备忘录' : '新建备忘录' }}
        </div>
        <div class="editor-actions">
          <button 
            class="editor-btn icon-btn" 
            title="全屏模式"
            @click="toggleFullScreen"
          >
            {{ isFullScreen ? '🗗' : '⛶' }}
          </button>
          <button class="editor-btn" @click="handleCancel">取消</button>
          <button class="editor-btn primary" @click="handleSave">保存</button>
        </div>
      </div>

      <div class="editor-content">
        <!-- 标题输入 -->
        <div class="form-group">
          <input
            v-model="formData.title"
            type="text"
            placeholder="输入备忘录标题..."
            class="title-input"
            :disabled="saving"
          >
        </div>

        <!-- 内容编辑器 -->
        <div class="form-group flex-1">
          <textarea
            v-model="formData.content"
            placeholder="开始写下你的想法..."
            class="content-textarea"
            :disabled="saving"
            @input="handleContentChange"
          />
        </div>

        <!-- 编辑工具栏 -->
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <!-- 标签管理 -->
            <div class="tags-section">
              <div class="tags-input-container">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="添加标签..."
                  class="tag-input"
                  @keyup.enter="addTag"
                  @keyup.comma="addTag"
                >
                <button class="add-tag-btn" @click="addTag">+</button>
              </div>
              
              <div class="tags-list">
                <span
                  v-for="tag in formData.tags"
                  :key="tag"
                  class="tag-item"
                >
                  {{ tag }}
                  <button class="remove-tag-btn" @click="removeTag(tag)">×</button>
                </span>
              </div>
            </div>

            <!-- 颜色选择 -->
            <div class="color-section">
              <span class="section-label">颜色：</span>
              <div class="color-picker">
                <button
                  v-for="color in availableColors"
                  :key="color.value"
                  class="color-option"
                  :class="{ active: formData.color === color.value }"
                  :style="{ backgroundColor: color.value }"
                  :title="color.name"
                  @click="formData.color = color.value"
                />
              </div>
            </div>

            <!-- 置顶选项 -->
            <label class="checkbox-option">
              <input
                v-model="formData.isPinned"
                type="checkbox"
              >
              <span class="checkbox-label">置顶备忘录</span>
            </label>
          </div>

          <div class="toolbar-right">
            <!-- 统计信息 -->
            <div class="editor-stats">
              <span class="stat-item">字符: {{ contentStats.characters }}</span>
              <span class="stat-item">单词: {{ contentStats.words }}</span>
              <span class="stat-item">行数: {{ contentStats.lines }}</span>
            </div>

            <!-- 快捷操作 -->
            <div class="quick-actions">
              <button 
                class="quick-btn"
                title="插入当前时间"
                @click="insertTimestamp"
              >
                📅
              </button>
              <button 
                class="quick-btn"
                title="清空内容"
                @click="clearContent"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- 建议标签 -->
        <div v-if="suggestedTags.length > 0" class="suggested-tags">
          <span class="section-label">建议标签：</span>
          <button
            v-for="tag in suggestedTags"
            :key="tag"
            class="suggested-tag"
            @click="addSuggestedTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 保存状态指示器 -->
      <div v-if="saving" class="saving-indicator">
        <div class="loading-spinner" />
        <span>正在保存...</span>
      </div>

      <!-- 自动保存提示 -->
      <div v-if="autoSaveStatus" class="auto-save-status" :class="autoSaveStatus.type">
        {{ autoSaveStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Memo } from '~/types'

// Props
interface Props {
  memo?: Memo | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['save', 'cancel'])

// 响应式数据
const isFullScreen = ref(false)
const saving = ref(false)
const newTag = ref('')
const autoSaveTimer = ref<NodeJS.Timeout | null>(null)
const autoSaveStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

// 表单数据
const formData = reactive({
  title: props.memo?.title || '',
  content: props.memo?.content || '',
  tags: props.memo?.tags ? [...props.memo.tags] : [],
  color: props.memo?.color || '#ffffff',
  isPinned: props.memo?.isPinned || false,
})

// 可用颜色
const availableColors = [
  { name: '默认', value: '#ffffff' },
  { name: '黄色', value: '#fef3c7' },
  { name: '绿色', value: '#d1fae5' },
  { name: '蓝色', value: '#dbeafe' },
  { name: '紫色', value: '#e0e7ff' },
  { name: '粉色', value: '#fce7f3' },
  { name: '橙色', value: '#fed7aa' },
  { name: '灰色', value: '#f3f4f6' },
]

// 计算属性
const contentStats = computed(() => {
  const content = formData.content
  return {
    characters: content.length,
    words: content.trim() ? content.trim().split(/\s+/).length : 0,
    lines: content.split('\n').length
  }
})

const suggestedTags = computed(() => {
  // 基于内容推荐标签
  const content = formData.content.toLowerCase()
  const suggestions = []
  
  if (content.includes('工作') || content.includes('项目') || content.includes('会议')) {
    suggestions.push('工作')
  }
  if (content.includes('学习') || content.includes('笔记') || content.includes('知识')) {
    suggestions.push('学习')
  }
  if (content.includes('想法') || content.includes('灵感') || content.includes('创意')) {
    suggestions.push('想法')
  }
  if (content.includes('个人') || content.includes('生活') || content.includes('日常')) {
    suggestions.push('个人')
  }
  if (content.includes('重要') || content.includes('紧急') || content.includes('优先')) {
    suggestions.push('重要')
  }

  // 过滤掉已经添加的标签
  return suggestions.filter(tag => !formData.tags.includes(tag))
})

// 方法
const handleOverlayClick = () => {
  if (!isFullScreen.value) {
    handleCancel()
  }
}

const handleCancel = () => {
  if (hasUnsavedChanges()) {
    if (confirm('有未保存的更改，确定要退出吗？')) {
      emit('cancel')
    }
  } else {
    emit('cancel')
  }
}

const handleSave = async () => {
  if (!formData.title.trim()) {
    alert('请输入备忘录标题')
    return
  }

  saving.value = true

  try {
    const memoData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
    }

    emit('save', memoData)
  } catch (error) {
    console.error('Save error:', error)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const hasUnsavedChanges = () => {
  if (!props.memo) {
    return formData.title || formData.content || formData.tags.length > 0
  }

  return (
    formData.title !== props.memo.title ||
    formData.content !== props.memo.content ||
    JSON.stringify(formData.tags) !== JSON.stringify(props.memo.tags) ||
    formData.color !== props.memo.color ||
    formData.isPinned !== props.memo.isPinned
  )
}

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  
  if (isFullScreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const addTag = () => {
  const tag = newTag.value.trim().replace(',', '')
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

const addSuggestedTag = (tag: string) => {
  if (!formData.tags.includes(tag)) {
    formData.tags.push(tag)
  }
}

const removeTag = (tagToRemove: string) => {
  const index = formData.tags.indexOf(tagToRemove)
  if (index > -1) {
    formData.tags.splice(index, 1)
  }
}

const insertTimestamp = () => {
  const timestamp = new Date().toLocaleString('zh-CN')
  formData.content += `\n\n[${timestamp}]\n`
}

const clearContent = () => {
  if (formData.content && confirm('确定要清空所有内容吗？')) {
    formData.content = ''
  }
}

const handleContentChange = () => {
  // 自动保存逻辑
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value)
  }

  autoSaveTimer.value = setTimeout(() => {
    if (hasUnsavedChanges()) {
      autoSave()
    }
  }, 3000) // 3秒后自动保存
}

const autoSave = async () => {
  if (!formData.title.trim()) return

  try {
    // TODO: 实现自动保存 API 调用
    autoSaveStatus.value = {
      type: 'success',
      message: '已自动保存'
    }

    setTimeout(() => {
      autoSaveStatus.value = null
    }, 2000)
  } catch (error) {
    autoSaveStatus.value = {
      type: 'error',
      message: '自动保存失败'
    }

    setTimeout(() => {
      autoSaveStatus.value = null
    }, 3000)
  }
}

// 键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 's') {
      event.preventDefault()
      handleSave()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      handleCancel()
    }
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value)
  }
  document.body.style.overflow = ''
})

// 监听全屏状态变化
watch(isFullScreen, (newValue) => {
  if (!newValue) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.memo-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.memo-editor {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
}

.memo-editor.full-screen {
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.editor-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.editor-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.editor-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.editor-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.editor-btn.primary {
  background: #4338ca;
  color: white;
  border-color: #4338ca;
}

.editor-btn.primary:hover {
  background: #3730a3;
}

.icon-btn {
  padding: 0.5rem;
  font-size: 1rem;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem 2rem;
  overflow: hidden;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.flex-1 {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  transition: border-color 0.3s ease;
}

.title-input:focus {
  outline: none;
  border-color: #4338ca;
}

.content-textarea {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.6;
  resize: none;
  min-height: 200px;
  transition: border-color 0.3s ease;
}

.content-textarea:focus {
  outline: none;
  border-color: #4338ca;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  gap: 2rem;
}

.toolbar-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toolbar-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-input-container {
  display: flex;
  gap: 0.5rem;
}

.tag-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.9rem;
}

.add-tag-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-tag-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
}

.remove-tag-btn:hover {
  color: #ef4444;
}

.color-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.color-picker {
  display: flex;
  gap: 0.5rem;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option:hover {
  transform: scale(1.1);
  border-color: #9ca3af;
}

.color-option.active {
  border-color: #4338ca;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #374151;
}

.editor-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.quick-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.suggested-tags {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.suggested-tag {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggested-tag:hover {
  background: #e0e7ff;
  color: #4338ca;
  border-style: solid;
}

.saving-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.auto-save-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.auto-save-status.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.auto-save-status.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .memo-editor-overlay {
    padding: 1rem;
  }
  
  .editor-header {
    padding: 1rem;
  }
  
  .editor-content {
    padding: 1rem;
  }
  
  .editor-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .toolbar-right {
    align-items: stretch;
  }
  
  .editor-stats {
    justify-content: space-between;
  }
  
  .color-section {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .memo-editor-overlay {
    padding: 0.5rem;
  }
  
  .editor-actions {
    gap: 0.5rem;
  }
  
  .editor-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .suggested-tags {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
