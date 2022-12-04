<script setup>
function skipNav(event) {
  document.querySelector('#content').scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <a href="#content" class="skip-nav" @click.prevent="skipNav">
      <span>Skip to content</span>
    </a>

    <Header />

    <main id="content">
      <slot />
    </main>

    <Footer />

    <div hidden>
      <span id="label-external">Opens an external link in a new window</span>
      <span id="label-phone">Initiates a phone call (if available)</span>
    </div>
  </div>
</template>

<style scoped>
main {
  max-width: 100vw;
  overflow: hidden;
}
</style>
