// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Nuxt 4 互換モード
  future: {
    compatibilityVersion: 4,
  },

  // 開発ツール
  devtools: { enabled: true },

  // モジュール
  modules: ['@nuxtjs/i18n'],

  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // i18n設定
  i18n: {
    locales: [
      {
        code: 'ja',
        name: '日本語',
        file: 'ja.json',
      },
    ],
    defaultLocale: 'ja',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
  },

  // Sass（全SCSSファイルに変数・ミックスインを自動インポート）
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // _shared.scss 以外の全SCSSファイルに変数・ミックスインを自動インジェクト
          additionalData: `@import "${process.cwd()}/app/assets/styles/_shared";`,
          silenceDeprecations: ['import'],
        },
      },
    },
  },

  // グローバルCSS
  css: ['./app/assets/styles/main.scss'],

  // アプリ設定
  app: {
    head: {
      title: 'Dashboard | Billion Dollar Daisy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '管理画面・ダッシュボード',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
        },
      ],
    },
  },
})
