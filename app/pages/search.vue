<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">搜索备忘录</h1>
      
      <!-- 搜索框 -->
      <div class="mb-8">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="搜索备忘录内容、标题或标签..."
          >
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      
      <!-- 搜索过滤器 -->
      <div class="mb-6 flex flex-wrap gap-4">
        <select 
          v-model="filterType"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">所有类型</option>
          <option value="title">标题</option>
          <option value="content">内容</option>
          <option value="tags">标签</option>
        </select>
        
        <select 
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="relevance">相关性</option>
          <option value="date">创建时间</option>
          <option value="updated">更新时间</option>
        </select>
      </div>
      
      <!-- 搜索结果 -->
      <div v-if="isSearching" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">搜索中...</p>
      </div>
      
      <div v-else-if="searchResults.length > 0" class="space-y-4">
        <p class="text-gray-600 mb-4">找到 {{ searchResults.length }} 条结果</p>
        
        <div 
          v-for="memo in searchResults" 
          :key="memo.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateToMemo(memo.id)"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-800">{{ memo.title }}</h3>
            <span class="text-sm text-gray-500">{{ formatDate(memo.createdAt) }}</span>
          </div>
          <p class="text-gray-600 mb-3 line-clamp-2">{{ memo.content }}</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in memo.tags" 
              :key="tag"
              class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else-if="searchQuery && !isSearching" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">没有找到相关备忘录</h3>
        <p class="mt-2 text-gray-500">尝试使用不同的关键词搜索</p>
      </div>
      
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">开始搜索</h3>
        <p class="mt-2 text-gray-500">输入关键词来搜索你的备忘录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const searchQuery = ref('')
const filterType = ref('all')
const sortBy = ref('relevance')
const isSearching = ref(false)
const searchResults = ref([])

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  
  // TODO: 实现真实的搜索API调用
  setTimeout(() => {
    // 模拟搜索结果
    searchResults.value = [
      {
        id: 1,
        title: '项目计划',
        content: '这是一个关于项目计划的备忘录，包含了详细的时间安排和任务分配...',
        tags: ['工作', '计划'],
        createdAt: new Date('2025-09-07')
      },
      {
        id: 2,
        title: '学习笔记',
        content: 'Vue.js 的学习笔记，包含组件、路由、状态管理等内容...',
        tags: ['学习', 'Vue'],
        createdAt: new Date('2025-09-06')
      }
    ]
    isSearching.value = false
  }, 1000)
}

const navigateToMemo = (id) => {
  navigateTo(`/memos/${id}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>
