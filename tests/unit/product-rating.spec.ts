// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProductCard from '~/components/shop/ProductCard.vue'
import ProductListItem from '~/components/shop/ProductListItem.vue'

const baseProps = {
  image: '/plant.jpg',
  name: 'Monstera deliciosa',
  scientificName: 'Monstera deliciosa',
  price: 450,
  inStock: true,
}

describe('ProductCard', () => {
  it('does not render a rating/reviews block when none is given (no invented reviews)', async () => {
    const wrapper = await mountSuspended(ProductCard, { props: baseProps as any })
    expect(wrapper.find('div.flex.items-center.gap-1.mb-4').exists()).toBe(false)
  })
})

describe('ProductListItem', () => {
  it('does not render a rating/reviews block when none is given (no invented reviews)', async () => {
    const wrapper = await mountSuspended(ProductListItem, { props: baseProps as any })
    expect(wrapper.find('div.flex.items-center.gap-1.mb-4').exists()).toBe(false)
  })
})
