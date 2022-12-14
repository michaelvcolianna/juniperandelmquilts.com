<script setup>
const props = defineProps({
  inFooter: {
    type: Boolean,
    default: false
  }
})

const showDrafts = computed(() => process.env.NODE_ENV === 'development')
</script>

<template>
  <nav aria-label="Site areas" :class="{ 'in-footer': inFooter }">
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/blog">Blog</NuxtLink>
    <NuxtLink v-if="showDrafts" to="/products">Products</NuxtLink>
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
