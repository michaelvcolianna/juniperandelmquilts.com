<script setup>
const story = await useAsyncStoryblok('home', { version: 'draft' })
</script>

<template>
  <div>
    <pre>NAME {{ story.name }}</pre>
    <pre>CARD {{ story.content.card }}</pre>
    <pre>DESCRIPTION {{ story.content.description }}</pre>

    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>
