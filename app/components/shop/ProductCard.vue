<script setup lang="ts">
import { Star, ShoppingCart } from 'lucide-vue-next';
defineProps<{
  image: string;
  name: string;
  scientificName: string;
  rating: number;
  reviews: number;
  price: number;
  inStock: boolean;
}>();
</script>

<template>
    <div
        class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      <!-- Image -->
      <div class="relative h-72 bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden">
        <img
            :src="image"
            :alt="name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <!-- Agotado -->
        <div
            v-if="!inStock"
            class="absolute inset-0 bg-gray-900/50 flex items-center justify-center"
        >
        <span class="bg-white px-4 py-2 rounded-full text-sm">
          Agotado
        </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="mb-3">
          <h3 class="text-lg text-gray-800 group-hover:text-green-600 transition-colors">
            {{ name }}
          </h3>
          <p class="text-sm text-gray-500 italic">{{ scientificName }}</p>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-1 mb-4">
          <Star
              v-for="i in 5"
              :key="i"
              class="w-4 h-4"
              :class="i <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'"
          />
          <span class="text-sm text-gray-500 ml-2">({{ reviews }})</span>
        </div>

        <!-- Price + Button -->
        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl text-gray-800">${{ price }}</span>
            <span class="text-gray-500 text-sm ml-1">MXN</span>
          </div>

          <button
              class="px-5 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!inStock"
          >
            <ShoppingCart class="w-4 h-4" />
            <span class="text-sm">Agregar</span>
          </button>
        </div>
      </div>
    </div>
</template>
