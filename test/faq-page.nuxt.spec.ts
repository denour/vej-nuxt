import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FaqPage from '~/pages/faq.vue'
import { useFaqStore } from '~~/stores/Faq'

const fetchFaqsMock = vi.fn()

vi.mock('~~/services/faqs', () => ({
  fetchFaqs: (...args: unknown[]) => fetchFaqsMock(...args),
  fetchFaqById: vi.fn(),
}))

const categoryChips = ['Pedidos', 'Envíos', 'Pagos', 'Plantas']

beforeEach(() => {
  fetchFaqsMock.mockReset()
  useFaqStore().$reset()
})

describe('faq page — sin preguntas', () => {
  it('does not render the category chips when the API returns no faqs', async () => {
    fetchFaqsMock.mockResolvedValue([])

    const wrapper = await mountSuspended(FaqPage)
    await new Promise(process.nextTick)

    for (const chip of categoryChips) {
      expect(wrapper.text()).not.toContain(chip)
    }
  })

  it('still shows the empty state and the /contact CTA when the API returns no faqs', async () => {
    fetchFaqsMock.mockResolvedValue([])

    const wrapper = await mountSuspended(FaqPage)
    await new Promise(process.nextTick)

    expect(wrapper.text()).toContain('Sin respuesta')
    expect(wrapper.text()).toContain('aún')
    expect(wrapper.find('a[href="/contact"]').exists()).toBe(true)
  })
})

describe('faq page — con preguntas', () => {
  it('renders the category chips when the API returns at least one faq', async () => {
    fetchFaqsMock.mockResolvedValue([
      {
        id: '1',
        category: 'Pedidos',
        question: '¿Cómo hago un pedido?',
        answer: 'Desde el catálogo, agrega al carrito y checa out.',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ])

    const wrapper = await mountSuspended(FaqPage)
    await new Promise(process.nextTick)

    expect(wrapper.text()).toContain('Pedidos')
  })
})
