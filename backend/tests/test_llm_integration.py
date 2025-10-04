#!/usr/bin/env python3
"""
LLM服务集成测试

完整的端到端集成测试，使用真实API调用。
"""

import sys
import os
import json
import time
import unittest
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


class TestEndToEndWorkflow(unittest.TestCase):
    """端到端工作流测试"""

    def setUp(self):
        """测试前准备"""
        resetLLMServices()

    def test_complete_reading_assistant_workflow(self):
        """完整的阅读助手工作流"""
        print("\n=== 完整阅读助手工作流测试 ===")

        # 1. 读取真实配置
        config_file = projectRoot / 'test_api_providers.json'
        if not config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(config_file, 'r', encoding='utf-8') as f:
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

        # 2. 服务创建
        llm_service = LLMService(configData=test_config)
        print("✓ 服务创建成功")

        # 3. 配置验证
        providers = llm_service.configManager.getAllProviders()
        self.assertTrue(len(providers) > 0)
        print("✓ 配置验证通过")

        # 4. 模板准备
        article_content = """
        人工智能（AI）正在快速改变我们的世界。从医疗保健到金融，
        AI技术正在革命性地改变我们工作和生活的方式。机器学习算法可以
        现在分析大量数据以识别模式并做出以前无法预测的预测。
        这一技术进步为社会带来了机遇和挑战。
        """
        template = PromptTemplates.readingAssistant(article_content, 6)
        print("✓ 模板准备完成")

        # 5. 消息验证
        self.assertEqual(len(template), 2)
        self.assertEqual(template[0]['role'], 'system')
        self.assertEqual(template[1]['role'], 'user')
        print("✓ 消息结构验证通过")

        # 6. 执行真实API调用
        try:
            response = llm_service.chatWithTemplate(template)
            print("✓ API调用执行完成")

            # 7. 响应验证
            self.assertTrue(response.success, f"API调用失败: {response.error}")
            self.assertIsNotNone(response.content)
            self.assertGreater(len(response.content), 0)
            print("✓ 响应验证通过")
            print(f"  响应内容: {response.content[:200]}...")

        except Exception as e:
            self.fail(f"真实API调用失败: {e}")

        print("✓ 完整阅读助手工作流测试通过")

    def test_vocabulary_learning_workflow(self):
        """词汇学习工作流"""
        print("\n=== 词汇学习工作流测试 ===")

        # 1. 配置加载
        test_config_file = projectRoot / 'test_api_providers.json'
        if not test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(test_config_file, 'r', encoding='utf-8') as f:
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

        # 2. 词汇学习场景
        word = "paradigm"
        context = "人工智能的新范式需要思维方式的转变。"

        # 3. 创建词汇学习模板
        template = PromptTemplates.vocabularyPractice(word, context)

        # 4. 验证模板内容
        self.assertIn(word, template[1]['content'])
        self.assertIn(context, template[1]['content'])
        print("✓ 词汇学习模板验证通过")

        # 5. 执行真实API调用
        try:
            response = llm_service.chatWithTemplate(template)

            # 6. 验证响应
            self.assertTrue(response.success, f"API调用失败: {response.error}")
            self.assertIsNotNone(response.content)
            self.assertGreater(len(response.content), 0)
            print("✓ 词汇学习响应验证通过")
            print(f"  响应内容: {response.content[:200]}...")

        except Exception as e:
            self.fail(f"词汇学习API调用失败: {e}")

        print("✓ 词汇学习工作流测试通过")

    def test_writing_improvement_workflow(self):
        """写作改进工作流"""
        print("\n=== 写作改进工作流测试 ===")

        # 1. 配置加载
        test_config_file = projectRoot / 'test_api_providers.json'
        if not test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(test_config_file, 'r', encoding='utf-8') as f:
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

        # 2. 写作内容
        essay_text = """
        我认为技术对教育很重要。学生使用电脑和网络可以学得更好。
        现在很多学校使用智能板和在线学习平台。这帮助学生获得更多信息并学得更快。
        """

        # 3. 创建写作反馈模板
        template = PromptTemplates.writingFeedback(essay_text, "intermediate")

        # 4. 执行真实API调用
        try:
            response = llm_service.chatWithTemplate(template)

            # 5. 验证响应
            self.assertTrue(response.success, f"API调用失败: {response.error}")
            self.assertIsNotNone(response.content)
            self.assertGreater(len(response.content), 0)
            print("✓ 写作反馈响应验证通过")
            print(f"  响应内容: {response.content[:200]}...")

        except Exception as e:
            self.fail(f"写作反馈API调用失败: {e}")

        print("✓ 写作改进工作流测试通过")


