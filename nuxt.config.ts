// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  'modules': [
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
    ]
  ]
})
