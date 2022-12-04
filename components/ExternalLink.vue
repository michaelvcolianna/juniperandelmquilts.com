<script setup>
const props = defineProps({ href: String })

const isPhone = computed(() => {
  const test = /^tel/gm

  return test.exec(props.href)
})
</script>

<template>
  <a
    :href="href"
    :target="isPhone ? null : '_blank'"
    :rel="isPhone ? null : 'nofollow'"
    :aria-describedby="`label-${isPhone ? 'phone' : 'external'}`"
  >
    <slot></slot>
  </a>
</template>
