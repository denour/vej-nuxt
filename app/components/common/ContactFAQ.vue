<template>
  <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
    <h2 class="text-3xl mb-6 text-gray-800" style="font-family: serif">
      Preguntas Frecuentes
    </h2>

    <div class="space-y-4">
      <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-green-200"
      >
        <button
            @click="toggle(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <span class="text-gray-800 pr-4">{{ faq.question }}</span>

          <ChevronDown
              class="w-5 h-5 text-green-600 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openIndex === index }"
          />
        </button>

        <div
            class="overflow-hidden transition-all"
            :class="openIndex === index ? 'max-h-96' : 'max-h-0'"
        >
          <div class="px-6 pb-4 text-gray-600 leading-relaxed">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 p-6 bg-green-50 rounded-xl">
      <p class="text-gray-700 text-center">
        ¿No encontraste lo que buscabas?
        <a href="#form" class="text-green-600 hover:text-green-700 transition-colors">
          Envíanos un mensaje
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const openIndex = ref(0);

const faqs = [
  {
    question: '¿Cuál es el tiempo de entrega?',
    answer:
        'Nuestros tiempos de entrega son de 3 a 5 días hábiles en CDMX y área metropolitana, y de 5 a 7 días hábiles para el resto de la República Mexicana. Todas nuestras plantas se envían con empaque especial para garantizar que lleguen en perfectas condiciones.',
  },
  {
    question: '¿Qué hago si mi planta llega dañada?',
    answer:
        'Todas nuestras plantas están garantizadas por 30 días. Si tu planta llega dañada, contáctanos inmediatamente con fotos del producto y te enviaremos un reemplazo sin costo adicional o te devolveremos tu dinero.',
  },
  {
    question: '¿Ofrecen asesoría para el cuidado de las plantas?',
    answer:
        'Sí, cada planta incluye una guía de cuidados detallada. Además, nuestro equipo de expertos está disponible por email o teléfono para responder cualquier duda sobre el cuidado de tus plantas.',
  },
  {
    question: '¿Puedo devolver una planta?',
    answer:
        'Aceptamos devoluciones dentro de los primeros 7 días después de la entrega si la planta está en las mismas condiciones en que fue enviada. Los gastos de envío de devolución corren por cuenta del cliente, excepto en casos de plantas dañadas o error en el pedido.',
  },
  {
    question: '¿Tienen tienda física?',
    answer:
        'Actualmente operamos principalmente de forma online, pero tenemos un showroom en CDMX donde puedes ver nuestras plantas con previa cita. Contáctanos para agendar tu visita.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
        'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, y pago en OXXO. Todos nuestros pagos son procesados de forma segura.',
  },
];

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index;
}
</script>
