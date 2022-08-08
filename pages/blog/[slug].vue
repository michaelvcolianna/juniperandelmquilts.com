<script setup>
import { createError } from 'h3'

const { slug } = useRoute().params

const story = await useStoryblok(`blog/${slug}`, {
  version: 'draft'
})
  .then((response) => {
    return response
  })
  .catch((error) => {
    return error
  })

if(story.response) {
  throw createError({
    statusCode: story.response.status,
    statusMessage: story.response.statusText
  })
}
</script>

<template>
  <div>
    <StoryblokComponent v-if="story" :blok="story.content" />
    <pre>{{ story }}</pre>
  </div>
</template>
