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
  nitro: {
    plugins: ['~/server/index.ts']
  }
});
