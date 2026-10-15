import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ContactPage from '~/pages/contact.vue'

const submitContactMock = vi.fn()

vi.mock('~~/services/contact', () => ({
  submitContact: (...args: unknown[]) => submitContactMock(...args),
}))

async function fillAndSubmit(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  const textInputs = wrapper.findAll('input[type="text"]')
  await textInputs[0].setValue('Ana Pérez')
  await wrapper.find('input[type="email"]').setValue('ana@example.com')
  await textInputs[1].setValue('Pregunta sobre monstera')
  await wrapper.find('textarea').setValue('¿Cómo cuido mi monstera?')
  await wrapper.find('form').trigger('submit')
}

describe('contact page — envío real', () => {
  beforeEach(() => {
    submitContactMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls submitContact with the form payload instead of faking success with a timeout', async () => {
    submitContactMock.mockResolvedValue({ ok: true })

    const wrapper = await mountSuspended(ContactPage)
    await fillAndSubmit(wrapper)
    await new Promise(process.nextTick)

    expect(submitContactMock).toHaveBeenCalledTimes(1)
    expect(submitContactMock.mock.calls[0][0]).toMatchObject({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      subject: 'Pregunta sobre monstera',
      message: '¿Cómo cuido mi monstera?',
    })
  })

  it('does not mark the message as sent, and shows the real error, when the backend call fails', async () => {
    submitContactMock.mockRejectedValue(new Error('No pudimos enviar tu mensaje, intenta de nuevo'))

    const wrapper = await mountSuspended(ContactPage)
    await fillAndSubmit(wrapper)
    await new Promise(process.nextTick)
    await new Promise(process.nextTick)

    expect(submitContactMock).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).not.toContain('Recibido')
    expect(wrapper.text()).toContain('No pudimos enviar tu mensaje, intenta de nuevo')
  })
})

describe('contact page — datos de contacto', () => {
  it('renders the correct contact email, not the old one', async () => {
    const wrapper = await mountSuspended(ContactPage)

    expect(wrapper.find('a[href="mailto:contacto@vidaeneljardin.com"]').exists()).toBe(true)
    expect(wrapper.find('a[href="mailto:hola@vidaeneljardin.com"]').exists()).toBe(false)
  })

  it('renders a tel: link and a wa.me link for +52 668 608 8669', async () => {
    const wrapper = await mountSuspended(ContactPage)

    expect(wrapper.find('a[href="tel:+526686088669"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://wa.me/526686088669"]').exists()).toBe(true)
  })

  it('renders the Tijuana, B.C. address and not Coyoacán / CDMX', async () => {
    const wrapper = await mountSuspended(ContactPage)

    expect(wrapper.text()).toContain('Tijuana, B.C.')
    expect(wrapper.text()).not.toContain('Coyoacán')
    expect(wrapper.text()).not.toContain('CDMX')
  })
})
