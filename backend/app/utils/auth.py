"""
认证相关工具函数
提供JWT令牌处理、密码验证等认证功能
"""

from datetime import datetime, timedelta
from functools import wraps
from typing import Optional, Dict, Any

from flask import current_app, request, jsonify
from flask_jwt_extended import (
    createAccessToken, createRefreshToken, getJwtIdentity,
    getJwt, verifyJwtInRequest
)
from werkzeug.security import check_password_hash

from app.extensions import getJWT


def generateTokens(userId: int, rememberMe: bool = False) -> Dict[str, Any]:
    """生成JWT访问令牌和刷新令牌"""
    now = datetime.utcnow()

    # 根据记住我选项设置过期时间
    if rememberMe:
        accessTokenExpires = timedelta(days=7)
        refreshTokenExpires = timedelta(days=30)
    else:
        accessTokenExpires = current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        refreshTokenExpires = current_app.config['JWT_REFRESH_TOKEN_EXPIRES']

    additionalClaims = {
        'role': 'user',
        'type': 'access'
    }

    accessToken = createAccessToken(
        identity=userId,
        additionalClaims=additionalClaims,
        expiresDelta=accessTokenExpires
    )

    refreshToken = createRefreshToken(
        identity=userId,
        expiresDelta=refreshTokenExpires
    )

    return {
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'tokenType': 'Bearer',
        'expiresIn': int(accessTokenExpires.total_seconds()),
        'issuedAt': now.isoformat()
    }


def validatePassword(user, password: str) -> bool:
    """验证用户密码"""
    if not user or not user.passwordHash:
        return False
    return check_password_hash(user.passwordHash, password)


def getCurrentUserId() -> Optional[int]:
    """获取当前用户ID"""
    try:
        return getJwtIdentity()
    except Exception:
        return None


def getCurrentUser() -> Optional[Any]:
    """获取当前用户对象"""
    from app.models.user import User
    userId = getCurrentUserId()
    if userId:
        return User.query.get(userId)
    return None


def requireAuth(f):
    """认证装饰器，要求用户已登录"""
    @wraps(f)
    def decoratedFunction(*args, **kwargs):
        try:
            verifyJwtInRequest()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'AUTHENTICATION_REQUIRED',
                    'message': '需要登录才能访问此资源'
                }
            }), 401

    return decoratedFunction


def requireFreshAuth(f):
    """新鲜认证装饰器，要求新鲜的JWT令牌"""
    @wraps(f)
    def decoratedFunction(*args, **kwargs):
        try:
            verifyJwtInRequest(fresh=True)
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'FRESH_AUTHENTICATION_REQUIRED',
                    'message': '需要重新登录验证身份'
                }
            }), 401

    return decoratedFunction


def revokeToken(jti: str) -> bool:
    """撤销JWT令牌"""
    try:
        # 这里可以将jti添加到Redis黑名单中
        # 或者使用数据库存储撤销的令牌
        cache = current_app.extensions.get('cache')
        if cache:
            cache.set(f'revoked_token:{jti}', 'true', timeout=3600 * 24)  # 24小时
        return True
    except Exception:
        return False


def isTokenRevoked(jwtPayload: Dict[str, Any]) -> bool:
    """检查JWT令牌是否已被撤销"""
    try:
        cache = current_app.extensions.get('cache')
        if cache:
            jti = jwtPayload.get('jti')
            if jti:
                return cache.get(f'revoked_token:{jti}') is not None
        return False
    except Exception:
        return False


def refreshTokenIfExpiringSoon(accessToken: str, refreshToken: str) -> Optional[Dict[str, Any]]:
    """如果访问令牌即将过期，刷新令牌"""
    try:
        # 解码当前令牌检查过期时间
        jwtManager = getJWT()
        decodedToken = jwtManager._decode_jwt_from_config(accessToken)

        exp = decodedToken.get('exp')
        if not exp:
            return None

        expirationTime = datetime.fromtimestamp(exp)
        now = datetime.utcnow()
        timeUntilExpiry = expirationTime - now

        # 如果令牌在30分钟内过期，则刷新
        if timeUntilExpiry.total_seconds() < 1800:  # 30分钟
            userId = decodedToken.get('sub')
            if userId:
                return generateTokens(userId, rememberMe=True)

        return None
    except Exception:
        return None


def hashPassword(password: str) -> str:
    """生成密码哈希"""
    from werkzeug.security import generate_password_hash
    return generate_password_hash(password)


def validatePasswordStrength(password: str) -> Dict[str, Any]:
    """验证密码强度"""
    result = {
        'isValid': True,
        'errors': [],
        'score': 0
    }

    # 长度检查
    if len(password) < 8:
        result['isValid'] = False
        result['errors'].append('密码长度至少需要8个字符')
    else:
        result['score'] += 1

    # 包含大写字母
    if not any(c.isupper() for c in password):
        result['errors'].append('建议包含大写字母')
    else:
        result['score'] += 1

    # 包含小写字母
    if not any(c.islower() for c in password):
        result['errors'].append('建议包含小写字母')
    else:
        result['score'] += 1

    # 包含数字
    if not any(c.isdigit() for c in password):
        result['errors'].append('建议包含数字')
    else:
        result['score'] += 1

    # 包含特殊字符
    specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    if not any(c in specialChars for c in password):
        result['errors'].append('建议包含特殊字符')
    else:
        result['score'] += 1

    # 计算强度等级
    if result['score'] >= 4:
        result['strength'] = 'strong'
    elif result['score'] >= 3:
        result['strength'] = 'medium'
    else:
        result['strength'] = 'weak'

    return result