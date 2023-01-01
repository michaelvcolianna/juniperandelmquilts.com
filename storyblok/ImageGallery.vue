<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <ul class="image-gallery" v-editable="blok">
    <template v-for="image in blok.images" :key="`image-${image.id}`">
      <li>
        <StoryblokImage
          :image="image"
          height="150"
          width="150"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
        />
      </li>
    </template>
  </ul>
</template>

<style scoped lang="scss">
.image-gallery {
  display: grid;
  gap: 1rem;
  grid-template-columns: var(--gallery-columns);
  list-style: none;
  margin: auto;
  max-width: var(--gallery-width);
  padding: 0 0 2rem 0;
}

img {
  aspect-ratio: 1/1;
  height: auto;
}
</style>
