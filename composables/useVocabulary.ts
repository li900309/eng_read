import { ref, readonly } from 'vue'
import type { Vocabulary, VocabularyFilter, VocabularyListResponse, LearningProgress, VocabularyCategory } from '~/types/vocabulary'

// 词汇管理
export const useVocabulary = () => {
  const { isAuthenticated } = useAuth()

  // 状态
  const vocabularies = ref<Vocabulary[]>([])
  const userVocabularies = ref<Vocabulary[]>([])
  const categories = ref<VocabularyCategory[]>([])
  const learningProgress = ref<LearningProgress | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 分页信息
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // 获取公共词汇列表
  const fetchVocabularies = async (filter: VocabularyFilter = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<VocabularyListResponse>('/api/vocabulary', {
        method: 'GET',
        query: {
          ...filter,
          user: 'false'
        }
      })

      if (response.success && response.data) {
        vocabularies.value = response.data.vocabularies
        pagination.value = {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        }
        return response.data
      } else {
        throw new Error('获取词汇列表失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '获取词汇列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户词汇列表
  const fetchUserVocabularies = async (filter: VocabularyFilter = {}) => {
    if (!isAuthenticated.value) {
      throw new Error('用户未认证')
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<VocabularyListResponse>('/api/vocabulary', {
        method: 'GET',
        query: {
          ...filter,
          user: 'true'
        }
      })

      if (response.success && response.data) {
        userVocabularies.value = response.data.vocabularies
        pagination.value = {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        }
        return response.data
      } else {
        throw new Error('获取用户词汇列表失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '获取用户词汇列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 添加词汇到用户学习列表
  const addToUserList = async (vocabularyId: string) => {
    if (!isAuthenticated.value) {
      throw new Error('用户未认证')
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/vocabulary/add', {
        method: 'POST',
        body: { vocabularyId }
      })

      if (response.success) {
        // 刷新用户词汇列表
        await fetchUserVocabularies()
        // 刷新学习进度
        await fetchLearningProgress()
        return response.data
      } else {
        throw new Error('添加词汇失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '添加词汇失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取学习进度
  const fetchLearningProgress = async () => {
    if (!isAuthenticated.value) {
      return
    }

    try {
      const response = await $fetch('/api/learning/progress', {
        method: 'GET'
      })

      if (response.success && response.data) {
        learningProgress.value = response.data
        return response.data
      } else {
        throw new Error('获取学习进度失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '获取学习进度失败'
    }
  }

  // 提交学习记录
  const submitLearning = async (vocabularyId: string, isCorrect: boolean, responseTime: number) => {
    if (!isAuthenticated.value) {
      throw new Error('用户未认证')
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch('/api/learning/submit', {
        method: 'POST',
        body: {
          vocabularyId,
          isCorrect,
          responseTime
        }
      })

      if (response.success) {
        // 刷新学习进度
        await fetchLearningProgress()
        return response.data
      } else {
        throw new Error('提交学习记录失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '提交学习记录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取词汇分类
  const fetchCategories = async () => {
    try {
      const response = await $fetch('/api/vocabulary/categories', {
        method: 'GET'
      })

      if (response.success && response.data) {
        categories.value = response.data
        return response.data
      } else {
        throw new Error('获取词汇分类失败')
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message || '获取词汇分类失败'
    }
  }

  // 搜索词汇
  const searchVocabularies = async (query: string, filters: VocabularyFilter = {}) => {
    return await fetchVocabularies({
      ...filters,
      search: query
    })
  }

  // 获取今日需复习的词汇
  const getTodayReviews = async () => {
    if (!isAuthenticated.value) {
      return []
    }

    try {
      const today = new Date()
      today.setHours(23, 59, 59, 999)

      return await fetchUserVocabularies({
        // 这里可以添加筛选条件，只获取今天需要复习的词汇
      })
    } catch (err) {
      console.error('获取今日复习词汇失败:', err)
      return []
    }
  }

  // 重置状态
  const reset = () => {
    vocabularies.value = []
    userVocabularies.value = []
    categories.value = []
    learningProgress.value = null
    error.value = null
    pagination.value = {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }

  return {
    // 状态
    vocabularies: readonly(vocabularies),
    userVocabularies: readonly(userVocabularies),
    categories: readonly(categories),
    learningProgress: readonly(learningProgress),
    isLoading: readonly(isLoading),
    error: readonly(error),
    pagination: readonly(pagination),

    // 方法
    fetchVocabularies,
    fetchUserVocabularies,
    addToUserList,
    fetchLearningProgress,
    submitLearning,
    fetchCategories,
    searchVocabularies,
    getTodayReviews,
    reset
  }
}