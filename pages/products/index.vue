<script setup>
const showDrafts = computed(() => process.env.NODE_ENV === 'development')
</script>

<template>
  <div>
    fake products listing:

    <ul v-if="showDrafts">
      <li>
        <NuxtLink to="/products/test-product">Test Product</NuxtLink>
      </li>
    </ul>
  </div>
</template>
