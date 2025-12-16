import { defineStore } from 'pinia'
import type { Faq } from '~~/models/Faq'
import { fetchFaqById, fetchFaqs } from '~~/services/faqs'
import { withTTL } from '~~/utils/api'

type State = {
  faqs: Faq[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  cacheTTLms: number
}

export const useFaqStore = defineStore('faqs', {
  state: (): State => ({
    faqs: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
    cacheTTLms: 10 * 60 * 1000, // 10 minutes
  }),

  getters: {
    allFaqs: (state) => state.faqs,
    getFaqById: (state) => (id: string) => state.faqs.find((f) => f.id === id),
    categories: (state) => Array.from(new Set(state.faqs.map((f) => f.category))).sort(),
  },

  actions: {
    invalidate() {
      this.lastFetchedAt = null
      this.faqs = []
    },

    async fetchFaqs(q?: string) {
      if (withTTL(this.faqs, this.lastFetchedAt, this.cacheTTLms) && !q) return
      this.loading = true
      this.error = null
      try {
        const data = await fetchFaqs({ q })
        this.faqs = data
        this.lastFetchedAt = Date.now()
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al cargar faqs'
      } finally {
        this.loading = false
      }
    },

    async fetchFaq(id: string) {
      this.loading = true
      this.error = null
      try {
        const item = await fetchFaqById(id)
        const exists = this.faqs.find((f) => f.id === id)
        if (!exists) this.faqs.push(item)
        return item
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al obtener el faq'
        return null
      } finally {
        this.loading = false
      }
    },
  },
})
