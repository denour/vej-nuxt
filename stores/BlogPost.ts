import { defineStore } from 'pinia'
import type { BlogPost } from '~~/models/BlogPost'
import { fetchPostBySlug, fetchPosts } from '~~/services/posts'
import { withTTL } from '~~/utils/api'

type State = {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  cacheTTLms: number
  page: number
  perPage: number
  hasMore: boolean
  currentQuery: string
}

export const usePostsStore = defineStore('posts', {
  state: (): State => ({
    posts: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
    cacheTTLms: 5 * 60 * 1000, // 5 minutes
    page: 1,
    perPage: 9,
    hasMore: true,
    currentQuery: '',
  }),

  getters: {
    allPosts: (state) => state.posts,
    getPostById: (state) => (id: string) => state.posts.find((p) => p.id === id),
    featuredPost: (state) => {
      if (!state.posts.length) return null
      // Prefer publishedAt if present
      const sorted = [...state.posts].sort((a, b) => {
        const da = (a as any).publishedAt || (a as any).createdAt
        const db = (b as any).publishedAt || (b as any).createdAt
        return new Date(db || 0).getTime() - new Date(da || 0).getTime()
      })
      return sorted[0]
    },
    postsWithoutFeatured: (state): BlogPost[] => {
      const featured = (usePostsStore() as any).featuredPost as BlogPost | null
      if (!featured) return state.posts
      return state.posts.filter((p) => p.slug !== featured.slug)
    },
  },

  actions: {
    invalidate() {
      this.lastFetchedAt = null
      this.posts = []
      this.page = 1
      this.hasMore = true
    },

    async fetchPosts(opts: { force?: boolean; q?: string } = {}) {
      if (!opts.force && withTTL(this.posts, this.lastFetchedAt, this.cacheTTLms) && (!opts.q || opts.q === this.currentQuery)) {
        return
      }
      this.loading = true
      this.error = null
      try {
        this.page = 1
        this.currentQuery = opts.q || ''
        const data = await fetchPosts({ page: this.page, perPage: this.perPage, q: this.currentQuery })
        this.posts = data
        this.hasMore = data.length >= this.perPage
        this.lastFetchedAt = Date.now()
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al cargar posts'
      } finally {
        this.loading = false
      }
    },

    async loadMore() {
      if (!this.hasMore || this.loading) return
      this.loading = true
      try {
        const nextPage = this.page + 1
        const data = await fetchPosts({ page: nextPage, perPage: this.perPage, q: this.currentQuery })
        if (!data.length) {
          this.hasMore = false
        } else {
          this.page = nextPage
          this.posts = [...this.posts, ...data]
          this.hasMore = data.length >= this.perPage
        }
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al cargar más posts'
      } finally {
        this.loading = false
      }
    },

    async fetchPost(slug: string): Promise<BlogPost | null> {
      this.loading = true
      this.error = null
      try {
        const data = await fetchPostBySlug(slug)
        // Optionally cache into list if not present
        const exists = this.posts.find((p) => p.slug === slug)
        if (!exists) this.posts.unshift(data)
        return data
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al obtener el post'
        return null
      } finally {
        this.loading = false
      }
    },
  },
})
