<template>
  <div class="space-y-6">
    <!-- Hours -->
    <div class="bg-white rounded-2xl shadow-md p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 class="text-lg mb-3 text-gray-800">Horarios de Atención</h3>

          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Lunes - Viernes:</span>
              <span class="text-gray-800">9:00 AM - 7:00 PM</span>
            </div>

            <div class="flex justify-between">
              <span>Sábado:</span>
              <span class="text-gray-800">10:00 AM - 6:00 PM</span>
            </div>

            <div class="flex justify-between">
              <span>Domingo:</span>
              <span class="text-gray-800">10:00 AM - 3:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address -->
    <div class="bg-white rounded-2xl shadow-md p-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin class="w-6 h-6 text-green-600" />
        </div>

        <div>
          <h3 class="text-lg mb-2 text-gray-800">Dirección</h3>

          <p class="text-sm text-gray-600 mb-3">
            Av. Reforma 123, Col. Juárez<br />
            Cuauhtémoc, 06600<br />
            Ciudad de México, CDMX
          </p>

          <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-1"
          >
            Ver en Google Maps →
          </a>
        </div>
      </div>
    </div>

    <!-- Contact Details -->
    <div class="bg-white rounded-2xl shadow-md p-6">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Phone class="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h3 class="text-sm text-gray-500">Teléfono</h3>
            <a href="tel:+525512345678" class="text-gray-800 hover:text-green-600 transition-colors">
              +52 (55) 1234-5678
            </a>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail class="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h3 class="text-sm text-gray-500">Email</h3>
            <a href="mailto:info@vidaeneljardin.com" class="text-gray-800 hover:text-green-600 transition-colors">
              info@vidaeneljardin.com
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Social Media -->
    <div class="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-md p-6 text-white">
      <h3 class="text-lg mb-4">Síguenos en Redes Sociales</h3>

      <div class="flex gap-3">
        <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
        >
          <Instagram class="w-5 h-5" />
        </a>

        <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
        >
          <Facebook class="w-5 h-5" />
        </a>

        <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
        >
          <Twitter class="w-5 h-5" />
        </a>
      </div>

      <p class="text-sm text-green-100 mt-4">
        Comparte tu jardín con #VidaEnElJardín
      </p>
    </div>
  </div>
</template>

<script setup>
import {
  Clock,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-vue-next';
</script>
