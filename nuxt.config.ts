// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    mongoDbUrl: process.env.MONGODB_URL
  },
  nitro: {
    plugins: ["~/server/index.ts"]
  }
})
