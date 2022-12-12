<script setup>
const story = await getStory('home')

// @todo Create composable(?) to set meta values
// - story.content.card
// - story.content.description
</script>

<template>
  <div>
    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>
