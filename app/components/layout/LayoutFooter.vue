<template>
  <footer class="bg-gray-900 text-gray-300 py-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        <!-- Logo + descripción -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div
                class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
            >
            </div>
            <span class="text-white" style="font-family: serif">
              Vida en el Jardín
            </span>
          </div>
          <p class="text-sm text-gray-400">
            Tu destino para plantas, consejos y inspiración verde.
          </p>
        </div>

        <!-- Explorar -->
        <div>
          <h4 class="text-white mb-4">Explorar</h4>
          <ul class="space-y-2 text-sm">
            <li  v-for="link in navigationLinks"
                 :key="link.path">
              <NuxtLink
                  :to="link.path"
                  class=" hover:text-green-600 transition-colors"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Ayuda -->
        <div>
          <h4 class="text-white mb-4">Ayuda</h4>
          <ul class="space-y-2 text-sm">
<!--            <li>-->
<!--              <NuxtLink to="/shipments" class="hover:text-green-400 transition-colors"-->
<!--              >Envíos</NuxtLink>-->
<!--            </li>-->
<!--            <li>-->
<!--              <NuxtLink to="/returns" class="hover:text-green-400 transition-colors"-->
<!--              >Devoluciones</NuxtLink-->
<!--              >-->
<!--            </li>-->
            <li>
              <NuxtLink to="/faq" class="hover:text-green-400 transition-colors">FAQ</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact"
                  class="hover:text-green-400 transition-colors"
              >
                Contacto
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-white mb-4">Newsletter</h4>
          <p class="text-sm text-gray-400 mb-3">
            Recibe consejos y ofertas especiales
          </p>
          <NewsletterFooter />
        </div>
      </div>

      <div
          class="border-t border-gray-800 pt-8 text-center text-sm text-gray-400"
      >
        <p>© 2025 Vida en el Jardín. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import NewsletterFooter from './NewsletterFooter.vue'

const navigationLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Blog', path: '/blog' },
  // { name: 'Tienda', path: '/store' },
  { name: 'Especies', path: '/species' },
  // { name: 'Consejos', path: '/tips' },
]
</script>


