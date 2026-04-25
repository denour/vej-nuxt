<script setup lang="ts">
import { Instagram, Twitter, Youtube } from 'lucide-vue-next'

const year = new Date().getFullYear()

const sections = [
  {
    title: 'Explorar',
    links: [
      { name: 'Inicio', path: '/' },
      { name: 'Especies', path: '/species' },
      { name: 'Blog', path: '/blog' },
      { name: 'Tienda', path: '/store' },
    ],
  },
  {
    title: 'Apoyo',
    links: [
      { name: 'Preguntas frecuentes', path: '/faq' },
      { name: 'Envíos', path: '/shipments' },
      { name: 'Devoluciones', path: '/returns' },
      { name: 'Contacto', path: '/contact' },
    ],
  },
]
</script>

<template>
  <footer class="relative px-6 lg:px-12 pt-32 pb-10 border-t border-line max-w-[1400px] mx-auto">
    <div class="grid lg:grid-cols-12 gap-12 mb-20">
      <!-- Brand -->
      <div class="lg:col-span-5">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-full border border-cream/40 flex items-center justify-center">
            <span class="font-display text-cream text-xl leading-none">v</span>
          </div>
          <span class="font-display text-cream text-2xl tracking-tightest">Vida en el Jardín</span>
        </div>
        <p class="text-cream-60 text-lg leading-relaxed max-w-md">
          Una guía botánica para quienes consideran el jardín
          <em class="font-display-italic">parte del hogar, no su decorado</em>.
        </p>

        <div class="mt-10 flex items-center gap-4">
          <a
            v-for="(Icon, i) in [Instagram, Twitter, Youtube]"
            :key="i"
            href="#"
            class="w-11 h-11 rounded-full border border-cream/20 flex items-center justify-center text-cream-60 hover:bg-terra hover:border-terra hover:text-ink transition-all duration-500"
          >
            <component :is="Icon" class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Sections -->
      <div
        v-for="section in sections"
        :key="section.title"
        class="lg:col-span-2"
      >
        <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-6">
          {{ section.title }}
        </div>
        <ul class="space-y-4">
          <li v-for="link in section.links" :key="link.path">
            <NuxtLink
              :to="link.path"
              class="text-cream/80 hover:text-terra transition-colors text-base"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Time / location -->
      <div class="lg:col-span-3">
        <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-6">Desde</div>
        <p class="text-cream/80 mb-3">Ciudad de México, MX</p>
        <p class="text-cream-60 text-sm">
          Lunes a viernes
          <br />
          9:00 — 18:00 hrs
        </p>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="pt-10 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p class="text-cream-40 text-xs tracking-wide">
        © {{ year }} Vida en el Jardín · Todos los derechos reservados
      </p>
      <div class="flex items-center gap-6 text-cream-40 text-xs tracking-wide">
        <NuxtLink to="/" class="hover:text-cream transition-colors">Privacidad</NuxtLink>
        <NuxtLink to="/" class="hover:text-cream transition-colors">Términos</NuxtLink>
      </div>
    </div>

    <!-- Mega watermark -->
    <div class="mt-20 overflow-hidden pointer-events-none">
      <div class="font-display text-cream/[0.03] text-[20vw] leading-none tracking-tighter whitespace-nowrap text-center">
        VIDA EN EL JARDÍN
      </div>
    </div>
  </footer>
</template>
