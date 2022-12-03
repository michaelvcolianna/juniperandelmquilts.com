<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <pre>DISPLAY NAME {{ blok.display_name }}</pre>
    <pre>PRICE {{ blok.price }}</pre>
    <pre>DETAILS {{ blok.details }}</pre>
    <pre>IMAGES {{ blok.images }}</pre>
    <pre>OPTIONS {{ blok.options }}</pre>
  </div>
</template>
