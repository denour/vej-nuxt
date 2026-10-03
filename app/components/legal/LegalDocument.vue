<script setup lang="ts">
defineProps<{
  sections: { id: string; title: string }[]
  updated: string
}>()
</script>

<template>
  <section class="px-6 lg:px-12 max-w-[1400px] mx-auto pb-32">
    <div class="grid lg:grid-cols-12 gap-12">
      <!-- Índice lateral -->
      <nav aria-label="Contenido del documento" class="lg:col-span-3 lg:sticky lg:top-32 lg:self-start">
        <div class="text-cream-40 text-[10px] tracking-[0.3em] uppercase mb-6">Contenido</div>
        <ol class="space-y-3">
          <li v-for="(s, idx) in sections" :key="s.id">
            <a
              :href="`#${s.id}`"
              class="group flex items-baseline gap-3 text-cream-60 hover:text-terra transition-colors text-sm leading-snug"
            >
              <span class="font-display text-cream-40 group-hover:text-terra transition-colors tabular-nums">{{ String(idx + 1).padStart(2, '0') }}</span>
              <span>{{ s.title }}</span>
            </a>
          </li>
        </ol>
        <div class="mt-8 h-px bg-line" />
        <p class="mt-6 text-cream-40 text-xs tracking-wide">
          Última actualización:
          <span class="text-cream-60">{{ updated }}</span>
        </p>
      </nav>

      <!-- Cuerpo -->
      <div class="lg:col-span-9 space-y-6">
        <slot />
      </div>
    </div>
  </section>
</template>
