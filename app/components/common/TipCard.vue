<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">

    <!-- Image Header -->
    <div class="relative h-48 bg-gradient-to-br from-gray-100 to-green-50 overflow-hidden">
      <img
          :src="image"
          :alt="title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          @error="onImgError"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <!-- Icon Badge -->
      <div class="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
        <component :is="icon" class="w-6 h-6 text-green-600" />
      </div>

      <!-- Difficulty Badge -->
      <div class="absolute top-4 right-4">
        <span
            class="px-3 py-1 rounded-full text-xs shadow-md"
            :class="difficultyColor"
        >
          {{ difficulty }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs text-green-600 uppercase tracking-wide">
          {{ category }}
        </span>
      </div>

      <h3 class="text-xl text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
        {{ title }}
      </h3>

      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ description }}
      </p>

      <!-- Meta Info -->
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div class="flex items-center gap-1">
          <User class="w-4 h-4" />
          <span>{{ author }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock class="w-4 h-4" />
          <span>{{ readTime }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <button
          class="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 group/btn"
      >
        <span class="text-sm">Leer consejo</span>
        <ArrowRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Clock, ArrowRight } from 'lucide-vue-next'
import { onImgError } from '~~/utils/image'

/**
 * Props
 */
const props = defineProps({
  image: String,
  title: String,
  description: String,
  category: String,
  difficulty: String,
  author: String,
  readTime: String,
  icon: Object, // Debe ser el componente del ícono
})

/**
 * Difficulty badge style
 */
const difficultyColor = computed(() => {
  switch (props.difficulty) {
    case 'Fácil':
      return 'bg-green-600 text-white'
    case 'Media':
      return 'bg-yellow-500 text-white'
    case 'Difícil':
      return 'bg-red-600 text-white'
    default:
      return 'bg-gray-300 text-gray-800'
  }
})
</script>
