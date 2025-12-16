import type { H3Event } from 'h3'

type Provider = 'recaptcha' | 'hcaptcha'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ token?: string; provider?: Provider }>(event)
  const token = body?.token
  const provider = body?.provider || (useRuntimeConfig().public.captchaProvider as Provider)

  if (!token) {
    return { success: false, error: 'missing-token' }
  }

  const config = useRuntimeConfig()

  try {
    if (provider === 'hcaptcha') {
      const secret = config.hcaptchaSecret
      if (!secret) return { success: false, error: 'missing-secret' }
      const resp = await $fetch<any>('https://hcaptcha.com/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret, response: token }).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return { success: !!resp?.success }
    }

    // Default to Google reCAPTCHA
    const secret = config.recaptchaSecret
    if (!secret) return { success: false, error: 'missing-secret' }
    const resp = await $fetch<any>('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return { success: !!resp?.success }
  } catch (e) {
    return { success: false, error: 'verify-failed' }
  }
})
