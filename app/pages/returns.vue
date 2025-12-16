<script setup lang="ts">
import { ref } from 'vue'
import { RotateCcw, Calendar, CheckCircle, AlertCircle } from 'lucide-vue-next'
import {useReturnsStore} from "~~/stores/Return";

const iconMap = {
  RotateCcw,
  Calendar,
  CheckCircle,
  AlertCircle
}

const returns = useReturnsStore()

</script>

<template>
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-3xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <RotateCcw class="w-6 h-6" />
          </div>
          <h1 class="text-5xl" style="font-family: serif;">Devoluciones</h1>
        </div>
        <p class="text-xl text-blue-100">
          Tu satisfacción es nuestra prioridad. Conoce nuestra política de devoluciones
          y garantía de 30 días en todos nuestros productos.
        </p>
      </div>
    </div>
  </section>

  <!-- Quick Info Cards -->
  <section class="max-w-7xl mx-auto px-6 -mt-12 relative z-10 mb-16">
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-xl">
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Calendar class="w-6 h-6 text-blue-600" />
        </div>
        <h3 class="text-xl mb-2 text-gray-800">30 Días de Garantía</h3>
        <p class="text-gray-600">
          Tienes un mes completo para devolver cualquier planta que no cumpla tus expectativas
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-xl">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <RotateCcw class="w-6 h-6 text-green-600" />
        </div>
        <h3 class="text-xl mb-2 text-gray-800">Proceso Simple</h3>
        <p class="text-gray-600">
          Solo necesitas contactarnos y seguir 5 pasos sencillos para tu devolución
        </p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-xl">
        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle class="w-6 h-6 text-purple-600" />
        </div>
        <h3 class="text-xl mb-2 text-gray-800">Reembolso Completo</h3>
        <p class="text-gray-600">
          Te devolvemos el 100% de tu dinero o cambiamos el producto sin costo
        </p>
      </div>
    </div>
  </section>

  <!-- Guarantee Reasons -->
  <section class="max-w-7xl mx-auto px-6 mb-16">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-8 bg-blue-600 rounded-full"></div>
        <h2 class="text-3xl text-gray-800" style="font-family: serif;">Garantía de Satisfacción</h2>
      </div>
      <p class="text-gray-600">
        Puedes devolver o cambiar tu planta si se presenta alguna de estas situaciones:
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div v-for="(reason, index) in returns.guaranteeReasons" :key="index" class="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <component :is="iconMap[reason.icon]" class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 class="text-lg text-gray-800 mb-2">{{ reason.title }}</h3>
            <p class="text-gray-600">{{ reason.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
      <div class="flex items-start gap-3">
        <CheckCircle class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
        <div>
          <p class="text-gray-800 mb-2">
            <strong>Garantía inmediata:</strong> Si tu planta llegó dañada o enferma,
            te la reemplazamos sin hacer preguntas.
          </p>
          <p class="text-gray-700">
            Solo necesitamos fotos del producto dentro de las primeras 48 horas después de la entrega.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Return Process -->
  <section class="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 mb-16">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-12 text-center">
        <h2 class="text-3xl md:text-4xl mb-4 text-gray-800" style="font-family: serif;">Proceso de Devolución</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Sigue estos pasos para realizar una devolución exitosa
        </p>
      </div>

      <div class="space-y-6">
        <div v-for="(step, index) in returns.returnSteps" :key="index" class="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div class="flex items-start gap-6">
            <div class="flex flex-col items-center flex-shrink-0">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl mb-3">
                {{ step.number }}
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <component :is="iconMap[step.icon]" class="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl text-gray-800 mb-2">{{ step.title }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Conditions -->
  <section class="max-w-7xl mx-auto px-6 mb-16">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-8 bg-blue-600 rounded-full"></div>
        <h2 class="text-3xl text-gray-800" style="font-family: serif;">Condiciones para Devoluciones</h2>
      </div>
      <p class="text-gray-600">
        Para que tu devolución sea aceptada, debe cumplir con las siguientes condiciones:
      </p>
    </div>

    <div class="bg-white rounded-2xl p-8 shadow-md">
      <ul class="space-y-4">
        <li v-for="(condition, index) in returns.conditions" :key="index" class="flex items-start gap-3">
          <CheckCircle class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <span class="text-gray-700">{{ condition }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
