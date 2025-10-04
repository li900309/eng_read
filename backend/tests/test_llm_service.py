"""
LLM服务测试模块

测试LLM服务的各项功能。
"""

import pytest
import requests
import sys
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

from app.services import LLMService, PromptTemplates, LLMMessage, LLMResponse
from app.services.llmService import LLMConfigManager


class TestLLMConfigManager:
    """LLM配置管理器测试"""

    def test_getDefaultConfigPath(self):
        """测试获取默认配置路径"""
        configManager = LLMConfigManager()
        path = configManager._getDefaultConfigPath()
        assert path.endswith('config/llm_config.json')

    def test_getFallbackConfig(self):
        """测试获取备用配置"""
        configManager = LLMConfigManager()
        fallback = configManager._getFallbackConfig()

        assert 'providers' in fallback
        assert 'local' in fallback['providers']
        assert 'models' in fallback['providers']['local']

    def test_getProvider(self):
        """测试获取供应商配置"""
        configManager = LLMConfigManager()

        # 测试本地供应商（应该存在）
        localProvider = configManager.getProvider('local')
        assert localProvider is not None
        assert 'name' in localProvider
        assert 'base_url' in localProvider

    def test_getModel(self):
        """测试获取模型配置"""
        configManager = LLMConfigManager()

        # 测试本地模型（应该存在）
        localModel = configManager.getModel('local', 'local-model')
        assert localModel is not None
        assert 'max_tokens' in localModel
        assert 'temperature' in localModel


class TestLLMService:
    """LLM服务测试"""

    def test_init(self):
        """测试初始化"""
        configManager = LLMConfigManager()
        service = LLMService(configManager)
        assert service.configManager == configManager

    def test_chatSuccess(self):
        """测试聊天成功 - 真实API请求"""
        # 读取真实配置
        configPath = projectRoot / "test_api_providers.json"
        import json
        with open(configPath, 'r', encoding='utf-8') as f:
            configData = json.load(f)

        # 转换配置格式
        testConfig = {
            "providers": {}
        }

        for item in configData:
            for modelKey, modelConfig in item.items():
                providerName = "zhipuai"
                if providerName not in testConfig["providers"]:
                    testConfig["providers"][providerName] = {
                        "name": "智谱AI",
                        "base_url": modelConfig["baseurl"],
                        "api_key": modelConfig["apikey"],
                        "models": {}
                    }
                testConfig["providers"][providerName]["models"][modelKey] = {
                    "max_tokens": 4000,
                    "temperature": 0.7
                }

        # 创建LLM服务
        llmService = LLMService(configData=testConfig)

        # 执行聊天
        messages = [LLMMessage(role='user', content='你好，请简单回复')]
        response = llmService.chat(messages, 'zhipuai', 'glm-4.5-flash')

        # 验证结果
        assert response.success == True
        assert response.content is not None
        assert len(response.content) > 0
        print(f"LLM响应: {response.content}")

    def test_chatWithTemplate(self):
        """测试使用模板聊天 - 真实API请求"""
        # 读取真实配置
        configPath = projectRoot / "test_api_providers.json"
        import json
        with open(configPath, 'r', encoding='utf-8') as f:
            configData = json.load(f)

        # 转换配置格式
        testConfig = {
            "providers": {}
        }

        for item in configData:
            for modelKey, modelConfig in item.items():
                providerName = "zhipuai"
                if providerName not in testConfig["providers"]:
                    testConfig["providers"][providerName] = {
                        "name": "智谱AI",
                        "base_url": modelConfig["baseurl"],
                        "api_key": modelConfig["apikey"],
                        "models": {}
                    }
                testConfig["providers"][providerName]["models"][modelKey] = {
                    "max_tokens": 4000,
                    "temperature": 0.7
                }

        # 创建LLM服务
        llmService = LLMService(configData=testConfig)

        # 使用模板聊天
        template = [{'role': 'user', 'content': '你好{name}，请简单介绍一下自己'}]
        response = llmService.chatWithTemplate(template, name='测试用户')

        # 验证结果
        assert response.success == True
        assert response.content is not None
        assert len(response.content) > 0
        print(f"模板聊天响应: {response.content}")


class TestPromptTemplates:
    """提示词模板测试"""

    def test_readingAssistant(self):
        """测试阅读助手模板"""
        template = PromptTemplates.readingAssistant("Test content", 7)

        assert len(template) == 2
        assert template[0]['role'] == 'system'
        assert '难度等级：7/10' in template[0]['content']
        assert template[1]['role'] == 'user'
        assert 'Test content' in template[1]['content']

    def test_vocabularyPractice(self):
        """测试词汇练习模板"""
        template = PromptTemplates.vocabularyPractice("hello", "Hello world!")

        assert len(template) == 2
        assert template[0]['role'] == 'system'
        assert template[1]['role'] == 'user'
        assert 'hello' in template[1]['content']
        assert 'Hello world!' in template[1]['content']

    def test_writingFeedback(self):
        """测试写作反馈模板"""
        template = PromptTemplates.writingFeedback("My essay.", "advanced")

        assert len(template) == 2
        assert template[0]['role'] == 'system'
        assert 'advanced水平' in template[0]['content']
        assert template[1]['role'] == 'user'
        assert 'My essay.' in template[1]['content']


class TestLLMIntegration:
    """LLM集成测试"""

    def test_getLLMService(self):
        """测试获取LLM服务实例"""
        from app.services import getLLMService

        # 第一次调用应该创建实例
        service1 = getLLMService()
        # 第二次调用应该返回同一实例
        service2 = getLLMService()

        assert service1 is service2
        assert isinstance(service1, LLMService)


if __name__ == '__main__':
    pytest.main([__file__])