import type { Product } from '~~/models/Product'
import { apiFetch } from '~~/utils/api'

type ProductsListResponse = { data: Product[] } | Product[]
type ProductResponse = { data: Product } | Product

function unwrapList(res: ProductsListResponse): Product[] {
  return Array.isArray(res) ? res : res.data
}

function unwrapOne(res: ProductResponse): Product {
  return (res as any).data || (res as any)
}

export async function fetchProducts(params: { q?: string } = {}) {
  const res = await apiFetch<ProductsListResponse>('/products', { query: params.q ? { q: params.q } : undefined })
  return unwrapList(res)
}

export async function fetchProductBySlug(slug: string) {
  const res = await apiFetch<ProductResponse>(`/products/${slug}`)
  return unwrapOne(res)
}
