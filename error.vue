<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({
  redirect: '/'
})
</script>

<template>
  <pre>{{ error }}</pre>
  <button @click="handleError">Clear errors</button>
</template>
