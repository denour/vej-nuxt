<script setup lang="ts">
defineProps<{
  id: string
  n: number
  title: string
}>()
</script>

<template>
  <article
    :id="id"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    class="scroll-mt-32 p-8 lg:p-10 rounded-3xl bg-ink-card border border-line"
  >
    <div class="flex items-baseline gap-4 mb-6">
      <span class="font-display text-terra text-3xl tracking-tighter tabular-nums">{{ String(n).padStart(2, '0') }}</span>
      <h2 class="font-display text-cream text-2xl lg:text-3xl tracking-tighter leading-tight">{{ title }}</h2>
    </div>
    <div
      class="space-y-4 text-cream-60 leading-relaxed
        [&_h3]:font-display [&_h3]:text-cream [&_h3]:text-xl [&_h3]:tracking-tighter [&_h3]:pt-4
        [&_strong]:text-cream [&_strong]:font-medium
        [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li::marker]:text-terra
        [&_a]:text-cream [&_a]:underline [&_a]:decoration-terra [&_a]:underline-offset-4 [&_a:hover]:text-terra"
    >
      <slot />
    </div>
  </article>
</template>
