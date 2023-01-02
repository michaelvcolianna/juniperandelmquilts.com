<script setup>
const props = defineProps({ error: Object })
</script>

<template>
  <NuxtLayout>
    <section id="error">
      <div class="inner" role="alert">
        <h1>Oops! Something went wrong!</h1>

        <h2>Error {{ error.statusCode }}</h2>

        <p>{{ error.statusMessage }}</p>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped lang="scss">
#error {
  background-color: var(--color-grey-light);
}

.inner {
  display: grid;
  gap: 2rem;
  margin: auto;
  max-width: 80vw;
  padding: 4rem 0;
}
</style>
