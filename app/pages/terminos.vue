<script setup lang="ts">
import PageHero from '~/components/common/PageHero.vue'

useSeoMeta({
  title: 'Términos de uso',
  description: 'Términos de uso del sitio Vida en el Jardín.',
})
</script>

<template>
  <main class="relative min-h-screen">
    <PageHero
      eyebrow="Legal"
      title="Términos de"
      italic="uso"
    />

    <section class="px-6 lg:px-12 max-w-3xl mx-auto pb-24 text-cream-60 text-lg leading-relaxed space-y-6">
      <p>
        Vida en el Jardín es una guía de plantas y jardinería. El contenido del sitio es informativo:
        úsalo como orientación y adapta cada consejo a tu clima, tu espacio y tus plantas.
      </p>
      <p>
        Estamos preparando los términos completos. Mientras tanto, si tienes cualquier duda escríbenos a
        <a href="mailto:contacto@vidaeneljardin.com" class="underline hover:text-terra">contacto@vidaeneljardin.com</a>.
        El tratamiento de tus datos se rige por nuestro
        <NuxtLink to="/aviso-de-privacidad" class="underline hover:text-terra">aviso de privacidad</NuxtLink>.
      </p>
    </section>
  </main>
</template>
