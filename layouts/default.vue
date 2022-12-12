<script setup>
function skipNav(event) {
  event.preventDefault()
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
      <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
    </div>
  </div>
</template>

<style scoped lang="scss">
a[href="#content"] {
  background-color: var(--color-white);
  color: var(--color-black);
  left: 1rem;
  padding: 0.5rem 1rem;
  position: fixed;
  top: -999rem;
  z-index: 2;

  &:focus {
    top: 1rem;
  }
}

main {
  max-width: 100vw;
  overflow: hidden;
  position: relative;
}
</style>
