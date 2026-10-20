import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { BlogPost } from '~~/models/BlogPost'
import { usePostsStore } from '~~/stores/BlogPost'

const fetchPostsMock = vi.fn()

vi.mock('~~/services/posts', () => ({
  fetchPosts: (...args: unknown[]) => fetchPostsMock(...args),
  fetchPostBySlug: vi.fn(),
}))

const ALL_POSTS = Array.from({ length: 9 }, (_, i) => ({
  id: String(i),
  slug: `post-${i}`,
  title: `Post ${i}`,
})) as BlogPost[]

describe('posts store — limpiar la búsqueda (THE-417)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchPostsMock.mockReset()
    fetchPostsMock.mockImplementation(async ({ q }: { q?: string }) => (q ? [] : ALL_POSTS))
  })

  it('refetches without q after a zero-result search, instead of keeping the cached empty list', async () => {
    const store = usePostsStore()

    await store.fetchPosts({ q: 'qa-no-existe-383' })
    expect(store.posts).toHaveLength(0)

    await store.fetchPosts({ q: '' })

    expect(fetchPostsMock).toHaveBeenCalledTimes(2)
    expect(store.posts).toHaveLength(9)
  })

  it('does not refetch when clearing an already-empty query within the TTL (no-op boundary)', async () => {
    const store = usePostsStore()

    await store.fetchPosts({ q: '' })
    expect(fetchPostsMock).toHaveBeenCalledTimes(1)

    await store.fetchPosts({ q: '' })

    expect(fetchPostsMock).toHaveBeenCalledTimes(1)
  })
})
