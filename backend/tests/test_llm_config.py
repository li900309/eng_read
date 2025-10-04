#!/usr/bin/env python3
"""
LLM配置加载测试

专门测试配置文件的加载、解析和验证功能。
"""

import sys
import os
import json
import unittest
from pathlib import Path
from tempfile import NamedTemporaryFile, TemporaryDirectory

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

try:
    from app.services.llmService import (
        LLMConfigManager, LLMService,
        getLLMService, getLLMServiceWithConfig, resetLLMServices
    )
except ImportError as e:
    print(f"导入错误: {e}")
    print("请确保已安装所需依赖")
    sys.exit(1)


class TestConfigFormats(unittest.TestCase):
    """测试不同配置格式"""

    def test_standard_format(self):
        """测试标准格式"""
        config = {
            "providers": {
                "openai": {
                    "name": "OpenAI",
                    "base_url": "https://api.openai.com/v1",
                    "api_key": "test-key",
                    "models": {
                        "gpt-4": {
                            "max_tokens": 4000,
                            "temperature": 0.7
                        }
                    }
                }
            }
        }

        configManager = LLMConfigManager(configData=config)
        providers = configManager.getAllProviders()

        self.assertEqual(len(providers), 1)
        self.assertIn('openai', providers)
        self.assertEqual(providers['openai']['name'], 'OpenAI')

    def test_new_format_conversion(self):
        """测试新格式转换"""
        config = [
            {
                "glm-4.5-flash": {
                    "baseurl": "https://open.bigmodel.cn/api/paas/v4/",
                    "modelname": "GLM-4.5-Flash",
                    "apikey": "test-api-key"
                }
            }
        ]

        configManager = LLMConfigManager(configData=config)
        providers = configManager.getAllProviders()

        self.assertTrue(len(providers) > 0)
        provider = list(providers.values())[0]
        self.assertEqual(provider['name'], 'GLM-4.5-Flash')
        self.assertEqual(provider['base_url'], 'https://open.bigmodel.cn/api/paas/v4/')

    def test_field_mapping(self):
        """测试字段映射"""
        config = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key",
                    "max_tokens": 2000,
                    "temperature": 0.8
                }
            }
        ]

        configManager = LLMConfigManager(configData=config)
        providers = configManager.getAllProviders()

        provider = list(providers.values())[0]
        self.assertEqual(provider['base_url'], 'https://api.test.com/v1/')
        self.assertEqual(provider['name'], 'Test Model')
        self.assertEqual(provider['api_key'], 'test-key')

        model = list(provider['models'].values())[0]
        self.assertEqual(model['max_tokens'], 2000)
        self.assertEqual(model['temperature'], 0.8)

    def test_multiple_providers(self):
        """测试多供应商配置"""
        config = [
            {
                "model1": {
                    "baseurl": "https://api1.com/v1/",
                    "modelname": "Model 1",
                    "apikey": "key1"
                }
            },
            {
                "model2": {
                    "baseurl": "https://api2.com/v1/",
                    "modelname": "Model 2",
                    "apikey": "key2"
                }
            }
        ]

        configManager = LLMConfigManager(configData=config)
        providers = configManager.getAllProviders()

        self.assertEqual(len(providers), 2)
        provider_names = list(providers.keys())
        self.assertIn('provider_model1', provider_names)
        self.assertIn('provider_model2', provider_names)

    def test_empty_config(self):
        """测试空配置"""
        configManager = LLMConfigManager(configData={})
        providers = configManager.getAllProviders()

        # 应该返回备用配置
        self.assertIn('local', providers)


