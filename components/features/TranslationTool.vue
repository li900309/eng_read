<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI翻译助手</h3>
      <div class="flex items-center gap-2">
        <!-- 语言选择器 -->
        <select
          v-model="fromLanguage"
          class="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
        <Icon name="heroicons-arrow-right" class="w-4 h-4 text-gray-400" />
        <select
          v-model="toLanguage"
          class="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          原文
        </label>
        <textarea
          v-model="sourceText"
          :placeholder="`请输入${getLanguageName(fromLanguage)}文本...`"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          rows="4"
          @input="handleInputChange"
        />
        <div class="mt-2 flex items-center justify-between">
          <span class="text-xs text-gray-500">
            {{ sourceText.length }} 字符
          </span>
          <BaseButton
            v-if="sourceText.trim()"
            variant="ghost"
            size="sm"
            @click="clearText"
          >
            清空
          </BaseButton>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <Icon name="heroicons-arrow-path" class="animate-spin w-6 h-6 text-primary-600 mr-2" />
        <span class="text-gray-600 dark:text-gray-400">正在翻译...</span>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-start">
          <Icon name="heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
          <div>
            <h4 class="text-sm font-medium text-red-800 dark:text-red-200">翻译失败</h4>
            <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- 翻译结果 -->
      <div v-else-if="translationResult" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            翻译结果
          </label>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p class="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {{ translationResult.translatedText }}
            </p>
            <div v-if="translationResult.confidence" class="mt-2 flex items-center">
              <span class="text-xs text-gray-500 mr-2">置信度:</span>
              <div class="flex items-center">
                <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2 max-w-24">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${translationResult.confidence * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs text-gray-600 dark:text-gray-400">
                  {{ Math.round(translationResult.confidence * 100) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 备选翻译 -->
        <div v-if="translationResult.alternatives?.length" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            备选翻译
          </label>
          <div class="space-y-2">
            <button
              v-for="(alternative, index) in translationResult.alternatives"
              :key="index"
              class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              @click="applyAlternative(alternative)"
            >
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ alternative }}</p>
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-2 pt-2">
          <BaseButton
            variant="outline"
            size="sm"
            @click="copyTranslation"
          >
            <Icon name="heroicons-clipboard-document" class="w-4 h-4 mr-1" />
            复制
          </BaseButton>
          <BaseButton
            variant="outline"
            size="sm"
            @click="playAudio"
          >
            <Icon name="heroicons-speaker-wave" class="w-4 h-4 mr-1" />
            播放
          </BaseButton>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!sourceText.trim()" class="text-center py-8">
        <Icon name="heroicons-language" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">输入文本开始AI翻译</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLLM } from '~/composables/useLLM'
import type { TranslationResponse } from '~/types/llm'

// LLM服务
const { translate, debouncedTranslate, isLoading, error } = useLLM()

// 状态
const sourceText = ref('')
const translationResult = ref<TranslationResponse | null>(null)
const fromLanguage = ref('en')
const toLanguage = ref('zh')

// 支持的语言列表
const languages = [
  { code: 'en', name: '英语' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'es', name: '西班牙语' },
  { code: 'ru', name: '俄语' }
]

// 方法
const getLanguageName = (code: string): string => {
  const language = languages.find(lang => lang.code === code)
  return language?.name || code
}

const handleInputChange = () => {
  if (sourceText.value.trim()) {
    // 使用防抖的翻译函数
    debouncedTranslate({
      text: sourceText.value.trim(),
      from: fromLanguage.value,
      to: toLanguage.value
    }).then((result: any) => {
      translationResult.value = result
    }).catch(() => {
      // 错误已在useLLM中处理
    })
  } else {
    translationResult.value = null
  }
}

const clearText = () => {
  sourceText.value = ''
  translationResult.value = null
}

const applyAlternative = (alternative: string) => {
  if (translationResult.value) {
    translationResult.value.translatedText = alternative
  }
}

const copyTranslation = async () => {
  if (translationResult.value?.translatedText) {
    try {
      await navigator.clipboard.writeText(translationResult.value.translatedText)
      // 这里可以显示成功提示
      console.log('翻译结果已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

const playAudio = () => {
  if (translationResult.value?.translatedText) {
    // 使用Web Speech API播放翻译结果
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translationResult.value.translatedText)
      utterance.lang = toLanguage.value
      speechSynthesis.speak(utterance)
    }
  }
}

// 监听语言变化
watch([fromLanguage, toLanguage], () => {
  if (sourceText.value.trim()) {
    handleInputChange()
  }
})
</script>