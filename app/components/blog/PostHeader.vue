<script setup lang="ts">
import { Calendar, Clock } from 'lucide-vue-next'
import type {BlogPost} from "~~/models/BlogPost";
import { onImgError } from '~~/utils/image'

const props = defineProps<BlogPost>()
</script>

<template>
  <div class="relative">
    <!-- Hero Image -->
    <div class="relative h-[500px] w-full bg-gradient-to-br from-gray-100 to-green-50 overflow-hidden">
      <img :src="props.coverImage" :alt="props.title" class="w-full h-full object-cover" @error="onImgError" />
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
            <img :src="props.author?.image" :alt="props.author?.name" class="w-12 h-12 rounded-full object-cover" @error="onImgError" />
            <div>
              <p class="text-sm text-gray-500">Escrito por</p>
              <p class="text-gray-800">{{ props.author.name }}</p>
            </div>
          </div>

          <!-- Date -->
          <div class="flex items-center gap-2 text-gray-600">
            <Calendar class="w-4 h-4" />
            <span class="text-sm">{{ props.createdAt }}</span>
          </div>

          <!-- Read Time -->
          <div class="flex items-center gap-2 text-gray-600">
            <Clock class="w-4 h-4" />
            <span class="text-sm">{{ props.readTime }} de lectura</span>
          </div>
        </div>

        <!-- Share Buttons -->
        <div class="flex items-center gap-4 mt-6">
          <span class="text-sm text-gray-600">Compartir:</span>
          <div class="flex gap-2">
            <!-- Facebook -->
            <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            <!-- Twitter -->
            <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>

            <!-- LinkedIn -->
            <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
