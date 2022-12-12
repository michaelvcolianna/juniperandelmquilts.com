const generic = {
  title: 'Juniper & Elm Quilts',
  description: 'Juniper & Elm Quilts: Creating artwork you can curl up into!',
  image: 'https://a.storyblok.com/f/159199/1200x627/0b448f6439/card.jpg',
  url: 'https://www.juniperandelmquilts.com'
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: generic.title,
      link: [
        { hid: 'canonical', rel: 'canonical', href: generic.url },
        { rel: 'preconnect', href: 'https://fonts.bunny.net' },
        { rel: 'stylesheet', href: 'https://fonts.bunny.net/css?family=crimson-text:400,400i,700,700i|newsreader:300,400' }
      ],
      meta: [
        { hid: 'title', property: 'title', content: generic.title },
        { hid: 'description', property: 'description', content: generic.description },
        { hid: 'image', property: 'image', content: generic.image },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: generic.url },
        { hid: 'og:title', property: 'og:title', content: generic.title },
        { hid: 'og:description', property: 'og:url', content: generic.description },
        { hid: 'og:image', property: 'og:image', content: generic.image },
        { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:url', property: 'twitter:url', content: generic.url },
        { hid: 'twitter:title', property: 'twitter:title', content: generic.title },
        { hid: 'twitter:description', property: 'twitter:url', content: generic.description },
        { hid: 'twitter:image', property: 'twitter:image', content: generic.image }
      ]
    }
  },
  css: [
    '@/assets/css/main.scss'
  ],
  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.NODE_ENV === 'development'
          ? process.env.STORYBLOK_PREVIEW_KEY
          : process.env.STORYBLOK_PUBLIC_KEY
      }
    ],
    [
      '@nuxt/image-edge',
      {
        provider: 'storyblok',
        storyblok: {
          baseURL: 'https://a.storyblok.com'
        }
      }
    ],
    [
      '@nuxtjs/robots',
      {
        rules: {
          UserAgent: '*',
          Disallow: '/'
        }
      }
    ]
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/css/_mixins.scss";`
        }
      }
    }
  }
})
