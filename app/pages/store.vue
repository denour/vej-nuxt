<script setup lang="ts">
import { ref } from 'vue'
import ProductFilters from "~/components/shop/ProductFilters.vue";
import ProductCard from "~/components/shop/ProductCard.vue";
import ProductSort from "~/components/shop/ProductSort.vue";
import ProductListItem from "~/components/shop/ProductListItem.vue";
import {useProductsStore} from "~~/stores/Product";

const products = useProductsStore()

const viewMode = ref('grid')
const currentPage = ref(1)

const setViewMode = (mode:any) => {
  viewMode.value = mode;
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  currentPage.value++
}
</script>

<template>
    <!-- Products Section -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-4 gap-8">

        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <ProductFilters />
        </div>

        <!-- Products Grid/List -->
        <div class="lg:col-span-3">

          <ProductSort :total-products="products.products.length"/>

          <div v-if="viewMode !== 'grid'">
            <ProductCard
                v-for="product in products.products"
                :key="product.id"
                v-bind="product"
            />
          </div>

          <div v-else>
            <ProductListItem
                v-for="product in products.products"
                :key="product.id"
                v-bind="product"
            />
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center gap-2">
            <button
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage === 1"
                @click="prevPage"
            >
              <ChevronLeft class="w-5 h-5 text-gray-600" />
            </button>

            <button class="px-4 py-2 bg-green-600 text-white rounded-lg">
              1
            </button>

            <button class="px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
              2
            </button>

            <button class="px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
              3
            </button>

            <span class="px-2 text-gray-400">...</span>

            <button class="px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
              4
            </button>

            <button
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                @click="nextPage"
            >
              <ChevronRight class="w-5 h-5 text-gray-600" />
            </button>
          </div>

        </div>
      </div>
    </section>

    <!-- Guarantee Section -->
    <section class="bg-gradient-to-br from-green-600 to-emerald-600 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-3 gap-8 text-white text-center">

          <div>
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl mb-2">Garantía de Calidad</h3>
            <p class="text-green-100">Todas nuestras plantas están garantizadas por 30 días</p>
          </div>

          <div>
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100
                4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl mb-2">Envío Seguro</h3>
            <p class="text-green-100">Empaque especial para que lleguen en perfecto estado</p>
          </div>

          <div>
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536
                3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-xl mb-2">Soporte Experto</h3>
            <p class="text-green-100">Guías y consejos personalizados para cada planta</p>
          </div>

        </div>
      </div>
    </section>
</template>
