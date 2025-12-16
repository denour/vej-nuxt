import { apiFetch } from '~~/utils/api'

export async function subscribeNewsletter(email: string, captchaToken: string) {
  // Verify captcha in Nuxt server first
  const verify = await $fetch<{ success: boolean; error?: string }>('/api/captcha/verify', {
    method: 'POST',
    body: { token: captchaToken },
  })
  if (!verify.success) {
    throw createError({ statusCode: 400, statusMessage: 'Captcha inválido' })
  }

  // Then call Laravel Newsletter endpoint
  return await apiFetch('/newsletter/subscribe', {
    method: 'POST',
    body: { email },
  })
}
