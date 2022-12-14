<script setup>
//
</script>

<template>
  <footer>
    <div style="--grid-area: general;">
      <h4>Juniper &amp; Elm Quilts</h4>

      <p>Powered by <ExternalLink href="https://www.storyblok.com/">Storyblok</ExternalLink> and <ExternalLink href="https://nuxt.com/">Nuxt</ExternalLink>.</p>

      <SocialMedia />
    </div>

    <div style="--grid-area: navigation;">
      <Navigation :in-footer="true" />
    </div>

    <div class="accent" style="--grid-area: copyright;">
      &copy; 2019-{{ new Date().getFullYear() }}.
      All rights reserved.
      Site by <ExternalLink href="https://github.com/michaelvcolianna">MVC</ExternalLink>.
    </div>
  </footer>
</template>

<style scoped lang="scss">
footer {
  color: var(--color-white);
  display: grid;
  gap: 2.5rem;
  grid-template-areas: var(--grid-areas-footer);
  padding: 3rem 1rem;
}

a {
  &:active,
  &:link,
  &:visited {
    color: var(--color-grey-light);
  }
}

div {
  grid-area: var(--grid-area);

  &:first-child {
    display: grid;
    gap: 2.5rem;
  }
}
</style>
