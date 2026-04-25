<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, X, Plus, Minus } from 'lucide-vue-next'
import { useFaqStore } from '~~/stores/Faq'
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Preguntas Frecuentes — Vida en el Jardín',
  description: 'Respuestas rápidas a dudas comunes sobre pedidos, envíos, pagos y cuidado de plantas.',
})

const searchQuery = ref('')
const selectedCategory = ref('Todos')
const openId = ref<string | null>(null)

const categories = ['Todos', 'Pedidos', 'Envíos', 'Pagos', 'Plantas']

const store = useFaqStore()
const faqs = computed(() => store.allFaqs)

onMounted(async () => {
  try { await store.fetchFaqs() } catch (e) { /* falls back */ }
})

const filteredFaqs = computed(() =>
  faqs.value.filter(f => {
    const matchCat = selectedCategory.value === 'Todos' || f.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase()
    const matchQ = q === '' ||
      (f.question || '').toLowerCase().includes(q) ||
      (f.answer || '').toLowerCase().includes(q)
    return matchCat && matchQ
  })
)

const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Preguntas frecuentes"
      title="Las dudas"
      italic="comunes"
      trailing="ya resueltas."
      description="Si tu duda no está aquí, escríbenos. Respondemos antes de 24h, casi siempre antes de 2."
    >
      <template #after>
        <div class="relative max-w-[1400px] mx-auto mt-12 px-6 lg:px-12">
          <div class="relative flex items-center bg-ink-card border border-line rounded-full px-7 py-2 max-w-2xl">
            <Search class="w-5 h-5 text-cream-40 flex-shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="¿Qué necesitas saber?"
              class="flex-1 bg-transparent text-cream placeholder-cream/30 px-4 py-3 outline-none text-base"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="text-cream-40 hover:text-terra p-1">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </template>
    </PageHero>

    <!-- Categories -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-12">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in categories"
          :key="c"
          @click="selectedCategory = c"
          :class="[
            'px-5 py-2.5 rounded-full text-sm transition-all duration-300 border',
            selectedCategory === c
              ? 'bg-terra border-terra text-ink'
              : 'bg-transparent border-line text-cream-60 hover:border-cream/40 hover:text-cream'
          ]"
        >
          {{ c }}
        </button>
      </div>
    </section>

    <!-- FAQ accordion -->
    <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
      <div v-if="filteredFaqs.length === 0" class="py-20 text-center">
        <div class="font-display text-cream text-3xl mb-3 tracking-tighter">
          Sin respuesta
          <em class="font-display-italic text-terra">aún</em>.
        </div>
        <p class="text-cream-60">Pero podemos contestarte directo.</p>
        <NuxtLink
          to="/contact"
          class="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-cream/30 text-cream rounded-full text-sm hover:border-cream hover:bg-cream/5 transition-all"
        >
          Escríbenos
        </NuxtLink>
      </div>

      <div v-else class="grid lg:grid-cols-12 gap-8">
        <div class="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
          <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">
            {{ filteredFaqs.length }} {{ filteredFaqs.length === 1 ? 'respuesta' : 'respuestas' }}
          </div>
        </div>

        <div class="lg:col-span-10 divide-y divide-line">
          <div
            v-for="(faq, idx) in filteredFaqs"
            :key="faq.id"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: (idx % 8) * 50 } }"
          >
            <button
              @click="toggle(faq.id)"
              class="w-full flex items-start justify-between gap-6 py-7 text-left group"
            >
              <div class="flex-1">
                <div class="text-terra text-[10px] tracking-[0.25em] uppercase mb-2">{{ faq.category }}</div>
                <h3 class="font-display text-cream text-2xl lg:text-3xl tracking-tighter leading-tight group-hover:text-terra transition-colors duration-300">
                  {{ faq.question }}
                </h3>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center group-hover:border-terra transition-colors duration-300 mt-2">
                <Minus v-if="openId === faq.id" class="w-4 h-4 text-cream group-hover:text-terra transition-colors" />
                <Plus v-else class="w-4 h-4 text-cream group-hover:text-terra transition-colors" />
              </div>
            </button>

            <Transition
              enter-active-class="transition-all duration-400 ease-out-quint"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-300"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openId === faq.id" class="overflow-hidden">
                <div class="pb-7 pr-16 text-cream/80 text-lg leading-relaxed">
                  {{ faq.answer }}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
