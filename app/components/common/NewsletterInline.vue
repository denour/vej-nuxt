<template>
  <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
    <input
      v-model="email"
      type="email"
      placeholder="Tu email"
      class="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
    />
    <button
      :disabled="!email || loading"
      @click="handleSubscribe"
      class="px-8 py-4 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {{ loading ? 'Enviando...' : 'Suscribirme' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCaptcha } from '~~/composables/useCaptcha'
import { subscribeNewsletter } from '~~/services/newsletter'

const email = ref('')
const loading = ref(false)
const { getToken } = useCaptcha()

async function handleSubscribe() {
  if (!email.value || loading.value) return
  loading.value = true
  try {
    const token = await getToken('newsletter_subscribe')
    await subscribeNewsletter(email.value, token)
    // eslint-disable-next-line no-alert
    alert('Te has suscrito correctamente')
    email.value = ''
  } catch (e: any) {
    // eslint-disable-next-line no-alert
    alert(e?.statusMessage || e?.message || 'Error al suscribirse')
  } finally {
    loading.value = false
  }
}
</script>
