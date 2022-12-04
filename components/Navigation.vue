<script setup>
const showDrafts = computed(() => process.env.NODE_ENV === 'development')
</script>

<template>
  <nav aria-label="Site areas">
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/blog">Blog</NuxtLink>
    <NuxtLink v-if="showDrafts" to="/products">Products</NuxtLink>
    <NuxtLink to="/contact">Contact</NuxtLink>
  </nav>
</template>
