<script setup>
import { createError } from 'h3'

const invalidPaths = [
  'home',
  'main-menu',
  'social-menu'
]

const { slug } = useRoute().params
const path = Object.values(slug).join('/')

const story = await useStoryblok(path ? path : 'home', {
  version: 'draft'
})
  .then((response) => {
    return response
  })
  .catch((error) => {
    return error
  })

if(story.response || invalidPaths.includes(path)) {
  throw createError({
    statusCode: story.response ? story.response.status : '404',
    statusMessage: story.response ? story.response.statusText : 'Not found'
  })
}
</script>

<template>
  <div>
    <StoryblokComponent
      v-for="blok in story.content.body"
      :key="blok._uid"
      :blok="blok"
    />

    <pre>{{ story }}</pre>
  </div>
</template>
