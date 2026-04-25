import type { Faq } from '~~/models/Faq'
import { apiFetch } from '~~/utils/api'
import { mockFaqs } from '~~/utils/mockData'

type FaqsListResponse = { data: Faq[] } | Faq[]
type FaqItemResponse = { data: Faq } | Faq

function unwrapList(res: FaqsListResponse): Faq[] {
  return Array.isArray(res) ? res : res.data
}

function unwrapOne(res: FaqItemResponse): Faq {
  return (res as any).data || (res as any)
}

export async function fetchFaqs(params: { q?: string } = {}) {
  try {
    const res = await apiFetch<FaqsListResponse>('/faqs', { query: params.q ? { q: params.q } : undefined })
    return unwrapList(res)
  } catch (e) {
    let list: any[] = mockFaqs
    if (params.q) {
      const q = params.q.toLowerCase()
      list = list.filter(f =>
        (f.question || '').toLowerCase().includes(q) ||
        (f.answer || '').toLowerCase().includes(q)
      )
    }
    return list as Faq[]
  }
}

export async function fetchFaqById(id: string) {
  try {
    const res = await apiFetch<FaqItemResponse>(`/faqs/${id}`)
    return unwrapOne(res)
  } catch (e) {
    const found = mockFaqs.find(f => f.id === id)
    if (!found) throw e
    return found as Faq
  }
}
