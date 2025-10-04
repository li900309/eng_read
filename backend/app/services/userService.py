from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from flask import current_app
from werkzeug.security import check_password_hash
from app.models.user import User, UserAchievement
from app.models.vocabulary import UserVocabulary
from app.models.learning import LearningSession
from app.extensions import db, cache
from app.utils.auth import generateTokens, validatePassword
from app.utils.validators import validateEmail, validateUsername


class UserService:
    """用户服务类 - 处理用户相关的业务逻辑"""

    @staticmethod
    def createUser(userData: Dict[str, Any]) -> Dict[str, Any]:
        """创建新用户"""
        try:
            # 验证邮箱格式
            if not validateEmail(userData.get('email', '')):
                return {
                    'success': False,
                    'message': 'Invalid email format',
                    'code': 'INVALID_EMAIL'
                }

            # 验证用户名
            if not validateUsername(userData.get('username', '')):
                return {
                    'success': False,
                    'message': 'Invalid username format',
                    'code': 'INVALID_USERNAME'
                }

            # 验证密码强度
            passwordValidation = validatePassword(userData.get('password', ''))
            if not passwordValidation['valid']:
                return {
                    'success': False,
                    'message': passwordValidation['message'],
                    'code': 'WEAK_PASSWORD'
                }

            # 检查邮箱是否已存在
            if User.query.filter_by(email=userData['email']).first():
                return {
                    'success': False,
                    'message': 'Email already exists',
                    'code': 'EMAIL_EXISTS'
                }

            # 检查用户名是否已存在
            if User.query.filter_by(username=userData['username']).first():
                return {
                    'success': False,
                    'message': 'Username already exists',
                    'code': 'USERNAME_EXISTS'
                }

            # 创建用户
            user = User(
                email=userData['email'],
                username=userData['username'],
                passwordHash=userData['password'],
                nativeLanguage=userData.get('nativeLanguage', 'zh'),
                targetLanguage=userData.get('targetLanguage', 'en'),
                timezone=userData.get('timezone', 'UTC')
            )

            db.session.add(user)
            db.session.commit()

            return {
                'success': True,
                'message': 'User created successfully',
                'data': user.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating user: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to create user',
                'code': 'CREATION_ERROR'
            }

    @staticmethod
    def authenticateUser(email: str, password: str, rememberMe: bool = False) -> Dict[str, Any]:
        """用户认证"""
        try:
            # 查找用户
            user = User.query.filter_by(email=email).first()

            if not user or not user.checkPassword(password):
                return {
                    'success': False,
                    'message': 'Invalid email or password',
                    'code': 'INVALID_CREDENTIALS'
                }

            if not user.isActive:
                return {
                    'success': False,
                    'message': 'Account is deactivated',
                    'code': 'ACCOUNT_DEACTIVATED'
                }

            # 更新最后登录时间
            user.lastLoginAt = datetime.utcnow()
            user.loginCount = (user.loginCount or 0) + 1
            db.session.commit()

            # 生成令牌
            tokens = generateTokens(user.id, rememberMe)

            return {
                'success': True,
                'message': 'Authentication successful',
                'data': {
                    'user': user.toDict(),
                    'tokens': tokens
                }
            }

        except Exception as e:
            current_app.logger.error(f"Error during authentication: {str(e)}")
            return {
                'success': False,
                'message': 'Authentication failed',
                'code': 'AUTH_ERROR'
            }

    @staticmethod
    def getUserById(userId: int) -> Optional[User]:
        """根据ID获取用户"""
        try:
            user = User.query.get(userId)
            return user
        except Exception as e:
            current_app.logger.error(f"Error getting user by ID: {str(e)}")
            return None

    @staticmethod
    def getUserByEmail(email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        try:
            user = User.query.filter_by(email=email).first()
            return user
        except Exception as e:
            current_app.logger.error(f"Error getting user by email: {str(e)}")
            return None

    @staticmethod
    def updateUserProfile(userId: int, updateData: Dict[str, Any]) -> Dict[str, Any]:
        """更新用户资料"""
        try:
            user = User.query.get(userId)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found',
                    'code': 'USER_NOT_FOUND'
                }

            # 更新允许的字段
            updatableFields = [
                'username', 'nativeLanguage', 'targetLanguage',
                'timezone', 'dailyGoal', 'preferences'
            ]

            for field in updatableFields:
                if field in updateData:
                    setattr(user, field, updateData[field])

            # 特殊处理邮箱
            if 'email' in updateData and updateData['email'] != user.email:
                if not validateEmail(updateData['email']):
                    return {
                        'success': False,
                        'message': 'Invalid email format',
                        'code': 'INVALID_EMAIL'
                    }

                # 检查邮箱是否已存在
                existingUser = User.query.filter_by(email=updateData['email']).first()
                if existingUser:
                    return {
                        'success': False,
                        'message': 'Email already exists',
                        'code': 'EMAIL_EXISTS'
                    }

                user.email = updateData['email']

            user.updatedAt = datetime.utcnow()
            db.session.commit()

            # 清除缓存
            cache.delete(f'user_profile_{userId}')

            return {
                'success': True,
                'message': 'Profile updated successfully',
                'data': user.toDict()
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error updating user profile: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to update profile',
                'code': 'UPDATE_ERROR'
            }

    @staticmethod
    def changePassword(userId: int, currentPassword: str, newPassword: str) -> Dict[str, Any]:
        """修改密码"""
        try:
            user = User.query.get(userId)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found',
                    'code': 'USER_NOT_FOUND'
                }

            # 验证当前密码
            if not user.checkPassword(currentPassword):
                return {
                    'success': False,
                    'message': 'Current password is incorrect',
                    'code': 'INVALID_CURRENT_PASSWORD'
                }

            # 验证新密码强度
            passwordValidation = validatePassword(newPassword)
            if not passwordValidation['valid']:
                return {
                    'success': False,
                    'message': passwordValidation['message'],
                    'code': 'WEAK_PASSWORD'
                }

            # 更新密码
            user.setPassword(newPassword)
            user.updatedAt = datetime.utcnow()
            db.session.commit()

            return {
                'success': True,
                'message': 'Password changed successfully'
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error changing password: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to change password',
                'code': 'CHANGE_PASSWORD_ERROR'
            }

    @staticmethod
    def deactivateUser(userId: int) -> Dict[str, Any]:
        """停用用户"""
        try:
            user = User.query.get(userId)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found',
                    'code': 'USER_NOT_FOUND'
                }

            user.isActive = False
            user.updatedAt = datetime.utcnow()
            db.session.commit()

            # 清除所有用户相关缓存
            cache.delete(f'user_profile_{userId}')
            cache.delete(f'user_stats_{userId}')

            return {
                'success': True,
                'message': 'Account deactivated successfully'
            }

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error deactivating user: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to deactivate account',
                'code': 'DEACTIVATION_ERROR'
            }

    @staticmethod
    def getUserStatistics(userId: int) -> Dict[str, Any]:
        """获取用户统计数据"""
        try:
            # 使用缓存获取统计信息
            cacheKey = f'user_stats_{userId}'
            stats = cache.get(cacheKey)

            if stats:
                return {
                    'success': True,
                    'data': stats
                }

            user = User.query.get(userId)
            if not user:
                return {
                    'success': False,
                    'message': 'User not found',
                    'code': 'USER_NOT_FOUND'
                }

            # 计算统计数据
            totalWords = UserVocabulary.query.filter_by(userId=userId).count()
            masteredWords = UserVocabulary.query.filter_by(
                userId=userId,
                masteryLevel=5
            ).count()

            # 今日学习数据
            today = datetime.utcnow().date()
            todaySessions = LearningSession.query.filter(
                LearningSession.userId == userId,
                LearningSession.createdAt >= today,
                LearningSession.status == 'completed'
            ).count()

            todayWords = LearningSession.query.filter(
                LearningSession.userId == userId,
                LearningSession.createdAt >= today,
                LearningSession.status == 'completed'
            ).with_entities(LearningSession.wordsStudied).all()

            todayWordsStudied = sum(session[0] for session in todayWords) if todayWords else 0

            # 连续学习天数
            consecutiveDays = user.calculateConsecutiveDays()

            stats = {
                'totalWords': totalWords,
                'masteredWords': masteredWords,
                'learningProgress': round((masteredWords / totalWords * 100) if totalWords > 0 else 0, 2),
                'todaySessions': todaySessions,
                'todayWordsStudied': todayWordsStudied,
                'consecutiveDays': consecutiveDays,
                'totalSessions': user.loginCount or 0,
                'averageAccuracy': user.calculateAverageAccuracy(),
                'studyStreak': user.calculateStudyStreak()
            }

            # 缓存统计信息（10分钟）
            cache.set(cacheKey, stats, timeout=600)

            return {
                'success': True,
                'data': stats
            }

        except Exception as e:
            current_app.logger.error(f"Error getting user statistics: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to get user statistics',
                'code': 'STATS_ERROR'
            }

    @staticmethod
    def updateLastActivity(userId: int) -> None:
        """更新用户最后活动时间"""
        try:
            user = User.query.get(userId)
            if user:
                user.lastActivityAt = datetime.utcnow()
                db.session.commit()
        except Exception as e:
            current_app.logger.error(f"Error updating last activity: {str(e)}")

    @staticmethod
    def getActiveUsersCount() -> int:
        """获取活跃用户数量"""
        try:
            thirtyDaysAgo = datetime.utcnow() - timedelta(days=30)
            return User.query.filter(
                User.lastActivityAt >= thirtyDaysAgo,
                User.isActive == True
            ).count()
        except Exception as e:
            current_app.logger.error(f"Error getting active users count: {str(e)}")
            return 0