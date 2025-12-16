<script setup lang="ts">
import { Droplets, Sun, Thermometer, Info } from "lucide-vue-next";
import { onImgError } from '~~/utils/image'

const props = defineProps({
  species: {
    type: Object,
    required: true,
  },
});

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Fácil":
      return "bg-green-100 text-green-700";
    case "Moderado":
      return "bg-yellow-100 text-yellow-700";
    case "Avanzado":
      return "bg-orange-100 text-orange-700";
    default:
      return "";
  }
};

const getWaterLevel = (level: string) => {
  return level === "Baja" ? 1 : level === "Media" ? 2 : 3;
};

const getLightLevel = (level: string) => {
  return level === "Baja" ? 1 : level === "Media" ? 2 : 3;
};
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
    <!-- Image -->
    <div class="relative h-64 bg-gradient-to-br from-gray-100 to-green-50 overflow-hidden">
      <img
          :src="species.image"
          :alt="species.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          @error="onImgError"
      />

      <div class="absolute top-4 right-4">
        <span
            class="px-3 py-1 rounded-full text-xs shadow-md"
            :class="getDifficultyColor(species.difficulty)"
        >
          {{ species.difficulty }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="mb-3">
        <h3 class="text-xl text-gray-800 mb-1">
          {{ species.name }}
        </h3>
        <p class="text-sm text-gray-500 italic">{{ species.scientificName }}</p>
        <p class="text-xs text-gray-400 mt-1">Familia: {{ species.family }}</p>
      </div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ species.description }}
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
                :class="n <= getWaterLevel(species.waterNeeds) ? 'bg-blue-500' : 'bg-gray-200'"
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
                :class="n <= getLightLevel(species.lightNeeds) ? 'bg-yellow-500' : 'bg-gray-200'"
            />
          </div>
        </div>

        <!-- Temperature -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Thermometer class="w-4 h-4 text-red-500" />
            <span>Temperatura:</span>
          </div>
          <span class="text-sm text-gray-700">{{ species.temperature }}</span>
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
