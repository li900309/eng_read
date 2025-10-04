"""
应用基础测试
测试应用初始化、配置和基础功能
"""

import pytest
import json
from flask import current_app


class TestAppConfig:
    """测试应用配置"""
    def test_appExists(self, app):
        """测试应用实例存在"""
        assert app is not None
        assert isinstance(app, current_app._get_current_object().__class__)

    def testAppConfig(self, app):
        """测试应用配置"""
        assert app.config['TESTING'] is True
        assert app.config['SECRET_KEY'] == 'test-secret'
        assert app.config['JWT_SECRET_KEY'] == 'test-jwt-secret'

    def testAppExtensions(self, app):
        """测试扩展初始化"""
        assert hasattr(app, 'extensions')
        assert 'sqlalchemy' in app.extensions
        assert 'jwt' in app.extensions


class TestBasicRoutes:
    """测试基础路由"""
    def testHealthCheck(self, client):
        """测试健康检查端点"""
        response = client.get('/health')
        assert response.statusCode == 200

        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
        assert data['version'] == '1.0.0'

    def testApiInfo(self, client):
        """测试API信息端点"""
        response = client.get('/api')
        assert response.statusCode == 200

        data = json.loads(response.data)
        assert data['name'] == 'Eng Read API'
        assert data['version'] == '1.0.0'
        assert 'description' in data
        assert 'endpoints' in data

    def testNotFound(self, client):
        """测试404错误处理"""
        response = client.get('/nonexistent')
        assert response.statusCode == 404

        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['code'] == 'NOT_FOUND'

    def testMethodNotAllowed(self, client):
        """测试405错误处理"""
        response = client.patch('/health')
        assert response.statusCode == 405

        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['code'] == 'METHOD_NOT_ALLOWED'


class TestErrorHandlers:
    """测试错误处理器"""
    def testBadRequest(self, client):
        """测试400错误处理"""
        response = client.post('/api/auth/login',
                            json='invalid_json',
                            content_type='application/json')
        assert response.statusCode == 400

    def testServerError(self, app, client):
        """测试500错误处理"""
        # 这里可以模拟一个会触发500错误的路由
        pass


@pytest.mark.unit
class TestDatabase:
    """测试数据库连接"""
    def testDatabaseConnection(self, app):
        """测试数据库连接"""
        from app.extensions import db
        assert db is not None
        assert db.engine is not None

    def testDatabaseTables(self, app):
        """测试数据库表创建"""
        from app.extensions import db

        # 检查表是否存在
        inspector = db.inspect(db.engine)
        tables = inspector.getTableNames()

        expectedTables = [
            'users',
            'vocabularies',
            'vocabulary_categories',
            'user_vocabularies',
            'learning_sessions',
            'learning_records',
            'daily_statistics'
        ]

        for table in expectedTables:
            assert table in tables