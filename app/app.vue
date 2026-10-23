<script setup lang="ts">
const route = useRoute()
const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

useHead({
  link: [{ rel: 'canonical', href: () => siteUrl + route.path }],
})
</script>

<template>
  <div class="relative min-h-screen bg-ink text-cream">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
