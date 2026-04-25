<script setup lang="ts">
import { Truck, Package, Globe, Shield } from 'lucide-vue-next'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Envíos — Vida en el Jardín',
  description: 'Información sobre envíos, tiempos de entrega y zonas de cobertura.',
})

const zones = [
  { name: 'CDMX y Zona Metropolitana', time: '24–48 hrs', cost: '$120 MXN', free: 'Gratis arriba de $1,500' },
  { name: 'Resto de México', time: '3–5 días', cost: '$180 MXN', free: 'Gratis arriba de $2,500' },
  { name: 'Foráneo (zonas extendidas)', time: '5–8 días', cost: 'Cotización', free: '—' },
]

const principles = [
  { icon: Package, title: 'Empaque botánico', body: 'Tutores, sustrato húmedo y caja con respiración. Llegan vivas.' },
  { icon: Truck, title: 'Tracking en vivo', body: 'Te mandamos la guía y notificaciones en cada etapa.' },
  { icon: Shield, title: 'Garantía de llegada', body: 'Si llega dañada, te mandamos otra. Sin preguntas.' },
  { icon: Globe, title: 'Carbono compensado', body: 'Cada envío compensa su huella vía Pachama.' },
]
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Logística"
      title="Llegan vivas."
      italic="Llegan a tiempo."
      description="Empacamos cada planta como si fuera la única. Empaque diseñado en casa, tracking en vivo y garantía de llegada."
    />

    <!-- Zones table -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-20">
      <div class="bg-ink-card border border-line rounded-3xl overflow-hidden">
        <div class="hidden md:grid grid-cols-12 px-6 lg:px-10 py-6 border-b border-line text-cream-40 text-[10px] tracking-[0.3em] uppercase">
          <div class="col-span-5">Zona</div>
          <div class="col-span-3">Tiempo</div>
          <div class="col-span-2">Costo</div>
          <div class="col-span-2 text-right">Envío gratis</div>
        </div>
        <div
          v-for="(z, idx) in zones"
          :key="z.name"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 600, delay: idx * 100 } }"
          class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 px-6 lg:px-10 py-8 border-b border-line last:border-b-0 items-baseline"
        >
          <div class="md:col-span-5 font-display text-cream text-xl lg:text-2xl tracking-tighter">{{ z.name }}</div>
          <div class="md:col-span-3 text-cream/80">{{ z.time }}</div>
          <div class="md:col-span-2 text-cream/80">{{ z.cost }}</div>
          <div class="md:col-span-2 text-cream-60 text-sm md:text-right">{{ z.free }}</div>
        </div>
      </div>
    </section>

    <!-- Principles -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(p, idx) in principles"
          :key="p.title"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: idx * 80 } }"
          class="group p-8 rounded-3xl bg-ink-card border border-line hover:border-cream/30 transition-all duration-500"
        >
          <div class="w-11 h-11 rounded-full border border-cream/20 flex items-center justify-center mb-6 group-hover:border-terra group-hover:text-terra transition-colors duration-500 text-cream">
            <component :is="p.icon" class="w-5 h-5" />
          </div>
          <h3 class="font-display text-cream text-2xl tracking-tighter mb-3">{{ p.title }}</h3>
          <p class="text-cream-60 leading-relaxed">{{ p.body }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
