<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { usePostsStore } from "~~/stores/BlogPost"

useSeoMeta({
  title: 'Blog — Vida en el Jardín',
  description: 'Ensayos botánicos, guías de cuidado y notas para cultivadores curiosos. Escrito por jardineros, no por algoritmos.',
  ogTitle: 'Blog — Vida en el Jardín',
  ogDescription: 'Ensayos botánicos y guías de jardinería para cultivadores curiosos.',
})

const posts = usePostsStore()
const searchQuery = ref('')

let searchTimer: any
watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => posts.fetchPosts({ q }), 300)
})

onMounted(async () => {
  try {
    await posts.fetchPosts()
  } catch (e) { /* graceful — falls back to mocks */ }
})

const featured = computed(() => posts.featuredPost)
const listPosts = computed(() => posts.postsWithoutFeatured)

const formatDate = (d?: string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <main class="relative min-h-screen">
    <!-- Hero -->
    <section class="relative pt-40 pb-20 px-6 lg:px-12 overflow-hidden">
      <div class="absolute -top-40 left-1/3 w-[700px] h-[700px] rounded-full bg-moss/25 blur-[140px]" />

      <div class="relative max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12">
        <div class="lg:col-span-2">
          <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">Lecturas</div>
        </div>
        <div class="lg:col-span-7">
          <h1
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            class="font-display text-cream text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tightest font-light"
          >
            <span class="block">Ensayos para</span>
            <span class="block"><em class="font-display-italic text-terra">cultivadores</em></span>
            <span class="block">curiosos.</span>
          </h1>
        </div>
        <div class="lg:col-span-3 lg:pt-6">
          <p
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 700 } }"
            class="text-cream-60 leading-relaxed"
          >
            Lecturas largas y guías cortas. Escrito por jardineros, no por algoritmos.
            Sin SEO bait, sin listicles vacíos.
          </p>
        </div>
      </div>

      <!-- Search -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 700 } }"
        class="relative max-w-[1400px] mx-auto mt-12"
      >
        <div class="relative flex items-center bg-ink-card border border-line rounded-full px-7 py-2 max-w-2xl">
          <Search class="w-5 h-5 text-cream-40 flex-shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar entre los ensayos..."
            class="flex-1 bg-transparent text-cream placeholder-cream/30 px-4 py-3 outline-none text-base"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="text-cream-40 hover:text-terra p-1"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section v-if="featured" class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-16">
      <NuxtLink
        :to="`/blog/${(featured as any).slug}`"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="group block relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden border border-line"
      >
        <img
          :src="(featured as any).image"
          :alt="featured.title"
          class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-8 lg:p-14">
          <span class="px-3 py-1 bg-cream/15 backdrop-blur border border-cream/20 rounded-full text-cream text-[10px] tracking-[0.25em] uppercase">
            {{ (featured as any).category || 'Featured' }}
          </span>
          <h2 class="mt-6 font-display text-cream text-4xl lg:text-7xl tracking-tighter leading-[0.95] max-w-3xl group-hover:text-terra transition-colors duration-500">
            {{ featured.title }}
          </h2>
          <p class="mt-5 text-cream/80 max-w-2xl text-base lg:text-lg leading-relaxed">
            {{ featured.excerpt }}
          </p>
          <div class="mt-6 flex items-center gap-4 text-cream-40 text-xs tracking-wider uppercase">
            <span>{{ formatDate((featured as any).publishedAt) }}</span>
            <span class="text-terra">·</span>
            <span>{{ (featured as any).readTime }}</span>
          </div>
        </div>
      </NuxtLink>
    </section>

    <!-- Empty state -->
    <section v-if="!featured && listPosts.length === 0" class="px-6 py-32 text-center">
      <div class="font-display text-cream text-4xl mb-4 tracking-tighter">
        Aún
        <em class="font-display-italic text-terra">germinando</em>.
      </div>
      <p class="text-cream-60 max-w-md mx-auto">
        Estamos escribiendo más. Vuelve pronto o ajusta tu búsqueda si tienes algún término activo.
      </p>
    </section>

    <!-- Grid -->
    <section v-if="listPosts.length > 0" class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        <NuxtLink
          v-for="(post, idx) in listPosts"
          :key="post.id"
          :to="`/blog/${(post as any).slug}`"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: (idx % 6) * 80 } }"
          class="group block"
        >
          <div class="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-ink-card">
            <img
              :src="(post as any).image"
              :alt="post.title"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            <div class="absolute top-5 left-5">
              <span class="px-3 py-1.5 bg-cream/15 backdrop-blur border border-cream/20 rounded-full text-cream text-[11px] tracking-[0.2em] uppercase">
                {{ (post as any).category }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3 text-cream-40 text-xs tracking-wider uppercase mb-3">
            <span>{{ formatDate((post as any).publishedAt) }}</span>
            <span class="text-terra">·</span>
            <span>{{ (post as any).readTime }}</span>
          </div>
          <h3 class="font-display text-cream text-2xl lg:text-3xl tracking-tighter leading-tight group-hover:text-terra transition-colors duration-500">
            {{ post.title }}
          </h3>
          <p class="mt-3 text-cream-60 leading-relaxed line-clamp-3">
            {{ post.excerpt }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
