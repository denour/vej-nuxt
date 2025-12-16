<script setup lang="ts">
import { computed } from "vue"
import type { BlogPost } from "~~/models/BlogPost"
import { usePostsStore } from "~~/stores/BlogPost"
import { useSeoMeta } from '#imports'
import { useCaptcha } from '~~/composables/useCaptcha'
import { subscribeNewsletter } from '~~/services/newsletter'

import PostHeader from "~/components/blog/PostHeader.vue"
import TableOfContents from "~/components/blog/TableOfContents.vue"
import PostContent from "~/components/blog/PostContent.vue"
import AuthorBio from "~/components/blog/AuthorBio.vue"
import RelatedPosts from "~/components/blog/RelatedPosts.vue"

const route = useRoute()
const postsStore = usePostsStore()

const slugParam = route.params.slug
const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam as string)

const { data: post, error } = await useAsyncData(`post-${slug}`, async () => {
  const p = await postsStore.fetchPost(slug)
  if (!p) {
    throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
  }
  return p
})

// Avoid passing null values (like publishedAt) to child components that expect strings
const sanitizedPost = computed(() => {
  if (!post.value) return null
  return Object.fromEntries(
    Object.entries(post.value as BlogPost).filter(([, v]) => v !== null && v !== undefined)
  ) as Partial<BlogPost>
})

useSeoMeta({
  title: () => post.value?.title || 'Artículo | Vida en el Jardín',
  description: () => post.value?.excerpt || 'Artículo del blog',
  ogTitle: () => post.value?.title || 'Artículo | Vida en el Jardín',
  ogDescription: () => post.value?.excerpt || 'Artículo del blog',
  ogImage: () => post.value?.coverImage || '/images/placeholder.svg',
})

// Newsletter form in-page
const email = ref('')
const loading = ref(false)
const { getToken } = useCaptcha()
const handleSubscribe = async () => {
  if (!email.value || loading.value) return
  loading.value = true
  try {
    const token = await getToken('newsletter_subscribe')
    await subscribeNewsletter(email.value, token)
    // eslint-disable-next-line no-alert
    alert('Te has suscrito correctamente')
    email.value = ''
  } catch (e: any) {
    // eslint-disable-next-line no-alert
    alert(e?.statusMessage || e?.message || 'Error al suscribirse')
  } finally {
    loading.value = false
  }
}

</script>


<template>
  <PostHeader v-if="sanitizedPost" v-bind="sanitizedPost" />
  <section class="max-w-7xl mx-auto px-6 py-16">
    <div class="grid lg:grid-cols-4 gap-8">
      <div class="lg:col-span-1 order-2 lg:order-1">
        <TableOfContents v-if="post" :items="post.list" />
      </div>

      <div class="lg:col-span-3 order-1 lg:order-2">
        <article class="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <PostContent v-if="post" :content="post.content" />
        </article>

        <AuthorBio
          v-if="post"
          :thumbnail="post.author.thumbnail || post.author.image || ''"
          :name="post.author.name"
          :description="post.author.description || ''"
        />
      </div>
    </div>
  </section>

  <RelatedPosts
    v-if="post && post.related"
    :posts="post.related"
  />


  <section class="bg-gradient-to-br from-green-600 to-emerald-600 py-16">
    <div class="max-w-4xl mx-auto px-6 text-center text-white">
      <h2 class="text-3xl md:text-4xl mb-4">
      ¿Te gustó este artículo?
      </h2>
      <p class="text-xl text-green-100 mb-8">
        Suscríbete para recibir más consejos y guías directamente en tu correo
      </p>
      <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <input
            v-model="email"
            type="email"
            placeholder="Tu email"
            class="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          :disabled="!email || loading"
          @click="handleSubscribe"
          class="px-8 py-4 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Enviando...' : 'Suscribirme' }}
        </button>
      </div>
    </div>
  </section>
</template>
