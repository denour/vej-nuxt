// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LayoutFooter from '~/components/layout/LayoutFooter.vue'

describe('LayoutFooter links', () => {
  it('has no placeholder href="#" links (social icons must link somewhere real)', async () => {
    const wrapper = await mountSuspended(LayoutFooter)
    const placeholders = wrapper.findAll('a[href="#"]')
    expect(placeholders).toHaveLength(0)
  })

  it('points "Privacidad" to the real /aviso-de-privacidad route, not "/"', async () => {
    const wrapper = await mountSuspended(LayoutFooter)
    const link = wrapper.findAll('a').find(a => a.text() === 'Privacidad')
    expect(link?.attributes('href')).toBe('/aviso-de-privacidad')
  })

  it('points "Términos" to the real /terminos route, not "/"', async () => {
    const wrapper = await mountSuspended(LayoutFooter)
    const link = wrapper.findAll('a').find(a => a.text() === 'Términos')
    expect(link?.attributes('href')).toBe('/terminos')
  })
})
