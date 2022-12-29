<script setup>
const props = defineProps({ blok: Object })
</script>

<template>
  <section v-editable="blok" :id="blok._uid">
    <div class="inner">
      <h2>{{ blok.headline }}</h2>

      <div v-if="blok.copy.content.length > 1" class="featured-copy">
        <RichText :content="blok.copy" />
      </div>

      <div v-if="blok.items.length" class="featured-items">
        <template v-for="story in blok.items" :key="`story-${story.uuid}`">
          <article :id="`story-${story.id}`">
            <figure aria-hidden="true">
              <NuxtLink :to="story.full_slug">
                <StoryblokImage
                  :decorative="true"
                  :image="bestImage(story.content)"
                  height="450"
                  width="340"
                  sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
                />
              </NuxtLink>

              <figcaption>
                <div>
                  <NuxtLink :to="story.full_slug">{{ story.name }}</NuxtLink>
                </div>

                <p v-if="story.content.body[0].excerpt">
                  {{ story.content.body[0].excerpt }}
                </p>

                <time :datetime="story.first_published_at">
                  {{ storyDate(story.first_published_at) }}
                </time>
              </figcaption>
            </figure>
          </article>
        </template>
      </div>

      <div v-if="blok.images.length" class="featured-images">
        <template v-for="image in blok.images" :key="`image-${image.id}`">
          <figure aria-hidden="true">
            <StoryblokImage
              :decorative="true"
              :image="image"
              height="340"
              width="340"
              sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
            />

            <figcaption>{{ image.alt }}</figcaption>
          </figure>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
section {
  background-color: var(--color-grey-light);
}

.inner {
  display: grid;
  gap: 2em;
  margin: auto;
  max-width: var(--featured-width);
  padding: 5em 0;
}

h2,
.featured-copy,
.featured-images {
  text-align: center;
}

.featured-copy {
  padding-bottom: 3em;
}

.featured-items {
  display: grid;
  gap: 3em;
  grid-template-columns: var(--featured-columns);
}

figure {
  display: grid;
  gap: 1em;
  margin: 0;
}

img {
  display: block;
  height: auto;
  margin: auto;
  max-width: 100%;
  width: 100%;
}

figcaption {
  display: grid;
  gap: 0.5em;
}

a {
  color: var(--color-black);
}

p,
time {
  font-size: var(--font-size-accent);
}

time {
  color: var(--color-grey-dark);
}
</style>
