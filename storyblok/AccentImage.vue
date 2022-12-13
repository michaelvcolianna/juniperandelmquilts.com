<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok" class="clipped">
    <pre>ACCENT IMAGE {{ blok }}</pre>
  </div>
</template>
