// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Институт природопользования НАН Беларуси',
      // meta: [{ name: 'description', content: 'My amazing site.' }],
      // bodyAttrs: {
      //   class: 'test'
      // },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    mongoDbUrl: process.env.MONGODB_URL
  },
  css: ['~/assets/styles/base.css', '~/assets/styles/main.scss'],
  modules: ['vue3-carousel-nuxt', '@nuxt/image', '@nuxt/ui'],
  nitro: {
    plugins: ['~/server/index.ts']
  },
  colorMode: {
    preference: 'light'
  },
  ui: {
    icons: ['material-symbols']
  },
  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    }
  }
});
