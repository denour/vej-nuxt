<script setup lang="ts">
import Navigation from "~/components/layout/Navigation.vue";
</script>

<template>
  <div>
    <Navigation />
    <slot />
    <LayoutFooter />
  </div>
</template>
