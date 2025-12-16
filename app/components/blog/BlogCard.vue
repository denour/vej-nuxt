<script setup lang="ts">
import { Clock, User } from 'lucide-vue-next';
import type {BlogPost} from "~~/models/BlogPost";
import { useRouter } from 'vue-router'
import { onImgError } from '~~/utils/image'

const props = defineProps<BlogPost>();
const router = useRouter()

const handlePost = () => {
  router.push(`/blog/${props.slug}`)
}

const categoryColor = props.categoryColor || 'bg-green-100 text-green-700';
</script>

<template>
  <article
      @click="handlePost"
      class="bg-white cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
  >
    <div class="relative h-64 overflow-hidden">
      <img
          :src="props.coverImage"
          :alt="props.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="onImgError"
      />
      <div class="absolute top-4 left-4">
        <span
            :class="`${categoryColor} px-3 py-1 rounded-full text-sm backdrop-blur-sm`"
        >
          {{ props.category }}
        </span>
      </div>
    </div>

    <div class="p-6">
      <h3
          class="text-xl mb-3 text-gray-800 group-hover:text-green-600 transition-colors"
      >
        {{ props.title }}
      </h3>

      <p class="text-gray-600 mb-4 line-clamp-2">
        {{ props.excerpt }}
      </p>

      <div
          class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100"
      >
        <div class="flex items-center gap-2">
          <User class="w-4 h-4" />
          <span>{{ props.author.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Clock class="w-4 h-4" />
          <span>{{ props.readTime }}</span>
        </div>
      </div>
    </div>
  </article>
</template>
