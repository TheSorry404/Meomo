<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">设置</h1>
      
      <div class="space-y-8">
        <!-- 账户设置 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">账户设置</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input 
                type="text" 
                v-model="settings.username"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入用户名"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
              <input 
                type="email" 
                v-model="settings.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入邮箱地址"
              >
            </div>
          </div>
        </div>
        
        <!-- 界面设置 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">界面设置</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">深色模式</label>
                <p class="text-xs text-gray-500">切换到深色主题</p>
              </div>
              <button 
                @click="toggleDarkMode"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span 
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">语言</label>
              <select 
                v-model="settings.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="zh-cn">简体中文</option>
                <option value="zh-tw">繁體中文</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">每页显示备忘录数量</label>
              <select 
                v-model="settings.itemsPerPage"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- 隐私设置 -->
        <!-- <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">隐私设置</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">备忘录加密</label>
                <p class="text-xs text-gray-500">对敏感备忘录进行加密存储</p>
              </div>
              <button 
                @click="toggleEncryption"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.enableEncryption ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span 
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.enableEncryption ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">自动备份</label>
                <p class="text-xs text-gray-500">定期自动备份你的数据</p>
              </div>
              <button 
                @click="toggleAutoBackup"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span 
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </div> -->
        
        <!-- 数据管理 -->
        <!-- <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">数据管理</h2>
          
          <div class="space-y-4">
            <div class="flex space-x-4">
              <button 
                @click="exportData"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                导出数据
              </button>
              <button 
                @click="importData"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                导入数据
              </button>
            </div>
            
            <div class="pt-4 border-t border-gray-200">
              <button 
                @click="clearAllData"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                清除所有数据
              </button>
              <p class="text-xs text-gray-500 mt-2">⚠️ 此操作不可逆，请谨慎操作</p>
            </div>
          </div>
        </div>
         -->
        <!-- 保存按钮 -->
        <div class="flex justify-end space-x-4">
          <button 
            @click="resetSettings"
            class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            重置
          </button>
          <button 
            @click="saveSettings"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const settings = ref({
  username: '',
  email: '',
  darkMode: false,
  language: 'zh-cn',
  itemsPerPage: 20,
  enableEncryption: false,
  autoBackup: true
})

const toggleDarkMode = () => {
  settings.value.darkMode = !settings.value.darkMode
}

const toggleEncryption = () => {
  settings.value.enableEncryption = !settings.value.enableEncryption
}

const toggleAutoBackup = () => {
  settings.value.autoBackup = !settings.value.autoBackup
}

const saveSettings = () => {
  // TODO: 实现保存设置的逻辑
  console.log('保存设置:', settings.value)
}

const resetSettings = () => {
  // TODO: 实现重置设置的逻辑
  settings.value = {
    username: '',
    email: '',
    darkMode: false,
    language: 'zh-cn',
    itemsPerPage: 20,
    enableEncryption: false,
    autoBackup: true
  }
}

const exportData = () => {
  // TODO: 实现导出数据的逻辑
  console.log('导出数据')
}

const importData = () => {
  // TODO: 实现导入数据的逻辑
  console.log('导入数据')
}

const clearAllData = () => {
  // TODO: 实现清除所有数据的逻辑
  if (confirm('确定要清除所有数据吗？此操作不可逆！')) {
    console.log('清除所有数据')
  }
}

// TODO: 从API加载用户设置
onMounted(() => {
  // 模拟加载设置数据
  settings.value = {
    username: '示例用户',
    email: 'user@example.com',
    darkMode: false,
    language: 'zh-cn',
    itemsPerPage: 20,
    enableEncryption: false,
    autoBackup: true
  }
})
</script>
