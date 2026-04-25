import type { BlogPost } from '~~/models/BlogPost'
import { apiFetch } from '~~/utils/api'
import { calculateReadingTime } from '~~/utils/readingTime'
import { mockPosts } from '~~/utils/mockData'

type PostsListResponse = { data: BlogPost[] } | BlogPost[]
type PostResponse = { data: BlogPost } | BlogPost

function unwrapList(res: PostsListResponse): BlogPost[] {
  const list = Array.isArray(res) ? res : res.data
  return list.map(augmentPost)
}

function unwrapOne(res: PostResponse): BlogPost {
  const post = Array.isArray(res as any) ? (res as any)[0] : (res as any).data || (res as any)
  return augmentPost(post as BlogPost)
}

function augmentPost(p: BlogPost): BlogPost {
  const textBase = [p.excerpt, Array.isArray(p.content) ? JSON.stringify(p.content) : '']
    .filter(Boolean)
    .join(' ')
  const minutes = Math.max(1, calculateReadingTime(textBase))
  return {
    ...p,
    readTime: `${minutes} min`,
    readingTime: minutes,
  }
}

export async function fetchPosts(params: { page?: number; perPage?: number; q?: string; category?: string } = {}) {
  const query: any = {}
  if (params.page) query.page = params.page
  if (params.perPage) query.per_page = params.perPage
  if (params.q) query.q = params.q
  if (params.category) query.category = params.category
  try {
    const res = await apiFetch<PostsListResponse>('/posts', { query })
    return unwrapList(res)
  } catch (e) {
    // Fallback to mock data when backend isn't reachable
    let posts = mockPosts.map(augmentPost)
    if (params.q) {
      const q = params.q.toLowerCase()
      posts = posts.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q)
      )
    }
    if (params.category) {
      posts = posts.filter(p => (p as any).category === params.category)
    }
    return posts
  }
}

export async function fetchPostBySlug(slug: string) {
  try {
    const res = await apiFetch<PostResponse>(`/posts/${slug}`)
    return unwrapOne(res)
  } catch (e) {
    const found = mockPosts.find(p => (p as any).slug === slug)
    if (!found) throw e
    return augmentPost(found as BlogPost)
  }
}
