<script setup>
const props = defineProps({ error: Object })
</script>

<template>
  <div>
    <h1>error.vue</h1>
    <pre>{{ error }}</pre>
  </div>
</template>
