from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, get_jwt
)
from app.services.userService import UserService
from app.utils.validators import validateEmail, validatePassword
from app.extensions import jwt
from datetime import datetime

# 创建认证蓝图
authBlueprint = Blueprint('auth', __name__, url_prefix='/api/auth')


@jwt.token_in_blocklist_loader
def checkIfTokenIsRevoked(jwtHeader, jwtPayload):
    """检查令牌是否被撤销"""
    return validateToken(jwtPayload['jti'])


@jwt.expired_token_loader
def expiredTokenCallback(jwtHeader, jwtPayload):
    """令牌过期回调"""
    return jsonify({
        'success': False,
        'message': 'Token has expired',
        'code': 'TOKEN_EXPIRED'
    }), 401


@jwt.invalid_token_loader
def invalidTokenCallback(error):
    """无效令牌回调"""
    return jsonify({
        'success': False,
        'message': 'Invalid token',
        'code': 'INVALID_TOKEN'
    }), 401


@jwt.unauthorized_loader
def missingTokenCallback(error):
    """缺少令牌回调"""
    return jsonify({
        'success': False,
        'message': 'Authorization token is required',
        'code': 'MISSING_TOKEN'
    }), 401


@jwt.needs_fresh_token_loader
def tokenNotFreshCallback(jwtHeader, jwtPayload):
    """令牌不新鲜回调"""
    return jsonify({
        'success': False,
        'message': 'Fresh token required',
        'code': 'FRESH_TOKEN_REQUIRED'
    }), 401


@jwt.revoked_token_loader
def revokedTokenCallback(jwtHeader, jwtPayload):
    """令牌已撤销回调"""
    return jsonify({
        'success': False,
        'message': 'Token has been revoked',
        'code': 'TOKEN_REVOKED'
    }), 401


@authBlueprint.route('/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()

        # 验证必需字段
        requiredFields = ['email', 'username', 'password']
        for field in requiredFields:
            if not data or not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}',
                    'code': 'MISSING_FIELD'
                }), 400

        # 验证数据格式
        if not validateEmail(data['email']):
            return jsonify({
                'success': False,
                'message': 'Invalid email format',
                'code': 'INVALID_EMAIL'
            }), 400

        passwordValidation = validatePassword(data['password'])
        if not passwordValidation['valid']:
            return jsonify({
                'success': False,
                'message': passwordValidation['message'],
                'code': 'WEAK_PASSWORD'
            }), 400

        # 创建用户
        result = UserService.createUser(data)

        if result['success']:
            return jsonify(result), 201
        else:
            statusCode = 400
            if result['code'] in ['EMAIL_EXISTS', 'USERNAME_EXISTS']:
                statusCode = 409
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Registration failed',
            'code': 'REGISTRATION_ERROR'
        }), 500


@authBlueprint.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()

        # 验证必需字段
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email and password are required',
                'code': 'MISSING_CREDENTIALS'
            }), 400

        # 验证数据格式
        if not validateEmail(data['email']):
            return jsonify({
                'success': False,
                'message': 'Invalid email format',
                'code': 'INVALID_EMAIL'
            }), 400

        rememberMe = data.get('rememberMe', False)

        # 用户认证
        result = UserService.authenticateUser(
            data['email'],
            data['password'],
            rememberMe
        )

        if result['success']:
            return jsonify(result), 200
        else:
            statusCode = 401
            if result['code'] == 'ACCOUNT_DEACTIVATED':
                statusCode = 403
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Login failed',
            'code': 'LOGIN_ERROR'
        }), 500


@authBlueprint.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refreshToken():
    """刷新访问令牌"""
    try:
        currentUserId = get_jwt_identity()
        user = UserService.getUserById(currentUserId)

        if not user or not user.isActive:
            return jsonify({
                'success': False,
                'message': 'User not found or inactive',
                'code': 'USER_INACTIVE'
            }), 404

        # 创建新的访问令牌
        additionalClaims = {
            'role': user.role,
            'email': user.email
        }

        newAccessToken = create_access_token(
            identity=currentUserId,
            additional_claims=additionalClaims,
            fresh=False
        )

        return jsonify({
            'success': True,
            'message': 'Token refreshed successfully',
            'data': {
                'accessToken': newAccessToken
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Token refresh error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Token refresh failed',
            'code': 'REFRESH_ERROR'
        }), 500


@authBlueprint.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """用户登出"""
    try:
        jti = get_jwt()['jti']
        currentUserId = get_jwt_identity()

        # 将令牌加入黑名单
        from app.utils.auth import revokeToken
        revokeToken(jti, currentUserId)

        # 更新用户最后活动时间
        UserService.updateLastActivity(currentUserId)

        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200

    except Exception as e:
        current_app.logger.error(f"Logout error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Logout failed',
            'code': 'LOGOUT_ERROR'
        }), 500


