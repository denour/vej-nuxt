<template>
  <div class="flex gap-2">
    <input
      v-model="email"
      type="email"
      placeholder="Tu email"
      class="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-green-500"
    />
    <button
      :disabled="!email || loading"
      @click="handleSubscribe"
      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      →
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
