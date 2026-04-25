<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const navigationLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Especies', path: '/species' },
  { name: 'Blog', path: '/blog' },
  { name: 'Tienda', path: '/store' },
  { name: 'Contacto', path: '/contact' },
]

const onScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const toggle = () => (mobileMenuOpen.value = !mobileMenuOpen.value)
const close = () => (mobileMenuOpen.value = false)
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-quint"
    :class="scrolled
      ? 'bg-ink/85 backdrop-blur-xl border-b border-line py-3'
      : 'bg-transparent py-6'"
  >
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group" @click="close">
        <div class="w-9 h-9 rounded-full border border-cream/40 group-hover:border-terra flex items-center justify-center transition-colors duration-500 ease-out-quint">
          <span class="font-display text-cream text-lg leading-none">v</span>
        </div>
        <span class="font-display text-cream text-lg tracking-tightest hidden sm:block">
          Vida en el Jardín
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-10">
        <NuxtLink
          v-for="link in navigationLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link text-sm tracking-wide text-cream-60 hover:text-cream transition-colors"
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <!-- CTA -->
      <NuxtLink
        to="/store"
        class="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-terra text-ink rounded-full text-sm font-medium hover:bg-cream transition-colors duration-300 shine-on-hover"
      >
        Tienda
        <span class="text-base leading-none">→</span>
      </NuxtLink>

      <!-- Mobile menu toggle -->
      <button
        @click="toggle"
        class="md:hidden text-cream p-2"
        aria-label="Toggle menu"
      >
        <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-ink/95 backdrop-blur-xl border-b border-line"
      >
        <div class="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-6">
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.path"
            :to="link.path"
            @click="close"
            class="font-display text-3xl text-cream hover:text-terra transition-colors"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>
