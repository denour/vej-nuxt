<script setup lang="ts">
import BlogCard from './BlogCard.vue'
import type { BlogPost } from "~~/models/BlogPost"

const props = defineProps<{
  posts: BlogPost[]
}>()
</script>
 <template>
  <section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-6">
      <h2
          class="text-3xl md:text-4xl mb-10 text-gray-800 text-center"
          style="font-family: serif;"
      >
        Artículos Relacionados
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BlogCard
            v-for="(post, index) in props.posts"
            :key="index"
            v-bind="post"
        />
      </div>
    </div>
  </section>
</template>
