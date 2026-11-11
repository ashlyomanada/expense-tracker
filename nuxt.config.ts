// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register', '/join'],
    },
  },
  runtimeConfig: {
    public: {
      defaultCurrency: process.env.DEFAULT_CURRENCY || 'PHP',
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})

