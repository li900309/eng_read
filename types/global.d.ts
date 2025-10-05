// Nuxt 3 自动导入的全局类型声明
declare global {
  // Vue Composition API
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const readonly: typeof import('vue')['readonly']
  const watch: typeof import('vue')['watch']
  const nextTick: typeof import('vue')['nextTick']
  const onMounted: typeof import('vue')['onMounted']

  // Nuxt App
  const useNuxtApp: typeof import('#app')['useNuxtApp']
  const useState: typeof import('#app')['useState']
  const useCookie: typeof import('#app')['useCookie']

  // Nuxt Router
  const useRouter: typeof import('#app/composables')['useRouter']
  const useRoute: typeof import('#app/composables')['useRoute']
  const navigateTo: typeof import('#app/composables')['navigateTo']
  const onBeforeRouteUpdate: typeof import('#app/composables')['onBeforeRouteUpdate']
  const onAfterRouteLeave: typeof import('#app/composables')['onAfterRouteLeave']

  // Nuxt Meta
  const useHead: typeof import('#app/composables')['useHead']

  // Nuxt Utils
  const $fetch: typeof import('ofetch')['$fetch']

  // VueUse
  const useDebounceFn: typeof import('@vueuse/core')['useDebounceFn']

  // Nuxt Config
  const defineNuxtConfig: typeof import('@nuxt/schema')['defineNuxtConfig']

  // Nuxt Server
  const defineEventHandler: typeof import('h3')['defineEventHandler']
  const readBody: typeof import('h3')['readBody']
  const setCookie: typeof import('h3')['setCookie']
  const createError: typeof import('h3')['createError']
}

export {}