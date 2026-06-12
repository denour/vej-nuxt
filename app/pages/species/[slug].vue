<script setup lang="ts">
import { computed } from 'vue'
import { Droplets, Sun, ArrowLeft, AlertTriangle, Ruler, Sprout, Leaf } from 'lucide-vue-next'
import { useSpeciesStore } from '~~/stores/Species'
import { onImgError } from '~~/utils/image'

const route = useRoute()
const speciesStore = useSpeciesStore()

const slugParam = route.params.slug
const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam as string)

const { data: species } = await useAsyncData(`species-${slug}`, async () => {
  const s = await speciesStore.fetchBySlug(slug)
  if (!s) {
    throw createError({ statusCode: 404, statusMessage: 'Especie no encontrada' })
  }
  return s
})

const config = useRuntimeConfig()
const canonicalUrl = computed(() => `${config.public.siteUrl}/species/${slug}`)

useSeoMeta({
  title: () => species.value ? `${species.value.commonName} — Vida en el Jardín` : 'Especie',
  description: () => species.value?.description?.slice(0, 160) || 'Ficha botánica con cuidados de luz, riego y carácter.',
  ogTitle: () => species.value?.commonName || 'Especie | Vida en el Jardín',
  ogDescription: () => species.value?.description?.slice(0, 160) || 'Ficha botánica',
  ogImage: () => species.value?.image || '/images/og-default.jpg',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
})

const difficultyLabel = computed(() => {
  switch (species.value?.careLevel) {
    case 'easy': return 'Fácil'
    case 'medium': return 'Moderado'
    case 'hard': return 'Avanzado'
    default: return null
  }
})

const toxicityLabel = computed(() => {
  switch (species.value?.toxicity) {
    case 'pets': return 'Tóxica para mascotas'
    case 'humans': return 'Tóxica para humanos'
    case 'both': return 'Tóxica para mascotas y humanos'
    case 'none': return 'No tóxica'
    default: return null
  }
})

const growthLabel = computed(() => {
  switch (species.value?.growthRate) {
    case 'slow': return 'Lento'
    case 'medium': return 'Medio'
    case 'fast': return 'Rápido'
    default: return null
  }
})

const getLevelDots = (level?: string): number =>
  level === 'low' ? 1 : level === 'medium' ? 2 : level === 'high' ? 3 : 0

const levelLabel = (level?: string): string =>
  level === 'low' ? 'Bajo' : level === 'medium' ? 'Medio' : level === 'high' ? 'Alto' : '—'
</script>

<template>
  <main v-if="species" class="relative min-h-screen">
    <section class="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
      <div class="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-moss/25 blur-[140px]" />

      <div class="relative max-w-[1400px] mx-auto">
        <NuxtLink
          to="/species"
          class="inline-flex items-center gap-2 text-cream-40 text-xs tracking-[0.2em] uppercase hover:text-terra transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Catálogo botánico
        </NuxtLink>

        <div class="mt-10 grid lg:grid-cols-12 gap-12">
          <!-- Image -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            class="lg:col-span-6"
          >
            <div class="relative aspect-[4/5] rounded-3xl overflow-hidden border border-line bg-ink-card">
              <NuxtImg
                :src="species.image"
                :alt="species.commonName"
                sizes="xs:100vw lg:700px"
                fetchpriority="high"
                preload
                class="absolute inset-0 w-full h-full object-cover duotone"
                @error="onImgError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div class="absolute top-5 left-5 flex flex-col gap-2">
                <span
                  v-if="difficultyLabel"
                  class="px-3 py-1 bg-cream/15 backdrop-blur border border-cream/20 rounded-full text-cream text-[10px] tracking-[0.2em] uppercase w-fit"
                >
                  {{ difficultyLabel }}
                </span>
                <span
                  v-if="species.toxicity && species.toxicity !== 'none'"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-terra/90 backdrop-blur rounded-full text-ink text-[10px] tracking-[0.15em] uppercase w-fit"
                >
                  <AlertTriangle class="w-3 h-3" />
                  Tóxica
                </span>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="lg:col-span-6 lg:pt-6">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 700 } }"
            >
              <div class="text-cream-40 text-xs tracking-[0.25em] uppercase italic">
                {{ species.scientificName }}
              </div>
              <h1 class="mt-4 font-display text-cream text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-tightest font-light">
                {{ species.commonName }}
              </h1>

              <div class="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-cream-40 text-xs tracking-wider uppercase">
                <span v-if="species.family">Familia · <span class="text-cream-60">{{ species.family }}</span></span>
                <span v-if="species.origin">Origen · <span class="text-cream-60">{{ species.origin }}</span></span>
              </div>

              <p v-if="species.description" class="mt-8 text-cream-60 leading-relaxed text-lg">
                {{ species.description }}
              </p>
            </div>

            <!-- Care ficha -->
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 700 } }"
              class="mt-12 grid grid-cols-2 gap-4"
            >
              <div class="p-5 rounded-2xl bg-ink-card border border-line">
                <div class="flex items-center gap-2 text-cream-40 text-[10px] tracking-[0.25em] uppercase">
                  <Droplets class="w-3.5 h-3.5" /> Riego
                </div>
                <div class="mt-3 flex items-center gap-3">
                  <div class="flex gap-1.5">
                    <div
                      v-for="n in 3" :key="n"
                      class="w-2 h-2 rounded-full"
                      :class="n <= getLevelDots(species.watering) ? 'bg-terra' : 'bg-cream/15'"
                    />
                  </div>
                  <span class="text-cream text-sm">{{ levelLabel(species.watering) }}</span>
                </div>
              </div>

              <div class="p-5 rounded-2xl bg-ink-card border border-line">
                <div class="flex items-center gap-2 text-cream-40 text-[10px] tracking-[0.25em] uppercase">
                  <Sun class="w-3.5 h-3.5" /> Luz
                </div>
                <div class="mt-3 flex items-center gap-3">
                  <div class="flex gap-1.5">
                    <div
                      v-for="n in 3" :key="n"
                      class="w-2 h-2 rounded-full"
                      :class="n <= getLevelDots(species.sunlight) ? 'bg-amber-brand' : 'bg-cream/15'"
                    />
                  </div>
                  <span class="text-cream text-sm">{{ levelLabel(species.sunlight) }}</span>
                </div>
              </div>

              <div v-if="growthLabel" class="p-5 rounded-2xl bg-ink-card border border-line">
                <div class="flex items-center gap-2 text-cream-40 text-[10px] tracking-[0.25em] uppercase">
                  <Sprout class="w-3.5 h-3.5" /> Crecimiento
                </div>
                <div class="mt-3 text-cream text-sm">{{ growthLabel }}</div>
              </div>

              <div v-if="species.maxHeightCm" class="p-5 rounded-2xl bg-ink-card border border-line">
                <div class="flex items-center gap-2 text-cream-40 text-[10px] tracking-[0.25em] uppercase">
                  <Ruler class="w-3.5 h-3.5" /> Altura máx.
                </div>
                <div class="mt-3 text-cream text-sm">{{ species.maxHeightCm }} cm</div>
              </div>

              <div v-if="toxicityLabel" class="p-5 rounded-2xl bg-ink-card border border-line col-span-2">
                <div class="flex items-center gap-2 text-cream-40 text-[10px] tracking-[0.25em] uppercase">
                  <Leaf class="w-3.5 h-3.5" /> Toxicidad
                </div>
                <div class="mt-3 text-cream text-sm">{{ toxicityLabel }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
