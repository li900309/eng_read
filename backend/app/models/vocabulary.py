"""
词汇数据模型
包含词汇基本信息、分类和用户学习进度
"""

from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from typing import Optional, Dict, Any, List
import json

db = SQLAlchemy()


class VocabularyCategory(db.Model):
    """词汇分类模型"""
    __tablename__ = 'vocabulary_categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    color = db.Column(db.String(7), default='#007bff')  # 十六进制颜色代码
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # 关联关系
    vocabularies = db.relationship('Vocabulary', backref='category', lazy='dynamic')

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None
        }

    def __repr__(self) -> str:
        return f'<VocabularyCategory {self.name}>'


class Vocabulary(db.Model):
    """词汇模型"""
    __tablename__ = 'vocabularies'

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), nullable=False, index=True)
    pronunciation = db.Column(db.String(200))  # 音标
    definition = db.Column(db.Text, nullable=False)
    translation = db.Column(db.Text, nullable=False)
    example = db.Column(db.Text)
    exampleTranslation = db.Column(db.Text)

    # 词汇属性
    difficulty = db.Column(db.Integer, default=1, nullable=False)  # 1-5难度等级
    frequency = db.Column(db.Integer, default=1)  # 词频等级
    partOfSpeech = db.Column(db.String(20))  # 词性

    # 分类和状态
    categoryId = db.Column(db.Integer, db.ForeignKey('vocabulary_categories.id'))
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 关联关系
    userVocabularies = db.relationship('UserVocabulary', backref='vocabulary', lazy='dynamic', cascade='all, delete-orphan')

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'word': self.word,
            'pronunciation': self.pronunciation,
            'definition': self.definition,
            'translation': self.translation,
            'example': self.example,
            'exampleTranslation': self.exampleTranslation,
            'difficulty': self.difficulty,
            'frequency': self.frequency,
            'partOfSpeech': self.partOfSpeech,
            'categoryId': self.categoryId,
            'category': self.category.toDict() if self.category else None,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None
        }

    def __repr__(self) -> str:
        return f'<Vocabulary {self.word}>'


class UserVocabulary(db.Model):
    """用户词汇学习进度模型"""
    __tablename__ = 'user_vocabularies'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vocabularyId = db.Column(db.Integer, db.ForeignKey('vocabularies.id'), nullable=False)

    # 学习进度
    masteryLevel = db.Column(db.Integer, default=0, nullable=False)  # 0-5掌握等级
    reviewCount = db.Column(db.Integer, default=0, nullable=False)
    correctCount = db.Column(db.Integer, default=0, nullable=False)
    consecutiveCorrect = db.Column(db.Integer, default=0, nullable=False)

    # 时间管理
    nextReview = db.Column(db.DateTime, nullable=False)
    lastReview = db.Column(db.DateTime)
    firstReviewedAt = db.Column(db.DateTime)

    # 状态标记
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    isFavorite = db.Column(db.Boolean, default=False, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 唯一约束
    __table_args__ = (
        db.UniqueConstraint('userId', 'vocabularyId', name='unique_user_vocabulary'),
        db.Index('idx_user_next_review', 'userId', 'nextReview'),
        db.Index('idx_user_mastery', 'userId', 'masteryLevel'),
    )

    def calculateAccuracy(self) -> float:
        """计算正确率"""
        if self.reviewCount == 0:
            return 0.0
        return self.correctCount / self.reviewCount

    def calculateDifficultyScore(self) -> float:
        """计算难度评分"""
        if self.reviewCount == 0:
            return 1.0

        accuracy = self.calculateAccuracy()
        masteryFactor = self.masteryLevel / 5.0
        timeFactor = self._calculateTimeFactor()

        score = accuracy * 0.4 + masteryFactor * 0.3 + timeFactor * 0.3
        return max(0.0, min(1.0, score))

    def _calculateTimeFactor(self) -> float:
        """计算时间因子"""
        if not self.lastReview:
            return 1.0

        daysSinceReview = (datetime.utcnow() - self.lastReview).days
        # 超期未复习的词汇时间因子降低
        if daysSinceReview > 7:
            return max(0.2, 1.0 - (daysSinceReview - 7) * 0.1)
        return 1.0

    def updateReview(self, isCorrect: bool) -> None:
        """更新复习记录"""
        now = datetime.utcnow()
        self.reviewCount += 1
        self.lastReview = now
        self.updatedAt = now

        if isCorrect:
            self.correctCount += 1
            self.consecutiveCorrect += 1
            # 连续答对提升掌握等级
            if self.consecutiveCorrect >= 3 and self.masteryLevel < 5:
                self.masteryLevel += 1
                self.consecutiveCorrect = 0
        else:
            self.consecutiveCorrect = 0
            # 答错降低掌握等级
            if self.masteryLevel > 0:
                self.masteryLevel = max(0, self.masteryLevel - 1)

        # 设置首次复习时间
        if not self.firstReviewedAt:
            self.firstReviewedAt = now

        # 计算下次复习时间
        self.nextReview = self._calculateNextReview()

    def _calculateNextReview(self) -> datetime:
        """计算下次复习时间（间隔重复算法）"""
        intervals = {
            0: 1,    # 新词汇：1小时后
            1: 6,    # 掌握度1：6小时后
            2: 24,   # 掌握度2：1天后
            3: 72,   # 掌握度3：3天后
            4: 168,  # 掌握度4：7天后
            5: 336   # 掌握度5：14天后
        }

        # 根据连续答对次数调整间隔
        baseInterval = intervals.get(self.masteryLevel, 24)
        multiplier = min(2.0, 1.0 + self.consecutiveCorrect * 0.2)

        intervalHours = int(baseInterval * multiplier)
        return datetime.utcnow() + timedelta(hours=intervalHours)

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'userId': self.userId,
            'vocabularyId': self.vocabularyId,
            'vocabulary': self.vocabulary.toDict() if self.vocabulary else None,
            'masteryLevel': self.masteryLevel,
            'reviewCount': self.reviewCount,
            'correctCount': self.correctCount,
            'consecutiveCorrect': self.consecutiveCorrect,
            'accuracy': self.calculateAccuracy(),
            'difficultyScore': self.calculateDifficultyScore(),
            'nextReview': self.nextReview.isoformat() if self.nextReview else None,
            'lastReview': self.lastReview.isoformat() if self.lastReview else None,
            'firstReviewedAt': self.firstReviewedAt.isoformat() if self.firstReviewedAt else None,
            'isActive': self.isActive,
            'isFavorite': self.isFavorite,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None
        }

    def __repr__(self) -> str:
        return f'<UserVocabulary {self.userId}:{self.vocabularyId}>'