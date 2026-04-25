<script setup lang="ts">
import { Droplets, Sun, ArrowUpRight, AlertTriangle } from 'lucide-vue-next'
import { onImgError } from '~~/utils/image'
import type { Species } from '~~/models/Species'

const props = defineProps<{
  species: Species
  index?: number
}>()

const getDifficultyLabel = (careLevel?: string) => {
  switch (careLevel) {
    case 'easy': return 'Fácil'
    case 'medium': return 'Moderado'
    case 'hard': return 'Avanzado'
    default: return null
  }
}

const getLevelDots = (level?: string): number => {
  return level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 0
}

const isToxic = (toxicity?: string) =>
  toxicity && toxicity !== 'none'
</script>

<template>
  <article
    v-motion
    :initial="{ opacity: 0, y: 30 }"
    :visible-once="{
      opacity: 1, y: 0,
      transition: { duration: 600, delay: ((props.index ?? 0) % 9) * 60 }
    }"
    class="group relative overflow-hidden rounded-2xl bg-ink-card border border-line cursor-pointer transition-all duration-500 hover:border-cream/30"
  >
    <!-- Image area -->
    <div class="relative aspect-[4/5] overflow-hidden">
      <img
        :src="species.image"
        :alt="species.commonName"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-110"
        @error="onImgError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />

      <!-- Top right arrow icon -->
      <div class="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/10 backdrop-blur border border-cream/20 flex items-center justify-center transition-all duration-500 group-hover:bg-terra group-hover:border-terra">
        <ArrowUpRight class="w-4 h-4 text-cream transition-transform duration-500 group-hover:rotate-45 group-hover:text-ink" />
      </div>

      <!-- Top left tags -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <span
          v-if="getDifficultyLabel(species.careLevel)"
          class="px-3 py-1 bg-cream/15 backdrop-blur border border-cream/20 rounded-full text-cream text-[10px] tracking-[0.2em] uppercase"
        >
          {{ getDifficultyLabel(species.careLevel) }}
        </span>
        <span
          v-if="isToxic(species.toxicity)"
          class="inline-flex items-center gap-1 px-3 py-1 bg-terra/90 backdrop-blur rounded-full text-ink text-[10px] tracking-[0.15em] uppercase"
        >
          <AlertTriangle class="w-3 h-3" />
          Tóxica
        </span>
      </div>

      <!-- Bottom info -->
      <div class="absolute bottom-0 left-0 right-0 p-5">
        <div class="text-cream-40 text-[10px] tracking-[0.25em] uppercase mb-1.5">
          {{ species.scientificName }}
        </div>
        <h3 class="font-display text-cream text-2xl tracking-tighter leading-tight">
          {{ species.commonName }}
        </h3>
      </div>
    </div>

    <!-- Footer with care indicators -->
    <div class="px-5 py-4 flex items-center justify-between border-t border-line">
      <!-- Water -->
      <div class="flex items-center gap-2">
        <Droplets class="w-3.5 h-3.5 text-cream-40" />
        <div class="flex gap-1">
          <div
            v-for="n in 3" :key="n"
            class="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            :class="n <= getLevelDots(species.watering) ? 'bg-terra' : 'bg-cream/15'"
          />
        </div>
      </div>

      <!-- Sun -->
      <div class="flex items-center gap-2">
        <Sun class="w-3.5 h-3.5 text-cream-40" />
        <div class="flex gap-1">
          <div
            v-for="n in 3" :key="n"
            class="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            :class="n <= getLevelDots(species.sunlight) ? 'bg-amber-brand' : 'bg-cream/15'"
          />
        </div>
      </div>

      <!-- Family or growth -->
      <div v-if="species.family" class="text-cream-40 text-[10px] tracking-[0.2em] uppercase truncate max-w-[100px]">
        {{ species.family }}
      </div>
    </div>
  </article>
</template>
