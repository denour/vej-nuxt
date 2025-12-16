<template>
  <!-- Hero -->
  <section class="bg-gradient-to-br from-teal-600 to-cyan-700 text-white py-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-3xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
          </div>
          <h1 class="text-5xl" style="font-family: serif">
            Consejos
          </h1>
        </div>

        <p class="text-xl text-teal-100 mb-8">
          Guías prácticas y consejos de expertos para resolver problemas comunes,
          mejorar el cuidado de tus plantas y convertirte en un jardinero experto.
        </p>

        <!-- Search -->
        <div class="relative max-w-xl">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
              type="text"
              placeholder="Buscar consejos..."
              v-model="searchQuery"
              class="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Quick Access -->
  <section class="bg-white py-12 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="text-2xl mb-8 text-gray-800 text-center" style="font-family: serif">
        Acceso Rápido
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
            v-for="category in categories.filter(c => c.name !== 'Todos')"
            :key="category.name"
            @click="selectedCategory = category.name"
            :class="[
            'p-6 rounded-2xl transition-all flex flex-col items-center gap-3',
            selectedCategory === category.name
              ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl scale-105'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          ]"
        >
          <div
              :class="[
              'w-12 h-12 rounded-full flex items-center justify-center',
              selectedCategory === category.name ? 'bg-white/20' : 'bg-white'
            ]"
          >
            <component :is="category.icon" />
          </div>

          <span class="text-sm text-center">{{ category.name }}</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Categories Filter -->
  <section class="bg-white border-b border-gray-200 sticky top-[72px] z-20 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center gap-4 overflow-x-auto">
        <span class="text-sm text-gray-600 flex-shrink-0">Filtrar:</span>

        <div class="flex gap-2">
          <button
              v-for="category in categories"
              :key="category.name"
              @click="selectedCategory = category.name"
              :class="[
              'px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap flex items-center gap-2',
              selectedCategory === category.name
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <component :is="category.icon" />
            <span>{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Tip -->
  <section class="max-w-7xl mx-auto px-6 py-12">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-8 bg-teal-600 rounded-full"></div>
        <h2 class="text-3xl text-gray-800" style="font-family: serif">
          Consejo Destacado
        </h2>
      </div>
    </div>

    <div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group mb-16">
      <div class="grid md:grid-cols-2 gap-0">
        <div class="relative h-96 md:h-full bg-gradient-to-br from-gray-100 to-teal-50 overflow-hidden">
          <img
              src="https://images.unsplash.com/photo-1610968228389-d0047911d878"
              alt="Featured tip"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div class="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Sprout class="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div class="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Intermedio
            </span>
            <span class="text-sm text-gray-500">• 8 min de lectura</span>
          </div>

          <h2 class="text-3xl md:text-4xl mb-4 text-gray-800 group-hover:text-teal-600 transition-colors" style="font-family: serif">
            Propagación en agua paso a paso
          </h2>

          <p class="text-gray-600 mb-6 leading-relaxed">
            Descubre todos los secretos para multiplicar tus plantas favoritas usando el método
            de propagación en agua.
          </p>

          <button class="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all shadow-md self-start">
            Leer guía completa
          </button>
        </div>
      </div>
    </div>

    <!-- All Tips -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div class="w-1 h-8 bg-teal-600 rounded-full"></div>
          <h2 class="text-3xl text-gray-800" style="font-family: serif">
            Todos los Consejos
          </h2>
        </div>

        <p class="text-gray-600">
          {{ filteredTips.length }} {{ filteredTips.length === 1 ? 'consejo' : 'consejos' }}
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <TipCard v-for="(tip, index) in filteredTips" :key="index" v-bind="tip" />
    </div>

    <div v-if="filteredTips.length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search class="w-10 h-10 text-gray-400" />
      </div>
      <p class="text-gray-500 mb-2">No se encontraron consejos</p>
      <p class="text-sm text-gray-400">Intenta con otra búsqueda o categoría</p>
    </div>

    <div v-if="filteredTips.length > 0" class="text-center">
      <button class="px-8 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-full hover:bg-teal-50 transition-all">
        Cargar más consejos
      </button>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-br from-teal-600 to-cyan-600 py-16">
    <div class="max-w-4xl mx-auto px-6 text-center text-white">
      <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle class="w-8 h-8" />
      </div>

      <h2 class="text-3xl md:text-4xl mb-4" style="font-family: serif">
        ¿Necesitas ayuda personalizada?
      </h2>

      <p class="text-xl text-teal-100 mb-8">
        Nuestro equipo de expertos está aquí para ayudarte con cualquier problema específico
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="px-8 py-4 bg-white text-teal-600 rounded-full hover:bg-teal-50 transition-all shadow-lg">
          Consultar a un experto
        </button>

        <button class="px-8 py-4 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-all border-2 border-white/20">
          Ver preguntas frecuentes
        </button>
      </div>
    </div>
  </section>
 </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Droplets, Sun, Scissors, Sprout, Bug, AlertCircle } from 'lucide-vue-next'
import TipCard from "~/components/common/TipCard.vue";
import { useTipsStore } from '~~/stores/Tips'
import { useSeoMeta } from '#imports'

const searchQuery = ref('')
const selectedCategory = ref('Todos')

const categories = [
  { name: 'Todos', icon: null },
  { name: 'Riego', icon: Droplets },
  { name: 'Iluminación', icon: Sun },
  { name: 'Poda', icon: Scissors },
  { name: 'Propagación', icon: Sprout },
  { name: 'Plagas', icon: Bug },
  { name: 'Problemas', icon: AlertCircle }
]

const tipsStore = useTipsStore()
onMounted(async () => {
  await tipsStore.fetchTips()
})

const iconMap: Record<string, any> = {
  'Riego': Droplets,
  'Iluminación': Sun,
  'Poda': Scissors,
  'Propagación': Sprout,
  'Plagas': Bug,
  'Problemas': AlertCircle,
}

const mappedTips = computed(() =>
  tipsStore.all.map(p => ({
    image: (p as any).coverImage || '',
    title: p.title,
    description: p.excerpt,
    category: (p as any).category || 'Consejos',
    difficulty: 'Intermedio',
    author: (p.author && (p.author as any).name) ? (p.author as any).name : 'Equipo Vida en el Jardín',
    readTime: (p as any).readTime || `${(p as any).readingTime || 5} min`,
    icon: iconMap[(p as any).category] || Sprout,
  }))
)

const filteredTips = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return mappedTips.value.filter(tip => {
    const matchesCategory = selectedCategory.value === 'Todos' || tip.category === selectedCategory.value
    const matchesSearch =
      tip.title?.toLowerCase().includes(q) || tip.description?.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })
})

useSeoMeta({
  title: 'Consejos | Vida en el Jardín',
  description: 'Guías prácticas y consejos de expertos para resolver problemas comunes y mejorar el cuidado de tus plantas.',
  ogTitle: 'Consejos | Vida en el Jardín',
  ogDescription: 'Guías prácticas y consejos de expertos para tus plantas.',
})
</script>
