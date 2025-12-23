<script lang="ts">
import { defineComponent } from 'vue'
import { ArrowUpIcon, MagnifyingGlassIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'Navigation',
  components: {
    ArrowUpIcon,
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    Bars3Icon,
    XMarkIcon
  },
  data() {
    return {
      cartCount: 3,
      mobileMenuOpen: false,
      navigationLinks: [
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        // { name: 'Tienda', path: '/store' },
        { name: 'Especies', path: '/species' },
        // { name: 'Consejos', path: '/tips' },
        { name: 'Contacto', path: '/contact' }
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
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

        <!-- Navigation Links (Desktop) -->
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

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-gray-600 hover:text-green-600 transition-colors p-2"
          aria-label="Toggle menu"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-4 pb-4 border-t border-green-100"
      >
        <div class="flex flex-col gap-4 pt-4">
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.path"
            :to="link.path"
            @click="closeMobileMenu"
            class="text-gray-700 hover:text-green-600 transition-colors py-2 px-4 hover:bg-green-50 rounded-lg"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
