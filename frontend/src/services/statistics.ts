import { BaseApiService, ApiResponse, PaginatedResponse } from './api';

// 统计相关类型定义
export interface DashboardStats {
  todayStats: {
    wordsLearned: number;
    timeSpent: number;
    accuracy: number;
    currentStreak: number;
  };
  weeklyProgress: {
    totalWords: number;
    totalTime: number;
    averageAccuracy: number;
    dailyBreakdown: Array<{
      date: string;
      wordsLearned: number;
      timeSpent: number;
      accuracy: number;
    }>;
  };
  monthlyProgress: {
    totalWords: number;
    totalTime: number;
    averageAccuracy: number;
    weeklyBreakdown: Array<{
      week: string;
      wordsLearned: number;
      timeSpent: number;
      accuracy: number;
    }>;
  };
  overallStats: {
    totalWordsLearned: number;
    totalTimeSpent: number;
    averageAccuracy: number;
    longestStreak: number;
    currentLevel: number;
    experiencePoints: number;
    nextLevelExperience: number;
  };
}

export interface LearningAnalytics {
  performanceByDifficulty: Array<{
    difficulty: string;
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    averageResponseTime: number;
  }>;
  performanceByCategory: Array<{
    category: string;
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    averageResponseTime: number;
  }>;
  learningCurve: Array<{
    date: string;
    cumulativeWords: number;
    accuracy: number;
    responseTime: number;
  }>;
  retentionRate: Array<{
    interval: string;
    retentionRate: number;
    sampleSize: number;
  }>;
  bestPerformanceTimes: Array<{
    hour: number;
    accuracy: number;
    sessionCount: number;
  }>;
  weakAreas: Array<{
    category: string;
    difficulty: string;
    accuracy: number;
    recommendation: string;
  }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'accuracy' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  progress: {
    current: number;
    required: number;
    percentage: number;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  stats: {
    wordsLearned: number;
    accuracy: number;
    streakDays: number;
    experiencePoints: number;
  };
  change: number; // 排名变化
}

export interface LearningReport {
  period: {
    start: string;
    end: string;
    type: 'daily' | 'weekly' | 'monthly';
  };
  summary: {
    totalWordsLearned: number;
    totalTimeSpent: number;
    averageAccuracy: number;
    streakDays: number;
    sessionsCompleted: number;
  };
  dailyBreakdown: Array<{
    date: string;
    wordsLearned: number;
    timeSpent: number;
    accuracy: number;
    sessionsCount: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    wordsLearned: number;
    accuracy: number;
    timeSpent: number;
  }>;
  difficultyBreakdown: Array<{
    difficulty: string;
    wordsLearned: number;
    accuracy: number;
    timeSpent: number;
  }>;
  insights: Array<{
    type: 'strength' | 'weakness' | 'recommendation';
    title: string;
    description: string;
    actionable: boolean;
  }>;
}

export class StatisticsService extends BaseApiService {
  // 获取仪表板统计
  async getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>('/statistics/dashboard');
  }

  // 获取学习分析数据
  async getLearningAnalytics(timeRange?: 'week' | 'month' | 'quarter' | 'year'): Promise<LearningAnalytics> {
    return this.get<LearningAnalytics>('/statistics/analytics', {
      params: { timeRange }
    });
  }

  // 获取成就列表
  async getAchievements(category?: Achievement['category']): Promise<Achievement[]> {
    return this.get<Achievement[]>('/statistics/achievements', {
      params: { category }
    });
  }

  // 获取未解锁的成就
  async getLockedAchievements(): Promise<Achievement[]> {
    return this.get<Achievement[]>('/statistics/achievements/locked');
  }

  // 获取排行榜
  async getLeaderboard(type: 'global' | 'friends' | 'category' = 'global', period: 'daily' | 'weekly' | 'monthly' = 'weekly', limit: number = 50): Promise<LeaderboardEntry[]> {
    return this.get<LeaderboardEntry[]>('/statistics/leaderboard', {
      params: { type, period, limit }
    });
  }

