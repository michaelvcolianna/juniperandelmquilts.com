<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok">
    <pre>NEWSLETTER SIGNUP {{ blok }}</pre>
  </div>
</template>
