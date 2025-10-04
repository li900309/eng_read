"""
Flask应用工厂模块

本模块使用应用工厂模式创建和配置Flask应用实例。
"""

import os
import logging
from datetime import datetime
from flask import Flask, jsonify, request, g
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from app.config import getConfig
from app.extensions import (
    db, migrate, jwt, cors, cache, limiter, ma,
    initExtensions
)
from app.views import (
    authBlueprint,
    vocabularyBlueprint,
    learningBlueprint,
    statisticsBlueprint,
    llmBlueprint
)
from app.views.main import mainBlueprint


def createApp(configName: str = None) -> Flask:
    """创建Flask应用实例"""
    # 创建Flask应用
    app = Flask(__name__)

    # 加载配置
    config = getConfig(configName)
    app.config.from_object(config)

    # 初始化扩展
    initExtensions(app)

    # 配置应用
    configureApp(app)

    # 注册蓝图
    registerBlueprints(app)

    # 注册错误处理器
    registerErrorHandlers(app)

    # 注册上下文处理器
    registerContextProcessors(app)

    # 配置日志
    configureLogging(app)

    return app


def configureApp(app: Flask):
    """配置Flask应用"""
    # 设置JSON编码
    app.json.ensure_ascii = False

    # 设置请求钩子
    @app.before_request
    def beforeRequest():
        """请求前处理"""
        g.startTime = datetime.utcnow()

        # 记录请求信息
        app.logger.info(f"Request: {request.method} {request.path} from {request.remote_addr}")

    @app.after_request
    def afterRequest(response):
        """请求后处理"""
        # 记录响应信息
        if hasattr(g, 'startTime'):
            duration = (datetime.utcnow() - g.startTime).total_seconds()
            app.logger.info(f"Response: {response.status_code} in {duration:.3f}s")

        # 添加安全头
        if not response.headers.get('X-Content-Type-Options'):
            response.headers['X-Content-Type-Options'] = 'nosniff'
        if not response.headers.get('X-Frame-Options'):
            response.headers['X-Frame-Options'] = 'DENY'
        if not response.headers.get('X-XSS-Protection'):
            response.headers['X-XSS-Protection'] = '1; mode=block'

        return response


def registerBlueprints(app: Flask):
    """注册蓝图"""
    # 注册主蓝图
    app.register_blueprint(mainBlueprint)

    # 注册API蓝图
    app.register_blueprint(authBlueprint)
    app.register_blueprint(vocabularyBlueprint)
    app.register_blueprint(learningBlueprint)
    app.register_blueprint(statisticsBlueprint)
    app.register_blueprint(llmBlueprint)

    app.logger.info("All blueprints registered successfully")


def registerErrorHandlers(app: Flask):
    """注册错误处理器"""

    @app.errorhandler(400)
    def badRequest(error):
        """400错误处理"""
        return jsonify({
            'success': False,
            'message': 'Bad request',
            'code': 'BAD_REQUEST'
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        """401错误处理"""
        return jsonify({
            'success': False,
            'message': 'Unauthorized',
            'code': 'UNAUTHORIZED'
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        """403错误处理"""
        return jsonify({
            'success': False,
            'message': 'Forbidden',
            'code': 'FORBIDDEN'
        }), 403

    @app.errorhandler(404)
    def notFound(error):
        """404错误处理"""
        return jsonify({
            'success': False,
            'message': 'Resource not found',
            'code': 'NOT_FOUND'
        }), 404

    @app.errorhandler(405)
    def methodNotAllowed(error):
        """405错误处理"""
        return jsonify({
            'success': False,
            'message': 'Method not allowed',
            'code': 'METHOD_NOT_ALLOWED'
        }), 405

    @app.errorhandler(429)
    def rateLimitExceeded(error):
        """429错误处理"""
        return jsonify({
            'success': False,
            'message': 'Rate limit exceeded',
            'code': 'RATE_LIMIT_EXCEEDED'
        }), 429

    @app.errorhandler(500)
    def internalServerError(error):
        """500错误处理"""
        app.logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'code': 'INTERNAL_SERVER_ERROR'
        }), 500

    @app.errorhandler(Exception)
    def handleException(error):
        """未捕获异常处理"""
        app.logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
        return jsonify({
            'success': False,
            'message': 'An unexpected error occurred',
            'code': 'UNEXPECTED_ERROR'
        }), 500


def registerContextProcessors(app: Flask):
    """注册上下文处理器"""

    @app.context_processor
    def injectConfig():
        """注入配置到模板上下文"""
        return {
            'APP_NAME': app.config.get('APP_NAME', 'Eng Read'),
            'APP_VERSION': app.config.get('APP_VERSION', '1.0.0'),
            'ENVIRONMENT': app.config.get('ENV', 'development')
        }


def configureLogging(app: Flask):
    """配置日志"""
    if not app.debug and not app.testing:
        # 生产环境日志配置
        if not os.path.exists('logs'):
            os.mkdir('logs')

        file_handler = logging.FileHandler('logs/app.log')
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('Eng Read Backend startup')

    else:
        # 开发环境日志配置
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        )