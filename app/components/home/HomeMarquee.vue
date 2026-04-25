<script setup lang="ts">
const items = [
  'Monstera Deliciosa',
  '·',
  'Ficus Lyrata',
  '·',
  'Pothos',
  '·',
  'Sansevieria',
  '·',
  'Calathea Orbifolia',
  '·',
  'Alocasia Zebrina',
  '·',
  'Strelitzia',
  '·',
  'Philodendron',
  '·',
  'Chamaedorea',
  '·',
]
const doubled = [...items, ...items]
</script>

<template>
  <div class="border-y border-line py-8 overflow-hidden">
    <div class="marquee-track gap-12">
      <span
        v-for="(item, i) in doubled"
        :key="i"
        class="font-display text-cream-40 text-2xl whitespace-nowrap"
        :class="item === '·' ? 'text-terra' : 'font-display-italic'"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>
