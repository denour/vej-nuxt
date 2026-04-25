<script setup lang="ts">
import { Leaf, BookOpen, Sprout } from 'lucide-vue-next'

const principles = [
  {
    n: '01',
    icon: Leaf,
    title: 'Plantas con historia',
    body: 'Cada especie pasa por una curaduría manual. No vendemos lo que no cuidaríamos en nuestra propia casa.',
  },
  {
    n: '02',
    icon: BookOpen,
    title: 'Conocimiento abierto',
    body: 'Guías escritas por jardineros, no por algoritmos. Errores incluidos, porque así también se aprende.',
  },
  {
    n: '03',
    icon: Sprout,
    title: 'Ritmo lento',
    body: 'Las plantas no tienen prisa. Tampoco nosotros. Aquí cultivar es un acto, no una transacción.',
  },
]
</script>

<template>
  <section class="relative py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
    <div class="grid lg:grid-cols-12 gap-8">
      <div class="lg:col-span-2">
        <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">03 — Manifiesto</div>
      </div>
      <div class="lg:col-span-10">
        <h2
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="font-display text-cream text-5xl lg:text-7xl leading-[0.95] tracking-tighter mb-20 max-w-5xl"
        >
          Tres cosas en las que
          <em class="font-display-italic text-terra">creemos profundamente</em>.
        </h2>

        <div class="grid md:grid-cols-3 gap-12">
          <div
            v-for="(p, idx) in principles"
            :key="p.n"
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 700, delay: idx * 150 } }"
            class="group"
          >
            <div class="flex items-baseline gap-4 mb-8">
              <span class="font-display text-terra text-6xl tracking-tighter">{{ p.n }}</span>
              <component :is="p.icon" class="w-5 h-5 text-cream-40 group-hover:text-terra transition-colors duration-500" />
            </div>
            <h3 class="font-display text-cream text-3xl tracking-tighter leading-tight mb-4">
              {{ p.title }}
            </h3>
            <p class="text-cream-60 leading-relaxed">{{ p.body }}</p>
            <div class="mt-8 h-px bg-line group-hover:bg-terra transition-colors duration-700" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
