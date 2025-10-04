from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta, date
from flask import current_app
from sqlalchemy import and_, or_, func, extract
from app.models.user import User, UserAchievement
from app.models.vocabulary import Vocabulary, VocabularyCategory
from app.models.learning import UserVocabulary, LearningSession, SessionWord
from app.extensions import db, cache


class StatisticsService:
    """统计服务类 - 处理数据分析和可视化统计"""

    @staticmethod
    def getDashboardStatistics(userId: int) -> Dict[str, Any]:
        """获取仪表板统计数据"""
        try:
            cacheKey = f'dashboard_stats_{userId}'
            stats = cache.get(cacheKey)

            if stats:
                return {
                    'success': True,
                    'data': stats
                }

            # 基础统计
            totalWords = UserVocabulary.query.filter_by(userId=userId).count()
            masteredWords = UserVocabulary.query.filter_by(
                userId=userId, masteryLevel=5
            ).count()

            # 今日统计
            today = datetime.utcnow().date()
            todaySessions = LearningSession.query.filter(
                LearningSession.userId == userId,
                LearningSession.createdAt >= today,
                LearningSession.status == 'completed'
            ).all()

            todayWordsStudied = sum(session.wordsStudied for session in todaySessions)
            todayTimeSpent = sum(session.totalTimeSpent for session in todaySessions)
            todayAccuracy = sum(session.accuracy for session in todaySessions) / len(todaySessions) if todaySessions else 0

            # 本周统计
            weekStart = today - timedelta(days=today.weekday())
            weekSessions = LearningSession.query.filter(
                LearningSession.userId == userId,
                LearningSession.createdAt >= weekStart,
                LearningSession.status == 'completed'
            ).all()

            weekWordsStudied = sum(session.wordsStudied for session in weekSessions)
            weekTimeSpent = sum(session.totalTimeSpent for session in weekSessions)

            # 学习连续天数
            user = User.query.get(userId)
            consecutiveDays = user.calculateConsecutiveDays() if user else 0

            # 待复习词汇
            reviewWords = UserVocabulary.query.filter(
                and_(
                    UserVocabulary.userId == userId,
                    UserVocabulary.nextReviewAt <= datetime.utcnow(),
                    UserVocabulary.masteryLevel < 5
                )
            ).count()

            # 最近7天学习趋势
            recentTrend = StatisticsService._getRecentLearningTrend(userId, 7)

            stats = {
                'overview': {
                    'totalWords': totalWords,
                    'masteredWords': masteredWords,
                    'learningProgress': round((masteredWords / totalWords * 100) if totalWords > 0 else 0, 2),
                    'consecutiveDays': consecutiveDays,
                    'currentLevel': StatisticsService._calculateUserLevel(userId)
                },
                'today': {
                    'sessions': len(todaySessions),
                    'wordsStudied': todayWordsStudied,
                    'timeSpent': todayTimeSpent,
                    'accuracy': round(todayAccuracy, 2)
                },
                'week': {
                    'sessions': len(weekSessions),
                    'wordsStudied': weekWordsStudied,
                    'timeSpent': weekTimeSpent,
                    'dailyAverage': round(weekWordsStudied / 7, 1)
                },
                'pending': {
                    'reviewWords': reviewWords,
                    'newWords': max(0, user.dailyGoal - todayWordsStudied) if user and user.dailyGoal else 10
                },
                'trend': recentTrend
            }

            # 缓存5分钟
            cache.set(cacheKey, stats, timeout=300)

            return {
                'success': True,
                'data': stats
            }

        except Exception as e:
            current_app.logger.error(f"Error getting dashboard statistics: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get dashboard statistics',
                'code': 'DASHBOARD_ERROR'
            }

    @staticmethod
    def _getRecentLearningTrend(userId: int, days: int) -> List[Dict[str, Any]]:
        """获取最近学习趋势"""
        try:
            trend = []
            today = datetime.utcnow().date()

            for i in range(days - 1, -1, -1):
                date = today - timedelta(days=i)

                sessions = LearningSession.query.filter(
                    and_(
                        LearningSession.userId == userId,
                        func.date(LearningSession.createdAt) == date,
                        LearningSession.status == 'completed'
                    )
                ).all()

                wordsStudied = sum(session.wordsStudied for session in sessions)
                timeSpent = sum(session.totalTimeSpent for session in sessions)
                accuracy = sum(session.accuracy for session in sessions) / len(sessions) if sessions else 0

                trend.append({
                    'date': date.isoformat(),
                    'wordsStudied': wordsStudied,
                    'timeSpent': timeSpent,
                    'sessions': len(sessions),
                    'accuracy': round(accuracy, 2)
                })

            return trend

        except Exception as e:
            current_app.logger.error(f"Error getting recent learning trend: {str(e)}")
            return []

    @staticmethod
    def _calculateUserLevel(userId: int) -> int:
        """计算用户水平"""
        try:
            totalWords = UserVocabulary.query.filter_by(userId=userId).count()
            masteredWords = UserVocabulary.query.filter_by(
                userId=userId, masteryLevel=5
            ).count()

            if totalWords < 50:
                return 1
            elif totalWords < 200:
                return 2
            elif totalWords < 500:
                return 3
            elif totalWords < 1000:
                return 4
            else:
                return 5

        except Exception as e:
            current_app.logger.error(f"Error calculating user level: {str(e)}")
            return 1

    @staticmethod
    def getDetailedProgress(userId: int, period: str = '30d') -> Dict[str, Any]:
        """获取详细学习进度"""
        try:
            cacheKey = f'detailed_progress_{userId}_{period}'
            progress = cache.get(cacheKey)

            if progress:
                return {
                    'success': True,
                    'data': progress
                }

            # 确定时间范围
            if period == '7d':
                startDate = datetime.utcnow() - timedelta(days=7)
            elif period == '30d':
                startDate = datetime.utcnow() - timedelta(days=30)
            elif period == '90d':
                startDate = datetime.utcnow() - timedelta(days=90)
            else:  # 1y
                startDate = datetime.utcnow() - timedelta(days=365)

            # 获取会话数据
            sessions = LearningSession.query.filter(
                and_(
                    LearningSession.userId == userId,
                    LearningSession.createdAt >= startDate,
                    LearningSession.status == 'completed'
                )
            ).order_by(LearningSession.createdAt).all()

            # 按日期分组统计
            dailyStats = {}
            for session in sessions:
                dateKey = session.createdAt.date().isoformat()
                if dateKey not in dailyStats:
                    dailyStats[dateKey] = {
                        'sessions': 0,
                        'wordsStudied': 0,
                        'timeSpent': 0,
                        'accuracy': 0,
                        'correctAnswers': 0,
                        'totalAnswers': 0
                    }

                dailyStats[dateKey]['sessions'] += 1
                dailyStats[dateKey]['wordsStudied'] += session.wordsStudied
                dailyStats[dateKey]['timeSpent'] += session.totalTimeSpent
                dailyStats[dateKey]['correctAnswers'] += session.correctAnswers
                dailyStats[dateKey]['totalAnswers'] += session.wordsStudied

            # 计算每日准确率
            for date, stats in dailyStats.items():
                if stats['totalAnswers'] > 0:
                    stats['accuracy'] = round(stats['correctAnswers'] / stats['totalAnswers'] * 100, 2)

            # 掌握度变化趋势
            masteryTrend = StatisticsService._getMasteryTrend(userId, startDate)

            # 分类学习进度
            categoryProgress = StatisticsService._getCategoryProgress(userId)

            # 学习效率分析
            efficiencyAnalysis = StatisticsService._analyzeLearningEfficiency(sessions)

            progress = {
                'period': period,
                'dailyStats': dailyStats,
                'masteryTrend': masteryTrend,
                'categoryProgress': categoryProgress,
                'efficiencyAnalysis': efficiencyAnalysis,
                'summary': {
                    'totalSessions': len(sessions),
                    'totalWordsStudied': sum(s.wordsStudied for s in sessions),
                    'totalTimeSpent': sum(s.totalTimeSpent for s in sessions),
                    'averageAccuracy': round(sum(s.accuracy for s in sessions) / len(sessions), 2) if sessions else 0,
                    'averageSessionTime': round(sum(s.totalTimeSpent for s in sessions) / len(sessions), 2) if sessions else 0
                }
            }

            # 缓存10分钟
            cache.set(cacheKey, progress, timeout=600)

            return {
                'success': True,
                'data': progress
            }

        except Exception as e:
            current_app.logger.error(f"Error getting detailed progress: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get detailed progress',
                'code': 'PROGRESS_ERROR'
            }

    @staticmethod
    def _getMasteryTrend(userId: int, startDate: datetime) -> List[Dict[str, Any]]:
        """获取掌握度趋势"""
        try:
            # 获取时间范围内的用户词汇更新记录
            userVocabulary = UserVocabulary.query.filter(
                and_(
                    UserVocabulary.userId == userId,
                    UserVocabulary.lastReviewAt >= startDate
                )
            ).order_by(UserVocabulary.lastReviewAt).all()

            # 按周分组统计掌握度变化
            weeklyStats = {}
            for uv in userVocabulary:
                weekKey = uv.lastReviewAt.strftime('%Y-W%U')  # 年-周数
                if weekKey not in weeklyStats:
                    weeklyStats[weekKey] = {
                        'week': weekKey,
                        'totalMastery': 0,
                        'count': 0,
                        'newMastered': 0
                    }

                weeklyStats[weekKey]['totalMastery'] += uv.masteryLevel
                weeklyStats[weekKey]['count'] += 1

                if uv.masteryLevel == 5:
                    weeklyStats[weekKey]['newMastered'] += 1

            # 计算每周平均掌握度
            masteryTrend = []
            for week, stats in sorted(weeklyStats.items()):
                averageMastery = stats['totalMastery'] / stats['count'] if stats['count'] > 0 else 0
                masteryTrend.append({
                    'week': week,
                    'averageMastery': round(averageMastery, 2),
                    'wordsReviewed': stats['count'],
                    'newMastered': stats['newMastered']
                })

            return masteryTrend

        except Exception as e:
            current_app.logger.error(f"Error getting mastery trend: {str(e)}")
            return []

    @staticmethod
    def _getCategoryProgress(userId: int) -> List[Dict[str, Any]]:
        """获取分类学习进度"""
        try:
            # 按分类统计学习进度
            categoryStats = db.session.query(
                VocabularyCategory.id,
                VocabularyCategory.name,
                func.count(Vocabulary.id).label('totalWords'),
                func.sum(func.case(
                    (UserVocabulary.masteryLevel >= 3, 1), else_=0
                )).label('learnedWords'),
                func.sum(func.case(
                    (UserVocabulary.masteryLevel == 5, 1), else_=0
                )).label('masteredWords')
            ).outerjoin(
                VocabularyCategory.vocabularies
            ).outerjoin(
                UserVocabulary, and_(
                    UserVocabulary.vocabularyId == Vocabulary.id,
                    UserVocabulary.userId == userId
                )
            ).filter(
                Vocabulary.isDeleted == False
            ).group_by(VocabularyCategory.id).all()

            categoryProgress = []
            for stat in categoryStats:
                totalWords = stat.totalWords or 0
                learnedWords = stat.learnedWords or 0
                masteredWords = stat.masteredWords or 0

                categoryProgress.append({
                    'categoryId': stat.id,
                    'categoryName': stat.name,
                    'totalWords': totalWords,
                    'learnedWords': learnedWords,
                    'masteredWords': masteredWords,
                    'learningProgress': round((learnedWords / totalWords * 100) if totalWords > 0 else 0, 2),
                    'masteryProgress': round((masteredWords / totalWords * 100) if totalWords > 0 else 0, 2)
                })

            return sorted(categoryProgress, key=lambda x: x['learningProgress'], reverse=True)

        except Exception as e:
            current_app.logger.error(f"Error getting category progress: {str(e)}")
            return []

    @staticmethod
    def _analyzeLearningEfficiency(sessions: List[LearningSession]) -> Dict[str, Any]:
        """分析学习效率"""
        try:
            if not sessions:
                return {
                    'averageWordsPerMinute': 0,
                    'bestSession': None,
                    'peakLearningHours': [],
                    'efficiencyTrend': []
                }

            # 计算每小时学习效率
            hourlyStats = {}
            for session in sessions:
                hour = session.createdAt.hour
                if hour not in hourlyStats:
                    hourlyStats[hour] = {
                        'sessions': 0,
                        'wordsStudied': 0,
                        'timeSpent': 0,
                        'accuracy': 0
                    }

                hourlyStats[hour]['sessions'] += 1
                hourlyStats[hour]['wordsStudied'] += session.wordsStudied
                hourlyStats[hour]['timeSpent'] += session.totalTimeSpent
                hourlyStats[hour]['accuracy'] += session.accuracy

            # 计算每小时平均数据
            for hour, stats in hourlyStats.items():
                if stats['sessions'] > 0:
                    stats['averageAccuracy'] = round(stats['accuracy'] / stats['sessions'], 2)
                    stats['wordsPerMinute'] = round(stats['wordsStudied'] / (stats['timeSpent'] / 60), 2) if stats['timeSpent'] > 0 else 0

            # 找出效率最高的时间段
            peakHours = sorted(
                [(hour, stats['wordsPerMinute']) for hour, stats in hourlyStats.items() if stats['sessions'] >= 3],
                key=lambda x: x[1], reverse=True
            )[:3]

            # 找出最佳学习会话
            bestSession = max(sessions, key=lambda s: (s.wordsStudied / (s.totalTimeSpent / 60)) if s.totalTimeSpent > 0 else 0)

            # 计算平均学习效率
            totalTimeSpent = sum(s.totalTimeSpent for s in sessions)
            totalWordsStudied = sum(s.wordsStudied for s in sessions)
            averageWordsPerMinute = round(totalWordsStudied / (totalTimeSpent / 60), 2) if totalTimeSpent > 0 else 0

            return {
                'averageWordsPerMinute': averageWordsPerMinute,
                'bestSession': {
                    'id': bestSession.id,
                    'wordsStudied': bestSession.wordsStudied,
                    'timeSpent': bestSession.totalTimeSpent,
                    'accuracy': bestSession.accuracy,
                    'efficiency': round(bestSession.wordsStudied / (bestSession.totalTimeSpent / 60), 2) if bestSession.totalTimeSpent > 0 else 0
                },
                'peakLearningHours': [{'hour': hour, 'efficiency': efficiency} for hour, efficiency in peakHours],
                'hourlyStats': hourlyStats
            }

        except Exception as e:
            current_app.logger.error(f"Error analyzing learning efficiency: {str(e)}")
            return {
                'averageWordsPerMinute': 0,
                'bestSession': None,
                'peakLearningHours': [],
                'efficiencyTrend': []
            }

    @staticmethod
    def getAchievements(userId: int) -> Dict[str, Any]:
        """获取用户成就"""
        try:
            # 获取用户已获得的成就
            userAchievements = UserAchievement.query.filter_by(userId=userId).all()
            achievementNames = [ua.achievementName for ua in userAchievements]

            # 预定义成就列表
            allAchievements = StatisticsService._getAllAchievements()

            # 检查新成就
            newAchievements = []
            for achievement in allAchievements:
                if achievement['name'] not in achievementNames:
                    if StatisticsService._checkAchievement(userId, achievement):
                        newAchievements.append(achievement)

            # 添加新成就到数据库
            for achievement in newAchievements:
                userAchievement = UserAchievement(
                    userId=userId,
                    achievementName=achievement['name'],
                    achievementData=achievement
                )
                db.session.add(userAchievement)

            if newAchievements:
                db.session.commit()

            # 返回所有成就
            earnedAchievements = []
            for achievement in allAchievements:
                isEarned = achievement['name'] in achievementNames or achievement in newAchievements
                earnedAchievements.append({
                    **achievement,
                    'earned': isEarned,
                    'earnedAt': next((ua.earnedAt for ua in userAchievements if ua.achievementName == achievement['name']), None)
                })

            return {
                'success': True,
                'data': {
                    'achievements': earnedAchievements,
                    'newAchievements': [a['name'] for a in newAchievements],
                    'totalEarned': len(earnedAchievements),
                    'progress': StatisticsService._calculateAchievementProgress(userId)
                }
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error getting achievements: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get achievements',
                'code': 'ACHIEVEMENTS_ERROR'
            }

    @staticmethod
    def _getAllAchievements() -> List[Dict[str, Any]]:
        """获取所有成就定义"""
        return [
            {
                'name': 'first_word',
                'title': '初学者',
                'description': '学会第一个词汇',
                'icon': '🎯',
                'category': 'learning',
                'points': 10
            },
            {
                'name': 'vocabulary_10',
                'title': '词汇新手',
                'description': '学会10个词汇',
                'icon': '📚',
                'category': 'learning',
                'points': 50
            },
            {
                'name': 'vocabulary_100',
                'title': '词汇达人',
                'description': '学会100个词汇',
                'icon': '🎓',
                'category': 'learning',
                'points': 200
            },
            {
                'name': 'vocabulary_500',
                'title': '词汇大师',
                'description': '学会500个词汇',
                'icon': '👑',
                'category': 'learning',
                'points': 500
            },
            {
                'name': 'streak_7',
                'title': '坚持不懈',
                'description': '连续学习7天',
                'icon': '🔥',
                'category': 'consistency',
                'points': 100
            },
            {
                'name': 'streak_30',
                'title': '月度冠军',
                'description': '连续学习30天',
                'icon': '🏆',
                'category': 'consistency',
                'points': 300
            },
            {
                'name': 'perfect_session',
                'title': '完美表现',
                'description': '单次会话100%正确率',
                'icon': '💯',
                'category': 'performance',
                'points': 50
            },
            {
                'name': 'speed_learner',
                'title': '快速学习者',
                'description': '单分钟学习5个词汇',
                'icon': '⚡',
                'category': 'performance',
                'points': 75
            }
        ]

    @staticmethod
    def _checkAchievement(userId: int, achievement: Dict[str, Any]) -> bool:
        """检查是否满足成就条件"""
        try:
            if achievement['name'] == 'first_word':
                return UserVocabulary.query.filter_by(userId=userId).count() >= 1

            elif achievement['name'] == 'vocabulary_10':
                return UserVocabulary.query.filter_by(userId=userId).count() >= 10

            elif achievement['name'] == 'vocabulary_100':
                return UserVocabulary.query.filter_by(userId=userId).count() >= 100

            elif achievement['name'] == 'vocabulary_500':
                return UserVocabulary.query.filter_by(userId=userId).count() >= 500

            elif achievement['name'] == 'streak_7':
                user = User.query.get(userId)
                return user.calculateConsecutiveDays() >= 7 if user else False

            elif achievement['name'] == 'streak_30':
                user = User.query.get(userId)
                return user.calculateConsecutiveDays() >= 30 if user else False

            elif achievement['name'] == 'perfect_session':
                return LearningSession.query.filter(
                    and_(
                        LearningSession.userId == userId,
                        LearningSession.accuracy == 100,
                        LearningSession.status == 'completed'
                    )
                ).first() is not None

            elif achievement['name'] == 'speed_learner':
                return SessionWord.query.filter(
                    and_(
                        SessionWord.session.has(LearningSession.userId == userId),
                        SessionWord.timeSpent <= 60,
                        SessionWord.isCorrect == True
                    )
                ).count() >= 5

            return False

        except Exception as e:
            current_app.logger.error(f"Error checking achievement {achievement['name']}: {str(e)}")
            return False

    @staticmethod
    def _calculateAchievementProgress(userId: int) -> Dict[str, Any]:
        """计算成就进度"""
        try:
            user = User.query.get(userId)
            if not user:
                return {}

            progress = {}

            # 词汇学习进度
            totalWords = UserVocabulary.query.filter_by(userId=userId).count()
            progress['vocabulary_10'] = min(100, totalWords / 10 * 100)
            progress['vocabulary_100'] = min(100, totalWords / 100 * 100)
            progress['vocabulary_500'] = min(100, totalWords / 500 * 100)

            # 连续学习天数进度
            consecutiveDays = user.calculateConsecutiveDays()
            progress['streak_7'] = min(100, consecutiveDays / 7 * 100)
            progress['streak_30'] = min(100, consecutiveDays / 30 * 100)

            return progress

        except Exception as e:
            current_app.logger.error(f"Error calculating achievement progress: {str(e)}")
            return {}

    @staticmethod
    def getSystemStatistics() -> Dict[str, Any]:
        """获取系统统计数据"""
        try:
            cacheKey = 'system_statistics'
            stats = cache.get(cacheKey)

            if stats:
                return {
                    'success': True,
                    'data': stats
                }

            # 用户统计
            totalUsers = User.query.count()
            activeUsers = User.query.filter(
                User.lastActivityAt >= datetime.utcnow() - timedelta(days=30)
            ).count()

            # 词汇统计
            totalVocabulary = Vocabulary.query.filter_by(isDeleted=False).count()

            # 学习统计
            totalSessions = LearningSession.query.count()
            completedSessions = LearningSession.query.filter_by(status='completed').count()
            totalLearningTime = db.session.query(func.sum(LearningSession.totalTimeSpent)).scalar() or 0

            # 今日统计
            today = datetime.utcnow().date()
            todaySessions = LearningSession.query.filter(
                func.date(LearningSession.createdAt) == today
            ).count()

            todayActiveUsers = db.session.query(
                func.count(func.distinct(LearningSession.userId))
            ).filter(
                func.date(LearningSession.createdAt) == today
            ).scalar() or 0

            stats = {
                'users': {
                    'total': totalUsers,
                    'active': activeUsers,
                    'activeRate': round(activeUsers / totalUsers * 100, 2) if totalUsers > 0 else 0
                },
                'vocabulary': {
                    'total': totalVocabulary
                },
                'learning': {
                    'totalSessions': totalSessions,
                    'completedSessions': completedSessions,
                    'completionRate': round(completedSessions / totalSessions * 100, 2) if totalSessions > 0 else 0,
                    'totalLearningTime': totalLearningTime,
                    'averageSessionTime': round(totalLearningTime / completedSessions, 2) if completedSessions > 0 else 0
                },
                'today': {
                    'sessions': todaySessions,
                    'activeUsers': todayActiveUsers
                }
            }

            # 缓存1小时
            cache.set(cacheKey, stats, timeout=3600)

            return {
                'success': True,
                'data': stats
            }

        except Exception as e:
            current_app.logger.error(f"Error getting system statistics: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get system statistics',
                'code': 'SYSTEM_STATS_ERROR'
            }