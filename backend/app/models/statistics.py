"""
统计数据模型
包含用户学习统计、每日进度、成就系统等
"""

from datetime import datetime, date
from flask_sqlalchemy import SQLAlchemy
from typing import Optional, Dict, Any
import json

db = SQLAlchemy()


class DailyStatistics(db.Model):
    """每日统计模型"""
    __tablename__ = 'daily_statistics'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    statisticsDate = db.Column(db.Date, nullable=False)

    # 学习统计
    wordsStudied = db.Column(db.Integer, default=0, nullable=False)
    newWords = db.Column(db.Integer, default=0, nullable=False)
    reviewWords = db.Column(db.Integer, default=0, nullable=False)

    # 时间统计
    studyTime = db.Column(db.Integer, default=0, nullable=False)  # 学习时间（分钟）
    sessionCount = db.Column(db.Integer, default=0, nullable=False)

    # 表现统计
    correctAnswers = db.Column(db.Integer, default=0, nullable=False)
    totalAnswers = db.Column(db.Integer, default=0, nullable=False)
    accuracy = db.Column(db.Float, default=0.0, nullable=False)

    # 进度统计
    wordsMastered = db.Column(db.Integer, default=0, nullable=False)
    pointsEarned = db.Column(db.Integer, default=0, nullable=False)

    # 时间戳
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 唯一约束
    __table_args__ = (
        db.UniqueConstraint('userId', 'statisticsDate', name='unique_user_date_statistics'),
        db.Index('idx_user_date', 'userId', 'statisticsDate'),
    )

    def calculateAccuracy(self) -> float:
        """计算正确率"""
        if self.totalAnswers == 0:
            return 0.0
        return self.correctAnswers / self.totalAnswers

    def updateFromSession(self, session) -> None:
        """从学习会话更新统计数据"""
        self.wordsStudied += session.totalWords
        self.studyTime += (session.duration or 0) // 60  # 转换为分钟
        self.sessionCount += 1
        self.correctAnswers += session.correctAnswers
        self.totalAnswers += session.correctAnswers + session.wrongAnswers
        self.pointsEarned += session.pointsEarned
        self.accuracy = self.calculateAccuracy()
        self.updatedAt = datetime.utcnow()

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'userId': self.userId,
            'statisticsDate': self.statisticsDate.isoformat() if self.statisticsDate else None,
            'wordsStudied': self.wordsStudied,
            'newWords': self.newWords,
            'reviewWords': self.reviewWords,
            'studyTime': self.studyTime,
            'sessionCount': self.sessionCount,
            'correctAnswers': self.correctAnswers,
            'totalAnswers': self.totalAnswers,
            'accuracy': self.accuracy,
            'wordsMastered': self.wordsMastered,
            'pointsEarned': self.pointsEarned,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None
        }

    def __repr__(self) -> str:
        return f'<DailyStatistics {self.userId}:{self.statisticsDate}>'


class Achievement(db.Model):
    """成就定义模型"""
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50))  # 成就图标
    category = db.Column(db.String(50), nullable=False)  # 成就类别

    # 成就条件
    conditionType = db.Column(db.String(50), nullable=False)  # words_studied, streak_days, accuracy, etc.
    conditionValue = db.Column(db.Integer, nullable=False)
    conditionOperator = db.Column(db.String(10), default='>=')  # >=, ==, <=

    # 奖励设置
    pointsReward = db.Column(db.Integer, default=0, nullable=False)
    badgeType = db.Column(db.String(50))  # 徽章类型

    # 状态
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def checkCondition(self, userValue: int) -> bool:
        """检查用户是否满足成就条件"""
        if self.conditionOperator == '>=':
            return userValue >= self.conditionValue
        elif self.conditionOperator == '==':
            return userValue == self.conditionValue
        elif self.conditionOperator == '<=':
            return userValue <= self.conditionValue
        return False

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'category': self.category,
            'conditionType': self.conditionType,
            'conditionValue': self.conditionValue,
            'conditionOperator': self.conditionOperator,
            'pointsReward': self.pointsReward,
            'badgeType': self.badgeType,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None
        }

    def __repr__(self) -> str:
        return f'<Achievement {self.name}>'


class UserAchievement(db.Model):
    """用户成就模型"""
    __tablename__ = 'user_achievements'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    achievementId = db.Column(db.Integer, db.ForeignKey('achievements.id'), nullable=False)

    # 解锁信息
    unlockedAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    progressValue = db.Column(db.Integer, nullable=False)  # 解锁时的进度值

    # 关联关系
    achievement = db.relationship('Achievement', backref='userAchievements')

    # 唯一约束
    __table_args__ = (
        db.UniqueConstraint('userId', 'achievementId', name='unique_user_achievement'),
    )

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'userId': self.userId,
            'achievementId': self.achievementId,
            'achievement': self.achievement.toDict() if self.achievement else None,
            'unlockedAt': self.unlockedAt.isoformat() if self.unlockedAt else None,
            'progressValue': self.progressValue
        }

    def __repr__(self) -> str:
        return f'<UserAchievement {self.userId}:{self.achievementId}>'


class LearningStreak(db.Model):
    """学习连续天数模型"""
    __tablename__ = 'learning_streaks'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # 连续记录
    currentStreak = db.Column(db.Integer, default=0, nullable=False)
    longestStreak = db.Column(db.Integer, default=0, nullable=False)

    # 时间追踪
    lastStudyDate = db.Column(db.Date)
    streakStartDate = db.Column(db.Date)

    # 统计信息
    totalStudyDays = db.Column(db.Integer, default=0, nullable=False)

    # 时间戳
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def updateStreak(self, studyDate: date) -> None:
        """更新学习连续天数"""
        today = date.today()

        if self.lastStudyDate:
            days_diff = (studyDate - self.lastStudyDate).days

            if days_diff == 1:  # 连续学习
                self.currentStreak += 1
                self.totalStudyDays += 1
            elif days_diff > 1:  # 中断了连续学习
                if self.currentStreak > self.longestStreak:
                    self.longestStreak = self.currentStreak
                self.currentStreak = 1
                self.streakStartDate = studyDate
                self.totalStudyDays += 1
            # days_diff == 0 或负数表示同一天或数据异常，不做处理
        else:
            # 首次学习
            self.currentStreak = 1
            self.longestStreak = 1
            self.streakStartDate = studyDate
            self.totalStudyDays = 1

        self.lastStudyDate = studyDate
        self.updatedAt = datetime.utcnow()

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'userId': self.userId,
            'currentStreak': self.currentStreak,
            'longestStreak': self.longestStreak,
            'lastStudyDate': self.lastStudyDate.isoformat() if self.lastStudyDate else None,
            'streakStartDate': self.streakStartDate.isoformat() if self.streakStartDate else None,
            'totalStudyDays': self.totalStudyDays,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None
        }

    def __repr__(self) -> str:
        return f'<LearningStreak {self.userId}:{self.currentStreak}>'