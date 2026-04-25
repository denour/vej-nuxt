<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, X } from 'lucide-vue-next'
import SpeciesCard from "~/components/common/SpeciesCard.vue";
import { useSpeciesStore } from "~~/stores/Species";

useSeoMeta({
  title: 'Especies — Vida en el Jardín',
  description: 'Una colección curada de especies con fichas de cuidado, requisitos de luz y notas botánicas.',
  ogTitle: 'Especies — Vida en el Jardín',
  ogDescription: 'Colección botánica curada. Fichas de cuidado, luz, riego y carácter.',
})

const selectedDifficulty = ref('Todas')
const selectedSunlight = ref('Todas')
const selectedWatering = ref('Todas')
const searchQuery = ref('')

const difficulties = ['Todas', 'Fácil', 'Moderado', 'Avanzado']
const sunlightLevels = ['Todas', 'Baja', 'Media', 'Alta']
const wateringLevels = ['Todas', 'Bajo', 'Medio', 'Alto']

const speciesData = useSpeciesStore()

onMounted(async () => {
  try {
    await speciesData.fetchSpecies()
  } catch (e) {
    // API may not be available locally — fall through to empty state
  }
})

const difficultyMap: Record<string, string> = {
  'Fácil': 'easy', 'Moderado': 'medium', 'Avanzado': 'hard',
}
const sunlightMap: Record<string, string> = {
  'Baja': 'low', 'Media': 'medium', 'Alta': 'high',
}
const wateringMap: Record<string, string> = {
  'Bajo': 'low', 'Medio': 'medium', 'Alto': 'high',
}

const filteredSpecies = computed(() => {
  return speciesData.species.filter(s => {
    const md = selectedDifficulty.value === 'Todas' || s.careLevel === difficultyMap[selectedDifficulty.value]
    const ms = selectedSunlight.value === 'Todas' || s.sunlight === sunlightMap[selectedSunlight.value]
    const mw = selectedWatering.value === 'Todas' || s.watering === wateringMap[selectedWatering.value]
    const q = searchQuery.value.toLowerCase()
    const mq = (s.commonName || '').toLowerCase().includes(q) ||
               (s.scientificName || '').toLowerCase().includes(q) ||
               (s.family || '').toLowerCase().includes(q)
    return md && ms && mw && mq
  })
})

const hasActiveFilters = computed(() =>
  selectedDifficulty.value !== 'Todas' ||
  selectedSunlight.value !== 'Todas' ||
  selectedWatering.value !== 'Todas' ||
  searchQuery.value !== ''
)

const clearFilters = () => {
  selectedDifficulty.value = 'Todas'
  selectedSunlight.value = 'Todas'
  selectedWatering.value = 'Todas'
  searchQuery.value = ''
}
</script>

