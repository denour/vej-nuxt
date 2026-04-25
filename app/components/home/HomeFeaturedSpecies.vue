<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

interface Species {
  name: string
  latin: string
  difficulty: string
  light: string
  image: string
  span: string
}

const species: Species[] = [
  {
    name: 'Monstera Deliciosa',
    latin: 'Costilla de Adán',
    difficulty: 'Fácil',
    light: 'Indirecta brillante',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=80',
    span: 'lg:col-span-7 lg:row-span-2',
  },
  {
    name: 'Ficus Lyrata',
    latin: 'Higuera de hoja de violín',
    difficulty: 'Intermedia',
    light: 'Indirecta intensa',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=900&q=80',
    span: 'lg:col-span-5',
  },
  {
    name: 'Calathea Orbifolia',
    latin: 'Catedral viviente',
    difficulty: 'Avanzada',
    light: 'Indirecta media',
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=900&q=80',
    span: 'lg:col-span-3',
  },
  {
    name: 'Pothos Marble',
    latin: 'Epipremnum aureum',
    difficulty: 'Muy fácil',
    light: 'Cualquiera',
    image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=900&q=80',
    span: 'lg:col-span-2',
  },
]
</script>

<template>
  <section class="relative py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
    <!-- Section header -->
    <div class="grid lg:grid-cols-12 gap-8 mb-20">
      <div class="lg:col-span-2">
        <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">
          01 — Especies
        </div>
      </div>
      <div class="lg:col-span-7">
        <h2
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="font-display text-cream text-5xl lg:text-7xl leading-[0.95] tracking-tighter"
        >
          Una colección curada de
          <em class="font-display-italic text-terra">plantas con carácter</em>.
        </h2>
      </div>
      <div class="lg:col-span-3 lg:pt-4">
        <p class="text-cream-60 leading-relaxed">
          Cada especie viene con su ficha de cuidado, requisitos de luz, y notas botánicas para que sepas exactamente con quién vives.
        </p>
      </div>
    </div>

    <!-- Bento grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-[minmax(280px,_auto)]">
      <article
        v-for="(s, idx) in species"
        :key="s.name"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 700, delay: idx * 100 } }"
        :class="[
          'group relative overflow-hidden rounded-3xl bg-ink-card border border-line cursor-pointer',
          s.span,
        ]"
      >
        <img
          :src="s.image"
          :alt="s.name"
          class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />

        <!-- Top right arrow -->
        <div class="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream/10 backdrop-blur border border-cream/20 flex items-center justify-center transition-all duration-500 group-hover:bg-terra group-hover:border-terra">
          <ArrowUpRight class="w-4 h-4 text-cream transition-transform duration-500 group-hover:rotate-45 group-hover:text-ink" />
        </div>

        <!-- Bottom info -->
        <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div class="text-cream-40 text-[10px] tracking-[0.25em] uppercase mb-2">
            {{ s.latin }}
          </div>
          <h3 class="font-display text-cream text-2xl lg:text-3xl tracking-tighter leading-tight">
            {{ s.name }}
          </h3>
          <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span class="px-3 py-1 bg-cream/10 backdrop-blur border border-cream/15 rounded-full text-cream-60">
              {{ s.difficulty }}
            </span>
            <span class="px-3 py-1 bg-cream/10 backdrop-blur border border-cream/15 rounded-full text-cream-60">
              {{ s.light }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- See all -->
    <div class="mt-16 text-center">
      <NuxtLink
        to="/species"
        class="inline-flex items-center gap-3 text-cream hover:text-terra transition-colors group"
      >
        <span class="font-display-italic text-2xl">Ver todas las especies</span>
        <span class="inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
      </NuxtLink>
    </div>
  </section>
</template>
