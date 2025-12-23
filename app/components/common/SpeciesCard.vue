<script setup lang="ts">
import { Droplets, Sun, TrendingUp, Skull, Info } from "lucide-vue-next";
import { onImgError } from '~~/utils/image'
import type { Species } from '~~/models/Species'

const props = defineProps<{
  species: Species
}>();

const getDifficultyColor = (careLevel?: string) => {
  switch (careLevel) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getDifficultyLabel = (careLevel?: string) => {
  switch (careLevel) {
    case "easy":
      return "Fácil";
    case "medium":
      return "Moderado";
    case "hard":
      return "Avanzado";
    default:
      return "N/A";
  }
};

const getWaterLevel = (level?: string) => {
  return level === "low" ? 1 : level === "medium" ? 2 : level === "high" ? 3 : 0;
};

const getLightLevel = (level?: string) => {
  return level === "low" ? 1 : level === "medium" ? 2 : level === "high" ? 3 : 0;
};

const getGrowthRateLabel = (rate?: string) => {
  switch (rate) {
    case "slow":
      return "Lento";
    case "medium":
      return "Moderado";
    case "fast":
      return "Rápido";
    default:
      return "N/A";
  }
};

const getToxicityLabel = (toxicity?: string) => {
  switch (toxicity) {
    case "none":
      return "No tóxica";
    case "pets":
      return "Tóxica para mascotas";
    case "humans":
      return "Tóxica para humanos";
    case "both":
      return "Tóxica";
    default:
      return null;
  }
};

const getToxicityColor = (toxicity?: string) => {
  return toxicity && toxicity !== "none" ? "text-red-500" : "text-green-500";
};
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
    <!-- Image -->
    <div class="relative h-64 bg-gradient-to-br from-gray-100 to-green-50 overflow-hidden">
      <img
          :src="species.image"
          :alt="species.commonName"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          @error="onImgError"
      />

      <div class="absolute top-4 right-4 flex flex-col gap-2">
        <span
            class="px-3 py-1 rounded-full text-xs shadow-md backdrop-blur-sm"
            :class="getDifficultyColor(species.careLevel)"
        >
          {{ getDifficultyLabel(species.careLevel) }}
        </span>
        <span
            v-if="getToxicityLabel(species.toxicity)"
            class="px-3 py-1 rounded-full text-xs shadow-md backdrop-blur-sm bg-white/90 flex items-center gap-1"
            :class="getToxicityColor(species.toxicity)"
        >
          <Skull class="w-3 h-3" />
          {{ getToxicityLabel(species.toxicity) }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="mb-3">
        <h3 class="text-xl text-gray-800 mb-1">
          {{ species.commonName }}
        </h3>
        <p class="text-sm text-gray-500 italic">{{ species.scientificName }}</p>
        <p v-if="species.family" class="text-xs text-gray-400 mt-1">Familia: {{ species.family }}</p>
      </div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ species.description || 'Sin descripción disponible' }}
      </p>

      <!-- Care Requirements -->
      <div class="space-y-3 mb-4">
        <!-- Water Needs -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Droplets class="w-4 h-4 text-blue-500" />
            <span>Riego:</span>
          </div>

          <div class="flex gap-1">
            <div
                v-for="n in 3"
                :key="n"
                class="w-2 h-2 rounded-full"
                :class="n <= getWaterLevel(species.watering) ? 'bg-blue-500' : 'bg-gray-200'"
            />
          </div>
        </div>

        <!-- Light Needs -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Sun class="w-4 h-4 text-yellow-500" />
            <span>Luz:</span>
          </div>

          <div class="flex gap-1">
            <div
                v-for="n in 3"
                :key="n"
                class="w-2 h-2 rounded-full"
                :class="n <= getLightLevel(species.sunlight) ? 'bg-yellow-500' : 'bg-gray-200'"
            />
          </div>
        </div>

        <!-- Growth Rate -->
        <div v-if="species.growthRate" class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp class="w-4 h-4 text-green-500" />
            <span>Crecimiento:</span>
          </div>
          <span class="text-sm text-gray-700">{{ getGrowthRateLabel(species.growthRate) }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <button
          class="w-full py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
      >
        <Info class="w-4 h-4" />
        <span class="text-sm">Ver detalles</span>
      </button>
    </div>
  </div>
</template>
