import { useUserStore as _useUserStore } from '../stores/user'

/**
 * 安全地使用用户 store 的 composable
 * 提供额外的错误处理和状态检查
 */
export function useUserStore() {
  try {
    // 检查是否在客户端环境中
    if (typeof window === 'undefined') {
      console.warn('useUserStore called on server side')
    }

    const store = _useUserStore()
    
    if (!store) {
      throw new Error('User store is not available')
    }
    
    return store
  } catch (error) {
    // 如果是Pinia未初始化，在客户端环境下等待下一个tick重试
    if (typeof window !== 'undefined' && error instanceof Error && error.message.includes('getActivePinia')) {
      // 返回一个Promise，在下一个tick重试
      return new Promise((resolve, reject) => {
        nextTick(() => {
          try {
            resolve(_useUserStore())
          } catch (retryError) {
            reject(retryError)
          }
        })
      }) as any
    }
    
    throw error
  }
}
