<script setup>
const attrs = useAttrs()

const props = defineProps({
  image: Object,
  decorative: {
    type: Boolean,
    default: false
  }
})

const src = computed(() => {
  return props.image.filename.replace('https://a.storyblok.com', '')
})
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="decorative ? '' : image.alt"
    v-bind="attrs"
  />
</template>
