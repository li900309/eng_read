// 学习相关类型定义

export interface LearningSession {
  id: string
  sessionType: 'vocabulary' | 'reading' | 'quiz'
  startTime: string
  endTime?: string
  totalWords: number
  correctAnswers: number
  timeSpent: number // 秒
  isActive: boolean
  createdAt: string
  updatedAt: string
  user: User
}

export interface LearningSessionRecord {
  id: string
  isCorrect: boolean
  responseTime: number // 毫秒
  difficulty: number
  createdAt: string
  session: LearningSession
  vocabulary: Vocabulary
}

export interface ReadingArticle {
  id: string
  title: string
  content: string
  summary?: string
  difficulty: number // 1-5
  wordCount: number
  readingTime: number // 分钟
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserReadingRecord {
  id: string
  readingTime: number // 秒
  comprehension: number // 0-1
  wordsLearned: number
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  user: User
  article: ReadingArticle
}

export interface LearningStats {
  totalSessions: number
  totalTimeSpent: number
  averageAccuracy: number
  wordsLearned: number
  articlesRead: number
  streakDays: number
  weeklyProgress: {
    date: string
    wordsStudied: number
    accuracy: number
  }[]
}

export interface QuizQuestion {
  id: string
  vocabulary: Vocabulary
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

export interface QuizResult {
  sessionId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  averageResponseTime: number
  questions: {
    question: QuizQuestion
    userAnswer: string
    isCorrect: boolean
    responseTime: number
  }[]
}