import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress } from '@/components/base';
import { useAuth } from '@/hooks/useAuth';
import { useApiQuery } from '@/hooks/useApi';
import { BookOpen, Trophy, Target, Clock, TrendingUp, ArrowRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, getDisplayName } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useApiQuery<any>(
    ['dashboard'],
    '/api/statistics/dashboard'
  );

  const { data: learningStats } = useApiQuery<any>(
    ['learning-stats'],
    '/api/learning/stats'
  );

  const { data: achievements } = useApiQuery<any>(
    ['achievements'],
    '/api/statistics/achievements'
  );

  const stats = dashboardData?.todayStats || {};
  const weeklyProgress = learningStats?.weeklyProgress || {};
  const recentAchievements = achievements?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p>加载仪表板...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              欢迎回来，{getDisplayName()}！
            </h1>
            <p className="text-muted-foreground">
              今天是您连续学习的第 {stats.currentStreak || 0} 天
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">今日学习</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.wordsLearned || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">个词汇</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">学习时长</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.floor((stats.timeSpent || 0) / 60)}
                    </p>
                    <p className="text-xs text-muted-foreground">分钟</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">准确率</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(stats.accuracy || 0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">正确率</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">连续天数</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.currentStreak || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">天</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Goal Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    今日目标进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>词汇学习</span>
                        <span>{stats.wordsLearned || 0} / {user?.preferences?.dailyGoal || 20}</span>
                      </div>
                      <Progress
                        value={((stats.wordsLearned || 0) / (user?.preferences?.dailyGoal || 20)) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>学习时长</span>
                        <span>{Math.floor((stats.timeSpent || 0) / 60)} / 30 分钟</span>
                      </div>
                      <Progress
                        value={((stats.timeSpent || 0) / 1800) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>快速开始</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button className="h-16 flex-col" asChild>
                      <Link to="/learning/session">
                        <BookOpen className="h-6 w-6 mb-2" />
                        开始学习
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col" asChild>
                      <Link to="/learning/review">
                        <RotateCcw className="h-6 w-6 mb-2" />
                        复习词汇
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col" asChild>
                      <Link to="/vocabulary">
                        <Library className="h-6 w-6 mb-2" />
                        词汇库
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col" asChild>
                      <Link to="/statistics">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        查看统计
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    本周学习趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyProgress.dailyBreakdown?.map((day: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-12">
                          {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                        </span>
                        <div className="flex-1">
                          <Progress
                            value={(day.wordsLearned / 20) * 100}
                            className="h-2"
                          />
                        </div>
                        <span className="text-sm text-foreground w-12 text-right">
                          {day.wordsLearned}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    最近成就
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentAchievements.length > 0 ? (
                    <div className="space-y-4">
                      {recentAchievements.map((achievement: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {achievement.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      继续学习以解锁成就！
                    </p>
                  )}
                  <Button variant="ghost" className="w-full mt-4" asChild>
                    <Link to="/statistics/achievements">
                      查看所有成就
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>学习推荐</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-1">复习昨天的词汇</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        您有 {5} 个词汇需要复习
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/learning/review">开始复习</Link>
                      </Button>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-1">学习新词汇</h4>
                      <p className="text-sm text-green-700 mb-2">
                        推荐学习商务英语词汇
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/learning/session">开始学习</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import missing icons
const RotateCcw = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 4v6h6M23 20v-6h-6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
  </svg>
);

const Library = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 17V9M13 17V5M8 17v-3" />
  </svg>
);

export default DashboardPage;