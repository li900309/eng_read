#!/usr/bin/env python3
"""
LLM提示词模板测试

专门测试提示词模板的生成、格式化和使用功能。
"""

import sys
import os
import json
import unittest
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

try:
    from app.services.llmService import (
        LLMService, LLMMessage, LLMResponse,
        getLLMService, getLLMServiceWithConfig, resetLLMServices
    )
    from app.services.llmService import PromptTemplates
except ImportError as e:
    print(f"导入错误: {e}")
    print("请确保已安装所需依赖")
    sys.exit(1)


class TestPromptTemplatesStructure(unittest.TestCase):
    """测试提示词模板结构"""

    def test_reading_assistant_template_structure(self):
        """测试阅读助手模板结构"""
        template = PromptTemplates.readingAssistant("Test content", 5)

        # 验证模板结构
        self.assertIsInstance(template, list)
        self.assertEqual(len(template), 2)

        # 验证第一条消息（系统消息）
        system_msg = template[0]
        self.assertEqual(system_msg['role'], 'system')
        self.assertIn('英语学习助手', system_msg['content'])
        self.assertIn('难度等级：5/10', system_msg['content'])

        # 验证第二条消息（用户消息）
        user_msg = template[1]
        self.assertEqual(user_msg['role'], 'user')
        self.assertIn('Test content', user_msg['content'])
        self.assertIn('中文翻译', user_msg['content'])
        self.assertIn('重点词汇解释', user_msg['content'])
        self.assertIn('学习建议', user_msg['content'])

    def test_vocabulary_practice_template_structure(self):
        """测试词汇练习模板结构"""
        template = PromptTemplates.vocabularyPractice("hello", "Hello world!")

        # 验证模板结构
        self.assertIsInstance(template, list)
        self.assertEqual(len(template), 2)

        # 验证系统消息
        system_msg = template[0]
        self.assertEqual(system_msg['role'], 'system')
        self.assertIn('词汇老师', system_msg['content'])

        # 验证用户消息
        user_msg = template[1]
        self.assertEqual(user_msg['role'], 'user')
        self.assertIn('hello', user_msg['content'])
        self.assertIn('Hello world!', user_msg['content'])
        self.assertIn('中文释义', user_msg['content'])
        self.assertIn('英文解释', user_msg['content'])
        self.assertIn('例句', user_msg['content'])
        self.assertIn('记忆技巧', user_msg['content'])

    def test_writing_feedback_template_structure(self):
        """测试写作反馈模板结构"""
        template = PromptTemplates.writingFeedback("My essay content.", "advanced")

        # 验证模板结构
        self.assertIsInstance(template, list)
        self.assertEqual(len(template), 2)

        # 验证系统消息
        system_msg = template[0]
        self.assertEqual(system_msg['role'], 'system')
        self.assertIn('写作老师', system_msg['content'])
        self.assertIn('advanced水平', system_msg['content'])

        # 验证用户消息
        user_msg = template[1]
        self.assertEqual(user_msg['role'], 'user')
        self.assertIn('My essay content.', user_msg['content'])
        self.assertIn('语法', user_msg['content'])
        self.assertIn('词汇', user_msg['content'])
        self.assertIn('结构', user_msg['content'])
        self.assertIn('逻辑', user_msg['content'])


