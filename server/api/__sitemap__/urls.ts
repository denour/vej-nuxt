import { defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }> = []

  try {
    // Fetch posts
    const postsRes = await $fetch<{ data: Array<{ slug: string; updated_at: string }> }>(`${apiBase}/posts?per_page=100`)
    if (postsRes?.data) {
      for (const post of postsRes.data) {
        urls.push({
          loc: `/blog/${post.slug}`,
          lastmod: post.updated_at,
          changefreq: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch (e) {
    console.warn('Failed to fetch posts for sitemap:', e)
  }

  try {
    // Fetch species
    const speciesRes = await $fetch<{ data: Array<{ id: string; updated_at: string }> }>(`${apiBase}/species?per_page=100`)
    if (speciesRes?.data) {
      for (const species of speciesRes.data) {
        urls.push({
          loc: `/species/${species.id}`,
          lastmod: species.updated_at,
          changefreq: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch (e) {
    console.warn('Failed to fetch species for sitemap:', e)
  }

  try {
    // Fetch products
    const productsRes = await $fetch<{ data: Array<{ id: string; updated_at: string }> }>(`${apiBase}/products?per_page=100`)
    if (productsRes?.data) {
      for (const product of productsRes.data) {
        urls.push({
          loc: `/store/${product.id}`,
          lastmod: product.updated_at,
          changefreq: 'daily',
          priority: 0.9,
        })
      }
    }
  } catch (e) {
    console.warn('Failed to fetch products for sitemap:', e)
  }

  return urls
})
