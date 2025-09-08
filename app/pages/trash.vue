<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">回收站</h1>
        <div class="flex space-x-4">
          <button 
            @click="restoreSelected"
            :disabled="selectedMemos.length === 0"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            恢复选中项 ({{ selectedMemos.length }})
          </button>
          <button 
            @click="permanentDeleteSelected"
            :disabled="selectedMemos.length === 0"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            永久删除选中项
          </button>
          <button 
            @click="clearTrash"
            :disabled="trashedMemos.length === 0"
            class="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            清空回收站
          </button>
        </div>
      </div>
      
      <!-- 提示信息 -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-yellow-800">注意</h3>
            <p class="text-sm text-yellow-700 mt-1">
              回收站中的备忘录将在30天后自动永久删除。永久删除的备忘录无法恢复。
            </p>
          </div>
        </div>
      </div>
      
      <!-- 全选控制 -->
      <div v-if="trashedMemos.length > 0" class="mb-4">
        <label class="inline-flex items-center">
          <input 
            type="checkbox" 
            :checked="selectAll"
            @change="toggleSelectAll"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">全选</span>
        </label>
      </div>
      
      <!-- 备忘录列表 -->
      <div v-if="trashedMemos.length > 0" class="space-y-4">
        <div 
          v-for="memo in trashedMemos" 
          :key="memo.id"
          class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-400"
        >
          <div class="flex items-start space-x-4">
            <input 
              type="checkbox" 
              :value="memo.id"
              v-model="selectedMemos"
              class="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
            
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-800">{{ memo.title }}</h3>
                <div class="text-sm text-gray-500">
                  <p>删除时间: {{ formatDate(memo.deletedAt) }}</p>
                  <p class="text-red-600">{{ getDaysUntilPermanentDelete(memo.deletedAt) }} 天后永久删除</p>
                </div>
              </div>
              
              <p class="text-gray-600 mb-3 line-clamp-2">{{ memo.content }}</p>
              
              <div class="flex justify-between items-center">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in memo.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    @click="restoreMemo(memo.id)"
                    class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    恢复
                  </button>
                  <button 
                    @click="permanentDeleteMemo(memo.id)"
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    永久删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">回收站为空</h3>
        <p class="mt-2 text-gray-500">没有已删除的备忘录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const trashedMemos = ref([])
const selectedMemos = ref([])

const selectAll = computed({
  get: () => selectedMemos.value.length === trashedMemos.value.length && trashedMemos.value.length > 0,
  set: (value) => {
    selectedMemos.value = value ? trashedMemos.value.map(memo => memo.id) : []
  }
})

const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
}

const restoreMemo = async (id) => {
  // TODO: 实现恢复单个备忘录的逻辑
  console.log('恢复备忘录:', id)
  trashedMemos.value = trashedMemos.value.filter(memo => memo.id !== id)
}

const permanentDeleteMemo = async (id) => {
  if (confirm('确定要永久删除这个备忘录吗？此操作不可逆！')) {
    // TODO: 实现永久删除单个备忘录的逻辑
    console.log('永久删除备忘录:', id)
    trashedMemos.value = trashedMemos.value.filter(memo => memo.id !== id)
    selectedMemos.value = selectedMemos.value.filter(selectedId => selectedId !== id)
  }
}

const restoreSelected = async () => {
  if (selectedMemos.value.length === 0) return
  
  // TODO: 实现批量恢复的逻辑
  console.log('批量恢复备忘录:', selectedMemos.value)
  trashedMemos.value = trashedMemos.value.filter(memo => !selectedMemos.value.includes(memo.id))
  selectedMemos.value = []
}

const permanentDeleteSelected = async () => {
  if (selectedMemos.value.length === 0) return
  
  if (confirm(`确定要永久删除选中的 ${selectedMemos.value.length} 个备忘录吗？此操作不可逆！`)) {
    // TODO: 实现批量永久删除的逻辑
    console.log('批量永久删除备忘录:', selectedMemos.value)
    trashedMemos.value = trashedMemos.value.filter(memo => !selectedMemos.value.includes(memo.id))
    selectedMemos.value = []
  }
}

const clearTrash = async () => {
  if (trashedMemos.value.length === 0) return
  
  if (confirm('确定要清空回收站吗？所有备忘录将被永久删除，此操作不可逆！')) {
    // TODO: 实现清空回收站的逻辑
    console.log('清空回收站')
    trashedMemos.value = []
    selectedMemos.value = []
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDaysUntilPermanentDelete = (deletedAt) => {
  const deleteDate = new Date(deletedAt)
  const permanentDeleteDate = new Date(deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30天后
  const now = new Date()
  const diffTime = permanentDeleteDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// TODO: 从API获取已删除的备忘录
onMounted(() => {
  // 模拟加载已删除的备忘录
  trashedMemos.value = [
    {
      id: 1,
      title: '已删除的备忘录1',
      content: '这是一个已删除的备忘录内容，展示在回收站中...',
      tags: ['标签1', '标签2'],
      deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5天前删除
    },
    {
      id: 2,
      title: '已删除的备忘录2',
      content: '另一个已删除的备忘录内容...',
      tags: ['工作'],
      deletedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10天前删除
    }
  ]
})
</script>
