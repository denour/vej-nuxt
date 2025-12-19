<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { MagnifyingGlassIcon as Search } from '@heroicons/vue/24/outline'
import {usePostsStore} from "~~/stores/BlogPost";
import BlogCard from "~/components/blog/BlogCard.vue";
import { useSeoMeta } from '#imports'
import NewsletterInline from '~/components/common/NewsletterInline.vue'

const posts = usePostsStore();
const selectedCategory = ref<string | null>(null)
const categories = ref<string[]>([])
const searchQuery = ref("")
const featured = computed(() => posts.featuredPost)
const listPosts = computed(() => posts.postsWithoutFeatured)

let searchTimer: any
watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    posts.fetchPosts({ q })
  }, 300)
})

onMounted(async () => {
  await posts.fetchPosts()
})

useSeoMeta({
  title: 'Blog | Vida En el Jardin',
})
</script>

 <template>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            </div>
            <h1 class="text-5xl" style="font-family: serif">
              Blog
            </h1>
          </div>

          <p class="text-xl text-green-100 mb-8">
            Descubre consejos, guías y secretos para el cuidado de tus plantas.
            Aprende de expertos y convierte tu espacio en un jardín próspero.
          </p>

          <!-- Search Bar -->
          <div class="relative max-w-xl">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Buscar artículos..."
                v-model="searchQuery"
                class="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Filter -->
    <section class="bg-white border-b border-gray-200 sticky top-[72px] z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center gap-4 overflow-x-auto">
          <div class="flex items-center gap-2 text-gray-600 flex-shrink-0">
            <span class="text-sm">Filtrar:</span>
          </div>

          <div class="flex gap-2">
            <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                class="px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap"
                :class="selectedCategory === category
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-8 bg-green-600 rounded-full"></div>
          <h2 class="text-3xl text-gray-800" style="font-family: serif">
            Artículo Destacado
          </h2>
        </div>
      </div>

      <div v-if="featured" class="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group mb-16">
        <div class="grid md:grid-cols-2 gap-0">
          <div class="relative h-96 md:h-full bg-gradient-to-br from-gray-100 to-green-50 overflow-hidden">
            <img
                :src="featured.coverImage"
                :alt="featured.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute top-6 left-6">
            <span class="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm shadow-lg">
              Destacado
            </span>
            </div>
          </div>

          <div class="p-8 md:p-12 flex flex-col justify-center">
          <span class="text-sm text-green-600 uppercase tracking-wide mb-3">
            {{ featured.category }} • {{ featured.readTime }} de lectura
          </span>

            <h2
                class="text-3xl md:text-4xl mb-4 text-gray-800 group-hover:text-green-600 transition-colors"
                style="font-family: serif"
            >
              {{ featured.title }}
            </h2>

            <p class="text-gray-600 mb-6 leading-relaxed">
              {{ featured.excerpt }}
            </p>

            <div class="flex items-center gap-4 mb-6">
              <img
                  :src="featured.author?.image || ''"
                  :alt="featured.author?.name || 'Autor'"
                  class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p class="text-gray-800">{{ featured.author?.name }}</p>
                <p class="text-sm text-gray-500">{{ featured.createdAt }}</p>
              </div>
            </div>

            <nuxt-link :to="`/blog/${featured.slug}`" class="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md self-start">
              Leer artículo completo
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- All Posts Grid -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <div class="w-1 h-8 bg-green-600 rounded-full"></div>
            <h2 class="text-3xl text-gray-800" style="font-family: serif">
              Todos los Artículos
            </h2>
          </div>
          <p class="text-gray-600">
            {{ posts.posts.length }} {{ posts.posts.length === 1 ? 'artículo' : 'artículos' }}
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <BlogCard
            v-for="(post, index) in listPosts"
            :key="index"
            v-bind="post"
        />
      </div>

      <div v-if="listPosts.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">No se encontraron artículos</p>
        <p class="text-sm text-gray-400">Intenta con otra búsqueda o categoría</p>
      </div>

      <!-- Load More -->
      <div v-if="listPosts.length > 0" class="text-center">
        <button
          :disabled="!posts.hasMore || posts.loading"
          @click="posts.loadMore()"
          class="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-full hover:bg-green-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ posts.loading ? 'Cargando...' : posts.hasMore ? 'Cargar más artículos' : 'No hay más' }}
        </button>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="bg-gradient-to-br from-green-600 to-emerald-600 py-16">
      <div class="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 class="text-3xl md:text-4xl mb-4" style="font-family: serif">
          No te pierdas ningún artículo
        </h2>

        <p class="text-xl text-green-100 mb-8">
          Suscríbete y recibe los mejores consejos directamente en tu correo
        </p>

        <NewsletterInline />
      </div>
    </section>
  </template>
