<script setup lang="ts">
import { Sparkles } from "lucide-vue-next";

// SVG pattern background
const patternBg =
    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20 Q 25 15, 20 20 T 20 30 Q 25 35, 30 30 T 30 20' fill='%23059669' /%3E%3C/svg%3E\")";
</script>

<template>
  <section class="relative h-[600px] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
    <!-- Decorative botanical elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-10 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
    </div>

    <!-- Botanical pattern overlay -->
    <div
        class="absolute inset-0 opacity-5"
        :style="{
        backgroundImage: patternBg,
        backgroundSize: '60px 60px'
      }"
    ></div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-6 h-full flex items-center">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
          <Sparkles class="w-4 h-4 text-green-600" />
          <span class="text-sm text-gray-700">Tu espacio verde favorito</span>
        </div>

        <h1
            class="text-6xl mb-6 text-gray-800 leading-tight"
            :style="{ fontFamily: 'serif' }"
        >
          Cultiva tu pasión
          <br />
          <span class="text-green-600">por las plantas</span>
        </h1>

        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          Descubre consejos expertos, explora especies únicas y encuentra todo lo que necesitas para crear tu jardín ideal.
        </p>

        <div class="flex gap-4">
<!--          <NuxtLink :to="`/store`" class="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl">-->
<!--            Explorar Tienda-->
<!--          </NuxtLink>-->

          <NuxtLink :to="`/blog`" class="px-8 py-3 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all shadow-md">
            Leer Blog
          </NuxtLink>
        </div>
      </div>

      <!-- Decorative image -->
      <div class="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2">
        <div class="relative">
          <div class="absolute inset-0 bg-green-400/20 rounded-full blur-2xl"></div>

          <img
              src="https://images.unsplash.com/photo-1710948410781-d5ba35329a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBnYXJkZW4lMjBncmVlbnxlbnwxfHx8fDE3NjQ5MTEwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Botanical"
              class="relative w-80 h-80 object-cover rounded-full shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
