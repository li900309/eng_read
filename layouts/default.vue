<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <AppHeader />

    <!-- 主要内容区域 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 底部信息栏 -->
    <AppFooter />

    <!-- 全局加载状态 -->
    <ClientOnly>
      <Teleport to="body">
        <LoadingOverlay v-if="isLoading" />
      </Teleport>
    </ClientOnly>

    <!-- 全局通知 -->
    <ClientOnly>
      <UNotifications />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

// 页面元数据
useHead({
  titleTemplate: '%s - 智能英语学习平台',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: '通过AI技术和个性化算法，提供高效的英语阅读理解学习体验' }
  ],
  htmlAttrs: {
    lang: 'zh-CN'
  }
})

// 状态管理
const isLoading = ref(false)
const { user } = useAuth()

// 监听路由变化
const route = useRoute()
const router = useRouter()

// 页面加载状态管理
onBeforeRouteUpdate(() => {
  isLoading.value = true
})

onBeforeRouteLeave(() => {
  isLoading.value = true
})

// 页面切换完成后
onMounted(() => {
  nextTick(() => {
    isLoading.value = false
  })
})

// 监听页面加载状态
watch(
  () => route.path,
  () => {
    isLoading.value = true
    // 模拟页面加载时间
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
)
</script>