"""
用户数据模型
包含用户基本信息、认证数据和学习偏好设置
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional, Dict, Any
import json

db = SQLAlchemy()


class User(db.Model):
    """用户模型"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    passwordHash = db.Column(db.String(255), nullable=False)
    isActive = db.Column(db.Boolean, default=True, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    lastLoginAt = db.Column(db.DateTime)

    # 用户偏好设置（JSON格式存储）
    preferences = db.Column(db.Text, default='{}')

    # 关联关系
    vocabularies = db.relationship('UserVocabulary', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    learningSessions = db.relationship('LearningSession', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    achievements = db.relationship('UserAchievement', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def __init__(self, email: str, username: str, password: str):
        """初始化用户"""
        self.email = email.lower()
        self.username = username
        self.setPassword(password)

    def setPassword(self, password: str) -> None:
        """设置密码哈希"""
        self.passwordHash = generate_password_hash(password)

    def checkPassword(self, password: str) -> bool:
        """验证密码"""
        return check_password_hash(self.passwordHash, password)

    def getPreferences(self) -> Dict[str, Any]:
        """获取用户偏好设置"""
        if not self.preferences:
            return {}
        return json.loads(self.preferences)

    def setPreferences(self, preferences: Dict[str, Any]) -> None:
        """设置用户偏好"""
        self.preferences = json.dumps(preferences)
        self.updatedAt = datetime.utcnow()

    def updateLastLogin(self) -> None:
        """更新最后登录时间"""
        self.lastLoginAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'isActive': self.isActive,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,
            'updatedAt': self.updatedAt.isoformat() if self.updatedAt else None,
            'lastLoginAt': self.lastLoginAt.isoformat() if self.lastLoginAt else None,
            'preferences': self.getPreferences()
        }

    def __repr__(self) -> str:
        return f'<User {self.username}>'


class UserAchievement(db.Model):
    """用户成就模型"""
    __tablename__ = 'user_achievements'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    achievementType = db.Column(db.String(50), nullable=False)  # 成就类型
    achievementValue = db.Column(db.Integer, nullable=False)    # 成就数值
    unlockedAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def toDict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'id': self.id,
            'achievementType': self.achievementType,
            'achievementValue': self.achievementValue,
            'unlockedAt': self.unlockedAt.isoformat() if self.unlockedAt else None
        }

    def __repr__(self) -> str:
        return f'<UserAchievement {self.userId}:{self.achievementType}>'