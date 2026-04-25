<script setup lang="ts">
import { onMounted } from 'vue'
import { ArrowUpRight, Package, ShieldCheck, Truck } from 'lucide-vue-next'
import { useProductsStore } from '~~/stores/Product'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Tienda — Vida en el Jardín',
  description: 'Plantas curadas, listas para su nuevo hogar. Envío en empaque botánico con garantía de llegada.',
})

const products = useProductsStore()

onMounted(async () => {
  try { await (products as any).fetchProducts?.() } catch (e) { /* graceful */ }
})

const features = [
  { icon: Package, title: 'Empaque botánico', body: 'Diseñado para que lleguen vivas y firmes.' },
  { icon: Truck, title: 'Envío 24-48h', body: 'En CDMX y zona metropolitana.' },
  { icon: ShieldCheck, title: 'Garantía 30 días', body: 'Reposición sin preguntas si llega dañada.' },
]
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Tienda"
      title="Plantas listas"
      italic="para su"
      trailing="nuevo hogar."
      description="Curadas a mano, empacadas con cuidado y enviadas con garantía de llegada. Cada una viene con su ficha de cuidado."
    />

    <!-- Trust strip -->
    <section class="border-y border-line">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 grid sm:grid-cols-3 gap-8">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: i * 100 } }"
          class="flex items-center gap-5"
        >
          <div class="w-12 h-12 rounded-full border border-line flex items-center justify-center text-terra flex-shrink-0">
            <component :is="f.icon" class="w-5 h-5" />
          </div>
          <div>
            <div class="font-display text-cream text-xl tracking-tighter">{{ f.title }}</div>
            <div class="text-cream-60 text-sm">{{ f.body }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products grid (or empty state) -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto py-20">
      <div v-if="!products.products || products.products.length === 0" class="py-20 text-center">
        <div class="font-display text-cream text-5xl mb-6 tracking-tighter">
          Tienda
          <em class="font-display-italic text-terra">en germinación</em>.
        </div>
        <p class="text-cream-60 max-w-md mx-auto leading-relaxed">
          Estamos preparando las primeras especies para venta. Mientras tanto, puedes explorar el
          <NuxtLink to="/species" class="text-cream underline decoration-terra underline-offset-4 hover:text-terra transition-colors">catálogo botánico</NuxtLink>
          y suscribirte para enterarte cuando abramos.
        </p>
        <div class="mt-12 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/species"
            class="inline-flex items-center gap-3 px-7 py-4 bg-cream text-ink rounded-full text-sm font-medium hover:bg-terra transition-colors duration-500 shine-on-hover"
          >
            Ver especies
            <ArrowUpRight class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="inline-flex items-center gap-3 px-7 py-4 border border-cream/30 text-cream rounded-full text-sm font-medium hover:border-cream hover:bg-cream/5 transition-all"
          >
            Pedir alerta
          </NuxtLink>
        </div>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="(product, idx) in products.products"
          :key="(product as any).id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: (idx % 8) * 60 } }"
          class="group relative overflow-hidden rounded-2xl bg-ink-card border border-line cursor-pointer transition-all duration-500 hover:border-cream/30"
        >
          <div class="relative aspect-[4/5] overflow-hidden">
            <img
              :src="(product as any).image"
              :alt="(product as any).name"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div class="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/10 backdrop-blur border border-cream/20 flex items-center justify-center transition-all duration-500 group-hover:bg-terra group-hover:border-terra">
              <ArrowUpRight class="w-4 h-4 text-cream transition-transform duration-500 group-hover:rotate-45 group-hover:text-ink" />
            </div>
          </div>
          <div class="p-5 flex items-baseline justify-between">
            <h3 class="font-display text-cream text-xl tracking-tighter">{{ (product as any).name }}</h3>
            <span class="text-terra font-display text-lg">${{ (product as any).price }}</span>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
