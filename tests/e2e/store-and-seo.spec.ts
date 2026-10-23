import { createServer } from 'node:http'
import { afterAll, describe, expect, it } from 'vitest'
import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e'

const REQUEST_TIMEOUT = 60_000

function startMockApiServer(): Promise<{ url: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      res.setHeader('content-type', 'application/json')
      const body = req.url?.includes('/products')
        ? { data: [{ id: 'test-product-1', updated_at: '2026-01-01T00:00:00Z' }] }
        : { data: [] }
      res.end(JSON.stringify(body))
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number }
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise(res => server.close(() => res())),
      })
    })
  })
}

const mockApi = await startMockApiServer()
afterAll(() => mockApi.close())

describe('store visibility & technical SEO (e2e)', async () => {
  await setup({
    dev: true,
    setupTimeout: 180_000,
    serverStartTimeout: 180_000,
    env: { API_BASE: mockApi.url },
  })

  it('GET /store does not return an indexable 200 — it 404s or redirects home', async () => {
    const res = await fetch('/store', { redirect: 'manual' })
    const location = res.headers.get('location')
    const redirectsHome = location ? new URL(location, res.url).pathname === '/' : false
    const isHidden = res.status === 404 || redirectsHome

    expect(isHidden, `expected /store to 404 or redirect home, got status ${res.status} location ${location}`).toBe(true)
  }, REQUEST_TIMEOUT)

  it('GET /tips redirects (301) to /blog', async () => {
    const res = await fetch('/tips', { redirect: 'manual' })
    const location = res.headers.get('location')
    const pathname = location ? new URL(location, res.url).pathname : ''

    expect(res.status).toBe(301)
    expect(pathname).toBe('/blog')
  }, REQUEST_TIMEOUT)

  it('sitemap dynamic urls source excludes /store/* even when products exist upstream', async () => {
    const urls = await $fetch<Array<{ loc: string }>>('/api/__sitemap__/urls')

    expect(urls.some(entry => entry.loc.startsWith('/store'))).toBe(false)
  }, REQUEST_TIMEOUT)

  it('canonical link on /blog points to its own route, not the homepage', async () => {
    const html = await $fetch('/blog', { responseType: 'text' }) as string
    const href = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''

    expect(new URL(href).pathname).toBe('/blog')
  }, REQUEST_TIMEOUT)

  it('title on /contact has no duplicated "Vida en el Jardín" suffix', async () => {
    const html = await $fetch('/contact', { responseType: 'text' }) as string
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''

    expect((title.match(/jard[ií]n/gi) || []).length).toBe(1)
  }, REQUEST_TIMEOUT)

  it('title on /blog has no duplicated "Vida en el Jardín" suffix', async () => {
    const html = await $fetch('/blog', { responseType: 'text' }) as string
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''

    expect((title.match(/jard[ií]n/gi) || []).length).toBe(1)
  }, REQUEST_TIMEOUT)
})
