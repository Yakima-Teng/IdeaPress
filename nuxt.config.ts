// https://nuxt.com/docs/api/configuration/nuxt-config

const {
  NODE_ENV,
  SITE_TITLE,
  SITE_SUB_TITLE,
  SITE_DESC,
  SITE_COPYRIGHT,
  SERVER_PORT,
  API_BASE,
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
  DISABLED_JWT,
  JWT_SECRET,
  AES_KEY,
  API_SECRET,
} = process.env

const isDev = NODE_ENV === 'development'

export default defineNuxtConfig({
  // @ts-ignore
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  css: ['~/assets/scss/main.scss'],
  devtools: { enabled: true },
  devServer: {
    https: false,
    host: '0.0.0.0',
    port: Number(SERVER_PORT),
    url: `http://localhost:${SERVER_PORT}`,
  },
  modules: [
    '@element-plus/nuxt',
    ['@nuxtjs/eslint-module', { lintOnStart: false }],
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // 自动引入 `defineStore()`
          'defineStore',
          'storeToRefs',
        ],
      },
    ],
    '@nuxt/content',
  ],
  elementPlus: { /** Options */ },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;'
        }
      }
    }
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: API_SECRET,
    isDev,
    serverPort: SERVER_PORT,
    disabledJWT: JSON.parse(DISABLED_JWT || 'false'),
    jwtSecret: JWT_SECRET,
    // AES加解密用的key
    aesKey: AES_KEY,
    // Keys within public are also exposed client-side
    public: {
      apiBase: API_BASE,
      siteTitle: SITE_TITLE,
      siteSubTitle: SITE_SUB_TITLE,
      siteDesc: SITE_DESC,
      siteCopyright: SITE_COPYRIGHT,
    },
    mysql: {
      database: MYSQL_DATABASE,
      username: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
      host: MYSQL_HOST,
      port: MYSQL_PORT,
    }
  }
})
