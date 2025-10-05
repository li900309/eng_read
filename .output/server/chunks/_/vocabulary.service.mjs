import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
class VocabularyService {
  /**
   * 获取词汇列表
   */
  async getVocabularyList(filter) {
    const page = filter.page || 1;
    const limit = Math.min(filter.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where = {
      isActive: true
    };
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    if (filter.difficulty) {
      where.difficulty = filter.difficulty;
    }
    if (filter.search) {
      where.OR = [
        { word: { contains: filter.search, mode: "insensitive" } },
        { definition: { contains: filter.search, mode: "insensitive" } },
        { example: { contains: filter.search, mode: "insensitive" } }
      ];
    }
    const [vocabularies, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        include: {
          category: true
        },
        orderBy: [
          { frequency: "desc" },
          { word: "asc" }
        ],
        skip,
        take: limit
      }),
      prisma.vocabulary.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      vocabularies,
      total,
      page,
      limit,
      totalPages
    };
  }
  /**
   * 获取用户词汇学习列表
   */
  async getUserVocabularies(userId, filter) {
    const page = filter.page || 1;
    const limit = Math.min(filter.limit || 20, 100);
    const skip = (page - 1) * limit;
    const where = {
      userId
    };
    if (filter.categoryId) {
      where.vocabulary = {
        categoryId: filter.categoryId
      };
    }
    if (filter.difficulty) {
      where.vocabulary = {
        ...where.vocabulary,
        difficulty: filter.difficulty
      };
    }
    if (filter.search) {
      where.vocabulary = {
        ...where.vocabulary,
        OR: [
          { word: { contains: filter.search, mode: "insensitive" } },
          { definition: { contains: filter.search, mode: "insensitive" } }
        ]
      };
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
          nextReviewAt: "asc"
        },
        skip,
        take: limit
      }),
      prisma.userVocabulary.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      vocabularies: userVocabularies.map((uv) => uv.vocabulary),
      total,
      page,
      limit,
      totalPages
    };
  }
  /**
   * 添加词汇到用户学习列表
   */
  async addVocabularyToUser(userId, vocabularyId) {
    const existing = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      }
    });
    if (existing) {
      return existing;
    }
    return await prisma.userVocabulary.create({
      data: {
        userId,
        vocabularyId,
        masteryLevel: 0,
        reviewCount: 0,
        correctCount: 0,
        consecutiveCorrect: 0,
        nextReviewAt: /* @__PURE__ */ new Date()
      },
      include: {
        vocabulary: {
          include: {
            category: true
          }
        },
        user: true
      }
    });
  }
  /**
   * 更新用户词汇学习进度
   */
  async updateUserVocabulary(userId, vocabularyId, isCorrect, responseTime) {
    const userVocab = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId
        }
      }
    });
    if (!userVocab) {
      throw new Error("\u7528\u6237\u8BCD\u6C47\u8BB0\u5F55\u4E0D\u5B58\u5728");
    }
    const reviewCount = userVocab.reviewCount + 1;
    const correctCount = userVocab.correctCount + (isCorrect ? 1 : 0);
    const consecutiveCorrect = isCorrect ? userVocab.consecutiveCorrect + 1 : 0;
    let masteryLevel = userVocab.masteryLevel;
    if (consecutiveCorrect >= 3 && masteryLevel < 5) {
      masteryLevel += 1;
    } else if (consecutiveCorrect === 0 && masteryLevel > 0) {
      masteryLevel = Math.max(0, masteryLevel - 1);
    }
    const nextReviewAt = this.calculateNextReview(consecutiveCorrect, responseTime);
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
        lastReviewAt: /* @__PURE__ */ new Date(),
        nextReviewAt,
        updatedAt: /* @__PURE__ */ new Date()
      },
      include: {
        vocabulary: {
          include: {
            category: true
          }
        },
        user: true
      }
    });
  }
  /**
   * 获取用户学习进度统计
   */
  async getUserLearningProgress(userId) {
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
    ]);
    const totalCorrect = await prisma.userVocabulary.aggregate({
      where: { userId },
      _sum: { correctCount: true, reviewCount: true }
    });
    const correctRate = totalCorrect._sum.reviewCount > 0 ? totalCorrect._sum.correctCount / totalCorrect._sum.reviewCount : 0;
    return {
      totalWords,
      learnedWords,
      masteredWords,
      correctRate: Math.round(correctRate * 100) / 100,
      todayStudyTime: todayStats.timeSpent,
      todayWordsStudied: todayStats.wordsStudied,
      streak: todayStats.streak
    };
  }
  /**
   * 获取词汇分类列表
   */
  async getVocabularyCategories() {
    return await prisma.vocabularyCategory.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }
  /**
   * 计算下次复习时间（间隔重复算法）
   */
  calculateNextReview(consecutiveCorrect, responseTime) {
    const baseIntervals = [1, 3, 7, 14, 30];
    let interval = baseIntervals[Math.min(consecutiveCorrect, baseIntervals.length - 1)];
    if (responseTime < 3e3) {
      interval = Math.ceil(interval * 1.2);
    } else if (responseTime > 1e4) {
      interval = Math.ceil(interval * 0.8);
    }
    const nextReview = /* @__PURE__ */ new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
  }
  /**
   * 获取今日统计数据
   */
  async getTodayStats(userId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = await prisma.learningSession.findMany({
      where: {
        userId,
        startTime: { gte: today }
      }
    });
    const timeSpent = todaySessions.reduce((sum, session) => sum + session.timeSpent, 0);
    const wordsStudied = todaySessions.reduce((sum, session) => sum + session.totalWords, 0);
    const streak = await this.calculateStreak(userId);
    return { timeSpent, wordsStudied, streak };
  }
  /**
   * 计算连续学习天数
   */
  async calculateStreak(userId) {
    const sessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 30
      // 最多30天
    });
    if (sessions.length === 0) return 0;
    let streak = 1;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todaySession = sessions.find(
      (s) => s.startTime >= today
    );
    if (!todaySession) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdaySession = sessions.find(
        (s) => s.startTime >= yesterday && s.startTime < today
      );
      if (!yesterdaySession) return 0;
    }
    for (let i = 1; i < sessions.length; i++) {
      const currentDate = new Date(sessions[i - 1].startTime);
      currentDate.setHours(0, 0, 0, 0);
      const prevDate = new Date(sessions[i].startTime);
      prevDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1e3 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }
    return streak;
  }
}
const vocabularyService = new VocabularyService();

export { vocabularyService as v };
//# sourceMappingURL=vocabulary.service.mjs.map
