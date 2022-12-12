<script setup>
const { slug } = useRoute().params
const story = await getStory(`blog/${slug}`)
</script>

<template>
  <div>
    <pre>NAME {{ story.name }}</pre>
    <pre>CARD {{ story.content.card }}</pre>
    <pre>DESCRIPTION {{ story.content.description }}</pre>

    <StoryblokComponent v-if="story" :blok="story.content" />
  </div>
</template>
