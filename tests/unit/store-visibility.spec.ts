// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Navigation from '~/components/layout/Navigation.vue'
import LayoutFooter from '~/components/layout/LayoutFooter.vue'

function storeLinks(html: string): string[] {
  return [...html.matchAll(/href="([^"]*)"/g)]
    .map(m => m[1])
    .filter(href => href === '/store' || href.startsWith('/store/'))
}

describe('store visibility flag', () => {
  it('exposes a reactivable STORE_ENABLED flag that defaults to false', () => {
    const config = useRuntimeConfig()
    expect(config.public.storeEnabled).toBe(false)
  })

  it('Navigation renders no /store link when the flag is false (zero links)', async () => {
    const wrapper = await mountSuspended(Navigation)
    expect(storeLinks(wrapper.html())).toHaveLength(0)
  })

  it('LayoutFooter renders no /store link when the flag is false (zero links)', async () => {
    const wrapper = await mountSuspended(LayoutFooter)
    expect(storeLinks(wrapper.html())).toHaveLength(0)
  })
})