  // 获取用户在排行榜中的排名
  async getMyLeaderboardRank(type: 'global' | 'friends' | 'category' = 'global', period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<LeaderboardEntry> {
    return this.get<LeaderboardEntry>('/statistics/leaderboard/me', {
      params: { type, period }
    });
  }

  // 生成学习报告
  async generateLearningReport(type: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string): Promise<LearningReport> {
    return this.get<LearningReport>('/statistics/report', {
      params: { type, startDate, endDate }
    });
  }

  // 导出学习报告
  async exportLearningReport(format: 'pdf' | 'xlsx' | 'csv', type: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string): Promise<Blob> {
    const response = await this.client.get('/statistics/report/export', {
      params: { format, type, startDate, endDate },
      responseType: 'blob'
    });
    return response.data;
  }

  // 获取学习趋势
  async getLearningTrends(metric: 'words' | 'accuracy' | 'time' | 'streak', timeRange: 'week' | 'month' | 'quarter' | 'year'): Promise<Array<{
    date: string;
    value: number;
    change: number;
  }>> {
    return this.get<any>('/statistics/trends', {
      params: { metric, timeRange }
    });
  }

  // 获取比较数据（与平均水平或其他用户比较）
  async getComparativeStats(metric: 'words' | 'accuracy' | 'time' | 'streak'): Promise<{
    user: number;
    average: number;
    percentile: number;
    rank: number;
    totalUsers: number;
  }> {
    return this.get<any>('/statistics/compare', {
      params: { metric }
    });
  }

  // 获取学习目标进度
  async getGoalProgress(): Promise<Array<{
    id: string;
    type: 'daily' | 'weekly' | 'monthly';
    target: number;
    current: number;
    progress: number;
    unit: 'words' | 'time' | 'accuracy';
    deadline: string;
    isCompleted: boolean;
    createdAt: string;
  }>> {
    return this.get<any>('/statistics/goals');
  }

  // 设置学习目标
  async setGoal(type: 'daily' | 'weekly' | 'monthly', target: number, unit: 'words' | 'time' | 'accuracy'): Promise<{
    id: string;
    type: string;
    target: number;
    unit: string;
    deadline: string;
  }> {
    return this.post<any>('/statistics/goals', {
      type,
      target,
      unit
    });
  }

  // 更新学习目标
  async updateGoal(id: string, target: number): Promise<void> {
    return this.patch<void>(`/statistics/goals/${id}`, { target });
  }

  // 删除学习目标
  async deleteGoal(id: string): Promise<void> {
    return this.delete<void>(`/statistics/goals/${id}`);
  }

  // 获取学习时间分析
  async getTimeAnalysis(period: 'week' | 'month' | 'year'): Promise<{
    total: number;
    average: number;
    bestDay: string;
    bestTime: string;
    distribution: Array<{
      hour: number;
      sessions: number;
      totalTime: number;
    }>;
    dailyPattern: Array<{
      day: string;
      totalTime: number;
      sessions: number;
    }>;
  }> {
    return this.get<any>('/statistics/time-analysis', {
      params: { period }
    });
  }

  // 获取词汇掌握度分析
  async getMasteryAnalysis(): Promise<{
    total: number;
    mastered: number;
    learning: number;
    new: number;
    byDifficulty: Array<{
      difficulty: string;
      total: number;
      mastered: number;
      masteryRate: number;
    }>;
    byCategory: Array<{
      category: string;
      total: number;
      mastered: number;
      masteryRate: number;
    }>;
    progressOverTime: Array<{
      date: string;
      mastered: number;
      total: number;
      masteryRate: number;
    }>;
  }> {
    return this.get<any>('/statistics/mastery');
  }

  // 记录学习会话
  async recordLearningSession(data: {
    duration: number;
    wordsStudied: number;
    accuracy: number;
    type: 'new' | 'review' | 'mixed';
    categories?: string[];
  }): Promise<{
    id: string;
    experienceGained: number;
    levelUp: boolean;
    newLevel?: number;
  }> {
    return this.post<any>('/statistics/session', data);
  }

  // 获取学习建议
  async getLearningRecommendations(): Promise<Array<{
    type: 'category' | 'difficulty' | 'time' | 'method';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
    estimatedImpact: number;
  }>> {
    return this.get<any>('/statistics/recommendations');
  }

  // 获取社交统计数据
  async getSocialStats(): Promise<{
    friendsCount: number;
    studyGroups: number;
    sharedSessions: number;
    helpedOthers: number;
    receivedHelp: number;
    communityRank: number;
  }> {
    return this.get<any>('/statistics/social');
  }

  // 分享成就
  async shareAchievement(achievementId: string, platform: 'facebook' | 'twitter' | 'linkedin' | 'wechat'): Promise<{
    shareUrl: string;
    message: string;
  }> {
    return this.post<any>(`/statistics/achievements/${achievementId}/share`, {
      platform
    });
  }

  // 获取月度总结
  async getMonthlySummary(year: number, month: number): Promise<{
    period: string;
    highlights: string[];
    stats: {
      wordsLearned: number;
      timeSpent: number;
      accuracy: number;
      longestStreak: number;
      achievementsUnlocked: number;
    };
    comparison: {
      wordsLearned: {
        current: number;
        previous: number;
        change: number;
      };
      timeSpent: {
        current: number;
        previous: number;
        change: number;
      };
      accuracy: {
        current: number;
        previous: number;
        change: number;
      };
    };
    nextMonthGoals: string[];
  }> {
    return this.get<any>('/statistics/monthly-summary', {
      params: { year, month }
    });
  }
}

// 创建统计服务实例
export const statisticsService = new StatisticsService();

// 导出默认实例
export default statisticsService;