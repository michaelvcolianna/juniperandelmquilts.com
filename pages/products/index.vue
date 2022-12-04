<script setup>
const showDrafts = computed(() => process.env.NODE_ENV === 'development')

if(process.env.NODE_ENV !== 'development') {
  throw createError({
    statusCode: 404,
    statusMessage: `Page '/products' not found`,
    fatal: true
  })
}
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
