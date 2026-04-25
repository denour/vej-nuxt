import type { Species } from '~~/models/Species'
import { apiFetch } from '~~/utils/api'
import { mockSpecies } from '~~/utils/mockData'

type SpeciesListResponse = { data: Species[] } | Species[]
type SpeciesItemResponse = { data: Species } | Species

function unwrapList(res: SpeciesListResponse): Species[] {
  return Array.isArray(res) ? res : res.data
}

function unwrapOne(res: SpeciesItemResponse): Species {
  return (res as any).data || (res as any)
}

export async function fetchSpecies(params: { q?: string } = {}) {
  try {
    const res = await apiFetch<SpeciesListResponse>('/species', { query: params.q ? { q: params.q } : undefined })
    return unwrapList(res)
  } catch (e) {
    // Fallback to mock data when backend isn't reachable
    let list = mockSpecies
    if (params.q) {
      const q = params.q.toLowerCase()
      list = list.filter(s =>
        (s.commonName || '').toLowerCase().includes(q) ||
        (s.scientificName || '').toLowerCase().includes(q) ||
        (s.family || '').toLowerCase().includes(q)
      )
    }
    return list
  }
}

export async function fetchSpeciesBySlug(slug: string) {
  try {
    const res = await apiFetch<SpeciesItemResponse>(`/species/${slug}`)
    return unwrapOne(res)
  } catch (e) {
    const found = mockSpecies.find(s => (s as any).slug === slug)
    if (!found) throw e
    return found
  }
}
