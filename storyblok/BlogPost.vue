<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <section v-editable="blok" id="blog-content">
    <RichText :content="blok.body" />
  </section>
</template>

<style scoped lang="scss">
#blog-content {
  display: grid;
  gap: 1rem;
  padding: 2rem 0;
}

:deep(h2) {
  margin-top: 2rem;
}

:deep(p) {
  line-height: 1.5;
}

:deep(img) {
  display: block;
  max-width: 100%;
}
</style>
