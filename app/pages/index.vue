<script setup lang="ts">
import HomeHero from '~/components/home/HomeHero.vue'
import HomeMarquee from '~/components/home/HomeMarquee.vue'
import HomeFeaturedSpecies from '~/components/home/HomeFeaturedSpecies.vue'
import HomeBlog from '~/components/home/HomeBlog.vue'
import HomeManifesto from '~/components/home/HomeManifesto.vue'
import HomeCTA from '~/components/home/HomeCTA.vue'

useSeoMeta({
  title: 'Vida en el Jardín — Botánica para tu casa',
  description: 'Una guía botánica para quienes ven el jardín como ritual. Especies curadas, ensayos largos, y todo lo que florece en lo cotidiano.',
  ogTitle: 'Vida en el Jardín — Botánica para tu casa',
  ogDescription: 'Especies curadas, ensayos botánicos, y todo lo que florece en lo cotidiano. Tu santuario verde empieza aquí.',
  ogType: 'website',
})
</script>

<template>
  <main class="relative">
    <HomeHero />
    <HomeMarquee />
    <HomeFeaturedSpecies />
    <HomeBlog />
    <HomeManifesto />
    <HomeCTA />
  </main>
</template>
