<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <div :class="['aligned-image', blok.alignment]">
    <h2>{{ blok.title }}</h2>

    <div class="image">
      <StoryblokImage
        :image="blok.image"
        height="450"
        width="340"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
      />
    </div>

    <div class="text">
      <RichText :content="blok.content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.aligned-image {
  h2 {
    margin-bottom: 2rem;
  }

  &.left {
    .image {
      float: var(--aligned-image-left-float);
      margin: var(--aligned-image-left-margin);
    }
  }

  &.right {
    .image {
      float: var(--aligned-image-right-float);
      margin: var(--aligned-image-right-margin);
    }
  }

  .text {
    margin-top: var(--aligned-image-text-margin);
  }
}
</style>