class TestTemplateParameterHandling(unittest.TestCase):
    """测试模板参数处理"""

    def test_reading_assistant_parameter_substitution(self):
        """测试阅读助手参数替换"""
        content = "The quick brown fox jumps over the lazy dog."
        difficulty = 8

        template = PromptTemplates.readingAssistant(content, difficulty)

        # 验证参数替换
        self.assertIn(f"难度等级：{difficulty}/10", template[0]['content'])
        self.assertIn(content, template[1]['content'])

    def test_vocabulary_practice_parameter_substitution(self):
        """测试词汇练习参数替换"""
        word = "algorithm"
        context = "The algorithm solves this problem efficiently."

        template = PromptTemplates.vocabularyPractice(word, context)

        # 验证参数替换
        self.assertIn(f"'{word}'", template[1]['content'])
        self.assertIn(context, template[1]['content'])

    def test_writing_feedback_parameter_substitution(self):
        """测试写作反馈参数替换"""
        text = "This is my essay about artificial intelligence."
        level = "beginner"

        template = PromptTemplates.writingFeedback(text, level)

        # 验证参数替换
        self.assertIn(f"{level}水平", template[0]['content'])
        self.assertIn(text, template[1]['content'])

    def test_template_with_special_characters(self):
        """测试包含特殊字符的模板"""
        # 测试包含引号、换行符等特殊字符
        content = 'He said, "Hello world!"\nThis is a test.'
        difficulty = 3

        template = PromptTemplates.readingAssistant(content, difficulty)

        # 应该能正确处理特殊字符
        self.assertIn(content, template[1]['content'])

    def test_template_with_unicode(self):
        """测试Unicode字符处理"""
        content = "学习人工智能很有趣。"
        difficulty = 7

        template = PromptTemplates.readingAssistant(content, difficulty)

        # 应该能正确处理Unicode字符
        self.assertIn(content, template[1]['content'])

    def test_template_parameter_validation(self):
        """测试模板参数验证"""
        # 测试空内容
        template = PromptTemplates.readingAssistant("", 5)
        self.assertIn("", template[1]['content'])

        # 测试边界值
        template = PromptTemplates.readingAssistant("test", 0)
        self.assertIn("0/10", template[0]['content'])

        template = PromptTemplates.readingAssistant("test", 10)
        self.assertIn("10/10", template[0]['content'])

        # 测试超出边界的值
        template = PromptTemplates.readingAssistant("test", 15)
        self.assertIn("15/10", template[0]['content'])


class TestTemplateMessageValidation(unittest.TestCase):
    """测试模板消息验证"""

    def test_message_role_validation(self):
        """测试消息角色验证"""
        template = PromptTemplates.readingAssistant("test", 5)

        for msg in template:
            self.assertIn('role', msg)
            self.assertIn('content', msg)
            self.assertIn(msg['role'], ['system', 'user'])
            self.assertIsInstance(msg['content'], str)

    def test_message_content_length(self):
        """测试消息内容长度"""
        template = PromptTemplates.readingAssistant("test", 5)

        for msg in template:
            self.assertGreater(len(msg['content']), 0)

    def test_message_content_structure(self):
        """测试消息内容结构"""
        template = PromptTemplates.vocabularyPractice("hello", "Hello world!")

        user_msg = template[1]
        content = user_msg['content']

        # 应该包含所有必要的信息点
        required_phrases = ['中文释义', '英文解释', '例句', '记忆技巧']
        for phrase in required_phrases:
            self.assertIn(phrase, content)


class TestTemplateWithLLMService(unittest.TestCase):
    """测试模板与LLM服务的集成"""

    def setUp(self):
        """测试前准备"""
        # 读取真实配置文件
        config_file = projectRoot / 'test_api_providers.json'
        if config_file.exists():
            with open(config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)

            # 转换配置格式
            self.test_config = {
                "providers": {}
            }

            for item in config_data:
                for modelKey, modelConfig in item.items():
                    providerName = "zhipuai"
                    if providerName not in self.test_config["providers"]:
                        self.test_config["providers"][providerName] = {
                            "name": "智谱AI",
                            "base_url": modelConfig["baseurl"],
                            "api_key": modelConfig["apikey"],
                            "models": {}
                        }
                    self.test_config["providers"][providerName]["models"][modelKey] = {
                        "max_tokens": 4000,
                        "temperature": 0.7
                    }
        else:
            self.skipTest("test_api_providers.json 文件不存在")

    def test_reading_assistant_with_llm_service(self):
        """测试阅读助手模板与LLM服务集成 - 真实API"""
        llm_service = LLMService(configData=self.test_config)

        # 使用模板进行真实API调用
        response = llm_service.chatWithTemplate(
            PromptTemplates.readingAssistant("人工智能是未来的重要技术。", 5)
        )

        # 验证响应
        self.assertTrue(response.success, f"API调用失败: {response.error}")
        self.assertIsNotNone(response.content)
        self.assertGreater(len(response.content), 0)
        print(f"阅读助手响应: {response.content[:200]}...")

    def test_vocabulary_practice_with_llm_service(self):
        """测试词汇练习模板与LLM服务集成 - 真实API"""
        llm_service = LLMService(configData=self.test_config)

        # 使用模板进行真实API调用
        response = llm_service.chatWithTemplate(
            PromptTemplates.vocabularyPractice("innovation", "Innovation drives technological advancement.")
        )

        # 验证响应
        self.assertTrue(response.success, f"API调用失败: {response.error}")
        self.assertIsNotNone(response.content)
        self.assertGreater(len(response.content), 0)
        print(f"词汇练习响应: {response.content[:200]}...")

    def test_writing_feedback_with_llm_service(self):
        """测试写作反馈模板与LLM服务集成 - 真实API"""
        llm_service = LLMService(configData=self.test_config)

        # 使用模板进行真实API调用
        response = llm_service.chatWithTemplate(
            PromptTemplates.writingFeedback("Technology is very important in our daily life.", "intermediate")
        )

        # 验证响应
        self.assertTrue(response.success, f"API调用失败: {response.error}")
        self.assertIsNotNone(response.content)
        self.assertGreater(len(response.content), 0)
        print(f"写作反馈响应: {response.content[:200]}...")


