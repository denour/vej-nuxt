<template>
  <aside class="bg-white rounded-2xl p-6 shadow-md h-fit sticky top-24">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <SlidersHorizontal class="w-5 h-5 text-green-600" />
        <h3 class="text-xl text-gray-800">Filtros</h3>
      </div>

      <button
          @click="showFilters = !showFilters"
          class="lg:hidden text-gray-500"
      >
        <ChevronDown
            :class="[
            'w-5 h-5 transition-transform',
            showFilters ? 'rotate-180' : ''
          ]"
        />
      </button>
    </div>

    <div :class="['space-y-6', showFilters ? 'block' : 'hidden lg:block']">
      <!-- Categories -->
      <div>
        <h4 class="text-sm text-gray-500 mb-3">Categoría</h4>
        <div class="space-y-2">
          <label
              v-for="(category, i) in categories"
              :key="i"
              class="flex items-center gap-2 cursor-pointer group"
          >
            <input
                type="checkbox"
                v-model="selectedCategories"
                :value="category.name"
                class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span class="text-gray-700 group-hover:text-green-600 transition-colors">
              {{ category.name }}
            </span>
            <span class="text-gray-400 text-sm ml-auto">({{ category.count }})</span>
          </label>
        </div>
      </div>

      <!-- Price Range -->
      <div class="border-t border-gray-100 pt-6">
        <h4 class="text-sm text-gray-500 mb-3">Rango de Precio</h4>
        <div class="space-y-3">
          <input
              type="range"
              min="0"
              max="1000"
              step="50"
              v-model="priceRange[1]"
              class="w-full accent-green-600"
          />
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">${{ priceRange[0] }}</span>
            <span class="text-gray-600">${{ priceRange[1] }}</span>
          </div>
        </div>
      </div>

      <!-- Size -->
      <div class="border-t border-gray-100 pt-6">
        <h4 class="text-sm text-gray-500 mb-3">Tamaño</h4>
        <div class="space-y-2">
          <label
              v-for="(size, i) in sizes"
              :key="i"
              class="flex items-center gap-2 cursor-pointer group"
          >
            <input
                type="checkbox"
                v-model="selectedSizes"
                :value="size"
                class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span class="text-gray-700 group-hover:text-green-600 transition-colors">
              {{ size }}
            </span>
          </label>
        </div>
      </div>

      <!-- Light Level -->
      <div class="border-t border-gray-100 pt-6">
        <h4 class="text-sm text-gray-500 mb-3">Nivel de Luz</h4>
        <div class="space-y-2">
          <label
              v-for="(level, i) in lightLevels"
              :key="i"
              class="flex items-center gap-2 cursor-pointer group"
          >
            <input
                type="checkbox"
                v-model="selectedLightLevels"
                :value="level"
                class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span class="text-gray-700 group-hover:text-green-600 transition-colors">
              {{ level }}
            </span>
          </label>
        </div>
      </div>

      <!-- Care Level -->
      <div class="border-t border-gray-100 pt-6">
        <h4 class="text-sm text-gray-500 mb-3">Nivel de Cuidado</h4>
        <div class="space-y-2">
          <label
              v-for="(level, i) in careLevels"
              :key="i"
              class="flex items-center gap-2 cursor-pointer group"
          >
            <input
                type="checkbox"
                v-model="selectedCareLevels"
                :value="level"
                class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span class="text-gray-700 group-hover:text-green-600 transition-colors">
              {{ level }}
            </span>
          </label>
        </div>
      </div>

      <!-- Reset Filters -->
      <div class="border-t border-gray-100 pt-6">
        <button
            @click="resetFilters"
            class="w-full py-2 text-green-600 hover:text-green-700 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { SlidersHorizontal, ChevronDown } from "lucide-vue-next";

const showFilters = ref(true);

const categories = [
  { name: "Suculentas", count: 34 },
  { name: "Plantas de Sombra", count: 12 },
  { name: "Aromáticas", count: 20 },
];

const sizes = ["Pequeño", "Mediano", "Grande"];

const lightLevels = ["Alta", "Media", "Baja"];

const careLevels = ["Fácil", "Moderado", "Difícil"];

const selectedCategories = ref([]);
const selectedSizes = ref([]);
const selectedLightLevels = ref([]);
const selectedCareLevels = ref([]);

const priceRange = ref([0, 500]);

const resetFilters = () => {
  selectedCategories.value = [];
  selectedSizes.value = [];
  selectedLightLevels.value = [];
  selectedCareLevels.value = [];
  priceRange.value = [0, 500];
};
</script>
