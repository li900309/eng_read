import pkg from '@prisma/client'
import type {
  Vocabulary,
  VocabularyCategory,
  UserVocabulary,
  VocabularyFilter,
  VocabularyListResponse,
  LearningProgress
} from '~/types/vocabulary'

const { PrismaClient } = pkg

const prisma = new PrismaClient()

export class VocabularyService {
  /**
   * 获取词汇列表
   */
  async getVocabularyList(filter: VocabularyFilter): Promise<VocabularyListResponse> {
    const page = filter.page || 1
    const limit = Math.min(filter.limit || 20, 100) // 限制最大数量
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      isActive: true
    }

    if (filter.categoryId) {
      where.categoryId = filter.categoryId
    }

    if (filter.difficulty) {
      where.difficulty = filter.difficulty
    }

    if (filter.search) {
      where.OR = [
        { word: { contains: filter.search, mode: 'insensitive' } },
        { definition: { contains: filter.search, mode: 'insensitive' } },
        { example: { contains: filter.search, mode: 'insensitive' } }
      ]
    }

    // 查询词汇
    const [vocabularies, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        include: {
          category: true
        },
        orderBy: [
          { frequency: 'desc' },
          { word: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.vocabulary.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      vocabularies,
      total,
      page,
      limit,
      totalPages
    }
  }

  /**
   * 获取用户词汇学习列表
   */
  async getUserVocabularies(userId: string, filter: VocabularyFilter): Promise<VocabularyListResponse> {
    const page = filter.page || 1
    const limit = Math.min(filter.limit || 20, 100)
    const skip = (page - 1) * limit

    const where: any = {
      userId
    }

    if (filter.categoryId) {
      where.vocabulary = {
        categoryId: filter.categoryId
      }
    }

    if (filter.difficulty) {
      where.vocabulary = {
        ...where.vocabulary,
        difficulty: filter.difficulty
      }
    }

    if (filter.search) {
      where.vocabulary = {
        ...where.vocabulary,
        OR: [
          { word: { contains: filter.search, mode: 'insensitive' } },
          { definition: { contains: filter.search, mode: 'insensitive' } }
        ]
      }
    }

    const [userVocabularies, total] = await Promise.all([
      prisma.userVocabulary.findMany({
        where,
        include: {
          vocabulary: {
            include: {
              category: true
            }
          },
          user: true
        },
        orderBy: {
          nextReviewAt: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.userVocabulary.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      vocabularies: userVocabularies.map(uv => uv.vocabulary),
      total,
      page,
      limit,
      totalPages
    }
  }

  /**
   * 添加词汇到用户学习列表
   */
  async addVocabularyToUser(userId: string, vocabularyId: string): Promise<UserVocabulary> {
    // 检查是否已存在
    const existing = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      }
    })

    if (existing) {
      return existing
    }

    // 创建新的用户词汇记录
    return await prisma.userVocabulary.create({
      data: {
        userId,
        vocabularyId,
        masteryLevel: 0,
        reviewCount: 0,
        correctCount: 0,
        consecutiveCorrect: 0,
        nextReviewAt: new Date()
      },
      include: {
        vocabulary: {
          include: {
            category: true
          }
        },
        user: true
      }
    })
  }

  /**
   * 更新用户词汇学习进度
   */
  async updateUserVocabulary(
    userId: string,
    vocabularyId: string,
    isCorrect: boolean,
    responseTime: number
  ): Promise<UserVocabulary> {
    const userVocab = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      }
    })

    if (!userVocab) {
      throw new Error('用户词汇记录不存在')
    }

    // 更新学习记录
    const reviewCount = userVocab.reviewCount + 1
    const correctCount = userVocab.correctCount + (isCorrect ? 1 : 0)
    const consecutiveCorrect = isCorrect ? userVocab.consecutiveCorrect + 1 : 0

    // 计算新的掌握等级
    let masteryLevel = userVocab.masteryLevel
    if (consecutiveCorrect >= 3 && masteryLevel < 5) {
      masteryLevel += 1
    } else if (consecutiveCorrect === 0 && masteryLevel > 0) {
      masteryLevel = Math.max(0, masteryLevel - 1)
    }

