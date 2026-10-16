<script setup lang="ts">
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-vue-next'
import PageHero from '~/components/common/PageHero.vue'
import { useCaptcha } from '~~/composables/useCaptcha'
import { submitContact } from '~~/services/contact'

useSeoMeta({
  title: 'Contacto — Vida en el Jardín',
  description: 'Escríbenos sobre cuidado de plantas, pedidos especiales o colaboraciones.',
})

const form = ref({ name: '', email: '', subject: '', message: '', website: '' })
const submitting = ref(false)
const success = ref(false)
const errorMessage = ref('')
const captchaContainer = ref<HTMLElement | null>(null)
const { enabled: captchaEnabled, getToken, render: renderCaptcha, reset: resetCaptcha, siteKey } = useCaptcha()

useHead(() => ({
  script: siteKey
    ? [{
        key: 'cloudflare-turnstile',
        src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=vejTurnstileLoaded&render=explicit',
        async: true,
        defer: true,
      }]
    : [],
}))

onMounted(() => {
  if (!captchaEnabled) return

  const mountCaptcha = () => {
    if (captchaContainer.value) renderCaptcha(captchaContainer.value)
  }

  ;(globalThis as any).vejTurnstileLoaded = mountCaptcha
  mountCaptcha()
})

onBeforeUnmount(() => {
  if ((globalThis as any).vejTurnstileLoaded) delete (globalThis as any).vejTurnstileLoaded
})

const messageFromError = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    const responseError = error as {
      data?: { error?: string; message?: string }
      message?: string
      statusMessage?: string
    }

    return responseError.data?.message
      || responseError.data?.error
      || responseError.statusMessage
      || responseError.message
      || 'No pudimos enviar tu mensaje. Intenta de nuevo.'
  }

  return 'No pudimos enviar tu mensaje. Intenta de nuevo.'
}

const submit = async (e: Event) => {
  e.preventDefault()
  if (submitting.value) return

  submitting.value = true
  success.value = false
  errorMessage.value = ''

  try {
    const captchaToken = await getToken('contact_submit')
    await submitContact({ ...form.value }, captchaToken)
    success.value = true
    form.value = { name: '', email: '', subject: '', message: '', website: '' }
    resetCaptcha()
  } catch (error) {
    errorMessage.value = messageFromError(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="04 — Conversación"
      title="Escríbenos."
      italic="Tomamos el tiempo"
      trailing="de responder bien."
      description="Para dudas de cuidado, pedidos especiales, colaboraciones, o solo para platicar de plantas. Contestamos en menos de 24h."
    />

    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div class="grid lg:grid-cols-12 gap-12">
        <!-- Form -->
        <form @submit="submit" class="lg:col-span-8 space-y-8 bg-ink-card border border-line rounded-3xl p-8 lg:p-12">
          <div class="grid sm:grid-cols-2 gap-8">
            <div>
              <label for="contact-name" class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Nombre</label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                required
                class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg"
              />
            </div>
            <div>
              <label for="contact-email" class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Email</label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                required
                class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg"
              />
            </div>
          </div>

          <div>
            <label for="contact-subject" class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Asunto</label>
            <input
              id="contact-subject"
              v-model="form.subject"
              type="text"
              required
              class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg"
            />
          </div>

          <div>
            <label for="contact-message" class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Mensaje</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              required
              rows="6"
              class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg resize-none"
            />
          </div>

          <div class="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label for="contact-website">Sitio web</label>
            <input
              id="contact-website"
              v-model="form.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <div
            v-if="captchaEnabled"
            class="overflow-x-auto"
            aria-label="Verificación de seguridad"
          >
            <div ref="captchaContainer" />
          </div>

          <p
            v-if="errorMessage"
            id="contact-error"
            role="alert"
            class="rounded-xl border border-red-300/40 bg-red-950/30 px-4 py-3 text-sm text-red-100"
          >
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="submitting"
            :aria-describedby="errorMessage ? 'contact-error' : undefined"
            class="inline-flex items-center gap-3 px-8 py-4 bg-terra text-ink rounded-full font-medium tracking-wide hover:bg-cream transition-colors duration-500 shine-on-hover disabled:opacity-50"
          >
            <Send class="w-4 h-4" />
            <span v-if="success">✓ Recibido — te respondemos pronto</span>
            <span v-else-if="submitting">Enviando...</span>
            <span v-else>Enviar mensaje</span>
          </button>
        </form>

        <!-- Info -->
        <aside class="lg:col-span-4 space-y-10 lg:pt-4">
          <div>
            <div class="flex items-center gap-3 mb-3 text-terra">
              <Mail class="w-4 h-4" />
              <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Email</div>
            </div>
            <a href="mailto:contacto@vidaeneljardin.com" class="font-display text-cream text-xl sm:text-2xl break-all hover:text-terra transition-colors">
              contacto@vidaeneljardin.com
            </a>
          </div>

          <div>
            <div class="flex items-center gap-3 mb-3 text-terra">
              <Phone class="w-4 h-4" />
              <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Teléfono</div>
            </div>
            <a href="tel:+526686088669" class="font-display text-cream text-2xl hover:text-terra transition-colors">
              +52 668 608 8669
            </a>
            <a
              href="https://wa.me/526686088669"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-3 inline-flex items-center gap-2 text-cream-60 hover:text-terra transition-colors"
            >
              <MessageCircle class="w-4 h-4" />
              Escribir por WhatsApp
            </a>
          </div>

          <div>
            <div class="flex items-center gap-3 mb-3 text-terra">
              <MapPin class="w-4 h-4" />
              <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Vivero</div>
            </div>
            <p class="font-display text-cream text-2xl leading-tight">Tijuana, B.C.</p>
          </div>

          <div>
            <div class="flex items-center gap-3 mb-3 text-terra">
              <Clock class="w-4 h-4" />
              <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Horario</div>
            </div>
            <p class="text-cream text-lg leading-relaxed">
              Lunes a viernes<br />
              <span class="text-cream-60">9:00 — 18:00</span>
            </p>
          </div>

          <div class="pt-8 border-t border-line">
            <p class="text-cream-60 leading-relaxed text-sm">
              Si tu duda es sobre cuidado de una planta específica, mándanos
              <em class="font-display-italic">una foto</em> en el mensaje. Ayuda mucho a diagnosticar.
            </p>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>
