// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt',
  ],
  runtimeConfig: {
    // Private keys only available server-side
    recaptchaSecret: process.env.RECAPTCHA_SECRET,
    hcaptchaSecret: process.env.HCAPTCHA_SECRET,
    public: {
      // Base URL for Laravel API (can include /api/v1)
      apiBase: process.env.API_BASE || 'http://localhost/api/v1',
      // Optional contact endpoint path (relative to apiBase)
      contactEndpoint: process.env.CONTACT_ENDPOINT || '/contact',
      // Captcha provider and site key (client-side)
      captchaProvider: process.env.CAPTCHA_PROVIDER || 'recaptcha',
      captchaSiteKey: process.env.CAPTCHA_SITE_KEY || '',
      // Client-side periodic cache invalidation for Pinia stores (ms)
      cacheInvalidateMs: Number(process.env.CACHE_INVALIDATE_MS || 0) // 0 disables
    }
  }
})
