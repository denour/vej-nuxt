<script lang="ts">
import { defineComponent } from 'vue'
import { ArrowUpIcon, MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'Navigation',
  components: {
    ArrowUpIcon,
    MagnifyingGlassIcon,
    ShoppingCartIcon
  },
  data() {
    return {
      cartCount: 3,
      navigationLinks: [
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        // { name: 'Tienda', path: '/store' },
        { name: 'Especies', path: '/species' },
        // { name: 'Consejos', path: '/tips' },
        { name: 'Contacto', path: '/contact' }
      ]
    }
  }
})
</script>

<template>
  <nav class="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <ArrowUpIcon class="w-6 h-6 text-white" />
          </div>
          <span class="text-xl text-gray-800" style="font-family: serif">
            Vida en el Jardín
          </span>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.path"
            :to="link.path"
            class="text-gray-700 hover:text-green-600 transition-colors"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- Icons -->
<!--        <div class="flex items-center gap-4">-->
<!--          <button class="text-gray-600 hover:text-green-600 transition-colors">-->
<!--            <MagnifyingGlassIcon class="w-5 h-5" />-->
<!--          </button>-->
<!--          <button class="relative text-gray-600 hover:text-green-600 transition-colors">-->
<!--            <ShoppingCartIcon class="w-5 h-5" />-->
<!--            <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">-->
<!--              {{ cartCount }}-->
<!--            </span>-->
<!--          </button>-->
<!--        </div>-->
      </div>
    </div>
  </nav>
</template>
