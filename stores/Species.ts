import { defineStore } from 'pinia'
import type { Species } from '../models/Species'
import { fetchSpecies as apiFetchSpecies, fetchSpeciesBySlug } from '~~/services/species'
import { withTTL } from '~~/utils/api'

type State = {
  species: Species[]
  loading: boolean
  error: string | null
  lastFetchedAt: number | null
  cacheTTLms: number
}

export const useSpeciesStore = defineStore('species', {
  state: (): State => ({
    species: [],
    loading: false,
    error: null,
    lastFetchedAt: null,
    cacheTTLms: 10 * 60 * 1000, // 10 minutes
  }),

  getters: {
    all: (state) => state.species,
    getById: (state) => (id: string) => state.species.find((s) => s.id === id),
  },

  actions: {
    invalidate() {
      this.lastFetchedAt = null
      this.species = []
    },

    async fetchSpecies(q?: string) {
      if (withTTL(this.species, this.lastFetchedAt, this.cacheTTLms) && !q) return
      this.loading = true
      this.error = null
      try {
        const data = await apiFetchSpecies({ q })
        this.species = data
        this.lastFetchedAt = Date.now()
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al obtener especies'
      } finally {
        this.loading = false
      }
    },

    async fetchBySlug(slug: string) {
      this.loading = true
      this.error = null
      try {
        const item = await fetchSpeciesBySlug(slug)
        const exists = this.species.find((s) => (s as any).slug === slug)
        if (!exists) this.species.push(item)
        return item
      } catch (err: any) {
        this.error = err?.statusMessage || err?.message || 'Error al obtener la especie'
        return null
      } finally {
        this.loading = false
      }
    },
  },
})
