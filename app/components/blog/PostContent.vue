<script setup lang="ts">

import type {ContentBlock} from "~~/models/BlogPost";

interface PostContentProps {
  content: ContentBlock[];
}

const props = defineProps<PostContentProps>();
</script>

<template>
  <div class="prose prose-lg max-w-none">
    <template v-for="(block, index) in props.content" :key="index">

      <!-- Heading -->
      <h2
          v-if="block.type === 'heading'"
          :id="block.data.id"
          class="text-3xl mt-12 mb-6 text-gray-800 scroll-mt-24"
          style="font-family: serif;"
      >
        {{ block.data.text }}
      </h2>

      <!-- Paragraph -->
      <p
          v-else-if="block.type === 'paragraph'"
          class="text-gray-700 leading-relaxed mb-6"
      >
        {{ block.data.text }}
      </p>

      <!-- Image -->
      <figure v-else-if="block.type === 'image'" class="my-10">
        <img
            :src="`http://localhost/storage/${block.data.url}`"
            :alt="block.data.caption || ''"
            class="w-full rounded-2xl shadow-lg"
        />
        <figcaption
            v-if="block.data.caption"
            class="text-center text-sm text-gray-500 mt-4 italic"
        >
          {{ block.data.caption }}
        </figcaption>
      </figure>

      <!-- List -->
      <ul v-else-if="block.type === 'list'" class="space-y-3 my-6 ml-6">
        <li
            v-for="(item, i) in block.data.items"
            :key="i"
            class="text-gray-700 flex items-start gap-3"
        >
          <span class="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
          <span>{{ item }}</span>
        </li>
      </ul>

      <!-- Quote -->
      <blockquote
          v-else-if="block.type === 'quote'"
          class="border-l-4 border-green-600 pl-6 my-8 italic"
      >
        <p class="text-xl text-gray-700 mb-2">{{ block.data.text }}</p>
        <cite v-if="block.data.author" class="text-sm text-gray-500 not-italic">
          — {{ block.data.author }}
        </cite>
      </blockquote>

    </template>
  </div>
</template>
