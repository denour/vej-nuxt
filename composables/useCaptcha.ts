export function useCaptcha() {
  const config = useRuntimeConfig()
  const provider = (config.public.captchaProvider as 'recaptcha' | 'hcaptcha') || 'recaptcha'
  const siteKey = config.public.captchaSiteKey

  async function getToken(action = 'submit') {
    if (!siteKey) return ''

    if (provider === 'hcaptcha') {
      const h = (globalThis as any).hcaptcha
      if (!h || !h.execute) return ''
      try {
        const token = await h.execute(siteKey, { action })
        return token as string
      } catch {
        return ''
      }
    }

    // Default Google reCAPTCHA v3
    const grecaptcha = (globalThis as any).grecaptcha
    if (!grecaptcha || !grecaptcha.execute) return ''
    try {
      const token = await grecaptcha.execute(siteKey, { action })
      return token as string
    } catch {
      return ''
    }
  }

  return { getToken, provider, siteKey }
}
