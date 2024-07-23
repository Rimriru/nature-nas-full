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
      devDomen: process.env.DEV_DOMEN,
      prodDomen: process.env.PROD_DOMEN,
      process: process.env.NODE_ENV,
      tinymce: process.env.TINYMCE_API_KEY
    },
    apiSecret: process.env.NUXT_API_SECRET
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
    },
    '/api/files/upload': {
      security: {
        requestSizeLimiter: {
          maxUploadFileRequestInBytes: 130000000
        }
      }
    },
    '/api/images': {
      security: {
        requestSizeLimiter: {
          maxUploadFileRequestInBytes: 5000000
        }
      }
    }
  },
  security: {
    rateLimiter: {
      tokensPerInterval: 250,
      interval: 10000
    },
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginResourcePolicy: 'cross-origin',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'script-src': [
          "'self'",
          '*.tinymce.com',
          '*.tiny.cloud',
          'https://cdn.tiny.cloud',
          'http://www.localhost:3000',
          'https://nature-nas.by',
          "'unsafe-inline'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          "'unsafe-eval'"
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
          'http://www.localhost:3000'
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          '*.tinymce.com',
          '*.tiny.cloud',
          'https://cdn.tiny.cloud',
          'https://nature-nas.by'
        ],
        'font-src': ["'self'", '*.tinymce.com', '*.tiny.cloud']
      }
    }
  },
  hooks: {
    'build:manifest': (manifest) => {
      for (const key in manifest) {
        manifest[key].dynamicImports = [];

        const file = manifest[key];
        if (file.assets) {
          file.assets = file.assets.filter((assetName) => !/.+\.(jpe?g|png|svg)$/.test(assetName));
        }
      }
    }
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  css: ['~/assets/styles/base.css', '~/assets/styles/main.scss'],
  vite: {
    build: {
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 250 * 1024,
          manualChunks: (id, _) => {
            if (
              !id.includes('node_modules') &&
              !id.startsWith('virtual:') &&
              !id.includes('src') &&
              !id.includes('assets')
            ) {
              if (id.includes('pages')) {
                const parts = id.split('/');
                const folderIndex = parts.indexOf('pages');
                if (folderIndex + 2 < parts.length) {
                  const pageGroup = parts[folderIndex + 1];
                  return `chunk-pg-${pageGroup}`;
                }
                return 'chunk-pg-misc';
              }
            }
          }
        }
      }
    }
  },
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
