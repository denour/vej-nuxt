<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowDown, Sparkles } from 'lucide-vue-next'

const heroImage = ref<HTMLElement>()
const scrollY = ref(0)
const mouse = ref({ x: 0, y: 0 })

const onScroll = () => (scrollY.value = window.scrollY)
const onMouseMove = (e: MouseEvent) => {
  if (!heroImage.value) return
  const rect = heroImage.value.getBoundingClientRect()
  mouse.value = {
    x: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 20,
    y: ((e.clientY - rect.top - rect.height / 2) / rect.height) * 20,
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <section class="relative min-h-screen pt-32 pb-20 overflow-hidden">
    <!-- Ambient gradient blobs -->
    <div
      class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-moss/30 blur-[120px]"
      :style="{ transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }"
    />
    <div
      class="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-terra/15 blur-[140px]"
      :style="{ transform: `translate(${-mouse.x * 0.3}px, ${-mouse.y * 0.3}px)` }"
    />

    <!-- Top label -->
    <div
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }"
      class="relative max-w-[1400px] mx-auto px-6 lg:px-12 mb-12"
    >
      <div class="flex items-center gap-3 text-cream-60 text-xs tracking-[0.3em] uppercase">
        <Sparkles class="w-3.5 h-3.5 text-terra" />
        <span>Edición 2026 · Botánica para tu casa</span>
      </div>
    </div>

    <!-- Hero grid -->
    <div class="relative max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center">
      <!-- Left: Text -->
      <div class="lg:col-span-7 relative z-10">
        <h1 class="font-display text-cream leading-[0.95] tracking-tightest">
          <span
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 800 } }"
            class="block text-[clamp(3rem,8vw,7.5rem)] font-light"
          >
            Cultiva
          </span>
          <span
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 450, duration: 800 } }"
            class="block text-[clamp(3rem,8vw,7.5rem)] font-light text-terra"
          >
            <em class="font-display-italic">tu santuario</em>
          </span>
          <span
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 800 } }"
            class="block text-[clamp(3rem,8vw,7.5rem)] font-light"
          >
            verde.
          </span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 900, duration: 700 } }"
          class="mt-10 max-w-xl text-cream-60 text-lg leading-relaxed"
        >
          Una guía pausada para quienes ven el jardín como ritual, no decoración.
          Especies seleccionadas, ensayos botánicos y todo lo necesario para que algo verde florezca contigo.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 1100, duration: 700 } }"
          class="mt-12 flex flex-wrap items-center gap-5"
        >
          <NuxtLink
            to="/species"
            class="group inline-flex items-center gap-3 px-7 py-4 bg-cream text-ink rounded-full text-sm font-medium tracking-wide shine-on-hover hover:bg-terra transition-colors duration-500"
          >
            Explorar especies
            <span class="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="group inline-flex items-center gap-3 px-7 py-4 border border-cream/30 text-cream rounded-full text-sm font-medium tracking-wide hover:border-cream hover:bg-cream/5 transition-all duration-500"
          >
            Leer guías
            <span class="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Image with parallax -->
      <div class="lg:col-span-5 relative">
        <div
          ref="heroImage"
          v-motion
          :initial="{ opacity: 0, scale: 0.94 }"
          :enter="{ opacity: 1, scale: 1, transition: { delay: 700, duration: 1200, ease: [0.22, 1, 0.36, 1] } }"
          class="relative aspect-[4/5] w-full max-w-[480px] ml-auto"
          :style="{ transform: `translateY(${scrollY * -0.08}px)` }"
        >
          <!-- Animated frame -->
          <div class="absolute inset-0 rounded-full border border-cream/15"
               :style="{ transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.4}px)` }" />

          <!-- Image masked to organic shape -->
          <div class="absolute inset-2 rounded-[42%_58%_55%_45%/45%_50%_50%_55%] overflow-hidden glow-ring duotone"
               :style="{ transform: `translate(${mouse.x * 0.2}px, ${mouse.y * 0.2}px)` }">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80"
              alt=""
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
          </div>

          <!-- Floating data badge -->
          <div
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: 1400, duration: 800 } }"
            class="absolute bottom-8 -left-6 lg:-left-12 bg-ink-card/90 backdrop-blur-md border border-line rounded-2xl px-5 py-4 max-w-[200px]"
          >
            <div class="text-cream-40 text-[10px] tracking-[0.25em] uppercase mb-1">Esta semana</div>
            <div class="font-display text-cream text-2xl leading-tight">+12 nuevas especies</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll cue -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 1600, duration: 800 } }"
      class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream-40 text-[10px] tracking-[0.3em] uppercase"
    >
      <span>Desplázate</span>
      <ArrowDown class="w-4 h-4 animate-bounce" />
    </div>
  </section>
</template>
