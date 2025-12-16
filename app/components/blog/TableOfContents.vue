<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { List } from 'lucide-vue-next'
import type {TOCItem} from "~~/models/BlogPost";


interface Props {
  items: TOCItem[]
}

const props = defineProps<Props>()

const activeId = ref<string>('')

// Scroll a sección
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Observer de intersección
let observer: IntersectionObserver | null = null

const initObserver = () => {
  observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
  )

  props.items.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) observer?.observe(element)
  })
}

onMounted(() => {
  initObserver()
})

watch(
    () => props.items,
    () => {
      observer?.disconnect()
      initObserver()
    }
)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-6 sticky top-24">
    <div class="flex items-center gap-2 mb-4">
      <List class="w-5 h-5 text-green-600" />
      <h3 class="text-lg text-gray-800">Tabla de Contenidos</h3>
    </div>

    <nav>
      <ul class="space-y-2">
        <li v-for="item in props.items" :key="item.id">
          <button
              @click="scrollToSection(item.id)"
              :class="[
              'text-left w-full px-3 py-2 rounded-lg transition-all text-sm',
              activeId === item.id
                ? 'bg-green-50 text-green-700 border-l-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'
            ]"
          >
            {{ item.text }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
