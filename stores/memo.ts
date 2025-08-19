import { defineStore } from 'pinia'
import type { Memo, MemoFilter, PaginationParams } from '~/types'

interface MemoState {
  memos: Memo[]
  currentMemo: Memo | null
  loading: boolean
  total: number
  filter: MemoFilter
}

export const useMemoStore = defineStore('memo', {
  state: (): MemoState => ({
    memos: [],
    currentMemo: null,
    loading: false,
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
    async fetchMemos(params: PaginationParams & MemoFilter = { page: 1, pageSize: 20 }) {
      this.loading = true
      
      try {
        const { token } = useUserStore()
        const response = await fetch('/api/memos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(params),
        })
        
        const { data } = await response.json()
        
        this.memos = data.memos
        this.total = data.total
        this.filter = params
      } catch (error) {
        console.error('Failed to fetch memos:', error)
      } finally {
        this.loading = false
      }
    },

    async createMemo(memoData: Omit<Memo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
      try {
        const { token } = useUserStore()
        const response = await fetch('/api/memos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(memoData),
        })
        
        const { data } = await response.json()
        
        this.memos.unshift(data)
        return { success: true, data }
      } catch (error) {
        console.error('Failed to create memo:', error)
        return { success: false, error }
      }
    },

    async updateMemo(id: string, updates: Partial<Memo>) {
      try {
        const { token } = useUserStore()
        const response = await fetch(`/api/memos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        })
        
        const { data } = await response.json()
        
        const index = this.memos.findIndex(memo => memo.id === id)
        if (index !== -1) {
          this.memos[index] = data
        }
        
        return { success: true, data }
      } catch (error) {
        console.error('Failed to update memo:', error)
        return { success: false, error }
      }
    },

    async deleteMemo(id: string) {
      try {
        const { token } = useUserStore()
        await fetch(`/api/memos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        
        this.memos = this.memos.filter(memo => memo.id !== id)
        return { success: true }
      } catch (error) {
        console.error('Failed to delete memo:', error)
        return { success: false, error }
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
