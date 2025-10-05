// 词汇相关类型定义

export interface Vocabulary {
  id: string
  word: string
  pronunciation?: string
  definition: string
  example?: string
  difficulty: number // 1-5
  frequency: number // 1-10
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: VocabularyCategory
}

export interface VocabularyCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserVocabulary {
  id: string
  masteryLevel: number // 0-5
  reviewCount: number
  correctCount: number
  consecutiveCorrect: number
  nextReviewAt: string
  lastReviewAt?: string
  createdAt: string
  updatedAt: string
  user: User
  vocabulary: Vocabulary
}

export interface VocabularyFilter {
  categoryId?: string
  difficulty?: number
  search?: string
  page?: number
  limit?: number
}

export interface VocabularyListResponse {
  vocabularies: Vocabulary[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LearningProgress {
  totalWords: number
  learnedWords: number
  masteredWords: number
  correctRate: number
  todayStudyTime: number
  todayWordsStudied: number
  streak: number
}