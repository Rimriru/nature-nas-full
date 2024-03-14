// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      title: 'Институт природопользования НАН Беларуси',
      // meta: [{ name: 'description', content: 'My amazing site.' }],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            canvases: ['./components/CanvasOne', './components/CanvasTwo']
          }
        }
      }
    }
  },
  components: [{ path: '~/components/ui', pathPrefix: false }, '~/components'],
  runtimeConfig: {
    mongoDbUrl: process.env.MONGODB_URL
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'https:', 'data:']
      }
    },
    rateLimiter: {
      tokensPerInterval: 30,
      interval: 10000
    }
  },
  css: ['~/assets/styles/base.css', '~/assets/styles/main.scss'],
  modules: ['@nuxt/image', '@nuxt/ui', '@vueuse/nuxt', 'nuxt-security'],
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
      xl: 1280
    }
  }
});
