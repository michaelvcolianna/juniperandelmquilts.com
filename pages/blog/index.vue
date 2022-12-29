<script setup>
// Static elements
const storyblokApi = useStoryblokApi()
const route = useRoute()
const storyVersion = process.env.NODE_ENV === 'development'
    ? 'draft'
    : 'published'

// References for async/dynamic elements
const articles = ref(null)
const page = ref(route.query.page)
const pagination = ref([])

// Get the articles
const getArticles = async () => {
  // Keeping constructed since pagination headers are needed
  const response = await storyblokApi.get('cdn/stories', {
    version: storyVersion,
    starts_with: 'blog',
    page: page.value || 1,
    per_page: 10,
    sort_by: 'first_published_at:desc'
  })

  // Assign articles value
  articles.value = response.data.stories

  // Reset pagination container
  pagination.value = []

  // Get current values for pagination if needed
  let pages = Math.ceil(response.total / response.perPage)

  // Build navigation if needed
  if(pages > 1) {
    let currentPage = parseInt(page.value || 1)

    // Previous button
    let prevDisabled = currentPage === 1
    pagination.value.push({
      rel: 'previous',
      disabled: prevDisabled,
      pageId: prevDisabled ? null : currentPage - 1
    })

    // Numbered pages
    for(let i = 0; i < pages; i++) {
      let pageId = i + 1
      pagination.value.push({
        rel: 'page',
        current: pageId === currentPage,
        disabled: false,
        pageId: pageId
      })
    }

    // Next button
    let nextDisabled = currentPage === pages
    pagination.value.push({
      rel: 'next',
      disabled: nextDisabled,
      pageId: nextDisabled ? null : currentPgae + 1
    })
  }
}

// Change page number
const changePage = (newPage) => {
  const { path } = useRoute()

  let query = {}

  if(newPage && newPage !== 1) {
    query.page = newPage
  }

  page.value = newPage

  navigateTo({
    path: path,
    query: query
  })
}

// Fetch articles on first load
onMounted(() => {
  getArticles()
})

// Update refs and fetch articles on update
watch(route, () => {
  setTimeout(() => {
    // @note If scrollintoview is needed, put it here
  }, 195)

  page.value = route.query.page

  getArticles()
})
</script>

<template>
  <section>
    <ul class="blog-list">
      <template v-for="article in articles" :key="article.uuid">
        <li>
          <article :id="`story-${article.id}`">
            <NuxtLink :to="article.full_slug">
              <StoryblokImage
                :decorative="true"
                :image="bestImage(article.content)"
                height="450"
                width="340"
                sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
              />
            </NuxtLink>

            <div class="blog-info">
              <time :datetime="storyDate(article.first_published_at, 'yyyy-MM-dd\'T\'HH:mm:ssXX')">
                {{ storyDate(article.first_published_at, "M/d/yy") }}
              </time>

              <h1>
                <NuxtLink :to="article.full_slug">{{ article.name  }}</NuxtLink>
              </h1>

              <NuxtLink :to="article.full_slug" class="read-more">
                Read More
              </NuxtLink>
            </div>
          </article>
        </li>
      </template>
    </ul>

    <nav v-if="pagination.length > 0" aria-label="Pages of blog posts">
      <ul class="pager">
        <template v-for="(link, key) in pagination" :key="`link-${key}`">
          <li>
            <a
              href="#"
              :class="{
                'arrow': link.rel !== 'page',
                'page': link.rel === 'page'
              }"
              :disabled="link.disabled"
              :aria-current="link.current ? 'page' : null"
              @click.prevent="changePage(link.pageId)"
            >
              <span v-if="link.rel === 'previous'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" fill="currentColor" height="1em"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
                Previous
              </span>

              <span v-if="link.rel === 'page'">{{ link.pageId }}</span>

              <span v-if="link.rel === 'next'">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" fill="currentColor" height="1em"><path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
              </span>
            </a>
          </li>
        </template>
      </ul>
    </nav>
  </section>
</template>

<style scoped lang="scss">
section {
  background-color: var(--color-grey-light);
  padding: var(--blog-padding);
}

img {
  display: block;
  max-width: 100%;
  object-fit: cover;
}

.blog-list {
  display: grid;
  gap: 2rem;
  grid-template-columns: var(--list-ul-columns);
  list-style: none;
  margin: auto;
  max-width: 750px;
  padding: 0;
}

article {
  display: grid;
  gap: var(--list-article-gap);
}

.blog-info {
  display: var(--list-article-layout);
  flex-flow: column;
  gap: 1rem;
  justify-content: var(--list-article-justify);

  h1 {
    font-size: var(--list-article-headline);

    a {
      color: var(--color-black);
    }
  }

  .read-more {
    color: var(--color-grey-medium);
    margin-top: 1rem;
  }
}

nav {
  margin: auto;
  max-width: 1200px;
  padding: 2rem 0;

  ul {
    display: flex;
    gap: 2rem;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--color-blac);
    display: inline-block;
    text-decoration: none;

    &[aria-current="page"] {
      border: 1px solid var(--color-grey-medium);
      border-radius: 100%;
    }

    &:not([disabled="false"]) {
      color: var(--color-grey-medium);
      pointer-events: none;
    }
  }

  span {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    height: 3rem;
    justify-content: center;
    min-width: 3rem;
  }
}
</style>
