<script setup>
const story = await getStory('home')
</script>

<template>
  <div>
    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>
