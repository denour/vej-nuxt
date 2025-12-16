import type { Faq } from '~~/models/Faq'
import { apiFetch } from '~~/utils/api'

type FaqsListResponse = { data: Faq[] } | Faq[]
type FaqItemResponse = { data: Faq } | Faq

function unwrapList(res: FaqsListResponse): Faq[] {
  return Array.isArray(res) ? res : res.data
}

function unwrapOne(res: FaqItemResponse): Faq {
  return (res as any).data || (res as any)
}

export async function fetchFaqs(params: { q?: string } = {}) {
  const res = await apiFetch<FaqsListResponse>('/faqs', { query: params.q ? { q: params.q } : undefined })
  return unwrapList(res)
}

export async function fetchFaqById(id: string) {
  const res = await apiFetch<FaqItemResponse>(`/faqs/${id}`)
  return unwrapOne(res)
}
