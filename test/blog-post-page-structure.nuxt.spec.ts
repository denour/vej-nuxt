import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import BlogPostPage from '~/pages/blog/[slug].vue'

const slug = 'el-arte-de-regar-sin-matar'

const fetchPostBySlugMock = vi.fn()

vi.mock('~~/services/posts', () => ({
  fetchPostBySlug: (...args: unknown[]) => fetchPostBySlugMock(...args),
  fetchPosts: vi.fn().mockResolvedValue([]),
}))

mockNuxtImport('useRoute', () => () => ({ params: { slug } }))

const post = {
  id: 'p-1',
  title: 'El arte de regar sin matar',
  slug,
  excerpt: 'Por qué la mitad de tus plantas mueren ahogadas, no de sed.',
  content: [
    { type: 'heading', data: { id: 'seccion-1', text: 'Cómo leer el sustrato' } },
    { type: 'paragraph', data: { text: 'Mete el dedo antes de regar.' } },
  ],
  category: 'Cuidados',
  tags: [],
  author: { name: 'Ana M.' },
  list: [{ id: 'seccion-1', text: 'Cómo leer el sustrato' }],
  status: 'published' as const,
  publishedAt: '2026-04-12',
}

describe('/blog/[slug] — estructura semántica', () => {
  it('wraps the post content in a single <main>', async () => {
    fetchPostBySlugMock.mockResolvedValue(post)

    const wrapper = await mountSuspended(BlogPostPage)

    const mains = wrapper.findAll('main')
    expect(mains).toHaveLength(1)
    expect(wrapper.find('main h1').exists()).toBe(true)
  })

  it('does not skip a heading level in the DOM (h1 is never directly followed by h3)', async () => {
    fetchPostBySlugMock.mockResolvedValue(post)

    const wrapper = await mountSuspended(BlogPostPage)

    const headings = wrapper.findAll('h1, h2, h3, h4, h5, h6')
    const levels = headings.map((h) => Number(h.element.tagName.slice(1)))

    expect(levels[0]).toBe(1)

    for (let i = 1; i < levels.length; i++) {
      const jump = levels[i] - levels[i - 1]
      expect(jump).toBeLessThanOrEqual(1)
    }
  })
})
