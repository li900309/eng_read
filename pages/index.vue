<template>
  <div class="min-h-screen">
    <!-- 英雄区域 -->
    <section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- 左侧内容 -->
          <div class="text-center lg:text-left space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                掌握英语
                <span class="text-gradient-primary"> 从这里开始</span>
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                通过AI技术和科学的记忆算法，提供个性化的英语学习体验。智能词汇推荐、自适应学习路径，让学习更高效。
              </p>
            </div>

            <!-- 行动按钮 -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <UButton
                size="lg"
                color="primary"
                class="text-lg px-8 py-3"
                @click="handleGetStarted"
              >
                立即开始学习
                <Icon name="heroicons-arrow-right" class="ml-2 w-5 h-5" />
              </UButton>
              <UButton
                size="lg"
                variant="outline"
                class="text-lg px-8 py-3"
                @click="scrollToFeatures"
              >
                了解更多
                <Icon name="heroicons-information-circle" class="ml-2 w-5 h-5" />
              </UButton>
            </div>

            <!-- 统计数据 -->
            <div class="grid grid-cols-3 gap-8 pt-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ formatNumber(stats.totalVocabularies) }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">词汇库</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ formatNumber(stats.activeUsers) }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">活跃用户</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ formatNumber(stats.dailyLearners) }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">日学习人数</div>
              </div>
            </div>
          </div>

          <!-- 右侧图片 -->
          <div class="relative">
            <div class="relative z-10">
              <img
                src="https://via.placeholder.com/500x300/4F46E5/FFFFFF?text=智能英语学习"
                alt="英语学习插画"
                class="w-full h-auto"
                loading="eager"
              />
            </div>
            <!-- 背景装饰 -->
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary-200/20 to-purple-200/20 rounded-3xl transform rotate-3"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section id="features" class="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            为什么选择我们
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            采用先进的学习科学原理和AI技术，为您量身定制最有效的英语学习方案
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 功能卡片 -->
          <FeatureCard
            v-for="feature in features"
            :key="feature.id"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
          />
        </div>
      </div>
    </section>

    <!-- 学习模式 -->
    <section class="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            多样化学习模式
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            根据您的学习目标和偏好，选择最适合的学习方式
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <LearningModeCard
            v-for="mode in learningModes"
            :key="mode.id"
            :mode="mode"
          />
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="py-20 lg:py-32 bg-gradient-to-r from-primary-600 to-indigo-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
          准备好开始学习了吗？
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          加入我们，开启您的英语学习之旅。免费注册，即刻体验智能学习的魅力。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            size="lg"
            color="white"
            variant="solid"
            class="text-lg px-8 py-3 text-primary-600"
            @click="handleGetStarted"
          >
            免费注册
            <Icon name="heroicons-arrow-right" class="ml-2 w-5 h-5" />
          </UButton>
          <UButton
            size="lg"
            variant="outline"
            class="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary-600"
            @click="handleLogin"
          >
            立即登录
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

// 页面元数据
useHead({
  title: '首页',
  meta: [
    { name: 'description', content: '智能英语学习平台 - 通过AI技术和科学记忆算法，提供高效的英语学习体验' }
  ]
})

// 认证状态
const { isAuthenticated } = useAuth()

// 统计数据
const stats = ref({
  totalVocabularies: 12500,
  activeUsers: 3280,
  dailyLearners: 856
})

// 功能特性
const features = ref([
  {
    id: 1,
    icon: 'heroicons-brain',
    title: 'AI智能推荐',
    description: '基于学习历史和表现，智能推荐最适合的词汇和学习内容，提高学习效率。'
  },
  {
    id: 2,
    icon: 'heroicons-chart-bar',
    title: '学习分析',
    description: '详细的学习数据分析，帮助您了解学习进度和薄弱环节，制定针对性的学习计划。'
  },
  {
    id: 3,
    icon: 'heroicons-clock',
    title: '间隔重复',
    description: '科学的艾宾浩斯遗忘曲线算法，在最恰当的时间安排复习，提高记忆效果。'
  },
  {
    id: 4,
    icon: 'heroicons-device-phone-mobile',
    title: '多端同步',
    description: '支持手机、平板、电脑等多设备学习，学习进度实时同步，随时随地学习。'
  },
  {
    id: 5,
    icon: 'heroicons-trophy',
    title: '成就系统',
    description: '丰富的成就系统和激励机制，让学习充满乐趣，持续保持学习动力。'
  },
  {
    id: 6,
    icon: 'heroicons-academic-cap',
    title: '个性化学习',
    description: '根据您的学习目标和水平，定制个性化的学习路径和内容安排。'
  }
])

// 学习模式
const learningModes = ref([
  {
    id: 1,
    title: '词汇学习',
    description: '通过单词卡片、例句理解、语音跟读等方式深入学习词汇',
    icon: 'heroicons-book-open',
    color: 'blue'
  },
  {
    id: 2,
    title: '阅读理解',
    description: '精选文章阅读，提升阅读速度和理解能力，扩大词汇量',
    icon: 'heroicons-document-text',
    color: 'green'
  },
  {
    id: 3,
    title: '智能测试',
    description: '多样化的测试形式，检验学习效果，发现知识盲点',
    icon: 'heroicons-clipboard-document-check',
    color: 'purple'
  }
])

// 方法
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

const scrollToFeatures = () => {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleGetStarted = () => {
  if (isAuthenticated.value) {
    navigateTo('/learning')
  } else {
    navigateTo('/register')
  }
}

const handleLogin = () => {
  navigateTo('/login')
}

// 页面加载动画
onMounted(() => {
  // 这里可以添加一些动画效果
})
</script>