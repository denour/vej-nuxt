<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, X, Droplets, Sun, Scissors, Sprout, Bug, AlertCircle } from 'lucide-vue-next'
import { usePostsStore } from '~~/stores/BlogPost'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Consejos — Vida en el Jardín',
  description: 'Guías prácticas para resolver problemas comunes y mejorar el cuidado de tus plantas.',
})

const searchQuery = ref('')
const selectedCategory = ref('Todos')

const categoryIcons: Record<string, any> = {
  'Cuidados': Droplets,
  'Especies': Sprout,
  'Diseño': Sun,
  'Sustratos': Scissors,
  'Plagas': Bug,
  'Problemas': AlertCircle,
}

const postsStore = usePostsStore()

onMounted(async () => {
  try { await postsStore.fetchPosts() } catch (e) { /* falls back */ }
})

const allPosts = computed(() => postsStore.posts)

const categories = computed(() => {
  const set = new Set<string>(['Todos'])
  allPosts.value.forEach(p => {
    const c = (p as any).category
    if (c) set.add(c)
  })
  return Array.from(set)
})

const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return allPosts.value.filter(p => {
    const matchCat = selectedCategory.value === 'Todos' || (p as any).category === selectedCategory.value
    const matchQ = q === '' ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q)
    return matchCat && matchQ
  })
})

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }) : ''
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Guías de cuidado"
      title="Consejos"
      italic="prácticos"
      trailing="que sí funcionan."
      description="Desde regar sin matar hasta combatir plagas en casa. Guías escritas por jardineros, probadas en plantas reales."
    >
      <template #after>
        <div class="relative max-w-[1400px] mx-auto mt-12 px-6 lg:px-12">
          <div class="relative flex items-center bg-ink-card border border-line rounded-full px-7 py-2 max-w-2xl">
            <Search class="w-5 h-5 text-cream-40 flex-shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar consejos..."
              class="flex-1 bg-transparent text-cream placeholder-cream/30 px-4 py-3 outline-none text-base"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="text-cream-40 hover:text-terra p-1">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </template>
    </PageHero>

    <!-- Category pills -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-12">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in categories"
          :key="c"
          @click="selectedCategory = c"
          :class="[
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all duration-300 border',
            selectedCategory === c
              ? 'bg-terra border-terra text-ink'
              : 'bg-transparent border-line text-cream-60 hover:border-cream/40 hover:text-cream'
          ]"
        >
          <component v-if="c !== 'Todos' && categoryIcons[c]" :is="categoryIcons[c]" class="w-3.5 h-3.5" />
          {{ c }}
        </button>
      </div>
    </section>

    <!-- Tips grid -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div v-if="filtered.length === 0" class="py-20 text-center">
        <div class="font-display text-cream text-3xl tracking-tighter">
          Sin
          <em class="font-display-italic text-terra">resultados</em>.
        </div>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        <NuxtLink
          v-for="(tip, idx) in filtered"
          :key="tip.id"
          :to="`/blog/${(tip as any).slug}`"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: (idx % 6) * 80 } }"
          class="group block"
        >
          <div class="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-ink-card">
            <img
              :src="(tip as any).image"
              :alt="tip.title"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            <div class="absolute top-5 left-5">
              <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-cream/15 backdrop-blur border border-cream/20 rounded-full text-cream text-[11px] tracking-[0.2em] uppercase">
                <component v-if="categoryIcons[(tip as any).category]" :is="categoryIcons[(tip as any).category]" class="w-3 h-3" />
                {{ (tip as any).category }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3 text-cream-40 text-xs tracking-wider uppercase mb-3">
            <span>{{ formatDate((tip as any).publishedAt) }}</span>
            <span class="text-terra">·</span>
            <span>{{ (tip as any).readTime }}</span>
          </div>

          <h3 class="font-display text-cream text-2xl lg:text-3xl tracking-tighter leading-tight group-hover:text-terra transition-colors duration-500">
            {{ tip.title }}
          </h3>
          <p class="mt-3 text-cream-60 leading-relaxed line-clamp-3">{{ tip.excerpt }}</p>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
