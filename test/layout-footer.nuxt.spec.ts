import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LayoutFooter from '~/components/layout/LayoutFooter.vue'

describe('LayoutFooter — datos de contacto', () => {
  it('renders a tel: link and a wa.me link for +52 668 608 8669', async () => {
    const wrapper = await mountSuspended(LayoutFooter)

    expect(wrapper.find('a[href="tel:+526686088669"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://wa.me/526686088669"]').exists()).toBe(true)
  })
})
