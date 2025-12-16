import { apiFetch } from '~~/utils/api'

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function submitContact(payload: ContactPayload, captchaToken: string) {
  const verify = await $fetch<{ success: boolean; error?: string }>('/api/captcha/verify', {
    method: 'POST',
    body: { token: captchaToken },
  })
  if (!verify.success) {
    throw createError({ statusCode: 400, statusMessage: 'Captcha inválido' })
  }

  const config = useRuntimeConfig()
  const endpoint = config.public.contactEndpoint || '/contact'
  return await apiFetch(endpoint, {
    method: 'POST',
    body: payload,
  })
}