class TestTemplateCustomization(unittest.TestCase):
    """测试模板自定义功能"""

    def test_create_custom_template(self):
        """测试创建自定义模板"""
        def custom_template(subject, difficulty=5):
            return [
                {
                    "role": "system",
                    "content": f"You are a {subject} tutor for level {difficulty} students."
                },
                {
                    "role": "user",
                    "content": f"Please explain {subject} concepts clearly."
                }
            ]

        template = custom_template("mathematics", 7)

        self.assertEqual(len(template), 2)
        self.assertEqual(template[0]['role'], 'system')
        self.assertIn('mathematics', template[0]['content'])
        self.assertIn('level 7', template[0]['content'])
        self.assertIn('mathematics', template[1]['content'])

    def test_template_modification(self):
        """测试模板修改"""
        # 获取基础模板
        template = PromptTemplates.readingAssistant("Original content", 5)

        # 修改模板
        modified_template = template.copy()
        modified_template[0]['content'] = modified_template[0]['content'].replace('英语学习助手', '专业英语教师')
        modified_template.append({
            "role": "assistant",
            "content": "I understand your request."
        })

        # 验证修改
        self.assertEqual(len(modified_template), 3)
        self.assertIn('专业英语教师', modified_template[0]['content'])
        self.assertEqual(modified_template[2]['role'], 'assistant')

    def test_template_combination(self):
        """测试模板组合"""
        # 组合多个模板
        reading_template = PromptTemplates.readingAssistant("Article content", 5)
        vocab_template = PromptTemplates.vocabularyPractice("important", "This is important.")

        # 创建组合模板
        combined_template = reading_template + vocab_template[1:]  # 跳过重复的系统消息

        # 验证组合
        self.assertEqual(len(combined_template), 3)
        self.assertEqual(combined_template[0]['role'], 'system')
        self.assertEqual(combined_template[1]['role'], 'user')
        self.assertEqual(combined_template[2]['role'], 'user')


class TestTemplatePerformance(unittest.TestCase):
    """测试模板性能"""

    def test_template_generation_speed(self):
        """测试模板生成速度"""
        import time

        # 测试大量模板生成
        start_time = time.time()

        for i in range(1000):
            template = PromptTemplates.readingAssistant(f"Test content {i}", i % 10)

        end_time = time.time()
        generation_time = end_time - start_time

        # 应该在合理时间内完成
        self.assertLess(generation_time, 1.0)  # 应该少于1秒
        print(f"模板生成性能: {1000}个模板耗时 {generation_time:.3f}秒")

    def test_template_memory_usage(self):
        """测试模板内存使用"""
        import sys

        # 获取模板的内存大小
        template = PromptTemplates.readingAssistant("Test content", 5)
        template_size = sys.getsizeof(template)

        # 模板应该相对较小
        self.assertLess(template_size, 1024)  # 应该少于1KB
        print(f"模板内存使用: {template_size} 字节")


def run_template_tests():
    """运行模板测试"""
    print("=== LLM提示词模板测试 ===\n")

    # 创建测试套件
    test_classes = [
        TestPromptTemplatesStructure,
        TestTemplateParameterHandling,
        TestTemplateMessageValidation,
        TestTemplateWithLLMService,
        TestTemplateCustomization,
        TestTemplatePerformance
    ]

    suite = unittest.TestSuite()

    for test_class in test_classes:
        tests = unittest.TestLoader().loadTestsFromTestCase(test_class)
        suite.addTests(tests)

    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 输出结果
    print(f"\n=== 模板测试结果 ===")
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
        success = run_template_tests()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"模板测试运行异常: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)