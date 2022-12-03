<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <pre>EXCERPT {{ blok.excerpt || '{use description}' }}</pre>
    <pre>HERO {{ blok.hero.filename || '{use card}' }}</pre>
    <pre>BODY {{ blok.body }}</pre>
  </div>
</template>
