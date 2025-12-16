<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center">
          <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle class="w-8 h-8" />
          </div>
          <h1 class="text-5xl mb-4" style="font-family: serif;">Preguntas Frecuentes</h1>
          <p class="text-xl text-purple-100 mb-8">
            Encuentra respuestas rápidas a las dudas más comunes sobre pedidos, envíos, pagos y cuidado de plantas.
          </p>

          <!-- Search Bar -->
          <div class="relative max-w-2xl mx-auto">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="¿Qué necesitas saber?"
                v-model="searchQuery"
                class="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="bg-white py-12 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div class="text-3xl text-purple-600 mb-1" style="font-family: serif;">
              {{ faqs.length }}
            </div>
            <p class="text-sm text-gray-600">Preguntas respondidas</p>
          </div>
          <div>
            <div class="text-3xl text-purple-600 mb-1" style="font-family: serif;">
              {'<'}2h
            </div>
            <p class="text-sm text-gray-600">Tiempo de respuesta</p>
          </div>
          <div>
            <div class="text-3xl text-purple-600 mb-1" style="font-family: serif;">
              95%
            </div>
            <p class="text-sm text-gray-600">Satisfacción</p>
          </div>
          <div>
            <div class="text-3xl text-purple-600 mb-1" style="font-family: serif;">
              24/7
            </div>
            <p class="text-sm text-gray-600">Soporte disponible</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="bg-white border-b border-gray-200 sticky top-[72px] z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center gap-4 overflow-x-auto">
          <span class="text-sm text-gray-600 flex-shrink-0">Categorías:</span>
          <div class="flex gap-2">
            <button
                v-for="category in categories"
                :key="category.name"
                @click="selectedCategory = category.name"
                :class="[
                'px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap flex items-center gap-2',
                selectedCategory === category.name
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <component :is="category.icon" class="w-4 h-4" />
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Questions -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-8 bg-purple-600 rounded-full"></div>
          <h2 class="text-3xl text-gray-800" style="font-family: serif;">
            {{ selectedCategory === 'Todos' ? 'Preguntas Más Populares' : `Preguntas sobre ${selectedCategory}` }}
          </h2>
        </div>
        <p class="text-gray-600">
          {{ filteredFaqs.length }} {{ filteredFaqs.length === 1 ? 'pregunta encontrada' : 'preguntas encontradas' }}
        </p>
      </div>

      <div v-if="filteredFaqs.length" class="space-y-4 mb-12">
        <details v-for="(faq, index) in filteredFaqs" :key="index" class="bg-white rounded-2xl shadow-md overflow-hidden group">
          <summary class="px-6 py-5 cursor-pointer flex items-start justify-between hover:bg-gray-50 transition-colors">
            <div class="flex-1 pr-4">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {{ faq.category }}
                </span>
              </div>
              <span class="text-gray-800 text-lg">{{ faq.question }}</span>
            </div>
            <span class="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
          </summary>
          <div class="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {{ faq.answer }}
          </div>
        </details>
      </div>

      <div v-else class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">No se encontraron preguntas</p>
        <p class="text-sm text-gray-400">Intenta con otra búsqueda o categoría</p>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { HelpCircle, ShoppingCart, Truck, CreditCard, Sprout, Search } from 'lucide-vue-next'
import { useFaqStore } from '~~/stores/Faq'
import { useSeoMeta } from '#imports'

const searchQuery = ref('')
const selectedCategory = ref('Todos')

const categories = [
  { name: 'Todos', icon: HelpCircle },
  { name: 'Pedidos', icon: ShoppingCart },
  { name: 'Envíos', icon: Truck },
  { name: 'Pagos', icon: CreditCard },
  { name: 'Plantas', icon: Sprout }
]

const store = useFaqStore()
const faqs = computed(() => store.allFaqs)

onMounted(async () => {
  await store.fetchFaqs()
})

watch(searchQuery, (q) => {
  // Si backend soporta búsqueda, podríamos llamar store.fetchFaqs(q)
  // pero mantenemos el filtrado en cliente para no cambiar UX
})

const filteredFaqs = computed(() =>
  faqs.value.filter(faq => {
    const matchesCategory = selectedCategory.value === 'Todos' || faq.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      q === '' ||
      (faq.question || '').toLowerCase().includes(q) ||
      (faq.answer || '').toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })
)

useSeoMeta({
  title: 'Preguntas Frecuentes | Vida en el Jardín',
  description: 'Respuestas rápidas a dudas comunes sobre pedidos, envíos, pagos y el cuidado de plantas.',
  ogTitle: 'Preguntas Frecuentes | Vida en el Jardín',
  ogDescription: 'Encuentra respuestas rápidas a las dudas más comunes.',
})
</script>
