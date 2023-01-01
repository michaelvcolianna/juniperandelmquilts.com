<script setup>
const { slug } = useRoute().params
const story = await getStory(`blog/${slug}`)

// @todo Stuff for card and description
// - card: story.content.body[0].hero.filename OR story.content.card
// - description: story.content.body[0].excerpt OR story.content.description
</script>

<template>
  <article>
    <NuxtLink to="/blog" class="back-blog">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true" fill="currentColor" height="1em"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
      <span>Back to Blog</span>
    </NuxtLink>

    <h1>{{ story.name }}</h1>

    <div class="inner">
      <div v-if="story.content.body[0].show_hero === 'yes'" class="hero">
        <StoryblokImage
          :image="bestImage(story.content)"
          height="350"
          width="550"
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
        />
      </div>

      <StoryblokComponent v-if="story" :blok="story.content" />
    </div>
  </article>
</template>

<style scoped lang="scss">
article {
  background-color: var(--color-grey-light);
  padding: 2rem 0;
}

.back-blog {
  align-items: center;
  color: var(--color-black);
  display: flex;
  gap: 0.5rem;
  font-weight: 700;
  margin: var(--blog-back-margin);
  text-transform: uppercase;
}

.inner {
  margin: auto;
  max-width: var(--blog-width);
}

h1 {
  margin: 0 1rem 4rem 1rem;
  text-align: center;
}

.hero {
  img {
    object-fit: cover;
    width: 100%;
  }
}
</style>
