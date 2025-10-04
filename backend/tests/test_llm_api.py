#!/usr/bin/env python3
"""
LLM API连接测试

测试实际的API连接、认证和调用功能。
"""

import sys
import os
import json
import time
import unittest
import requests
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

try:
    from app.services.llmService import (
        LLMService, LLMConfigManager, LLMMessage, LLMResponse,
        getLLMService, getLLMServiceWithConfig, resetLLMServices
    )
    from app.services.llmService import PromptTemplates
except ImportError as e:
    print(f"导入错误: {e}")
    print("请确保已安装所需依赖")
    sys.exit(1)


class TestRealAPIConnection(unittest.TestCase):
    """测试真实API连接"""

    def setUp(self):
        """测试前准备"""
        # 检查是否有test_api_providers.json文件
        self.test_config_file = projectRoot / 'test_api_providers.json'

    def test_load_real_config(self):
        """测试加载真实配置文件"""
        if not self.test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(self.test_config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)

        self.assertIsInstance(config_data, list)
        self.assertTrue(len(config_data) > 0)

        # 验证配置格式
        for config_item in config_data:
            for model_name, model_config in config_item.items():
                self.assertIn('baseurl', model_config)
                self.assertIn('apikey', model_config)
                self.assertIn('modelname', model_config)

    def test_real_api_connection(self):
        """测试真实API连接（如果API密钥可用）"""
        if not self.test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(self.test_config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)

        # 转换配置格式
        test_config = {
            "providers": {}
        }

        for item in config_data:
            for modelKey, modelConfig in item.items():
                providerName = "zhipuai"
                if providerName not in test_config["providers"]:
                    test_config["providers"][providerName] = {
                        "name": "智谱AI",
                        "base_url": modelConfig["baseurl"],
                        "api_key": modelConfig["apikey"],
                        "models": {}
                    }
                test_config["providers"][providerName]["models"][modelKey] = {
                    "max_tokens": 4000,
                    "temperature": 0.7
                }

        # 创建服务
        llm_service = LLMService(configData=test_config)

        # 获取第一个可用供应商
        provider_config = llm_service.configManager.getProvider('zhipuai')
        if not provider_config:
            self.skipTest("智谱AI供应商配置不存在")

        models = provider_config.get('models', {})
        if not models:
            self.skipTest("没有可用的模型配置")

        first_model = list(models.keys())[0]

        # 检查API密钥
        api_key = provider_config.get('api_key', '')
        if not api_key or api_key == 'your-api-key-here':
            self.skipTest("API密钥未配置或为示例值")

        # 进行真实API调用测试
        try:
            messages = [LLMMessage(role='user', content='你好！这是一个测试消息，请简单回复确认收到。')]
            response = llm_service.chat(messages, 'zhipuai', first_model)

            if response.success:
                print(f"✓ 真实API调用成功")
                print(f"  响应: {response.content[:100]}...")
                if response.usage:
                    print(f"  使用情况: {response.usage}")

                # 验证响应
                self.assertIsNotNone(response.content)
                self.assertGreater(len(response.content), 0)
            else:
                print(f"✗ 真实API调用失败: {response.error}")
                self.fail(f"API调用失败: {response.error}")

        except Exception as e:
            self.fail(f"API调用异常: {e}")

    def test_real_api_multiple_messages(self):
        """测试多轮对话"""
        if not self.test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(self.test_config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)

        # 转换配置格式
        test_config = {
            "providers": {}
        }

        for item in config_data:
            for modelKey, modelConfig in item.items():
                providerName = "zhipuai"
                if providerName not in test_config["providers"]:
                    test_config["providers"][providerName] = {
                        "name": "智谱AI",
                        "base_url": modelConfig["baseurl"],
                        "api_key": modelConfig["apikey"],
                        "models": {}
                    }
                test_config["providers"][providerName]["models"][modelKey] = {
                    "max_tokens": 4000,
                    "temperature": 0.7
                }

        llm_service = LLMService(configData=test_config)

        try:
            # 多轮对话
            messages = [
                LLMMessage(role='user', content='你好，我的名字是张三'),
                LLMMessage(role='assistant', content='你好张三，很高兴认识你！'),
                LLMMessage(role='user', content='请记住我的名字，并问我一个问题')
            ]
            response = llm_service.chat(messages, 'zhipuai', 'glm-4.5-flash')

            if response.success:
                print(f"✓ 多轮对话测试成功")
                print(f"  响应: {response.content}")

                # 验证响应中是否包含了记住的名字
                self.assertIsNotNone(response.content)
                self.assertGreater(len(response.content), 0)
            else:
                print(f"✗ 多轮对话测试失败: {response.error}")
                self.fail(f"多轮对话测试失败: {response.error}")

        except Exception as e:
            self.fail(f"多轮对话测试异常: {e}")

    def test_real_api_with_template(self):
        """测试使用模板的API调用"""
        if not self.test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(self.test_config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)

        # 转换配置格式
        test_config = {
            "providers": {}
        }

        for item in config_data:
            for modelKey, modelConfig in item.items():
                providerName = "zhipuai"
                if providerName not in test_config["providers"]:
                    test_config["providers"][providerName] = {
                        "name": "智谱AI",
                        "base_url": modelConfig["baseurl"],
                        "api_key": modelConfig["apikey"],
                        "models": {}
                    }
                test_config["providers"][providerName]["models"][modelKey] = {
                    "max_tokens": 4000,
                    "temperature": 0.7
                }

        llm_service = LLMService(configData=test_config)

        try:
            # 使用模板
            template = PromptTemplates.readingAssistant("这是一段关于人工智能的测试文本。", 7)
            response = llm_service.chatWithTemplate(template)

            if response.success:
                print(f"✓ 模板测试成功")
                print(f"  响应: {response.content[:200]}...")

                # 验证响应
                self.assertIsNotNone(response.content)
                self.assertGreater(len(response.content), 0)
            else:
                print(f"✗ 模板测试失败: {response.error}")
                self.fail(f"模板测试失败: {response.error}")

        except Exception as e:
            self.fail(f"模板测试异常: {e}")

    def test_api_error_scenarios(self):
        """测试API错误场景"""
        # 测试无效的供应商
        config_with_invalid_provider = {
            "providers": {
                "invalid-provider": {
                    "name": "Invalid Provider",
                    "base_url": "https://api.invalid.com/v1",
                    "api_key": "invalid-key",
                    "models": {
                        "invalid-model": {
                            "max_tokens": 4000,
                            "temperature": 0.7
                        }
                    }
                }
            }
        }

        llm_service = LLMService(configData=config_with_invalid_provider)
        messages = [LLMMessage(role='user', content='测试无效供应商')]
        response = llm_service.chat(messages, 'invalid-provider', 'invalid-model')

        # 应该失败
        self.assertFalse(response.success)
        self.assertIsNotNone(response.error)


def run_api_tests():
    """运行API测试"""
    print("=== LLM API真实连接测试 ===\n")

    # 创建测试套件
    test_classes = [
        TestRealAPIConnection,
    ]

    suite = unittest.TestSuite()

    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)

    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 输出结果
    print(f"\n=== API测试结果 ===")
    print(f"运行测试: {result.testsRun}")
    print(f"失败: {len(result.failures)}")
    print(f"错误: {len(result.errors)}")
    print(f"跳过: {len(result.skipped)}")

    if result.failures:
        print(f"\n失败的测试:")
        for test, traceback in result.failures:
            print(f"- {test}")

    if result.errors:
        print(f"\n错误的测试:")
        for test, traceback in result.errors:
            print(f"- {test}")

    success_rate = (result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100
    print(f"\n成功率: {success_rate:.1f}%")

    return result.wasSuccessful()


if __name__ == '__main__':
    try:
        success = run_api_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"API测试运行异常: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)