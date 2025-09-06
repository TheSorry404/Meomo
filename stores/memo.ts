import { defineStore } from 'pinia'
import type { Memo, MemoFilter, PaginationParams } from '~/types'
import { apiService, API_ENDPOINTS, type ApiResponse } from '../services/api'

interface MemoState {
  memos: Memo[]
  currentMemo: Memo | null
  loading: boolean
  error: string | null
  total: number
  filter: MemoFilter
}

export const useMemoStore = defineStore('memo', {
  state: (): MemoState => ({
    memos: [],
    currentMemo: null,
    loading: false,
    error: null,
    total: 0,
    filter: {},
  }),

  getters: {
    pinnedMemos: (state) => state.memos.filter(memo => memo.isPinned),
    unpinnedMemos: (state) => state.memos.filter(memo => !memo.isPinned),
    
    getMemosByTag: (state) => (tag: string) => 
      state.memos.filter(memo => memo.tags.includes(tag)),
      
    allTags: (state) => {
      const tags = state.memos.flatMap(memo => memo.tags)
      return [...new Set(tags)]
    },
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    async fetchMemos(params: PaginationParams & MemoFilter = { page: 1, pageSize: 20 }) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const response = await apiService.post<ApiResponse<{ memos: Memo[], total: number }>>(
          API_ENDPOINTS.MEMOS.LIST, 
          params
        )
        
        // 根据响应格式获取数据
        let data: { memos: Memo[], total: number }
        if ('data' in response && response.data) {
          data = response.data
        } else {
          data = response as unknown as { memos: Memo[], total: number }
        }
        
        this.memos = data.memos
        this.total = data.total
        this.filter = params
        
      } catch (error) {
        console.error('Failed to fetch memos:', error)
        this.setError(error instanceof Error ? error.message : 'Failed to fetch memos')
      } finally {
        this.setLoading(false)
      }
    },

    async createMemo(memoData: Omit<Memo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const response = await apiService.post<ApiResponse<Memo>>(API_ENDPOINTS.MEMOS.CREATE, memoData)
        
        // 根据响应格式获取数据
        let memo: Memo
        if ('data' in response && response.data) {
          memo = response.data
        } else {
          memo = response as unknown as Memo
        }
        
        this.memos.unshift(memo)
        return { success: true, data: memo }
        
      } catch (error) {
        console.error('Failed to create memo:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to create memo'
        this.setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        this.setLoading(false)
      }
    },

    async updateMemo(id: string, updates: Partial<Memo>) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const response = await apiService.put<ApiResponse<Memo>>(
          API_ENDPOINTS.MEMOS.UPDATE(id), 
          updates
        )
        
        // 根据响应格式获取数据
        let memo: Memo
        if ('data' in response && response.data) {
          memo = response.data
        } else {
          memo = response as unknown as Memo
        }
        
        const index = this.memos.findIndex(memo => memo.id === id)
        if (index !== -1) {
          this.memos[index] = memo
        }
        
        return { success: true, data: memo }
        
      } catch (error) {
        console.error('Failed to update memo:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to update memo'
        this.setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        this.setLoading(false)
      }
    },

    async deleteMemo(id: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        await apiService.delete(API_ENDPOINTS.MEMOS.DELETE(id))
        
        this.memos = this.memos.filter(memo => memo.id !== id)
        return { success: true }
        
      } catch (error) {
        console.error('Failed to delete memo:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete memo'
        this.setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        this.setLoading(false)
      }
    },

    async togglePin(id: string) {
      const memo = this.memos.find(m => m.id === id)
      if (memo) {
        return await this.updateMemo(id, { isPinned: !memo.isPinned })
      }
      return { success: false }
    },

    setCurrentMemo(memo: Memo | null) {
      this.currentMemo = memo
    },

    clearMemos() {
      this.memos = []
      this.total = 0
      this.currentMemo = null
    },
  },
})
