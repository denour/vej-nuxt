<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-16">
    <div class="max-w-xl text-center">
      <div class="w-20 h-20 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
        <span class="text-3xl">🌿</span>
      </div>
      <h1 class="text-4xl mb-3 text-gray-800" style="font-family: serif;">
        {{ is404 ? 'Página no encontrada' : 'Ha ocurrido un error' }}
      </h1>
      <p class="text-gray-600 mb-8">
        {{ message }}
      </p>
      <NuxtLink to="/" class="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
        Volver al inicio
      </NuxtLink>
    </div>
  </div>
  <NuxtLoadingIndicator />
</template>

<script setup lang="ts">
const props = defineProps<{ error: any }>()
const is404 = computed(() => props.error?.statusCode === 404)
const message = computed(() => props.error?.statusMessage || 'Intenta nuevamente en unos momentos.')
</script>
