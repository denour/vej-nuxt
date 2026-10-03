import { defineSitemapEventHandler } from '#imports'

type SitemapUrl = { loc: string; lastmod?: string; changefreq?: string; priority?: number }
type Paginated<T> = { data: T[]; meta?: { current_page: number; last_page: number } }

/**
 * Fetch every page of a paginated API listing. The API caps per_page at 50
 * server-side, so a single large request silently truncates — walk the pages
 * (with a sane ceiling) instead.
 */
async function fetchAllPages<T>(url: string, maxPages = 20): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let lastPage = 1

  do {
    const res = await $fetch<Paginated<T>>(`${url}&page=${page}`)
    if (!res?.data?.length) break
    items.push(...res.data)
    lastPage = res.meta?.last_page ?? page
    page++
  } while (page <= lastPage && page <= maxPages)

  return items
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const urls: SitemapUrl[] = []

  try {
    const posts = await fetchAllPages<{ slug: string; updated_at: string }>(`${apiBase}/posts?per_page=50`)
    for (const post of posts) {
      urls.push({
        loc: `/blog/${post.slug}`,
        lastmod: post.updated_at,
        changefreq: 'weekly',
        priority: 0.8,
      })
    }
  } catch (e) {
    console.warn('Failed to fetch posts for sitemap:', e)
  }

  try {
    const species = await fetchAllPages<{ slug?: string; updated_at: string }>(`${apiBase}/species?per_page=50`)
    for (const s of species) {
      if (!s.slug) continue
      urls.push({
        loc: `/species/${s.slug}`,
        lastmod: s.updated_at,
        changefreq: 'monthly',
        priority: 0.7,
      })
    }
  } catch (e) {
    console.warn('Failed to fetch species for sitemap:', e)
  }

  try {
    const products = await fetchAllPages<{ id: string; updated_at: string }>(`${apiBase}/products?per_page=50`)
    for (const product of products) {
      urls.push({
        loc: `/store/${product.id}`,
        lastmod: product.updated_at,
        changefreq: 'daily',
        priority: 0.9,
      })
    }
  } catch (e) {
    console.warn('Failed to fetch products for sitemap:', e)
  }

  return urls
})
