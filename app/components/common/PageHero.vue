<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  italic?: string
  trailing?: string
  description?: string
}>()
</script>

<template>
  <section class="relative pt-40 pb-20 px-6 lg:px-12 overflow-hidden">
    <div class="absolute -top-40 right-1/4 w-[700px] h-[700px] rounded-full bg-moss/25 blur-[140px]" />

    <div class="relative max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-2">
        <div v-if="eyebrow" class="text-cream-40 text-[10px] tracking-[0.3em] uppercase">
          {{ eyebrow }}
        </div>
      </div>

      <div class="lg:col-span-7">
        <h1
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="font-display text-cream text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] tracking-tightest font-light"
        >
          <span class="block">{{ title }}</span>
          <span v-if="italic" class="block">
            <em class="font-display-italic text-terra">{{ italic }}</em>
          </span>
          <span v-if="trailing" class="block">{{ trailing }}</span>
        </h1>
      </div>

      <div v-if="description" class="lg:col-span-3 lg:pt-6">
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 700 } }"
          class="text-cream-60 leading-relaxed"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <slot name="after" />
  </section>
</template>
