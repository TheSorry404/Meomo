<template>
  <transition name="toast">
    <div 
      v-if="visible" 
      class="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="font-semibold">{{ title || 'Error' }}</p>
          <p v-if="message" class="text-sm mt-1">{{ message }}</p>
        </div>
        <button 
          class="ml-3 text-white hover:text-gray-200 focus:outline-none"
          @click="close"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

interface Props {
  title?: string
  message?: string
  duration?: number
  visible?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Error',
  message: '',
  duration: 5000,
  visible: false
})

const emit = defineEmits<Emits>()

const close = () => {
  emit('close')
}

// 自动关闭
onMounted(() => {
  if (props.visible && props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})

watch(() => props.visible, (newVisible) => {
  if (newVisible && props.duration > 0) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
