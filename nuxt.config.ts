// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.bunny.net' },
        { rel: 'stylesheet', href: 'https://fonts.bunny.net/css?family=crimson-text:400,400i,700,700i|antic-didone:400' }
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
