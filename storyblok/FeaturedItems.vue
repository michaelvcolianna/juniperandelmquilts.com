<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <pre>FEATURED ITEMS {{ blok }}</pre>
  </div>
</template>
