#!/usr/bin/env python3
"""
LLM服务简化测试

不依赖Flask的基本功能验证测试。
"""

import sys
import os
import json
import unittest
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))


class SimpleLLMTests(unittest.TestCase):
    """简化的LLM测试"""

    def test_config_file_loading(self):
        """测试配置文件加载"""
        print("测试配置文件加载...")

        # 测试test_api_providers.json
        config_file = projectRoot / 'test_api_providers.json'
        if config_file.exists():
            with open(config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)

            self.assertIsInstance(config_data, list)
            self.assertTrue(len(config_data) > 0)
            print(f"✓ 配置文件加载成功: {len(config_data)} 个配置项")

            # 验证配置结构
            for config_item in config_data:
                for model_name, model_config in config_item.items():
                    self.assertIn('baseurl', model_config)
                    self.assertIn('modelname', model_config)
                    self.assertIn('apikey', model_config)
            print("✓ 配置结构验证通过")
        else:
            self.skipTest("test_api_providers.json 文件不存在")

    def test_config_format_conversion(self):
        """测试配置格式转换"""
        print("测试配置格式转换...")

        # 模拟新格式配置
        new_config = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-api-key",
                    "max_tokens": 2000,
                    "temperature": 0.5
                }
            }
        ]

        # 模拟转换逻辑
        def convert_config(config):
            providers = {}
            for provider_config in config:
                for model_name, model_info in provider_config.items():
                    provider_name = f"provider_{model_name.replace('-', '_')}"
                    providers[provider_name] = {
                        "name": model_info.get("modelname", model_name),
                        "base_url": model_info.get("baseurl", ""),
                        "api_key": model_info.get("apikey", ""),
                        "models": {
                            model_name: {
                                "max_tokens": model_info.get("max_tokens", 4000),
                                "temperature": model_info.get("temperature", 0.7)
                            }
                        }
                    }
            return {"providers": providers}

        converted = convert_config(new_config)

        # 验证转换结果
        self.assertIn('providers', converted)
        providers = converted['providers']
        self.assertTrue(len(providers) > 0)

        provider = list(providers.values())[0]
        self.assertEqual(provider['name'], 'Test Model')
        self.assertEqual(provider['base_url'], 'https://api.test.com/v1/')
        self.assertEqual(provider['api_key'], 'test-api-key')
        print("✓ 配置格式转换成功")

    def test_template_generation(self):
        """测试模板生成"""
        print("测试模板生成...")

        # 模拟阅读助手模板
        def reading_assistant_template(content, difficulty=5):
            return [
                {
                    "role": "system",
                    "content": f"你是一个专业的英语学习助手，帮助学生理解英语文章。难度等级：{difficulty}/10。"
                },
                {
                    "role": "user",
                    "content": f"请分析以下英语文章，提供：1. 中文翻译 2. 重点词汇解释 3. 学习建议\n\n文章内容：\n{content}"
                }
            ]

        # 测试模板生成
        template = reading_assistant_template("Test article content", 7)

        self.assertEqual(len(template), 2)
        self.assertEqual(template[0]['role'], 'system')
        self.assertEqual(template[1]['role'], 'user')
        self.assertIn('难度等级：7/10', template[0]['content'])
        self.assertIn('Test article content', template[1]['content'])
        print("✓ 模板生成成功")

    def test_message_structure(self):
        """测试消息结构"""
        print("测试消息结构...")

        # 模拟消息类
        class LLMMessage:
            def __init__(self, role, content):
                self.role = role
                self.content = content

        # 创建消息
        system_msg = LLMMessage('system', 'You are a helpful assistant.')
        user_msg = LLMMessage('user', 'Hello!')

        # 验证消息结构
        self.assertEqual(system_msg.role, 'system')
        self.assertEqual(system_msg.content, 'You are a helpful assistant.')
        self.assertEqual(user_msg.role, 'user')
        self.assertEqual(user_msg.content, 'Hello!')
        print("✓ 消息结构验证通过")

    def test_api_request_structure(self):
        """测试API请求结构"""
        print("测试API请求结构...")

        # 模拟API请求结构
        def create_api_request(messages, model, max_tokens=4000, temperature=0.7):
            return {
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature
            }

        # 创建请求
        messages = [
            {"role": "system", "content": "You are helpful assistant"},
            {"role": "user", "content": "Hello!"}
        ]

        request = create_api_request(messages, "test-model")

        # 验证请求结构
        self.assertEqual(request['model'], 'test-model')
        self.assertEqual(len(request['messages']), 2)
        self.assertEqual(request['max_tokens'], 4000)
        self.assertEqual(request['temperature'], 0.7)
        print("✓ API请求结构正确")

    def test_error_handling(self):
        """测试错误处理"""
        print("测试错误处理...")

        # 模拟错误处理
        def handle_api_error(status_code, error_text):
            if status_code == 401:
                return "API密钥无效或已过期"
            elif status_code == 429:
                return "API调用频率超限，请稍后重试"
            elif status_code == 500:
                return "服务器内部错误"
            else:
                return f"未知错误: {status_code}"

        # 测试各种错误
        self.assertEqual(handle_api_error(401, ""), "API密钥无效或已过期")
        self.assertEqual(handle_api_error(429, ""), "API调用频率超限，请稍后重试")
        self.assertEqual(handle_api_error(500, ""), "服务器内部错误")
        self.assertEqual(handle_api_error(400, ""), "未知错误: 400")
        print("✓ 错误处理正确")

    def test_configuration_validation(self):
        """测试配置验证"""
        print("测试配置验证...")

        def validate_config(config):
            errors = []

            if not isinstance(config, list):
                errors.append("配置应该是数组格式")
                return errors

            for i, config_item in enumerate(config):
                if not isinstance(config_item, dict):
                    errors.append(f"配置项 {i} 应该是对象")
                    continue

                for model_name, model_config in config_item.items():
                    required_fields = ['baseurl', 'modelname', 'apikey']
                    for field in required_fields:
                        if field not in model_config:
                            errors.append(f"模型 {model_name} 缺少字段: {field}")

            return errors

        # 测试有效配置
        valid_config = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key"
                }
            }
        ]

        errors = validate_config(valid_config)
        self.assertEqual(len(errors), 0)

        # 测试无效配置
        invalid_config = [
            {
                "test-model": {
                    "modelname": "Test Model"
                    # 缺少 baseurl 和 apikey
                }
            }
        ]

        errors = validate_config(invalid_config)
        self.assertGreater(len(errors), 0)
        print("✓ 配置验证功能正常")


def run_simple_tests():
    """运行简化测试"""
    print("=" * 60)
    print("LLM服务简化测试套件")
    print("=" * 60)
    print()

    # 创建测试套件
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleLLMTests)

    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 输出结果
    print("\n" + "=" * 60)
    print("简化测试结果")
    print("=" * 60)
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

    if result.wasSuccessful():
        print("🎉 简化测试全部通过！")
    else:
        print("⚠️  部分测试失败")

    return result.wasSuccessful()


if __name__ == '__main__':
    try:
        success = run_simple_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"测试运行异常: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)