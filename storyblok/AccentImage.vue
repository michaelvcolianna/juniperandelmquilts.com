<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <section v-editable="blok" aria-hidden="true" class="clipped">
    <StoryblokImage
      :decorative="true"
      :image="blok.image"
      height="500"
      width="340"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
    />
  </section>
</template>

<style scoped lang="scss">
section {
  background-color: var(--color-white);
  padding: var(--accent-padding);
}

img {
  display: block;
  height: var(--accent-height);
  object-fit: cover;
  object-position: var(--accent-position);
  width: 100%;
}
</style>