@authBlueprint.route('/profile', methods=['GET'])
@jwt_required()
def getProfile():
    """获取用户资料"""
    try:
        currentUserId = get_jwt_identity()
        user = UserService.getUserById(currentUserId)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found',
                'code': 'USER_NOT_FOUND'
            }), 404

        # 获取用户统计信息
        statsResult = UserService.getUserStatistics(currentUserId)

        profileData = user.toDict()
        if statsResult['success']:
            profileData['statistics'] = statsResult['data']

        return jsonify({
            'success': True,
            'data': profileData
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get profile error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to get profile',
            'code': 'PROFILE_ERROR'
        }), 500


@authBlueprint.route('/profile', methods=['PUT'])
@jwt_required()
def updateProfile():
    """更新用户资料"""
    try:
        currentUserId = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided',
                'code': 'NO_DATA'
            }), 400

        # 更新用户资料
        result = UserService.updateUserProfile(currentUserId, data)

        if result['success']:
            return jsonify(result), 200
        else:
            statusCode = 400
            if result['code'] in ['EMAIL_EXISTS', 'USER_NOT_FOUND']:
                statusCode = 409 if result['code'] == 'EMAIL_EXISTS' else 404
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Update profile error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to update profile',
            'code': 'UPDATE_PROFILE_ERROR'
        }), 500


@authBlueprint.route('/change-password', methods=['POST'])
@jwt_required()
def changePassword():
    """修改密码"""
    try:
        currentUserId = get_jwt_identity()
        data = request.get_json()

        # 验证必需字段
        requiredFields = ['currentPassword', 'newPassword']
        for field in requiredFields:
            if not data or not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}',
                    'code': 'MISSING_FIELD'
                }), 400

        # 验证新密码强度
        passwordValidation = validatePassword(data['newPassword'])
        if not passwordValidation['valid']:
            return jsonify({
                'success': False,
                'message': passwordValidation['message'],
                'code': 'WEAK_PASSWORD'
            }), 400

        # 修改密码
        result = UserService.changePassword(
            currentUserId,
            data['currentPassword'],
            data['newPassword']
        )

        if result['success']:
            return jsonify(result), 200
        else:
            statusCode = 400
            if result['code'] == 'INVALID_CURRENT_PASSWORD':
                statusCode = 401
            return jsonify(result), statusCode

    except Exception as e:
        current_app.logger.error(f"Change password error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to change password',
            'code': 'CHANGE_PASSWORD_ERROR'
        }), 500


@authBlueprint.route('/deactivate', methods=['POST'])
@jwt_required()
def deactivateAccount():
    """停用账户"""
    try:
        currentUserId = get_jwt_identity()
        data = request.get_json()

        # 验证密码确认
        if not data or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Password confirmation is required',
                'code': 'PASSWORD_REQUIRED'
            }), 400

        # 验证密码
        user = UserService.getUserById(currentUserId)
        if not user or not user.checkPassword(data['password']):
            return jsonify({
                'success': False,
                'message': 'Invalid password',
                'code': 'INVALID_PASSWORD'
            }), 401

        # 停用账户
        result = UserService.deactivateUser(currentUserId)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        current_app.logger.error(f"Deactivate account error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to deactivate account',
            'code': 'DEACTIVATE_ERROR'
        }), 500


@authBlueprint.route('/verify-token', methods=['POST'])
@jwt_required()
def verifyToken():
    """验证令牌有效性"""
    try:
        currentUserId = get_jwt_identity()
        user = UserService.getUserById(currentUserId)

        if not user or not user.isActive:
            return jsonify({
                'success': False,
                'message': 'Invalid token or user inactive',
                'code': 'INVALID_TOKEN'
            }), 401

        return jsonify({
            'success': True,
            'message': 'Token is valid',
            'data': {
                'userId': user.id,
                'email': user.email,
                'role': user.role
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Token verification error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Token verification failed',
            'code': 'VERIFICATION_ERROR'
        }), 500