class TestConfigFileLoading(unittest.TestCase):
    """测试配置文件加载"""

    def setUp(self):
        """测试前准备"""
        self.temp_dir = TemporaryDirectory()
        self.temp_dir_path = Path(self.temp_dir.name)

    def tearDown(self):
        """测试后清理"""
        self.temp_dir.cleanup()

    def test_load_valid_config_file(self):
        """测试加载有效配置文件"""
        config_data = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key"
                }
            }
        ]

        config_file = self.temp_dir_path / "test_config.json"
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, ensure_ascii=False, indent=2)

        configManager = LLMConfigManager(configPath=str(config_file))
        providers = configManager.getAllProviders()

        self.assertTrue(len(providers) > 0)

    def test_load_nonexistent_config_file(self):
        """测试加载不存在的配置文件"""
        nonexistent_file = self.temp_dir_path / "nonexistent.json"
        configManager = LLMConfigManager(configPath=str(nonexistent_file))

        # 应该使用备用配置
        providers = configManager.getAllProviders()
        self.assertIn('local', providers)

    def test_load_invalid_json(self):
        """测试加载无效JSON文件"""
        invalid_json_file = self.temp_dir_path / "invalid.json"
        with open(invalid_json_file, 'w', encoding='utf-8') as f:
            f.write("invalid json content")

        configManager = LLMConfigManager(configPath=str(invalid_json_file))

        # 应该使用备用配置
        providers = configManager.getAllProviders()
        self.assertIn('local', providers)

    def test_load_with_env_vars(self):
        """测试环境变量替换"""
        # 设置环境变量
        os.environ['TEST_API_KEY'] = 'env-replaced-key'

        config = {
            "providers": {
                "test": {
                    "name": "Test",
                    "base_url": "https://api.test.com/v1",
                    "api_key": "${TEST_API_KEY}",
                    "models": {
                        "test-model": {
                            "max_tokens": 4000,
                            "temperature": 0.7
                        }
                    }
                }
            }
        }

        config_file = self.temp_dir_path / "env_test.json"
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)

        configManager = LLMConfigManager(configPath=str(config_file))
        providers = configManager.getAllProviders()

        self.assertEqual(providers['test']['api_key'], 'env-replaced-key')

        # 清理环境变量
        del os.environ['TEST_API_KEY']


class TestTestApiProviders(unittest.TestCase):
    """测试test_api_providers.json文件"""

    def test_load_test_config_file(self):
        """测试加载test_api_providers.json"""
        test_config_file = projectRoot / 'test_api_providers.json'

        if not test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(test_config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)

        self.assertIsInstance(config_data, list)
        self.assertTrue(len(config_data) > 0)

        # 验证配置结构
        for config_item in config_data:
            self.assertIsInstance(config_item, dict)
            for model_name, model_config in config_item.items():
                self.assertIn('baseurl', model_config)
                self.assertIn('modelname', model_config)
                self.assertIn('apikey', model_config)

    def test_convert_test_config(self):
        """测试转换test_api_providers.json配置"""
        test_config_file = projectRoot / 'test_api_providers.json'

        if not test_config_file.exists():
            self.skipTest("test_api_providers.json 文件不存在")

        with open(test_config_file, 'r', encoding='utf-8') as f:
            config_data = json.load(f)

        configManager = LLMConfigManager(configData=config_data)
        providers = configManager.getAllProviders()

        self.assertTrue(len(providers) > 0)

        # 验证转换后的配置
        for provider_name, provider_config in providers.items():
            self.assertIn('name', provider_config)
            self.assertIn('base_url', provider_config)
            self.assertIn('api_key', provider_config)
            self.assertIn('models', provider_config)

            # 验证模型配置
            for model_name, model_config in provider_config['models'].items():
                self.assertIn('max_tokens', model_config)
                self.assertIn('temperature', model_config)


