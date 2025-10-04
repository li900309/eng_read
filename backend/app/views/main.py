from flask import Blueprint, jsonify, current_app
from datetime import datetime
import psutil
import os

# 创建主蓝图
mainBlueprint = Blueprint('main', __name__)


@mainBlueprint.route('/health', methods=['GET'])
def healthCheck():
    """健康检查接口"""
    try:
        # 获取系统信息
        systemInfo = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': os.getenv('APP_VERSION', '1.0.0'),
            'environment': current_app.config.get('ENV', 'development')
        }

        # 检查数据库连接
        try:
            from app.extensions import db
            db.session.execute('SELECT 1')
            systemInfo['database'] = 'connected'
        except Exception as e:
            systemInfo['database'] = f'error: {str(e)}'
            systemInfo['status'] = 'degraded'

        # 检查Redis连接
        try:
            from app.extensions import cache
            cache.set('health_check', 'ok', timeout=10)
            cache.get('health_check')
            systemInfo['cache'] = 'connected'
        except Exception as e:
            systemInfo['cache'] = f'error: {str(e)}'
            systemInfo['status'] = 'degraded'

        # 系统资源信息
        try:
            systemInfo['system'] = {
                'cpu_percent': psutil.cpu_percent(interval=1),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_percent': psutil.disk_usage('/').percent
            }
        except Exception:
            pass  # 系统信息获取失败不影响健康状态

        status_code = 200 if systemInfo['status'] == 'healthy' else 503

        return jsonify(systemInfo), status_code

    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.utcnow().isoformat(),
            'error': str(e)
        }), 503


@mainBlueprint.route('/api', methods=['GET'])
def apiInfo():
    """API信息接口"""
    try:
        apiInfo = {
            'name': 'Eng Read Backend API',
            'version': '1.0.0',
            'description': '英语阅读学习平台后端API服务',
            'documentation': {
                'swagger': '/api/docs' if current_app.config.get('ENABLE_SWAGGER') else None,
                'redoc': '/api/redoc' if current_app.config.get('ENABLE_REDOC') else None
            },
            'endpoints': {
                'authentication': '/api/auth',
                'vocabulary': '/api/vocabulary',
                'learning': '/api/learning',
                'statistics': '/api/statistics'
            },
            'health_check': '/health',
            'timestamp': datetime.utcnow().isoformat()
        }

        return jsonify({
            'success': True,
            'data': apiInfo
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get API information',
            'error': str(e)
        }), 500


@mainBlueprint.route('/', methods=['GET'])
def index():
    """根路径接口"""
    return jsonify({
        'success': True,
        'message': 'Welcome to Eng Read Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'api_info': '/api',
            'auth': '/api/auth',
            'vocabulary': '/api/vocabulary',
            'learning': '/api/learning',
            'statistics': '/api/statistics'
        }
    }), 200


@mainBlueprint.route('/robots.txt', methods=['GET'])
def robots():
    """Robots.txt"""
    robots_content = """User-agent: *
Disallow: /api/
Disallow: /admin/

Allow: /health
Allow: /api
"""
    return robots_content, 200, {'Content-Type': 'text/plain'}


@mainBlueprint.route('/favicon.ico', methods=['GET'])
def favicon():
    """Favicon"""
    return '', 204


@mainBlueprint.app_errorhandler(404)
def notFound(error):
    """404错误处理"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found',
        'code': 'NOT_FOUND',
        'path': request.path if hasattr(request, 'path') else None
    }), 404


@mainBlueprint.app_errorhandler(405)
def methodNotAllowed(error):
    """405错误处理"""
    return jsonify({
        'success': False,
        'message': 'Method not allowed',
        'code': 'METHOD_NOT_ALLOWED',
        'path': request.path if hasattr(request, 'path') else None,
        'method': request.method if hasattr(request, 'method') else None
    }), 405


@mainBlueprint.app_errorhandler(429)
def rateLimitExceeded(error):
    """429错误处理"""
    return jsonify({
        'success': False,
        'message': 'Rate limit exceeded',
        'code': 'RATE_LIMIT_EXCEEDED',
        'retry_after': getattr(error, 'retry_after', None)
    }), 429


@mainBlueprint.app_errorhandler(500)
def internalServerError(error):
    """500错误处理"""
    current_app.logger.error(f"Internal server error: {str(error)}")

    return jsonify({
        'success': False,
        'message': 'Internal server error',
        'code': 'INTERNAL_SERVER_ERROR'
    }), 500


# 需要导入request对象
from flask import request