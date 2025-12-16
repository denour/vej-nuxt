import { defineStore } from 'pinia'
import type {Product} from '../models/Product'
import { withTTL } from '~~/utils/api'
import { fetchProducts as apiFetchProducts, fetchProductBySlug } from '~~/services/products'


export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        loading: false,
        error: null as string | null,
        lastFetchedAt: null as number | null,
        cacheTTLms: 10 * 60 * 1000,
    }),

    getters: {
        all: (state) => state.products,
        getById: (state) => (id: string) => state.products.find((p) => p.id === id),
    },

    actions: {
        // ------------------------
        // Fetch All
        // ------------------------
        invalidate() {
            this.lastFetchedAt = null
            this.products = []
        },

        async fetchProducts(q?: string) {
            if (withTTL(this.products, this.lastFetchedAt, this.cacheTTLms) && !q) return
            this.loading = true
            this.error = null
            try {
                const data: Product[] = await apiFetchProducts({ q })
                this.products = data
                this.lastFetchedAt = Date.now()
            } catch (err: any) {
                this.error = err?.statusMessage || err?.message || 'Error al obtener los productos'
            } finally {
                this.loading = false
            }
        },

        // ------------------------
        // Fetch Single
        // ------------------------
        async fetchProduct(id: string) {
            this.loading = true
            this.error = null
            try {
                const API_BASE = useRuntimeConfig().public.apiBase
                const res = await fetch(`${API_BASE}/products/${id}`)
                if (!res.ok) throw new Error('Error al obtener el producto')
                const data: Product = await res.json()
                return data
            } catch (err: any) {
                this.error = err.message ?? 'Error al obtener el producto'
                return null
            } finally {
                this.loading = false
            }
        },

        async fetchProductBySlug(slug: string) {
            this.loading = true
            this.error = null
            try {
                const item = await fetchProductBySlug(slug)
                const exists = (this.products as any[]).find(p => (p as any).slug === slug)
                if (!exists) this.products.push(item)
                return item
            } catch (err: any) {
                this.error = err?.statusMessage || err?.message || 'Error al obtener el producto'
                return null
            } finally {
                this.loading = false
            }
        },

        // ------------------------
        // Create
        // ------------------------
        async addProduct(product: Product) {
            this.loading = true
            this.error = null
            try {
                const API_BASE = useRuntimeConfig().public.apiBase
                const res = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product),
                })
                if (!res.ok) throw new Error('Error al crear producto')
                const data: Product = await res.json()
                this.products.push(data)
                return data
            } catch (err: any) {
                this.error = err.message ?? 'Error al crear producto'
                return null
            } finally {
                this.loading = false
            }
        },

        // ------------------------
        // Update
        // ------------------------
        async updateProduct(id: string, updates: Partial<Product>) {
            this.loading = true
            this.error = null
            try {
                const API_BASE = useRuntimeConfig().public.apiBase
                const res = await fetch(`${API_BASE}/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                })
                if (!res.ok) throw new Error('Error al actualizar producto')
                const data: Product = await res.json()

                const index = this.products.findIndex((p) => p.id === id)
                if (index !== -1) this.products[index] = data

                return data
            } catch (err: any) {
                this.error = err.message ?? 'Error al actualizar producto'
                return null
            } finally {
                this.loading = false
            }
        },

        // ------------------------
        // Delete
        // ------------------------
        async deleteProduct(id: string) {
            this.loading = true
            this.error = null
            try {
                const API_BASE = useRuntimeConfig().public.apiBase
                const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
                if (!res.ok) throw new Error('Error al eliminar producto')
                this.products = this.products.filter((p) => p.id !== id)
                return true
            } catch (err: any) {
                this.error = err.message ?? 'Error al eliminar producto'
                return false
            } finally {
                this.loading = false
            }
        },
    },
})
