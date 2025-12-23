<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, Filter } from 'lucide-vue-next'
import SpeciesCard from "~/components/common/SpeciesCard.vue";
import {useSpeciesStore} from "~~/stores/Species";
import { useSeoMeta } from '#imports'

const selectedDifficulty = ref('Todas')
const selectedType = ref('Todas')
const searchQuery = ref('')

const difficulties = ['Todas', 'Fácil', 'Moderado', 'Avanzado']
const sunlightLevels = ['Todas', 'Baja', 'Media', 'Alta']
const wateringLevels = ['Todas', 'Bajo', 'Medio', 'Alto']

const selectedSunlight = ref('Todas')
const selectedWatering = ref('Todas')

const speciesData = useSpeciesStore();

onMounted(async () => {
  await speciesData.fetchSpecies()
})


const difficultyMap: Record<string, string> = {
  'Fácil': 'easy',
  'Moderado': 'medium',
  'Avanzado': 'hard',
}

const sunlightMap: Record<string, string> = {
  'Baja': 'low',
  'Media': 'medium',
  'Alta': 'high',
}

const wateringMap: Record<string, string> = {
  'Bajo': 'low',
  'Medio': 'medium',
  'Alto': 'high',
}

const filteredSpecies = computed(() => {
  return speciesData.species.filter(specie => {
    const matchesDifficulty =
      selectedDifficulty.value === 'Todas' || specie.careLevel === difficultyMap[selectedDifficulty.value]

    const matchesSunlight =
      selectedSunlight.value === 'Todas' || specie.sunlight === sunlightMap[selectedSunlight.value]

    const matchesWatering =
      selectedWatering.value === 'Todas' || specie.watering === wateringMap[selectedWatering.value]

    const search = searchQuery.value.toLowerCase()
    const matchesSearch =
      (specie.commonName || '').toLowerCase().includes(search) ||
      (specie.scientificName || '').toLowerCase().includes(search) ||
      (specie.family || '').toLowerCase().includes(search)

    return matchesDifficulty && matchesSunlight && matchesWatering && matchesSearch
  })
})

useSeoMeta({
  title: 'Especies | Vida en el Jardín',
  description: 'Explora nuestra colección de plantas con información detallada sobre sus cuidados, características y requisitos.',
  ogTitle: 'Especies | Vida en el Jardín',
  ogDescription: 'Colección de especies con cuidados y requisitos.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            </div>
            <h1 class="text-5xl font-serif">
              Especies
            </h1>
          </div>

          <p class="text-xl text-emerald-100 mb-8">
            Explora nuestra colección de plantas con información detallada sobre sus cuidados,
            características y requisitos.
          </p>

          <!-- Search -->
          <div class="relative max-w-xl">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Buscar especies..."
                v-model="searchQuery"
                class="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white border-b border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-3xl text-green-600 mb-1" style="font-family: serif">
              {{ speciesData.species.length }}+
            </div>
            <p class="text-sm text-gray-600">Especies catalogadas</p>
          </div>

          <div>
            <div class="text-3xl text-green-600 mb-1" style="font-family: serif">
              15+
            </div>
            <p class="text-sm text-gray-600">Familias botánicas</p>
          </div>

          <div>
            <div class="text-3xl text-green-600 mb-1" style="font-family: serif">
              100%
            </div>
            <p class="text-sm text-gray-600">Información verificada</p>
          </div>

          <div>
            <div class="text-3xl text-green-600 mb-1" style="font-family: serif">
              24/7
            </div>
            <p class="text-sm text-gray-600">Asesoría disponible</p>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="space-y-4">
          <!-- Difficulty Filter -->
          <div class="flex items-center gap-4 overflow-x-auto">
            <div class="flex items-center gap-2 text-gray-600 flex-shrink-0">
              <Filter class="w-5 h-5" />
              <span class="text-sm">Dificultad:</span>
            </div>

            <div class="flex gap-2">
              <button
                  v-for="difficulty in difficulties"
                  :key="difficulty"
                  @click="selectedDifficulty = difficulty"
                  class="px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap"
                  :class="selectedDifficulty === difficulty
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ difficulty }}
              </button>
            </div>
          </div>

          <!-- Sunlight Filter -->
          <div class="flex items-center gap-4 overflow-x-auto">
            <div class="flex items-center gap-2 text-gray-600 flex-shrink-0">
              <span class="text-sm">Luz:</span>
            </div>

            <div class="flex gap-2">
              <button
                  v-for="level in sunlightLevels"
                  :key="level"
                  @click="selectedSunlight = level"
                  class="px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap"
                  :class="selectedSunlight === level
              ? 'bg-yellow-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ level }}
              </button>
            </div>
          </div>

          <!-- Watering Filter -->
          <div class="flex items-center gap-4 overflow-x-auto">
            <div class="flex items-center gap-2 text-gray-600 flex-shrink-0">
              <span class="text-sm">Riego:</span>
            </div>

            <div class="flex gap-2">
              <button
                  v-for="level in wateringLevels"
                  :key="level"
                  @click="selectedWatering = level"
                  class="px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap"
                  :class="selectedWatering === level
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ level }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="max-w-7xl mx-auto px-6 py-12">

      <!-- Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <SpeciesCard
            v-for="item in filteredSpecies"
            :key="item.commonName"
            :species="item"
        />
      </div>
    </section>
  </div>
</template>
