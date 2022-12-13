<script setup>
const props = defineProps({ content: Object })
const richText = computed(() => renderRichText(props.content))
</script>

<template>
  <div v-html="richText"></div>
</template>

<style scoped lang="scss">
div {
  line-height: 1.55;
}

:deep(p) {
  margin: 1rem 0;
}
</style>
