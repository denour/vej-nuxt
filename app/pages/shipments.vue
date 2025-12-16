<template>
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-3xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Truck class="w-6 h-6" />
          </div>
          <h1 class="text-5xl" style="font-family: serif;">Envíos</h1>
        </div>
        <p class="text-xl text-green-100">
          Enviamos tus plantas con el mayor cuidado a cualquier parte de México.
          Conoce nuestros tiempos de entrega, costos y proceso de empaquetado especializado.
        </p>
      </div>
    </div>
  </section>

  <!-- Quick Info Cards -->
  <section class="max-w-7xl mx-auto px-6 -mt-12 relative z-10 mb-16">
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-xl" v-for="(card, index) in shipment.quickCards" :key="index">
        <div :class="['w-12 h-12 rounded-full flex items-center justify-center mb-4', card.bg]">
          <component :is="card.icon" :class="card.iconColor" />
        </div>
        <h3 class="text-xl mb-2 text-gray-800">{{ card.title }}</h3>
        <p class="text-gray-600">{{ card.description }}</p>
      </div>
    </div>
  </section>

  <!-- Shipping Zones -->
  <section class="max-w-7xl mx-auto px-6 mb-16">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-8 bg-green-600 rounded-full"></div>
        <h2 class="text-3xl text-gray-800" style="font-family: serif;">Zonas de Envío y Tiempos</h2>
      </div>
      <p class="text-gray-600">Conoce los tiempos estimados de entrega según tu ubicación</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div v-for="(zone, index) in shipment.shippingZones" :key="index" class="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-start gap-3 mb-4">
          <MapPin class="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
          <h3 class="text-lg text-gray-800">{{ zone.zone }}</h3>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Clock class="w-4 h-4" />
            <span>{{ zone.time }}</span>
          </div>
          <div class="pt-3 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-1">Costo de envío:</p>
            <p class="text-green-600">{{ zone.cost }}</p>
            <p class="text-sm text-gray-500">Costo regular: {{ zone.regularCost }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6">
      <div class="flex items-start gap-3">
        <MapPin class="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <p class="text-gray-800 mb-2">
            <strong>Nota importante:</strong> Los tiempos de entrega son estimados y pueden variar según condiciones climáticas y disponibilidad de paquetería.
          </p>
          <p class="text-gray-700">
            Recibirás un número de rastreo por correo electrónico una vez que tu pedido sea enviado.
          </p>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
import { Truck, Shield, Package, MapPin, Clock, CheckCircle, Phone, Mail } from 'lucide-vue-next'
import {useShipmentInfo} from "~~/stores/Shipment.ts";


const shipment = useShipmentInfo()

</script>
