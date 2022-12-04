<script setup>
const showDrafts = computed(() => process.env.NODE_ENV === 'development')
</script>

<template>
  <div>
    fake blog listing:

    <ul>
      <li v-if="showDrafts">
        <NuxtLink to="/blog/colianna-ivf-fundraiser">Colianna IVF Fundraiser</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/blog/sweetbriar-rose-quilt-tester-parade">Sweetbriar Rose Quilt Tester Parade!</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/blog/sweetbriar-rose-quilt-release-day">Sweetbriar Rose Quilt Release Day!!</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/blog/how-to-make-an-envelope-backing-for-a-quilted-pillow">How to Make an Envelope Backing for a Quilted Pillow</NuxtLink>
      </li>
    </ul>
  </div>
</template>
