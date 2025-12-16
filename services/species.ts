import type { Species } from '~~/models/Species'
import { apiFetch } from '~~/utils/api'

type SpeciesListResponse = { data: Species[] } | Species[]
type SpeciesItemResponse = { data: Species } | Species

function unwrapList(res: SpeciesListResponse): Species[] {
  return Array.isArray(res) ? res : res.data
}

function unwrapOne(res: SpeciesItemResponse): Species {
  return (res as any).data || (res as any)
}

export async function fetchSpecies(params: { q?: string } = {}) {
  const res = await apiFetch<SpeciesListResponse>('/species', { query: params.q ? { q: params.q } : undefined })
  return unwrapList(res)
}

export async function fetchSpeciesBySlug(slug: string) {
  const res = await apiFetch<SpeciesItemResponse>(`/species/${slug}`)
  return unwrapOne(res)
}
