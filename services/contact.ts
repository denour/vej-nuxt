import { apiFetch } from '~~/utils/api'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  website?: string
}

export async function submitContact(payload: ContactPayload, captchaToken = '') {
  if (payload.website) return { ok: true }

  const config = useRuntimeConfig()

  if (config.public.captchaSiteKey) {
    const verify = await $fetch<{ success: boolean; error?: string }>('/api/captcha/verify', {
      method: 'POST',
      body: { token: captchaToken, provider: 'turnstile' },
    })
    if (!verify.success) {
      throw createError({ statusCode: 400, statusMessage: 'No pudimos completar la verificación de seguridad' })
    }
  }

  const endpoint = config.public.contactEndpoint || '/contact'
  return await apiFetch(endpoint, {
    method: 'POST',
    body: {
      full_name: payload.name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      website: payload.website,
    },
  })
}
