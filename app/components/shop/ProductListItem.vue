<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
    <div class="grid md:grid-cols-3 gap-6 p-6">

      <!-- Image -->
      <div class="relative h-64 md:h-full bg-gradient-to-br from-gray-50 to-green-50 rounded-xl overflow-hidden">
        <img
            :src="image"
            :alt="name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div
            v-if="!inStock"
            class="absolute inset-0 bg-gray-900/50 flex items-center justify-center"
        >
          <span class="bg-white px-4 py-2 rounded-full text-sm">
            Agotado
          </span>
        </div>

        <button
            class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-50 transition-colors"
        >
          <Heart class="w-5 h-5 text-gray-600 hover:text-green-600" />
        </button>
      </div>

      <!-- Content -->
      <div class="md:col-span-2 flex flex-col justify-between">
        <div>
          <div class="mb-3">
            <h3 class="text-2xl text-gray-800 group-hover:text-green-600 transition-colors mb-1">
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
            <span class="text-sm text-gray-500 ml-2">({{ reviews }} reseñas)</span>
          </div>

          <p class="text-gray-600 mb-4 line-clamp-2">
            {{ description }}
          </p>

          <!-- Care Info -->
          <div class="flex flex-wrap gap-4 mb-4">
            <!-- Light -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <Sun class="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Luz</p>
                <p class="text-sm text-gray-700">{{ light }}</p>
              </div>
            </div>

            <!-- Water -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Droplet class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p class="text-xs text-gray-500">Riego</p>
                <p class="text-sm text-gray-700">{{ water }}</p>
              </div>
            </div>

            <!-- Care Level -->
            <div>
              <p class="text-xs text-gray-500">Cuidado</p>
              <span class="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {{ careLevel }}
              </span>
            </div>
          </div>
        </div>

        <!-- Price & Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span class="text-3xl text-gray-800">${{ price }}</span>
            <span class="text-gray-500 text-sm ml-1">MXN</span>
          </div>

          <button
              class="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!inStock"
          >
            <ShoppingCart class="w-5 h-5" />
            <span>Agregar al carrito</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Star, ShoppingCart, Heart, Droplet, Sun } from "lucide-vue-next";

defineProps({
  image: String,
  name: String,
  scientificName: String,
  price: Number,
  rating: Number,
  reviews: Number,
  description: String,
  careLevel: String,
  light: String,
  water: String,
  inStock: {
    type: Boolean,
    default: true,
  },
});
</script>
