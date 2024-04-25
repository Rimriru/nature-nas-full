// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      title: 'Институт природопользования НАН Беларуси',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  components: [{ path: '~/components/ui', pathPrefix: false }, '~/components'],
  runtimeConfig: {
    mongoDbUrl: process.env.MONGODB_URL,
    public: {
      domen: process.env.DOMEN,
      process: process.env.NODE_ENV
    }
  },
  routeRules: {
    '/api/**': {
      cors: true,
      security: {
        xssValidator: false,
        headers: {
          crossOriginEmbedderPolicy: 'unsafe-none',
          crossOriginResourcePolicy: 'cross-origin'
        }
      }
    }
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginResourcePolicy: 'cross-origin',
      contentSecurityPolicy: {
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https:',
          '*.tinymce.com',
          '*.tiny.cloud',
          'https://cdn.tiny.cloud',
          'http://www.localhost:3000',
          'http://www.localhost:4000'
        ],
        'script-src-attr': ["'self'"],
        'connect-src': [
          "'self'",
          '*.tinymce.com',
          '*.tiny.cloud',
          'https://cdn.tiny.cloud',
          'blob:'
        ],
        'img-src': [
          "'self'",
          '*.tinymce.com',
          '*.tiny.cloud',
          'data:',
          'https:',
          'blob:',
          'http://www.localhost:3000',
          'http://www.localhost:4000'
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          '*.tinymce.com',
          '*.tiny.cloud',
          'https://cdn.tiny.cloud'
        ],
        'font-src': ["'self'", '*.tinymce.com', '*.tiny.cloud']
      }
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
  },
  experimental: {
    asyncContext: true
  }
});
