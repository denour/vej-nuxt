<script setup lang="ts">
import { Sprout } from 'lucide-vue-next'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Devoluciones — Vida en el Jardín',
  description: 'Nuestra tienda aún no está abierta: por ahora no hay ventas ni devoluciones. Cuando abramos publicaremos aquí la política.',
  robots: 'noindex',
})
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Política"
      title="Devoluciones,"
      italic="todavía"
      trailing="en germinación."
      description="Por ahora la tienda está en germinación: todavía no vendemos ni hacemos devoluciones."
    />

    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="p-8 lg:p-12 rounded-3xl bg-ink-card border border-line max-w-3xl"
      >
        <div class="flex items-center gap-3 mb-6">
          <Sprout class="w-5 h-5 text-terra" />
          <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Estado de la tienda</div>
        </div>
        <h2 class="font-display text-cream text-3xl lg:text-4xl tracking-tighter leading-tight mb-6">
          Aún no hay pedidos,
          <em class="font-display-italic text-terra">así que aún no hay devoluciones</em>.
        </h2>
        <p class="text-cream-60 leading-relaxed">
          Vida en el Jardín hoy es un blog y una guía de especies. Cuando abramos la tienda publicaremos
          aquí la política de devoluciones completa, antes de aceptar el primer pedido.
          Mientras tanto, si tienes una duda sobre tus plantas, escríbenos.
        </p>

        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center gap-3 px-7 py-4 bg-terra text-ink rounded-full font-medium tracking-wide hover:bg-cream transition-colors duration-500 shine-on-hover"
          >
            Escríbenos
            <span>→</span>
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-3 px-7 py-4 border border-cream/30 text-cream rounded-full hover:border-cream hover:bg-cream/5 transition-all"
          >
            Leer el blog
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