    // 计算下次复习时间（间隔重复算法）
    const nextReviewAt = this.calculateNextReview(consecutiveCorrect, responseTime)

    return await prisma.userVocabulary.update({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      },
      data: {
        masteryLevel,
        reviewCount,
        correctCount,
        consecutiveCorrect,
        lastReviewAt: new Date(),
        nextReviewAt,
        updatedAt: new Date()
      },
      include: {
        vocabulary: {
          include: {
            category: true
          }
        },
        user: true
      }
    })
  }

  /**
   * 获取用户学习进度统计
   */
  async getUserLearningProgress(userId: string): Promise<LearningProgress> {
    const [
      totalWords,
      learnedWords,
      masteredWords,
      todayStats
    ] = await Promise.all([
      prisma.userVocabulary.count({
        where: { userId }
      }),
      prisma.userVocabulary.count({
        where: {
          userId,
          reviewCount: { gt: 0 }
        }
      }),
      prisma.userVocabulary.count({
        where: {
          userId,
          masteryLevel: { gte: 4 }
        }
      }),
      this.getTodayStats(userId)
    ])

    const totalCorrect = await prisma.userVocabulary.aggregate({
      where: { userId },
      _sum: { correctCount: true, reviewCount: true }
    })

    const correctRate = totalCorrect._sum.reviewCount! > 0
      ? totalCorrect._sum.correctCount! / totalCorrect._sum.reviewCount!
      : 0

    return {
      totalWords,
      learnedWords,
      masteredWords,
      correctRate: Math.round(correctRate * 100) / 100,
      todayStudyTime: todayStats.timeSpent,
      todayWordsStudied: todayStats.wordsStudied,
      streak: todayStats.streak
    }
  }

  /**
   * 获取词汇分类列表
   */
  async getVocabularyCategories(): Promise<VocabularyCategory[]> {
    return await prisma.vocabularyCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * 计算下次复习时间（间隔重复算法）
   */
  private calculateNextReview(consecutiveCorrect: number, responseTime: number): Date {
    const baseIntervals = [1, 3, 7, 14, 30] // 天数
    let interval = baseIntervals[Math.min(consecutiveCorrect, baseIntervals.length - 1)]

    // 根据响应时间调整间隔
    if (responseTime < 3000) { // 快速回答
      interval = Math.ceil(interval * 1.2)
    } else if (responseTime > 10000) { // 慢速回答
      interval = Math.ceil(interval * 0.8)
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    return nextReview
  }

  /**
   * 获取今日统计数据
   */
  private async getTodayStats(userId: string): Promise<{
    timeSpent: number
    wordsStudied: number
    streak: number
  }> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaySessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startTime: { gte: today }
      }
    })

    const timeSpent = todaySessions.reduce((sum, session) => sum + session.timeSpent, 0)
    const wordsStudied = todaySessions.reduce((sum, session) => sum + session.totalWords, 0)

    // 计算连续学习天数
    const streak = await this.calculateStreak(userId)

    return { timeSpent, wordsStudied, streak }
  }

  /**
   * 计算连续学习天数
   */
  private async calculateStreak(userId: string): Promise<number> {
    const sessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: 30 // 最多30天
    })

    if (sessions.length === 0) return 0

    let streak = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 检查今天是否有学习记录
    const todaySession = sessions.find(s =>
      s.startTime >= today
    )

    if (!todaySession) {
      // 检查昨天
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdaySession = sessions.find(s =>
        s.startTime >= yesterday && s.startTime < today
      )

      if (!yesterdaySession) return 0
    }

    // 计算连续天数
    for (let i = 1; i < sessions.length; i++) {
      const currentDate = new Date(sessions[i - 1].startTime)
      currentDate.setHours(0, 0, 0, 0)

      const prevDate = new Date(sessions[i].startTime)
      prevDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else if (diffDays > 1) {
        break
      }
    }

    return streak
  }
}

// 导出单例
export const vocabularyService = new VocabularyService()