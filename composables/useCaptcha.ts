export function useCaptcha() {
  const config = useRuntimeConfig()
  const siteKey = config.public.captchaSiteKey
  const token = ref('')
  const widgetId = ref<string | undefined>()

  function render(container: HTMLElement) {
    if (!siteKey) return ''

    const turnstile = (globalThis as any).turnstile
    if (!turnstile?.render || widgetId.value !== undefined) return ''

    try {
      widgetId.value = turnstile.render(container, {
        sitekey: siteKey,
        callback: (response: string) => { token.value = response },
        'expired-callback': () => { token.value = '' },
        'error-callback': () => { token.value = '' },
      })
      return widgetId.value
    } catch {
      return ''
    }
  }

  async function getToken(_action = 'submit') {
    if (!siteKey) return ''

    const turnstile = (globalThis as any).turnstile
    return token.value || turnstile?.getResponse?.(widgetId.value) || ''
  }

  function reset() {
    token.value = ''
    const turnstile = (globalThis as any).turnstile
    if (widgetId.value !== undefined) turnstile?.reset?.(widgetId.value)
  }

  return { enabled: Boolean(siteKey), getToken, render, reset, siteKey }
}
