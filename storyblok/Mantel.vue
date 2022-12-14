<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <section v-editable="blok" :id="blok._uid">
    <StoryblokImage
      :decorative="true"
      :image="blok.image"
      height="640"
      width="375"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
    />

    <div>
      <h1>{{ blok.headline }}</h1>

      <p v-if="blok.copy">{{ blok.copy }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
section {
  display: grid;
  grid-template-areas: "mantel";
}

img,
div {
  grid-area: mantel;
}

img {
  display: block;
  filter: blur(1.75px)
          brightness(65%)
          grayscale(0.15);
  height: calc(100vh - var(--header-height));
  object-fit: cover;
  width: 100vw;
  z-index: -1;
}

div {
  align-items: center;
  color: var(--color-white);
  display: flex;
  flex-flow: column;
  gap: 2rem;
  height: 100%;
  justify-content: center;
  margin: auto;
  text-align: center;
  text-shadow:
    0 1px 2px var(--color-black),
    0 0 5rem var(--color-black);
  width: 80vw;
}

h1,
p {
  font-weight: 300;
}

h1 {
  font-size: var(--font-size-mantel-heading);
}

p {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-mantel-copy);
}
</style>
