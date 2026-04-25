<script setup lang="ts">
import { RotateCcw, Calendar, CheckCircle, AlertCircle } from 'lucide-vue-next'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Devoluciones — Vida en el Jardín',
  description: 'Política de devoluciones: 30 días, garantía de planta viva.',
})

const steps = [
  { n: '01', icon: Calendar, title: '30 días', body: 'Cuentas con 30 días naturales desde que recibes la planta para iniciar una devolución.' },
  { n: '02', icon: AlertCircle, title: 'Avísanos', body: 'Mándanos una foto y descripción del problema. Diagnosticamos en 24h.' },
  { n: '03', icon: RotateCcw, title: 'Recolección', body: 'Coordinamos la recolección sin costo en CDMX y zonas con cobertura.' },
  { n: '04', icon: CheckCircle, title: 'Reembolso', body: 'Reembolso en 5–7 días hábiles a tu método de pago original.' },
]

const eligible = [
  'La planta llegó dañada o muerta',
  'Llegó una especie distinta a la pedida',
  'La maceta o accesorios incluidos están defectuosos',
  'No coincide la talla / tamaño descrito',
]

const notEligible = [
  'Plantas que murieron por cuidado posterior (riego excesivo, falta de luz, etc.)',
  'Pedidos personalizados o de especies bajo encargo',
  'Productos con más de 30 días desde la entrega',
  'Plantas adquiridas en promociones de "planta de la semana"',
]
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Política"
      title="Si algo sale"
      italic="mal,"
      trailing="lo arreglamos."
      description="Plantas vivas son cosa frágil. Por eso ofrecemos 30 días de garantía y reposición sin preguntas si llega dañada."
    />

    <!-- Steps -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-20">
      <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-12">El proceso</div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(s, idx) in steps"
          :key="s.n"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: idx * 100 } }"
          class="group"
        >
          <div class="flex items-baseline gap-4 mb-6">
            <span class="font-display text-terra text-5xl tracking-tighter">{{ s.n }}</span>
            <component :is="s.icon" class="w-5 h-5 text-cream-40 group-hover:text-terra transition-colors duration-500" />
          </div>
          <h3 class="font-display text-cream text-2xl tracking-tighter mb-3">{{ s.title }}</h3>
          <p class="text-cream-60 leading-relaxed">{{ s.body }}</p>
          <div class="mt-6 h-px bg-line group-hover:bg-terra transition-colors duration-700" />
        </div>
      </div>
    </section>

    <!-- Eligible vs Not -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="p-8 lg:p-10 rounded-3xl bg-ink-card border border-line">
          <div class="flex items-center gap-3 mb-6 text-moss-bright">
            <CheckCircle class="w-5 h-5" />
            <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Aplica devolución</div>
          </div>
          <ul class="space-y-4">
            <li
              v-for="(item, idx) in eligible"
              :key="idx"
              class="flex items-start gap-3 text-cream/90 leading-relaxed"
            >
              <span class="text-terra mt-1.5 flex-shrink-0">→</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="p-8 lg:p-10 rounded-3xl bg-ink-card border border-line">
          <div class="flex items-center gap-3 mb-6 text-terra">
            <AlertCircle class="w-5 h-5" />
            <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">No aplica</div>
          </div>
          <ul class="space-y-4">
            <li
              v-for="(item, idx) in notEligible"
              :key="idx"
              class="flex items-start gap-3 text-cream-60 leading-relaxed"
            >
              <span class="text-cream/30 mt-1.5 flex-shrink-0">×</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-3 px-7 py-4 bg-terra text-ink rounded-full font-medium tracking-wide hover:bg-cream transition-colors duration-500 shine-on-hover"
        >
          Iniciar devolución
          <span>→</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
