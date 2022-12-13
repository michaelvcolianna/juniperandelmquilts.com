<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div v-editable="blok" class="clipped">
    <pre>NEWSLETTER SIGNUP {{ blok }}</pre>
  </div>
</template>
