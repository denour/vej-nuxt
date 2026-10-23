import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PostHeader from '~/components/blog/PostHeader.vue'

const baseProps = {
  id: 'p-1',
  title: "Monstera: cuidados y trucos",
  slug: 'monstera-anatomia-rebelde',
  excerpt: 'Guía rápida',
  content: [],
  category: 'Especies',
  tags: [],
  author: { name: 'Ana M.' },
  list: [],
  status: 'published' as const,
}

const expectedUrl = 'https://vidaeneljardin.com/blog/monstera-anatomia-rebelde'
const encodedUrl = encodeURIComponent(expectedUrl)

describe('PostHeader — botones de compartir', () => {
  it('renders the Facebook share button as a link with a real href to Facebook and the encoded post URL', async () => {
    const wrapper = await mountSuspended(PostHeader, { props: baseProps })

    const facebookLink = wrapper.find('a[aria-label="Compartir en Facebook"]')
    expect(facebookLink.exists()).toBe(true)
    expect(facebookLink.attributes('href')).toContain('facebook.com')
    expect(facebookLink.attributes('href')).toContain(encodedUrl)
    expect(facebookLink.attributes('target')).toBe('_blank')
    expect(facebookLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders the Twitter share button as a link with a real href to Twitter, the encoded post URL and title', async () => {
    const wrapper = await mountSuspended(PostHeader, { props: baseProps })

    const twitterLink = wrapper.find('a[aria-label="Compartir en Twitter"]')
    expect(twitterLink.exists()).toBe(true)
    expect(twitterLink.attributes('href')).toContain('twitter.com')
    expect(twitterLink.attributes('href')).toContain(encodedUrl)
    expect(twitterLink.attributes('href')).toContain(encodeURIComponent(baseProps.title))
    expect(twitterLink.attributes('target')).toBe('_blank')
    expect(twitterLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('renders the LinkedIn share button as a link with a real href to LinkedIn and the encoded post URL', async () => {
    const wrapper = await mountSuspended(PostHeader, { props: baseProps })

    const linkedinLink = wrapper.find('a[aria-label="Compartir en LinkedIn"]')
    expect(linkedinLink.exists()).toBe(true)
    expect(linkedinLink.attributes('href')).toContain('linkedin.com')
    expect(linkedinLink.attributes('href')).toContain(encodedUrl)
    expect(linkedinLink.attributes('target')).toBe('_blank')
    expect(linkedinLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('does not leave any of the three share actions as a bare, non-functional button', async () => {
    const wrapper = await mountSuspended(PostHeader, { props: baseProps })

    const shareLinks = wrapper.findAll(
      'a[aria-label="Compartir en Facebook"], a[aria-label="Compartir en Twitter"], a[aria-label="Compartir en LinkedIn"]'
    )
    expect(shareLinks).toHaveLength(3)
  })

  it('still produces a valid Twitter share href when the title contains characters that must be escaped', async () => {
    const wrapper = await mountSuspended(PostHeader, {
      props: { ...baseProps, title: "Riego & fertilización: ¿cuándo?" },
    })

    const twitterLink = wrapper.find('a[aria-label="Compartir en Twitter"]')
    expect(twitterLink.exists()).toBe(true)
    expect(twitterLink.attributes('href')).toContain(
      encodeURIComponent("Riego & fertilización: ¿cuándo?")
    )
    expect(twitterLink.attributes('href')).not.toContain('¿')
  })
})
