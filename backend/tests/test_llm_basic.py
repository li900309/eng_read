#!/usr/bin/env python3
"""
LLM服务基础功能测试 - GLM版本

测试GLM-4.5-Flash模型的配置读取和聊天功能。
"""

import sys
import os
import unittest
import json
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

try:
    from app.services.llmService import (
        LLMService, LLMConfigManager, LLMMessage, LLMResponse
    )
except ImportError as e:
    print(f"导入错误: {e}")
    sys.exit(1)


class TestLLMBasic(unittest.TestCase):
    """LLM基础功能测试"""

    def setUp(self):
        """测试前准备"""
        # 读取GLM配置文件
        configPath = projectRoot / "test_api_providers.json"
        with open(configPath, 'r', encoding='utf-8') as f:
            configData = json.load(f)

        # 转换配置格式以符合LLMService期望的格式
        self.testConfig = {
            "providers": {}
        }

        for item in configData:
            for modelKey, modelConfig in item.items():
                # 从模型名推断provider名称
                providerName = "zhipuai"
                if providerName not in self.testConfig["providers"]:
                    self.testConfig["providers"][providerName] = {
                        "name": "智谱AI",
                        "base_url": modelConfig["baseurl"],
                        "api_key": modelConfig["apikey"],
                        "models": {}
                    }

                self.testConfig["providers"][providerName]["models"][modelKey] = {
                    "max_tokens": 4000,
                    "temperature": 0.7
                }

    def test_config_reading(self):
        """测试读取GLM配置"""
        # 测试配置管理器能正确读取配置
        configManager = LLMConfigManager(configData=self.testConfig)

        # 验证能获取到智谱AI供应商
        provider = configManager.getProvider('zhipuai')
        self.assertIsNotNone(provider)
        self.assertEqual(provider['name'], '智谱AI')
        self.assertEqual(provider['base_url'], 'https://open.bigmodel.cn/api/paas/v4/')

        # 验证能获取到GLM模型
        model = configManager.getModel('zhipuai', 'glm-4.5-flash')
        self.assertIsNotNone(model)
        self.assertEqual(model['max_tokens'], 4000)

    def test_glm_config_format(self):
        """测试GLM配置格式转换"""
        # 验证配置已正确转换
        self.assertIn('zhipuai', self.testConfig['providers'])
        self.assertIn('glm-4.5-flash', self.testConfig['providers']['zhipuai']['models'])
        self.assertEqual(self.testConfig['providers']['zhipuai']['name'], '智谱AI')
        self.assertEqual(self.testConfig['providers']['zhipuai']['base_url'], 'https://open.bigmodel.cn/api/paas/v4/')

    def test_glm_chat(self):
        """测试GLM聊天功能 - 真实API请求"""
        # 创建LLM服务
        llmService = LLMService(configData=self.testConfig)

        # 发送消息
        messages = [LLMMessage(role='user', content='你好，请用一句话简单介绍一下你自己')]
        response = llmService.chat(messages, 'zhipuai', 'glm-4.5-flash')

        # 验证响应
        self.assertTrue(response.success, f"API调用失败: {response.error if hasattr(response, 'error') else '未知错误'}")
        self.assertIsNotNone(response.content, "响应内容不应为空")
        self.assertGreater(len(response.content), 0, "响应内容长度应大于0")

        # 验证使用情况数据存在
        if hasattr(response, 'usage') and response.usage:
            self.assertIn('prompt_tokens', response.usage)
            self.assertIn('completion_tokens', response.usage)

        print(f"GLM响应: {response.content}")
        if hasattr(response, 'usage') and response.usage:
            print(f"Token使用: {response.usage}")


if __name__ == '__main__':
    print("=== GLM LLM服务基础功能测试 ===")
    unittest.main(verbosity=2)