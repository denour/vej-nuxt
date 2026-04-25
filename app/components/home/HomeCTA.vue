<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const submitted = ref(false)

const submit = (e: Event) => {
  e.preventDefault()
  if (!email.value) return
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    email.value = ''
  }, 3000)
}
</script>

<template>
  <section class="relative px-6 lg:px-12 py-32 max-w-[1400px] mx-auto">
    <div class="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-moss to-ink-soft border border-line p-12 lg:p-20">
      <!-- Floating leaves background -->
      <div class="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80"
          alt=""
          class="w-full h-full object-cover duotone"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
      </div>

      <div class="relative grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="text-cream-60 text-[10px] tracking-[0.3em] uppercase mb-6">Carta semanal</div>
          <h2
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            class="font-display text-cream text-5xl lg:text-6xl leading-[0.95] tracking-tighter"
          >
            Una carta de jardín
            <em class="font-display-italic text-terra">cada domingo</em>.
          </h2>
          <p class="mt-6 text-cream-60 text-lg max-w-md leading-relaxed">
            Notas botánicas, nuevas especies, lecturas largas. Sin spam, sin promociones invasivas.
            Solo cosas verdes que valen la pena.
          </p>
        </div>

        <div>
          <form @submit="submit" class="relative">
            <div class="flex flex-col sm:flex-row gap-3 p-2 bg-ink/40 backdrop-blur border border-cream/15 rounded-2xl">
              <input
                v-model="email"
                type="email"
                required
                placeholder="tu@correo.com"
                class="flex-1 bg-transparent text-cream placeholder-cream/30 px-5 py-4 outline-none"
              />
              <button
                type="submit"
                class="px-7 py-4 bg-cream text-ink rounded-xl font-medium tracking-wide hover:bg-terra transition-colors duration-500 shine-on-hover"
              >
                {{ submitted ? '✓ Te suscribiste' : 'Suscribirme' }}
              </button>
            </div>
            <p class="mt-4 text-cream-40 text-xs tracking-wide">
              Al suscribirte aceptas recibir un correo a la semana. Cancela cuando quieras.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