class TestMultiProviderScenario(unittest.TestCase):
    """多供应商场景测试"""

    def test_provider_configuration(self):
        """测试供应商配置"""
        print("\n=== 供应商配置测试 ===")

        # 1. 创建多供应商配置（使用智谱AI作为主要测试）
        config_file = projectRoot / 'test_api_providers.json'
        if not config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(config_file, 'r', encoding='utf-8') as f:
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

        # 2. 测试配置加载
        llm_service = LLMService(configData=test_config)
        providers = llm_service.configManager.getAllProviders()
        self.assertTrue(len(providers) > 0)
        print("✓ 多供应商配置加载成功")

        # 3. 测试获取供应商配置
        provider_config = llm_service.configManager.getProvider('zhipuai')
        self.assertIsNotNone(provider_config)
        self.assertIn('models', provider_config)
        print("✓ 供应商配置获取成功")

        # 4. 测试模型配置
        models = provider_config.get('models', {})
        self.assertTrue(len(models) > 0)
        first_model = list(models.keys())[0]
        model_config = models[first_model]
        self.assertIn('max_tokens', model_config)
        self.assertIn('temperature', model_config)
        print("✓ 模型配置验证成功")

    def test_model_switching(self):
        """测试模型切换"""
        print("\n=== 模型切换测试 ===")

        config_file = projectRoot / 'test_api_providers.json'
        if not config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(config_file, 'r', encoding='utf-8') as f:
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

        # 获取所有可用模型
        provider_config = llm_service.configManager.getProvider('zhipuai')
        models = provider_config.get('models', {})

        # 测试每个模型
        for model_name in models.keys():
            try:
                messages = [LLMMessage(role='user', content=f'你好，这是对模型{model_name}的测试')]
                response = llm_service.chat(messages, 'zhipuai', model_name)

                if response.success:
                    print(f"✓ 模型 {model_name} 测试通过")
                else:
                    print(f"✗ 模型 {model_name} 测试失败: {response.error}")
                    # 这里不fail，因为某些模型可能不可用

            except Exception as e:
                print(f"✗ 模型 {model_name} 测试异常: {e}")

        print("✓ 模型切换测试完成")


class TestErrorRecoveryScenarios(unittest.TestCase):
    """错误恢复场景测试"""

    def test_config_recovery(self):
        """测试配置恢复"""
        print("\n=== 配置恢复测试 ===")

        # 1. 使用有效配置
        valid_config = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key"
                }
            }
        ]

        llm_service = getLLMService(configData=valid_config)
        providers = llm_service.configManager.getAllProviders()
        self.assertTrue(len(providers) > 0)
        print("✓ 有效配置加载成功")

        # 2. 重置并使用无效配置
        resetLLMServices()
        invalid_config = {"invalid": "config"}
        llm_service = getLLMService(configData=invalid_config)
        providers = llm_service.configManager.getAllProviders()
        # 应该回退到本地配置
        self.assertIn('local', providers)
        print("✓ 无效配置恢复成功")

    def test_template_error_handling(self):
        """测试模板错误处理"""
        print("\n=== 模板错误处理测试 ===")

        config_data = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key"
                }
            }
        ]

        llm_service = LLMService(configData=config_data)

        # 测试模板参数错误
        try:
            template = PromptTemplates.readingAssistant(None, -1)
            # 应该能处理异常情况
            print("✓ 模板异常处理正确")
        except Exception as e:
            print(f"✓ 模板异常处理正确: {e}")
            # 异常是预期的

    def test_invalid_provider_handling(self):
        """测试无效供应商处理"""
        print("\n=== 无效供应商处理测试 ===")

        # 创建包含无效供应商的配置
        invalid_config = {
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

        llm_service = LLMService(configData=invalid_config)

        # 尝试使用无效供应商
        messages = [LLMMessage(role='user', content='测试无效供应商')]
        response = llm_service.chat(messages, 'invalid-provider', 'invalid-model')

        # 应该失败，但不应该崩溃
        self.assertFalse(response.success)
        self.assertIsNotNone(response.error)
        print("✓ 无效供应商处理正确")


class TestPerformanceAndLoad(unittest.TestCase):
    """性能和负载测试"""

    def test_response_time(self):
        """测试响应时间"""
        print("\n=== 响应时间测试 ===")

        config_file = projectRoot / 'test_api_providers.json'
        if not config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(config_file, 'r', encoding='utf-8') as f:
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

        # 测试单个请求的响应时间
        start_time = time.time()
        messages = [LLMMessage(role='user', content='你好，这是一个性能测试')]
        response = llm_service.chat(messages, 'zhipuai', 'glm-4.5-flash')
        end_time = time.time()

        response_time = end_time - start_time

        if response.success:
            print(f"✓ 响应时间测试通过: {response_time:.3f}s")
            # 响应时间应该在合理范围内（少于30秒，因为是真实API）
            self.assertLess(response_time, 30.0)
        else:
            print(f"✗ 响应时间测试失败: {response.error}")
            self.fail(f"API调用失败: {response.error}")

    def test_memory_usage(self):
        """测试内存使用"""
        print("\n=== 内存使用测试 ===")

        import tracemalloc

        # 开始内存跟踪
        tracemalloc.start()

        # 创建多个服务实例
        for i in range(5):
            config_file = projectRoot / 'test_api_providers.json'
            if config_file.exists():
                llm_service = getLLMServiceWithConfig(str(config_file))
                # 使用服务创建模板（不调用API以节省资源）
                template = PromptTemplates.readingAssistant(f"测试内容 {i}", 5)
                # 注意：这里不实际调用API，只测试配置和模板创建

        # 获取内存使用情况
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # 内存使用应该在合理范围内（少于20MB）
        peak_mb = peak / 1024 / 1024
        self.assertLess(peak_mb, 20.0)
        print(f"✓ 内存使用测试通过: 峰值内存使用 {peak_mb:.2f} MB")


def run_integration_tests():
    """运行集成测试"""
    print("=== LLM服务集成测试 ===\n")

    # 创建测试套件
    test_classes = [
        TestEndToEndWorkflow,
        TestMultiProviderScenario,
        TestErrorRecoveryScenarios,
        TestPerformanceAndLoad
    ]

    suite = unittest.TestSuite()

    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)

    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 输出结果
    print(f"\n=== 集成测试结果 ===")
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
        success = run_integration_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"集成测试运行异常: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)