<script setup>
const attrs = useAttrs()

const props = defineProps({
  image: Object,
  decorative: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <NuxtImg
    :src="image.filename"
    :alt="decorative ? '' : image.alt"
    v-bind="attrs"
  />
</template>
