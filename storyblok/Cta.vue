<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <pre>CTA {{ blok }}</pre>
  </div>
</template>
