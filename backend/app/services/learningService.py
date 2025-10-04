from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from flask import current_app
from sqlalchemy import and_, or_, desc, func
import random
import math
from app.models.learning import UserVocabulary, LearningSession, SessionWord
from app.models.user import User
from app.models.vocabulary import Vocabulary
from app.extensions import db, cache
from app.config import Config


class LearningService:
    """学习服务类 - 处理学习相关的业务逻辑和自适应算法"""

    @staticmethod
    def createLearningSession(userId: int, sessionConfig: Dict[str, Any]) -> Dict[str, Any]:
        """创建学习会话"""
        try:
            # 获取用户信息
            user = User.query.get(userId)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found',
                    'code': 'USER_NOT_FOUND'
                }

            # 确定学习参数
            wordCount = sessionConfig.get('wordCount', 20)
            difficulty = sessionConfig.get('difficulty', 'adaptive')
            categories = sessionConfig.get('categories', [])
            sessionType = sessionConfig.get('sessionType', 'mixed')

            # 获取学习词汇
            vocabularyList = LearningService._generateLearningQueue(
                userId, wordCount, difficulty, categories, sessionType
            )

            if not vocabularyList:
                return {
                    'success': False,
                    'message': 'No vocabulary available for learning',
                    'code': 'NO_VOCABULARY'
                }

            # 创建学习会话
            session = LearningSession(
                userId=userId,
                sessionType=sessionType,
                wordCount=len(vocabularyList),
                difficultyLevel=difficulty,
                status='active',
                config=sessionConfig
            )

            db.session.add(session)
            db.session.flush()  # 获取会话ID

            # 添加会话词汇
            for index, vocabulary in enumerate(vocabularyList):
                sessionWord = SessionWord(
                    sessionId=session.id,
                    vocabularyId=vocabulary.id,
                    position=index + 1,
                    initialDifficulty=vocabulary.difficulty
                )
                db.session.add(sessionWord)

            db.session.commit()

            return {
                'success': True,
                'message': 'Learning session created successfully',
                'data': session.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating learning session: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to create learning session',
                'code': 'SESSION_CREATION_ERROR'
            }

    @staticmethod
    def _generateLearningQueue(
        userId: int, wordCount: int, difficulty: str, categories: List[int], sessionType: str
    ) -> List[Vocabulary]:
        """生成学习队列"""
        try:
            # 获取算法配置
            algoConfig = current_app.config['ALGORITHM_CONFIG']

            # 获取用户已学习的词汇
            learnedVocabularyIds = db.session.query(UserVocabulary.vocabularyId).filter_by(
                userId=userId
            ).subquery()

            # 构建基础查询
            query = Vocabulary.query.filter(
                and_(
                    Vocabulary.isDeleted == False,
                    ~Vocabulary.id.in_(learnedVocabularyIds)
                )
            )

            # 应用分类过滤
            if categories:
                query = query.join(Vocabulary.categories).filter(
                    VocabularyCategory.id.in_(categories)
                )

            # 应用难度过滤
            if difficulty != 'adaptive':
                query = query.filter(Vocabulary.difficulty == difficulty)
            else:
                # 自适应难度：根据用户水平选择词汇
                userLevel = LearningService._calculateUserLevel(userId)
                minDifficulty = max(1, userLevel - 1)
                maxDifficulty = min(5, userLevel + 1)
                query = query.filter(
                    Vocabulary.difficulty.between(minDifficulty, maxDifficulty)
                )

            # 优先选择高频词汇
            query = query.order_by(desc(Vocabulary.frequency))

            # 获取候选词汇
            candidates = query.limit(wordCount * 2).all()  # 获取更多候选词汇

            if not candidates:
                # 如果没有新词汇，选择需要复习的词汇
                return LearningService._generateReviewQueue(userId, wordCount)

            # 根据学习类型调整词汇选择
            if sessionType == 'new':
                selectedVocabulary = candidates[:wordCount]
            elif sessionType == 'review':
                return LearningService._generateReviewQueue(userId, wordCount)
            else:  # mixed
                # 70%新词汇，30%复习词汇
                newCount = int(wordCount * 0.7)
                reviewCount = wordCount - newCount

                newVocabulary = candidates[:newCount]
                reviewVocabulary = LearningService._generateReviewQueue(userId, reviewCount)

                selectedVocabulary = newVocabulary + reviewVocabulary
                random.shuffle(selectedVocabulary)

            return selectedVocabulary[:wordCount]

        except Exception as e:
            current_app.logger.error(f"Error generating learning queue: {str(e)}")
            return []

    @staticmethod
    def _generateReviewQueue(userId: int, wordCount: int) -> List[Vocabulary]:
        """生成复习队列"""
        try:
            # 获取需要复习的词汇
            reviewVocabulary = db.session.query(UserVocabulary).filter(
                and_(
                    UserVocabulary.userId == userId,
                    UserVocabulary.nextReviewAt <= datetime.utcnow(),
                    UserVocabulary.masteryLevel < 5
                )
            ).order_by(UserVocabulary.nextReviewAt).limit(wordCount).all()

            vocabularyList = []
            for userVocab in reviewVocabulary:
                vocabularyList.append(userVocab.vocabulary)

            return vocabularyList

        except Exception as e:
            current_app.logger.error(f"Error generating review queue: {str(e)}")
            return []

    @staticmethod
    def _calculateUserLevel(userId: int) -> int:
        """计算用户水平"""
        try:
            # 获取用户学习统计
            totalWords = UserVocabulary.query.filter_by(userId=userId).count()
            masteredWords = UserVocabulary.query.filter_by(
                userId=userId, masteryLevel=5
            ).count()

            # 计算平均掌握度
            avgMastery = db.session.query(
                func.avg(UserVocabulary.masteryLevel)
            ).filter_by(userId=userId).scalar() or 0

            # 根据词汇量和掌握度计算水平
            if totalWords < 50:
                return 1
            elif totalWords < 200:
                return 2 if avgMastery > 2 else 1
            elif totalWords < 500:
                return 3 if avgMastery > 3 else 2
            elif totalWords < 1000:
                return 4 if avgMastery > 4 else 3
            else:
                return 5

        except Exception as e:
            current_app.logger.error(f"Error calculating user level: {str(e)}")
            return 1

    @staticmethod
    def submitAnswer(
        sessionId: int, vocabularyId: int, answer: str, timeSpent: int, isCorrect: bool
    ) -> Dict[str, Any]:
        """提交答案"""
        try:
            # 获取会话
            session = LearningSession.query.get(sessionId)
            if not session or session.status != 'active':
                return {
                    'success': False,
                    'message': 'Invalid or inactive session',
                    'code': 'INVALID_SESSION'
                }

            # 获取会话词汇
            sessionWord = SessionWord.query.filter_by(
                sessionId=sessionId,
                vocabularyId=vocabularyId
            ).first()

            if not sessionWord:
                return {
                    'success': False,
                    'message': 'Vocabulary not found in session',
                    'code': 'VOCABULARY_NOT_FOUND'
                }

            # 更新会话词汇记录
            sessionWord.answer = answer
            sessionWord.timeSpent = timeSpent
            sessionWord.isCorrect = isCorrect
            sessionWord.answeredAt = datetime.utcnow()

            # 更新用户词汇记录
            userVocabulary = UserVocabulary.query.filter_by(
                userId=session.userId,
                vocabularyId=vocabularyId
            ).first()

            if not userVocabulary:
                # 首次学习
                userVocabulary = UserVocabulary(
                    userId=session.userId,
                    vocabularyId=vocabularyId,
                    masteryLevel=1 if isCorrect else 0,
                    reviewCount=1,
                    correctCount=1 if isCorrect else 0,
                    totalTimeSpent=timeSpent,
                    lastReviewAt=datetime.utcnow(),
                    nextReviewAt=LearningService._calculateNextReview(
                        1 if isCorrect else 0, timeSpent, isCorrect
                    )
                )
                db.session.add(userVocabulary)
            else:
                # 更新现有记录
                LearningService._updateUserVocabulary(userVocabulary, isCorrect, timeSpent)

            # 更新会话统计
            session.wordsStudied += 1
            if isCorrect:
                session.correctAnswers += 1
            session.totalTimeSpent += timeSpent

            db.session.commit()

            return {
                'success': True,
                'message': 'Answer submitted successfully',
                'data': {
                    'isCorrect': isCorrect,
                    'timeSpent': timeSpent,
                    'sessionProgress': {
                        'studied': session.wordsStudied,
                        'total': session.wordCount,
                        'accuracy': round(session.correctAnswers / session.wordsStudied * 100, 2) if session.wordsStudied > 0 else 0
                    }
                }
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error submitting answer: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to submit answer',
                'code': 'SUBMIT_ERROR'
            }

    @staticmethod
    def _updateUserVocabulary(userVocabulary: UserVocabulary, isCorrect: bool, timeSpent: int):
        """更新用户词汇学习记录"""
        try:
            algoConfig = current_app.config['ALGORITHM_CONFIG']

            # 更新基础统计
            userVocabulary.reviewCount += 1
            userVocabulary.totalTimeSpent += timeSpent
            userVocabulary.lastReviewAt = datetime.utcnow()

            if isCorrect:
                userVocabulary.correctCount += 1
                userVocabulary.consecutiveCorrect = (userVocabulary.consecutiveCorrect or 0) + 1

                # 计算新的掌握度
                newMastery = LearningService._calculateNewMasteryLevel(
                    userVocabulary.masteryLevel,
                    True,
                    timeSpent,
                    userVocabulary.consecutiveCorrect
                )

                userVocabulary.masteryLevel = min(5, newMastery)
            else:
                userVocabulary.consecutiveCorrect = 0

                # 答错降低掌握度
                userVocabulary.masteryLevel = max(0, userVocabulary.masteryLevel - 1)

            # 计算下次复习时间
            userVocabulary.nextReviewAt = LearningService._calculateNextReview(
                userVocabulary.masteryLevel,
                timeSpent,
                isCorrect
            )

            # 更新学习状态
            if userVocabulary.masteryLevel >= 5:
                userVocabulary.learningStatus = 'mastered'
            elif userVocabulary.masteryLevel >= 3:
                userVocabulary.learningStatus = 'learning'
            else:
                userVocabulary.learningStatus = 'struggling'

        except Exception as e:
            current_app.logger.error(f"Error updating user vocabulary: {str(e)}")

    @staticmethod
    def _calculateNewMasteryLevel(
        currentLevel: int, isCorrect: bool, timeSpent: int, consecutiveCorrect: int
    ) -> int:
        """计算新的掌握度"""
        try:
            if not isCorrect:
                return max(0, currentLevel - 1)

            # 基础增长
            levelIncrease = 0.5

            # 连续答对奖励
            if consecutiveCorrect >= 3:
                levelIncrease += 0.3
            elif consecutiveCorrect >= 2:
                levelIncrease += 0.2

            # 快速回答奖励
            if timeSpent < 10:  # 10秒内
                levelIncrease += 0.2
            elif timeSpent < 20:  # 20秒内
                levelIncrease += 0.1

            # 高水平用户增长较慢
            if currentLevel >= 4:
                levelIncrease *= 0.5
            elif currentLevel >= 3:
                levelIncrease *= 0.7

            return currentLevel + levelIncrease

        except Exception as e:
            current_app.logger.error(f"Error calculating new mastery level: {str(e)}")
            return currentLevel

    @staticmethod
    def _calculateNextReview(masteryLevel: int, timeSpent: int, isCorrect: bool) -> datetime:
        """计算下次复习时间"""
        try:
            algoConfig = current_app.config['ALGORITHM_CONFIG']
            reviewIntervals = algoConfig['review_intervals']

            if not isCorrect:
                # 答错后较短时间后复习
                return datetime.utcnow() + timedelta(hours=1)

            # 根据掌握度确定复习间隔
            intervalHours = reviewIntervals.get(
                masteryLevel, reviewIntervals[0]
            )

            # 根据答题时间调整间隔
            if timeSpent < 10:  # 快速答对，可以延长间隔
                intervalHours = int(intervalHours * 1.2)
            elif timeSpent > 30:  # 答题较慢，缩短间隔
                intervalHours = int(intervalHours * 0.8)

            return datetime.utcnow() + timedelta(hours=intervalHours)

        except Exception as e:
            current_app.logger.error(f"Error calculating next review: {str(e)}")
            return datetime.utcnow() + timedelta(hours=24)

    @staticmethod
    def completeSession(sessionId: int, feedback: Dict[str, Any] = None) -> Dict[str, Any]:
        """完成学习会话"""
        try:
            session = LearningSession.query.get(sessionId)
            if not session:
                return {
                    'success': False,
                    'message': 'Session not found',
                    'code': 'SESSION_NOT_FOUND'
                }

            if session.status != 'active':
                return {
                    'success': False,
                    'message': 'Session already completed',
                    'code': 'SESSION_COMPLETED'
                }

            # 更新会话状态
            session.status = 'completed'
            session.completedAt = datetime.utcnow()
            session.feedback = feedback or {}

            # 计算最终统计
            sessionWordCount = SessionWord.query.filter_by(sessionId=sessionId).count()
            answeredWordCount = SessionWord.query.filter_by(
                sessionId=sessionId,
                answeredAt__isnot=None
            ).count()

            correctAnswerCount = SessionWord.query.filter_by(
                sessionId=sessionId,
                isCorrect=True
            ).count()

            session.accuracy = round(correctAnswerCount / answeredWordCount * 100, 2) if answeredWordCount > 0 else 0
            session.completionRate = round(answeredWordCount / sessionWordCount * 100, 2) if sessionWordCount > 0 else 0

            db.session.commit()

            # 更新用户最后活动时间
            from app.services.userService import UserService
            UserService.updateLastActivity(session.userId)

            return {
                'success': True,
                'message': 'Session completed successfully',
                'data': session.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error completing session: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to complete session',
                'code': 'COMPLETION_ERROR'
            }

    @staticmethod
    def getUserLearningStats(userId: int, days: int = 30) -> Dict[str, Any]:
        """获取用户学习统计"""
        try:
            cacheKey = f'user_learning_stats_{userId}_{days}'
            stats = cache.get(cacheKey)

            if stats:
                return {
                    'success': True,
                    'data': stats
                }

            startDate = datetime.utcnow() - timedelta(days=days)

            # 会话统计
            sessions = LearningSession.query.filter(
                LearningSession.userId == userId,
                LearningSession.createdAt >= startDate,
                LearningSession.status == 'completed'
            ).all()

            # 词汇统计
            userVocabulary = UserVocabulary.query.filter_by(userId=userId).all()

            # 计算统计数据
            totalSessions = len(sessions)
            totalTimeSpent = sum(session.totalTimeSpent for session in sessions)
            totalWordsStudied = sum(session.wordsStudied for session in sessions)
            averageAccuracy = sum(session.accuracy for session in sessions) / totalSessions if totalSessions > 0 else 0

            # 掌握度分布
            masteryDistribution = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            for uv in userVocabulary:
                masteryDistribution[uv.masteryLevel] += 1

            # 每日学习数据
            dailyStats = {}
            for i in range(days):
                date = (datetime.utcnow() - timedelta(days=i)).date()
                dailyStats[date.isoformat()] = {
                    'sessions': 0,
                    'timeSpent': 0,
                    'wordsStudied': 0
                }

            for session in sessions:
                date = session.createdAt.date().isoformat()
                if date in dailyStats:
                    dailyStats[date]['sessions'] += 1
                    dailyStats[date]['timeSpent'] += session.totalTimeSpent
                    dailyStats[date]['wordsStudied'] += session.wordsStudied

            stats = {
                'totalSessions': totalSessions,
                'totalTimeSpent': totalTimeSpent,
                'totalWordsStudied': totalWordsStudied,
                'averageAccuracy': round(averageAccuracy, 2),
                'averageSessionTime': round(totalTimeSpent / totalSessions, 2) if totalSessions > 0 else 0,
                'masteryDistribution': masteryDistribution,
                'dailyStats': dailyStats,
                'currentLevel': LearningService._calculateUserLevel(userId),
                'wordsForReview': UserVocabulary.query.filter(
                    and_(
                        UserVocabulary.userId == userId,
                        UserVocabulary.nextReviewAt <= datetime.utcnow(),
                        UserVocabulary.masteryLevel < 5
                    )
                ).count()
            }

            # 缓存统计信息（10分钟）
            cache.set(cacheKey, stats, timeout=600)

            return {
                'success': True,
                'data': stats
            }

        except Exception as e:
            current_app.logger.error(f"Error getting user learning stats: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get learning statistics',
                'code': 'STATS_ERROR'
            }

    @staticmethod
    def getRecommendedVocabulary(userId: int, count: int = 10) -> List[Dict[str, Any]]:
        """获取推荐词汇"""
        try:
            # 基于用户水平和学习历史推荐词汇
            userLevel = LearningService._calculateUserLevel(userId)

            # 获取用户已学习的词汇分类
            learnedCategories = db.session.query(VocabularyCategory.id).join(
                VocabularyCategory.vocabularies
            ).join(UserVocabulary).filter(
                UserVocabulary.userId == userId,
                UserVocabulary.masteryLevel >= 3
            ).distinct().all()

            categoryIds = [cat[0] for cat in learnedCategories]

            # 推荐相似难度和分类的词汇
            query = Vocabulary.query.filter(
                and_(
                    Vocabulary.isDeleted == False,
                    Vocabulary.difficulty.between(max(1, userLevel - 1), min(5, userLevel + 1))
                )
            )

            # 排除已学习的词汇
            learnedVocabularyIds = db.session.query(UserVocabulary.vocabularyId).filter_by(
                userId=userId
            ).subquery()

            query = query.filter(~Vocabulary.id.in_(learnedVocabularyIds))

            # 优先推荐相同分类的词汇
            if categoryIds:
                query = query.outerjoin(Vocabulary.categories).filter(
                    or_(
                        VocabularyCategory.id.in_(categoryIds),
                        VocabularyCategory.id.is_(None)
                    )
                )

            # 按频率和推荐权重排序
            vocabularyList = query.order_by(
                desc(Vocabulary.frequency),
                desc(Vocabulary.difficulty == userLevel)
            ).limit(count * 2).all()

            # 应用推荐算法评分
            scoredVocabulary = []
            for vocab in vocabularyList:
                score = LearningService._calculateRecommendationScore(userId, vocab)
                scoredVocabulary.append((vocab, score))

            # 按评分排序并返回前count个
            scoredVocabulary.sort(key=lambda x: x[1], reverse=True)

            return [vocab[0].toDict() for vocab in scoredVocabulary[:count]]

        except Exception as e:
            current_app.logger.error(f"Error getting recommended vocabulary: {str(e)}")
            return []

    @staticmethod
    def _calculateRecommendationScore(userId: int, vocabulary: Vocabulary) -> float:
        """计算推荐分数"""
        try:
            score = 0.0

            # 基础频率分数
            score += vocabulary.frequency * 0.3

            # 难度适配分数
            userLevel = LearningService._calculateUserLevel(userId)
            difficultyDiff = abs(vocabulary.difficulty - userLevel)
            score += (5 - difficultyDiff) * 0.2

            # 词频分数
            score += vocabulary.frequency * 0.2

            # 长度分数（适中长度优先）
            wordLength = len(vocabulary.word)
            if 4 <= wordLength <= 8:
                score += 0.1
            elif wordLength <= 12:
                score += 0.05

            # 随机因子
            score += random.random() * 0.2

            return score

        except Exception as e:
            current_app.logger.error(f"Error calculating recommendation score: {str(e)}")
            return 0.0