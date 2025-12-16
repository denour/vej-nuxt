import { defineStore } from 'pinia'
import type { BlogPost } from '~~/models/BlogPost'
import { fetchPosts } from '~~/services/posts'
import { withTTL } from '~~/utils/api'

type State = {
  tips: BlogPost[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  cacheTTLms: number
  currentQuery: string
}

export const useTipsStore = defineStore('tips', {
  state: (): State => ({
    tips: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
    cacheTTLms: 10 * 60 * 1000,
    currentQuery: '',
  }),

  getters: {
    all: (state) => state.tips,
  },

  actions: {
    invalidate() {
      this.lastFetchedAt = null
      this.tips = []
    },

    async fetchTips(q?: string) {
      if (withTTL(this.tips, this.lastFetchedAt, this.cacheTTLms) && !q) return
      this.loading = true
      this.error = null
      try {
        this.currentQuery = q || ''
        // Assume backend supports category filter as 'category=Consejos'
        const data = await fetchPosts({ q: this.currentQuery, category: 'Consejos' })
        this.tips = data
        this.lastFetchedAt = Date.now()
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al cargar consejos'
      } finally {
        this.loading = false
      }
    },
  },
})
