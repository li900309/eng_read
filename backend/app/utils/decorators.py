"""
装饰器工具函数
提供各种常用的装饰器功能
"""

import time
import logging
from functools import wraps
from typing import Any, Dict, List, Optional, Callable

from flask import request, jsonify, g
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.utils.auth import getCurrentUser


logger = logging.getLogger(__name__)


def logExecutionTime(func):
    """记录函数执行时间的装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        startTime = time.time()
        try:
            result = func(*args, **kwargs)
            executionTime = time.time() - startTime
            logger.info(f'{func.__name__} executed in {executionTime:.4f}s')
            return result
        except Exception as e:
            executionTime = time.time() - startTime
            logger.error(f'{func.__name__} failed after {executionTime:.4f}s: {str(e)}')
            raise
    return wrapper


def requireJson(func):
    """要求请求为JSON格式的装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not request.is_json:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_CONTENT_TYPE',
                    'message': '请求必须是JSON格式'
                }
            }), 400

        try:
            request.get_json()
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_JSON',
                    'message': '无效的JSON格式'
                }
            }), 400

        return func(*args, **kwargs)
    return wrapper


def rateLimit(maxCalls: int, timeWindow: int, keyFunc: Callable = None):
    """自定义限流装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 这里可以实现自定义的限流逻辑
            # 使用Redis或内存存储来跟踪调用次数
            return func(*args, **kwargs)
        return wrapper
    return decorator


def cacheResponse(timeout: int = 300, keyFunc: Callable = None):
    """缓存响应的装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            from flask import current_app
            cache = current_app.extensions.get('cache')

            if not cache:
                return func(*args, **kwargs)

            # 生成缓存键
            if keyFunc:
                cacheKey = keyFunc(request, *args, **kwargs)
            else:
                cacheKey = f'{func.__name__}:{request.url}:{hash(str(request.args))}'

            # 尝试从缓存获取
            cachedResponse = cache.get(cacheKey)
            if cachedResponse:
                return cachedResponse

            # 执行函数并缓存结果
            response = func(*args, **kwargs)
            cache.set(cacheKey, response, timeout=timeout)
            return response
        return wrapper
    return decorator


def validateRequest(schemaClass):
    """请求数据验证装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'INVALID_CONTENT_TYPE',
                        'message': '请求必须是JSON格式'
                    }
                }), 400

            try:
                data = request.get_json()
                schema = schemaClass()
                validatedData = schema.load(data)

                # 将验证后的数据存入请求上下文
                g.validatedData = validatedData

                return func(*args, **kwargs)
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': '数据验证失败',
                        'details': str(e)
                    }
                }), 400
        return wrapper
    return decorator


def handleExceptions(func):
    """统一异常处理装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValueError as e:
            logger.warning(f'ValueError in {func.__name__}: {str(e)}')
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_VALUE',
                    'message': str(e)
                }
            }), 400
        except KeyError as e:
            logger.warning(f'KeyError in {func.__name__}: {str(e)}')
            return jsonify({
                'success': False,
                'error': {
                    'code': 'MISSING_FIELD',
                    'message': f'缺少必需字段: {str(e)}'
                }
            }), 400
        except PermissionError as e:
            logger.warning(f'PermissionError in {func.__name__}: {str(e)}')
            return jsonify({
                'success': False,
                'error': {
                    'code': 'PERMISSION_DENIED',
                    'message': '权限不足'
                }
            }), 403
        except Exception as e:
            logger.error(f'Unexpected error in {func.__name__}: {str(e)}', exc_info=True)
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': '服务器内部错误'
                }
            }), 500
    return wrapper


def setCurrentUser(func):
    """设置当前用户到请求上下文的装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            userId = get_jwt_identity()
            user = getCurrentUser() if userId else None
            g.currentUser = user
            g.currentUserId = userId
        except Exception:
            g.currentUser = None
            g.currentUserId = None

        return func(*args, **kwargs)
    return wrapper


def requireRole(allowedRoles: List[str]):
    """要求特定角色的装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = getattr(g, 'currentUser', None)

            if not user:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'AUTHENTICATION_REQUIRED',
                        'message': '需要登录才能访问此资源'
                    }
                }), 401

            userRole = getattr(user, 'role', 'user')
            if userRole not in allowedRoles:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 'INSUFFICIENT_PERMISSIONS',
                        'message': '权限不足'
                    }
                }), 403

            return func(*args, **kwargs)
        return wrapper
    return decorator


def measurePerformance(func):
    """性能监控装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        startTime = time.time()
        startMemory = None

        try:
            # 尝试获取内存使用情况
            import psutil
            process = psutil.Process()
            startMemory = process.memory_info().rss
        except ImportError:
            pass

        try:
            result = func(*args, **kwargs)

            executionTime = time.time() - startTime
            memoryUsed = None

            if startMemory:
                try:
                    import psutil
                    process = psutil.Process()
                    endMemory = process.memory_info().rss
                    memoryUsed = endMemory - startMemory
                except ImportError:
                    pass

            logger.info(f'Performance {func.__name__}: {executionTime:.4f}s, Memory: {memoryUsed} bytes')
            return result

        except Exception as e:
            executionTime = time.time() - startTime
            logger.error(f'Performance {func.__name__} failed after {executionTime:.4f}s: {str(e)}')
            raise

    return wrapper


def retry(maxRetries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """重试装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            lastException = None
            currentDelay = delay

            for attempt in range(maxRetries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    lastException = e
                    if attempt < maxRetries:
                        logger.warning(f'Retry {func.__name__} (attempt {attempt + 1}/{maxRetries}): {str(e)}')
                        time.sleep(currentDelay)
                        currentDelay *= backoff
                    else:
                        logger.error(f'Failed {func.__name__} after {maxRetries + 1} attempts: {str(e)}')

            raise lastException
        return wrapper
    return decorator


def conditional(condition: bool, decorator: Callable):
    """条件装饰器"""
    if condition:
        return decorator
    else:
        return lambda func: func


def adminRequired(func):
    """要求管理员权限的装饰器"""
    return requireRole(['admin'])(func)


def paginate(defaultPerPage: int = 20, maxPerPage: int = 100):
    """分页装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 获取分页参数
            page = request.args.get('page', 1, type=int)
            perPage = request.args.get('perPage', defaultPerPage, type=int)

            # 验证分页参数
            if page < 1:
                page = 1
            if perPage < 1:
                perPage = defaultPerPage
            if perPage > maxPerPage:
                perPage = maxPerPage

            # 将分页参数存入请求上下文
            g.page = page
            g.perPage = perPage

            return func(*args, **kwargs)
        return wrapper
    return decorator