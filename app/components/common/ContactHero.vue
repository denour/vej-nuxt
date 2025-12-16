<script setup lang="ts">

</script>

<template>
  <section class="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-10 left-20 w-64 h-64 bg-green-400 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl mb-4 text-gray-800 font-serif">

          <span class="text-green-600">Contáctanos</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          ¿Tienes preguntas sobre nuestras plantas o necesitas ayuda? Estamos aquí para ti
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail class="w-6 h-6 text-green-600" />
          </div>
          <h3 class="mb-2 text-gray-800">Email</h3>
          <p class="text-sm text-gray-600">info@vidaeneljardin.com</p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone class="w-6 h-6 text-green-600" />
          </div>
          <h3 class="mb-2 text-gray-800">Teléfono</h3>
          <p class="text-sm text-gray-600">+52 (55) 1234-5678</p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin class="w-6 h-6 text-green-600" />
          </div>
          <h3 class="mb-2 text-gray-800">Ubicación</h3>
          <p class="text-sm text-gray-600">CDMX, México</p>
        </div>
      </div>
    </div>
  </section>
</template>
