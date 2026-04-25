<script setup lang="ts">
import { Mail, MapPin, Clock, Send } from 'lucide-vue-next'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Contacto — Vida en el Jardín',
  description: 'Escríbenos sobre cuidado de plantas, pedidos especiales o colaboraciones.',
})

const form = ref({ name: '', email: '', subject: '', message: '' })
const submitting = ref(false)
const success = ref(false)

const submit = async (e: Event) => {
  e.preventDefault()
  submitting.value = true
  await new Promise(r => setTimeout(r, 800))
  submitting.value = false
  success.value = true
  setTimeout(() => {
    success.value = false
    form.value = { name: '', email: '', subject: '', message: '' }
  }, 3500)
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
              <label class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Nombre</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg"
              />
            </div>
            <div>
              <label class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg"
              />
            </div>
          </div>

          <div>
            <label class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Asunto</label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg"
            />
          </div>

          <div>
            <label class="block text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-3">Mensaje</label>
            <textarea
              v-model="form.message"
              required
              rows="6"
              class="w-full bg-transparent border-b border-line text-cream py-3 outline-none focus:border-terra transition-colors text-lg resize-none"
            />
          </div>

          <button
            type="submit"
            :disabled="submitting"
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
            <a href="mailto:hola@vidaeneljardin.com" class="font-display text-cream text-2xl hover:text-terra transition-colors">
              hola@vidaeneljardin.com
            </a>
          </div>

          <div>
            <div class="flex items-center gap-3 mb-3 text-terra">
              <MapPin class="w-4 h-4" />
              <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Vivero</div>
            </div>
            <p class="font-display text-cream text-2xl leading-tight">
              Ciudad de México<br />
              <span class="text-cream-60 text-base font-sans">Coyoacán · CDMX</span>
            </p>
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
