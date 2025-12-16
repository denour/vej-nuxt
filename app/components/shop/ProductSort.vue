<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <div class="text-gray-600">
      Mostrando <span class="text-gray-800">{{ totalProducts }}</span> productos
    </div>

    <div class="flex items-center gap-4">
      <!-- Sort Dropdown -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Ordenar por:</span>
        <select
            v-model="selectedSort"
            class="px-4 py-2 border border-gray-200 rounded-lg text-sm
                 focus:outline-none focus:ring-2 focus:ring-green-500
                 focus:border-transparent bg-white"
        >
          <option>Más populares</option>
          <option>Precio: Menor a Mayor</option>
          <option>Precio: Mayor a Menor</option>
          <option>Nombre: A-Z</option>
          <option>Nombre: Z-A</option>
          <option>Más recientes</option>
        </select>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
        <button
            @click="changeMode('grid')"
            :class="[
            'p-2 rounded transition-colors',
            viewMode === 'grid'
              ? 'bg-green-600 text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <LayoutGrid class="w-4 h-4" />
        </button>

        <button
            @click="changeMode('list')"
            :class="[
            'p-2 rounded transition-colors',
            viewMode === 'list'
              ? 'bg-green-600 text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <List class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { LayoutGrid, List } from "lucide-vue-next";

const props = defineProps({
  viewMode: {
    type: String,
    required: true,
  },
  totalProducts: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["viewModeChange", "sortChange"]);

const selectedSort = ref("Más populares");

// Emitir cuando cambie el sort
watch(selectedSort, (value) => {
  emit("sortChange", value);
});

function changeMode(mode) {
  emit("viewModeChange", mode);
}
</script>
