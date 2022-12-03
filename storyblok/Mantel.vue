<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <pre>MANTEL {{ blok }}</pre>
  </div>
</template>
