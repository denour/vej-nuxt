<template>
  <ContactHero />
  <section class="max-w-7xl mx-auto px-6 py-16">
    <div class="grid grid-cols-3 gap-8">
      <div class="col-span-2" id="form">
        <ContactForm />
      </div>

      <div class="col-span-1">
        <ContactInfo />
      </div>
    </div>
  </section>
  <section class="max-w-7xl mx-auto px-6 pb-16">
    <ContactFAQ />
  </section>
</template>

<script setup lang="ts">
import ContactForm from "~/components/common/ContactForm.vue";
import ContactInfo from "~/components/common/ContactInfo.vue";
import ContactFAQ from "~/components/common/ContactFAQ.vue";
import ContactHero from "~/components/common/ContactHero.vue";
</script>
