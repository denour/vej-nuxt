<script setup lang="ts">
import { Calendar, Clock } from 'lucide-vue-next'
import type {BlogPost} from "~~/models/BlogPost";
import { onImgError } from '~~/utils/image'
import SocialShare from '~/components/blog/SocialShare.vue'

const props = defineProps<BlogPost>()

const config = useRuntimeConfig()
const shareUrl = computed(() => `${config.public.siteUrl || 'https://vidaeneljardin.com'}/blog/${props.slug}`)
</script>

<template>
  <div class="relative">
    <!-- Hero Image -->
    <div class="relative h-[500px] w-full bg-gradient-to-br from-gray-100 to-green-50 overflow-hidden">
      <NuxtImg :src="props.coverImage" :alt="props.title" sizes="xs:100vw xl:1536px" fetchpriority="high" preload class="w-full h-full object-cover" @error="onImgError" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      <!-- Category Badge -->
      <div class="absolute top-8 left-8">
        <span :class="`px-4 py-2  rounded-full text-sm shadow-lg`">
          {{ props.category }}
        </span>
      </div>
    </div>

    <!-- Post Info -->
    <div class="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
      <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <h1 class="text-4xl md:text-5xl mb-6 text-gray-800" style="font-family: serif;">
          {{ props.title }}
        </h1>

        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          {{ props.excerpt }}
        </p>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
          <!-- Author -->
          <div class="flex items-center gap-3">
            <img
              v-if="props.author?.avatar || props.author?.image"
              :src="props.author?.avatar || props.author?.image"
              :alt="props.author?.name"
              class="w-12 h-12 rounded-full object-cover"
              @error="onImgError"
            />
            <div v-else class="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <span class="text-lg text-green-700 font-bold">{{ props.author?.name?.charAt(0) }}</span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Escrito por</p>
              <p class="text-gray-800">{{ props.author?.name }}</p>
            </div>
          </div>

          <!-- Date -->
          <div v-if="props.publishedAt" class="flex items-center gap-2 text-gray-600">
            <Calendar class="w-4 h-4" />
            <span class="text-sm">{{ new Date(props.publishedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>

          <!-- Read Time -->
          <div v-if="props.readTime || props.readingTime" class="flex items-center gap-2 text-gray-600">
            <Clock class="w-4 h-4" />
            <span class="text-sm">{{ props.readTime || `${props.readingTime} min` }} de lectura</span>
          </div>
        </div>

        <!-- Share Buttons -->
        <div class="mt-6">
          <SocialShare :title="props.title" :url="shareUrl" />
        </div>
      </div>
    </div>
  </div>
</template>