class TestConfigManagerMethods(unittest.TestCase):
    """测试配置管理器方法"""

    def setUp(self):
        """测试前准备"""
        self.config = {
            "providers": {
                "test1": {
                    "name": "Test 1",
                    "base_url": "https://api1.com/v1",
                    "api_key": "key1",
                    "models": {
                        "model1": {
                            "max_tokens": 1000,
                            "temperature": 0.5
                        },
                        "model2": {
                            "max_tokens": 2000,
                            "temperature": 0.8
                        }
                    }
                },
                "test2": {
                    "name": "Test 2",
                    "base_url": "https://api2.com/v1",
                    "api_key": "key2",
                    "models": {
                        "model3": {
                            "max_tokens": 1500,
                            "temperature": 0.6
                        }
                    }
                }
            }
        }
        self.configManager = LLMConfigManager(configData=self.config)

    def test_get_provider_methods(self):
        """测试获取供应商方法"""
        # 测试获取存在的供应商
        provider1 = self.configManager.getProvider('test1')
        self.assertIsNotNone(provider1)
        self.assertEqual(provider1['name'], 'Test 1')

        # 测试获取不存在的供应商
        provider_none = self.configManager.getProvider('nonexistent')
        self.assertIsNone(provider_none)

    def test_get_model_methods(self):
        """测试获取模型方法"""
        # 测试获取存在的模型
        model1 = self.configManager.getModel('test1', 'model1')
        self.assertIsNotNone(model1)
        self.assertEqual(model1['max_tokens'], 1000)

        # 测试获取不存在的模型
        model_none = self.configManager.getModel('test1', 'nonexistent')
        self.assertIsNone(model_none)

        # 测试获取不存在供应商的模型
        model_none2 = self.configManager.getModel('nonexistent', 'model1')
        self.assertIsNone(model_none2)

    def test_get_all_providers(self):
        """测试获取所有供应商"""
        providers = self.configManager.getAllProviders()
        self.assertEqual(len(providers), 2)
        self.assertIn('test1', providers)
        self.assertIn('test2', providers)

    def test_get_first_available_provider(self):
        """测试获取第一个可用供应商"""
        first_provider = self.configManager.getFirstAvailableProvider()
        self.assertIn(first_provider, ['test1', 'test2'])


class TestServiceWithConfig(unittest.TestCase):
    """测试服务与配置的集成"""

    def setUp(self):
        """测试前准备"""
        resetLLMServices()

    def tearDown(self):
        """测试后清理"""
        resetLLMServices()

    def test_get_llm_service_with_config_data(self):
        """测试使用配置数据获取服务"""
        config_data = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key"
                }
            }
        ]

        llm_service = getLLMService(configData=config_data)
        self.assertIsInstance(llm_service, LLMService)

        providers = llm_service.configManager.getAllProviders()
        self.assertTrue(len(providers) > 0)

    def test_get_llm_service_with_config_file(self):
        """测试使用配置文件获取服务"""
        config_data = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key"
                }
            }
        ]

        with NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
            json.dump(config_data, f, ensure_ascii=False, indent=2)
            temp_file = f.name

        try:
            llm_service = getLLMServiceWithConfig(temp_file)
            self.assertIsInstance(llm_service, LLMService)

            providers = llm_service.configManager.getAllProviders()
            self.assertTrue(len(providers) > 0)
        finally:
            os.unlink(temp_file)

    def test_get_llm_service_with_nonexistent_file(self):
        """测试使用不存在的配置文件"""
        with self.assertRaises(FileNotFoundError):
            getLLMServiceWithConfig('nonexistent_config.json')

    def test_multiple_config_instances(self):
        """测试多个配置实例"""
        config1 = [{"model1": {"baseurl": "https://api1.com/v1/", "modelname": "Model 1", "apikey": "key1"}}]
        config2 = [{"model2": {"baseurl": "https://api2.com/v1/", "modelname": "Model 2", "apikey": "key2"}}]

        service1 = getLLMService(configData=config1)
        service2 = getLLMService(configData=config2)

        # 应该是不同的实例
        self.assertIsNot(service1, service2)

        providers1 = service1.configManager.getAllProviders()
        providers2 = service2.configManager.getAllProviders()

        self.assertNotEqual(providers1, providers2)


def run_config_tests():
    """运行配置测试"""
    print("=== LLM配置加载测试 ===\n")

    # 创建测试套件
    test_classes = [
        TestConfigFormats,
        TestConfigFileLoading,
        TestTestApiProviders,
        TestConfigManagerMethods,
        TestServiceWithConfig
    ]

    suite = unittest.TestSuite()

    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)

    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 输出结果
    print(f"\n=== 配置测试结果 ===")
    print(f"运行测试: {result.testsRun}")
    print(f"失败: {len(result.failures)}")
    print(f"错误: {len(result.errors)}")

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
        success = run_config_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"配置测试运行异常: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)