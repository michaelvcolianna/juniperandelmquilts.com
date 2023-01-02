<script setup>
const props = defineProps({
  inFooter: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <nav aria-label="Site areas" :class="{ 'in-footer': inFooter }">
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/blog">Blog</NuxtLink>
    <NuxtLink to="/contact">Contact</NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
nav {
  display: grid;
  gap: 0.5rem;
}

.in-footer {
  a {
    &:active,
    &:link,
    &:visited {
      color: var(--color-grey-light);
    }
  }
}
</style>
