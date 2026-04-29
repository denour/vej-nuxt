<script setup lang="ts">
interface AuthorBioProps {
  name: string;
  thumbnail: string;
  description: string;
}

const props = defineProps<AuthorBioProps>();
import { onImgError } from '~~/utils/image'
</script>

<template>
  <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-md mt-8">
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <!-- Imagen del autor -->
      <img
          v-if="props.thumbnail"
          :src="props.thumbnail"
          :alt="props.name"
          class="w-24 h-24 rounded-full object-cover shadow-lg flex-shrink-0"
          @error="onImgError"
      />
      <div v-else class="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center shadow-lg flex-shrink-0">
        <span class="text-3xl text-green-700 font-bold">{{ props.name?.charAt(0) }}</span>
      </div>

      <div class="flex-1">
        <!-- Nombre y título -->
        <h3 class="text-2xl mb-2 text-gray-800" style="font-family: serif;">
          Sobre {{ props.name }}
        </h3>
        <p v-if="props.description" class="text-gray-600 leading-relaxed">
          {{ props.description }}
        </p>
      </div>
    </div>
  </div>
</template>
