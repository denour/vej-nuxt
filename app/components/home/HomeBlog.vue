<script setup lang="ts">
const posts = [
  {
    category: 'Cuidados',
    title: 'El arte de regar sin matar',
    excerpt: 'Por qué la mitad de tus plantas mueren ahogadas, no de sed. Guía práctica para leer la humedad del sustrato.',
    readTime: '6 min',
    date: 'Abr 2026',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80',
  },
  {
    category: 'Especies',
    title: 'Monstera: anatomía de una rebelde',
    excerpt: 'Por qué le salen agujeros, qué significan, y cómo provocar fenestración temprana en plantas jóvenes.',
    readTime: '8 min',
    date: 'Abr 2026',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=80',
  },
  {
    category: 'Diseño',
    title: 'Componer con plantas: la regla del trío',
    excerpt: 'Una técnica que floristas usan para arreglar cualquier rincón verde. Tres alturas, tres texturas, una conversación.',
    readTime: '5 min',
    date: 'Mar 2026',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=80',
  },
]
</script>

<template>
  <section class="relative py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
    <div class="grid lg:grid-cols-12 gap-8 mb-16">
      <div class="lg:col-span-2">
        <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">02 — Lecturas</div>
      </div>
      <div class="lg:col-span-7">
        <h2
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="font-display text-cream text-5xl lg:text-7xl leading-[0.95] tracking-tighter"
        >
          Ensayos para
          <em class="font-display-italic text-terra">cultivadores curiosos</em>.
        </h2>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      <NuxtLink
        v-for="(post, idx) in posts"
        :key="post.title"
        to="/blog"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 700, delay: idx * 120 } }"
        class="group block"
      >
        <div class="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-ink-card">
          <img
            :src="post.image"
            :alt="post.title"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover duotone transition-transform duration-700 ease-out-quint group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          <div class="absolute top-5 left-5">
            <span class="px-3 py-1.5 bg-cream/15 backdrop-blur border border-cream/20 rounded-full text-cream text-[11px] tracking-[0.2em] uppercase">
              {{ post.category }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-cream-40 text-xs tracking-wider uppercase mb-3">
          <span>{{ post.date }}</span>
          <span class="text-terra">·</span>
          <span>{{ post.readTime }}</span>
        </div>

        <h3 class="font-display text-cream text-3xl lg:text-4xl tracking-tighter leading-[1.05] group-hover:text-terra transition-colors duration-500">
          {{ post.title }}
        </h3>

        <p class="mt-4 text-cream-60 leading-relaxed">
          {{ post.excerpt }}
        </p>

        <div class="mt-5 inline-flex items-center gap-2 text-cream font-display-italic text-lg">
          Leer
          <span class="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
