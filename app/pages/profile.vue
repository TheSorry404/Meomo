<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">用户档案</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
            <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ user.name || '用户名' }}</h2>
            <p class="text-gray-600">{{ user.email || 'user@example.com' }}</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input 
              type="text" 
              v-model="user.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入姓名"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input 
              type="email" 
              v-model="user.email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入邮箱"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
            <textarea 
              v-model="user.bio"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="介绍一下自己..."
            ></textarea>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button 
              @click="saveProfile"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              保存更改
            </button>
            <button 
              @click="resetForm"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const user = ref({
  name: '',
  email: '',
  bio: ''
})

const saveProfile = () => {
  // TODO: 实现保存用户档案的逻辑
  console.log('保存用户档案:', user.value)
}

const resetForm = () => {
  // TODO: 实现重置表单的逻辑
  user.value = {
    name: '',
    email: '',
    bio: ''
  }
}

// TODO: 从API获取用户信息
onMounted(() => {
  // 模拟加载用户数据
  user.value = {
    name: '示例用户',
    email: 'user@example.com',
    bio: '这是一个示例用户的个人简介。'
  }
})
</script>
