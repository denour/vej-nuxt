<template>
  <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
    <h2 class="text-3xl mb-6 text-gray-800" style="font-family: serif">
      Envíanos un mensaje
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name -->
      <div>
        <label class="block text-sm text-gray-700 mb-2">
          Nombre completo *
        </label>
        <div class="relative">
          <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
              type="text"
              required
              v-model="formData.name"
              placeholder="Tu nombre"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <!-- Email + Phone -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Email -->
        <div>
          <label class="block text-sm text-gray-700 mb-2">Email *</label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="email"
                required
                v-model="formData.email"
                placeholder="tu@email.com"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm text-gray-700 mb-2">Teléfono</label>
          <div class="relative">
            <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="tel"
                v-model="formData.phone"
                placeholder="(55) 1234-5678"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Subject -->
      <div>
        <label class="block text-sm text-gray-700 mb-2">
          Asunto *
        </label>
        <select
            required
            v-model="formData.subject"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        >
          <option value="">Selecciona un asunto</option>
          <option value="general">Consulta general</option>
          <option value="productos">Información de productos</option>
          <option value="pedido">Estado de pedido</option>
          <option value="cuidados">Consejos de cuidado</option>
          <option value="envio">Envíos y entregas</option>
          <option value="devolucion">Devoluciones</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <!-- Message -->
      <div>
        <label class="block text-sm text-gray-700 mb-2">
          Mensaje *
        </label>
        <div class="relative">
          <MessageSquare class="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <textarea
              required
              v-model="formData.message"
              placeholder="Cuéntanos cómo podemos ayudarte..."
              rows="6"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <button
          type="submit"
          class="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
      >
        <span>Enviar mensaje</span>
        <Send class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <p class="text-sm text-gray-500 text-center">
        * Campos obligatorios
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Send, User, Mail, MessageSquare, Phone } from 'lucide-vue-next'
import { submitContact, type ContactPayload } from '~~/services/contact'
import { useCaptcha } from '~~/composables/useCaptcha'

const formData = reactive<ContactPayload>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const { getToken } = useCaptcha()

const handleSubmit = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const token = await getToken('contact_submit')
    await submitContact({ ...formData }, token)
    // Reset fields after successful submission
    formData.name = ''
    formData.email = ''
    formData.phone = ''
    formData.subject = ''
    formData.message = ''
    // Feedback sin cambiar estilos (alert simple)
    // eslint-disable-next-line no-alert
    alert('Mensaje enviado correctamente')
  } catch (e: any) {
    // eslint-disable-next-line no-alert
    alert(e?.statusMessage || e?.message || 'Error al enviar el mensaje')
  } finally {
    loading.value = false
  }
}
</script>