<template>
  <main class="relative min-h-screen">
    <!-- Hero -->
    <section class="relative pt-40 pb-24 px-6 lg:px-12 overflow-hidden">
      <!-- Ambient blob -->
      <div class="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-moss/25 blur-[140px]" />

      <div class="relative max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12">
        <div class="lg:col-span-2">
          <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">
            Catálogo botánico
          </div>
        </div>

        <div class="lg:col-span-7">
          <h1
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            class="font-display text-cream text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tightest font-light"
          >
            <span class="block">Cada planta es</span>
            <span class="block"><em class="font-display-italic text-terra">una conversación</em></span>
            <span class="block">por sostener.</span>
          </h1>
        </div>

        <div class="lg:col-span-3 lg:pt-6">
          <p
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 700 } }"
            class="text-cream-60 leading-relaxed"
          >
            Una colección curada con fichas de cuidado, requisitos de luz, riego y notas
            botánicas escritas por jardineros, no por algoritmos.
          </p>
        </div>
      </div>

      <!-- Search bar -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 700 } }"
        class="relative max-w-[1400px] mx-auto mt-16 lg:mt-24"
      >
        <div class="relative flex items-center bg-ink-card border border-line rounded-full px-7 py-2 max-w-2xl">
          <Search class="w-5 h-5 text-cream-40 flex-shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, familia, género..."
            class="flex-1 bg-transparent text-cream placeholder-cream/30 px-4 py-3 outline-none text-base"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="text-cream-40 hover:text-terra p-1"
            aria-label="Limpiar búsqueda"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <section class="border-y border-line">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(stat, i) in [
          { n: speciesData.species.length || 50, label: 'Especies catalogadas', suffix: '+' },
          { n: 15, label: 'Familias botánicas', suffix: '+' },
          { n: 100, label: 'Información verificada', suffix: '%' },
          { n: 24, label: 'Asesoría disponible', suffix: '/7' },
        ]" :key="i">
          <div class="font-display text-cream text-5xl lg:text-6xl tracking-tighter font-light">
            {{ stat.n }}<span class="text-terra">{{ stat.suffix }}</span>
          </div>
          <div class="mt-2 text-cream-40 text-xs tracking-wider uppercase">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Filters + Grid -->
    <section class="relative px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
      <div class="grid lg:grid-cols-12 gap-12">
        <!-- Sidebar Filters -->
        <aside class="lg:col-span-3 lg:sticky lg:top-32 lg:self-start space-y-10">
          <div class="flex items-center justify-between">
            <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Filtros</div>
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-terra text-xs tracking-wide hover:underline"
            >
              Limpiar
            </button>
          </div>

          <!-- Difficulty -->
          <div>
            <div class="font-display text-cream text-xl mb-4 tracking-tighter">Dificultad</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="d in difficulties"
                :key="d"
                @click="selectedDifficulty = d"
                :class="[
                  'px-4 py-2 rounded-full text-sm transition-all duration-300 border',
                  selectedDifficulty === d
                    ? 'bg-terra border-terra text-ink'
                    : 'bg-transparent border-line text-cream-60 hover:border-cream/40 hover:text-cream'
                ]"
              >
                {{ d }}
              </button>
            </div>
          </div>

          <!-- Sunlight -->
          <div>
            <div class="font-display text-cream text-xl mb-4 tracking-tighter">Luz</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="l in sunlightLevels"
                :key="l"
                @click="selectedSunlight = l"
                :class="[
                  'px-4 py-2 rounded-full text-sm transition-all duration-300 border',
                  selectedSunlight === l
                    ? 'bg-terra border-terra text-ink'
                    : 'bg-transparent border-line text-cream-60 hover:border-cream/40 hover:text-cream'
                ]"
              >
                {{ l }}
              </button>
            </div>
          </div>

          <!-- Watering -->
          <div>
            <div class="font-display text-cream text-xl mb-4 tracking-tighter">Riego</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="w in wateringLevels"
                :key="w"
                @click="selectedWatering = w"
                :class="[
                  'px-4 py-2 rounded-full text-sm transition-all duration-300 border',
                  selectedWatering === w
                    ? 'bg-terra border-terra text-ink'
                    : 'bg-transparent border-line text-cream-60 hover:border-cream/40 hover:text-cream'
                ]"
              >
                {{ w }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Grid -->
        <div class="lg:col-span-9">
          <div class="flex items-baseline justify-between mb-8 pb-4 border-b border-line">
            <div class="font-display-italic text-cream text-2xl">
              {{ filteredSpecies.length }} {{ filteredSpecies.length === 1 ? 'especie' : 'especies' }}
            </div>
            <div class="text-cream-40 text-xs tracking-wider uppercase hidden sm:block">
              Curaduría manual
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="filteredSpecies.length === 0"
            class="py-32 text-center"
          >
            <div class="font-display text-cream text-4xl mb-4 tracking-tighter">
              Aún
              <em class="font-display-italic text-terra">germinando</em>.
            </div>
            <p class="text-cream-60 max-w-md mx-auto">
              Estamos cargando más especies. Vuelve pronto o ajusta los filtros si tienes alguno activo.
            </p>
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-cream/30 text-cream rounded-full text-sm hover:border-cream hover:bg-cream/5 transition-all"
            >
              Limpiar filtros
            </button>
          </div>

          <!-- Species grid -->
          <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            <SpeciesCard
              v-for="(item, idx) in filteredSpecies"
              :key="item.commonName"
              :species="item"
              :index="idx"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
