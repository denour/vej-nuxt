<script setup lang="ts">
import {onMounted} from 'vue'
import { Sprout } from 'lucide-vue-next'
import Hero from "~/components/common/Hero.vue";
import ProductCard from "~/components/shop/ProductCard.vue";
import type {Product} from "~~/models/Product";

const products = ref<Product[]>([])

// Cargar productos desde la API
onMounted(async () => {
  try {
    const response = await fetch('http://localhost/api/v1/products')
    products.value = await response.json()
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
})
</script>

<template>
  <Hero />
    <!-- Features Section -->
    <section class="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- Feature 1 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            </div>
            <h3 class="text-xl mb-2 text-gray-800">Plantas de Calidad</h3>
            <p class="text-gray-600">Seleccionadas cuidadosamente para tu hogar</p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl mb-2 text-gray-800">Guías Expertas</h3>
            <p class="text-gray-600">Consejos para cada tipo de planta</p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            </div>
            <h3 class="text-xl mb-2 text-gray-800">Cuidado Personal</h3>
            <p class="text-gray-600">Atención dedicada a cada pedido</p>
          </div>
        </div>
      </div>
    </section>

<!--    <section class="max-w-7xl mx-auto px-6 py-20">-->

<!--      <div class="flex items-center justify-between mb-12">-->
<!--        <div>-->
<!--          <h2 class="text-4xl mb-3 text-gray-800" style="font-family: serif;">-->
<!--            Tienda de Plantas-->
<!--          </h2>-->
<!--          <p class="text-gray-600">-->
<!--            Encuentra la planta perfecta para tu espacio-->
<!--          </p>-->
<!--        </div>-->

<!--        <nuxt-link to="/store"-->
<!--            class="px-6 py-3 text-green-600 hover:text-green-700 transition-colors cursor-pointer"-->
<!--        >-->
<!--          Ver toda la tienda →-->
<!--        </nuxt-link>-->
<!--      </div>-->

<!--      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">-->
<!--        <ProductCard-->
<!--            v-for="(product, index) in products"-->
<!--            :key="index"-->
<!--            v-bind="product"-->
<!--        />-->
<!--      </div>-->
<!--    </section>-->
</template>
