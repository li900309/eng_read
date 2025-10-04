"""
学习会话和进度数据模型
包含学习会话记录、学习进度统计等
"""

from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from typing import Optional, Dict, Any, List
import json

db = SQLAlchemy()


class LearningSession(db.Model):
    """学习会话模型"""
    __tablename__ = 'learning_sessions'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # 会话基本信息
    sessionType = db.Column(db.String(20), default='review', nullable=False)  # review, study, test
    startedAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    endedAt = db.Column(db.DateTime)
    duration = db.Column(db.Integer)  # 会话持续时间（秒）

    # 学习统计
    totalWords = db.Column(db.Integer, default=0, nullable=False)
    correctAnswers = db.Column(db.Integer, default=0, nullable=False)
    wrongAnswers = db.Column(db.Integer, default=0, nullable=False)
    skippedWords = db.Column(db.Integer, default=0, nullable=False)

    # 得分和表现
    pointsEarned = db.Column(db.Integer, default=0, nullable=False)
    accuracy = db.Column(db.Float, default=0.0, nullable=False)

    # 会话状态
    status = db.Column(db.String(20), default='active', nullable=False)  # active, completed, paused
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # 关联关系
    records = db.relationship('LearningRecord', backref='session', lazy='dynamic', cascade='all, delete-orphan')

    def calculateAccuracy(self) -> float:
        """计算正确率"""
        totalAnswered = self.correctAnswers + self.wrongAnswers
        if totalAnswered == 0:
            return 0.0
        return self.correctAnswers / totalAnswered

    def updateDuration(self) -> None:
        """更新会话持续时间"""
        if self.endedAt:
            self.duration = int((self.endedAt - self.startedAt).total_seconds())
        else:
            self.duration = int((datetime.utcnow() - self.startedAt).total_seconds())

    def endSession(self) -> None:
        """结束会话"""
        self.endedAt = datetime.utcnow()
        self.status = 'completed'
        self.updateDuration()
        self.accuracy = self.calculateAccuracy()

    def addAnswer(self, isCorrect: bool, points: int = 0) -> None:
        """添加答题记录"""
        self.totalWords += 1
        if isCorrect:
            self.correctAnswers += 1
            self.pointsEarned += points
        else:
            self.wrongAnswers += 1

        self.accuracy = self.calculateAccuracy()

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'userId': self.userId,
            'sessionType': self.sessionType,
            'startedAt': self.startedAt.isoformat() if self.startedAt else None,
            'endedAt': self.endedAt.isoformat() if self.endedAt else None,
            'duration': self.duration,
            'totalWords': self.totalWords,
            'correctAnswers': self.correctAnswers,
            'wrongAnswers': self.wrongAnswers,
            'skippedWords': self.skippedWords,
            'pointsEarned': self.pointsEarned,
            'accuracy': self.accuracy,
            'status': self.status,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None
        }

    def __repr__(self) -> str:
        return f'<LearningSession {self.id}:{self.sessionType}>'


class LearningRecord(db.Model):
    """学习记录模型"""
    __tablename__ = 'learning_records'

    id = db.Column(db.Integer, primary_key=True)
    sessionId = db.Column(db.Integer, db.ForeignKey('learning_sessions.id'), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vocabularyId = db.Column(db.Integer, db.ForeignKey('vocabularies.id'), nullable=False)

    # 答题信息
    userAnswer = db.Column(db.Text)
    correctAnswer = db.Column(db.Text, nullable=False)
    isCorrect = db.Column(db.Boolean, nullable=False)
    responseTime = db.Column(db.Integer)  # 响应时间（毫秒）

    # 学习数据
    pointsEarned = db.Column(db.Integer, default=0, nullable=False)
    difficultyBefore = db.Column(db.Integer, default=0)  # 学习前掌握度
    difficultyAfter = db.Column(db.Integer, default=0)   # 学习后掌握度

    # 时间戳
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # 关联关系
    vocabulary = db.relationship('Vocabulary', backref='learningRecords')

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'sessionId': self.sessionId,
            'userId': self.userId,
            'vocabularyId': self.vocabularyId,
            'vocabulary': self.vocabulary.toDict() if self.vocabulary else None,
            'userAnswer': self.userAnswer,
            'correctAnswer': self.correctAnswer,
            'isCorrect': self.isCorrect,
            'responseTime': self.responseTime,
            'pointsEarned': self.pointsEarned,
            'difficultyBefore': self.difficultyBefore,
            'difficultyAfter': self.difficultyAfter,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None
        }

    def __repr__(self) -> str:
        return f'<LearningRecord {self.sessionId}:{self.vocabularyId}>'


class StudyGoal(db.Model):
    """学习目标模型"""
    __tablename__ = 'study_goals'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # 目标设置
    goalType = db.Column(db.String(20), nullable=False)  # daily, weekly, monthly
    targetWords = db.Column(db.Integer, nullable=False)
    targetTime = db.Column(db.Integer)  # 目标学习时间（分钟）

    # 时间范围
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)

    # 进度追踪
    currentWords = db.Column(db.Integer, default=0, nullable=False)
    currentTime = db.Column(db.Integer, default=0, nullable=False)  # 已学习时间（分钟）

    # 状态
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    isCompleted = db.Column(db.Boolean, default=False, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def updateProgress(self, wordsAdded: int = 0, timeAdded: int = 0) -> None:
        """更新学习进度"""
        self.currentWords += wordsAdded
        self.currentTime += timeAdded
        self.updatedAt = datetime.utcnow()

        # 检查是否完成目标
        if (self.targetWords > 0 and self.currentWords >= self.targetWords) or \
           (self.targetTime > 0 and self.currentTime >= self.targetTime):
            self.isCompleted = True

    def getProgressPercentage(self) -> float:
        """获取完成百分比"""
        if self.targetWords > 0:
            return min(100.0, (self.currentWords / self.targetWords) * 100)
        elif self.targetTime > 0:
            return min(100.0, (self.currentTime / self.targetTime) * 100)
        return 0.0

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'userId': self.userId,
            'goalType': self.goalType,
            'targetWords': self.targetWords,
            'targetTime': self.targetTime,
            'startDate': self.startDate.isoformat() if self.startDate else None,
            'endDate': self.endDate.isoformat() if self.endDate else None,
            'currentWords': self.currentWords,
            'currentTime': self.currentTime,
            'progressPercentage': self.getProgressPercentage(),
            'isActive': self.isActive,
            'isCompleted': self.isCompleted,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None
        }

    def __repr__(self) -> str:
        return f'<StudyGoal {self.userId}:{self.goalType}>'