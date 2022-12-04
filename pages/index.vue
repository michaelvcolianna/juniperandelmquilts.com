<script setup>
const storyVersion = process.env.NODE_ENV === 'development'
  ? 'draft'
  : 'published'

const story = await useAsyncStoryblok('home', { version: storyVersion })
</script>

<template>
  <div>
    <pre>NAME {{ story.name }}</pre>
    <pre>CARD {{ story.content.card }}</pre>
    <pre>DESCRIPTION {{ story.content.description }}</pre>

    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>
