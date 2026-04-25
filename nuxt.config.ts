// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  app: {
    head: {
      title: 'Vida En el Jardín',
      titleTemplate: '%s | Vida En el Jardín',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Tu guía completa de plantas y jardinería. Consejos de cuidado, especies y tienda online.' },
        { name: 'theme-color', content: '#22c55e' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Vida En el Jardín' },
        { property: 'og:locale', content: 'es_MX' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: process.env.SITE_URL || 'https://vidaeneljardin.com' },
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxt/fonts',
    '@vueuse/motion/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [300, 400, 500, 600, 700, 900], styles: ['normal', 'italic'] },
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700] },
    ],
  },

  // Sitemap configuration
  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ],
  },

  // Image optimization
  image: {
    quality: 80,
    formats: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // For Vercel deployment
    provider: 'vercel',
  },

  // SEO defaults
  site: {
    url: process.env.SITE_URL || 'https://vidaeneljardin.com',
    name: 'Vida En el Jardín',
    description: 'Tu guía completa de plantas y jardinería',
    defaultLocale: 'es',
  },

  runtimeConfig: {
    // Private keys only available server-side
    recaptchaSecret: process.env.RECAPTCHA_SECRET,
    hcaptchaSecret: process.env.HCAPTCHA_SECRET,
    public: {
      // Site URL for SEO
      siteUrl: process.env.SITE_URL || 'https://vidaeneljardin.com',
      // Base URL for Laravel API (can include /api/v1)
      apiBase: process.env.API_BASE || 'http://localhost/api/v1',
      // Base URL for serving files from Laravel (e.g. /storage)
      storageBase: process.env.STORAGE_BASE || 'http://localhost',
      // Optional contact endpoint path (relative to apiBase)
      contactEndpoint: process.env.CONTACT_ENDPOINT || '/contact',
      // Captcha provider and site key (client-side)
      captchaProvider: process.env.CAPTCHA_PROVIDER || 'recaptcha',
      captchaSiteKey: process.env.CAPTCHA_SITE_KEY || '',
      // Client-side periodic cache invalidation for Pinia stores (ms)
      cacheInvalidateMs: Number(process.env.CACHE_INVALIDATE_MS || 0)
    }
  },

  // Nitro configuration for sitemap dynamic routes
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml'],
    },
  },

  // Route rules for caching
  routeRules: {
    '/api/**': { cache: { maxAge: 60 } },
    '/blog/**': { swr: 3600 },
    '/species/**': { swr: 3600 },
  },
})
