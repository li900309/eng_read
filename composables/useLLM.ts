import { ref, readonly } from 'vue'
import type {
  VocabularyGenerationRequest,
  TranslationRequest,
  TranslationResponse,
  GrammarCheckRequest,
  GrammarCheckResponse,
  ReadingComprehensionRequest,
  ReadingComprehensionResponse
} from '~/types/llm'

// LLM服务集成
export const useLLM = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 翻译功能
  const translate = async (request: TranslationRequest): Promise<TranslationResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<TranslationResponse>('/api/llm/translate', {
        method: 'POST',
        body: request
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || '翻译失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '翻译服务暂时不可用'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 语法检查
  const checkGrammar = async (request: GrammarCheckRequest): Promise<GrammarCheckResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<GrammarCheckResponse>('/api/llm/grammar-check', {
        method: 'POST',
        body: request
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || '语法检查失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '语法检查服务暂时不可用'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 生成阅读理解题
  const generateReadingComprehension = async (
    request: ReadingComprehensionRequest
  ): Promise<ReadingComprehensionResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<ReadingComprehensionResponse>('/api/llm/reading-comprehension', {
        method: 'POST',
        body: request
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || '生成阅读理解题失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '阅读理解生成服务暂时不可用'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 生成词汇
  const generateVocabulary = async (request: VocabularyGenerationRequest) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/llm/generate-vocabulary', {
        method: 'POST',
        body: request
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || '生成词汇失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '词汇生成服务暂时不可用'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 实时翻译（防抖处理）
  const debouncedTranslate = useDebounceFn(translate, 500)

  // 实时语法检查（防抖处理）
  const debouncedGrammarCheck = useDebounceFn(checkGrammar, 1000)

  // 获取LLM服务状态
  const getServiceStatus = async () => {
    try {
      const response = await $fetch('/api/llm/status', {
        method: 'GET'
      })

      return response
    } catch (err) {
      console.error('获取LLM服务状态失败:', err)
      return {
        success: false,
        data: {
          openai: 'disconnected',
          anthropic: 'disconnected',
          local: 'disconnected'
        }
      }
    }
  }

  // 重置状态
  const reset = () => {
    error.value = null
    isLoading.value = false
  }

  return {
    // 状态
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 方法
    translate,
    checkGrammar,
    generateReadingComprehension,
    generateVocabulary,
    debouncedTranslate,
    debouncedGrammarCheck,
    getServiceStatus,
    reset
  }
}