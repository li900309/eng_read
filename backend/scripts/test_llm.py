#!/usr/bin/env python3
"""
LLM模块测试脚本

用于快速验证LLM模块功能的脚本。
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

from app.services import LLMService, PromptTemplates, LLMMessage


def testLLMConfig():
    """测试LLM配置"""
    print("测试LLM配置...")

    service = LLMService()

    # 检查配置是否加载成功
    if service.configManager.config:
        print("✓ 配置加载成功")
        providers = list(service.configManager.config.get('providers', {}).keys())
        print(f"  可用供应商: {providers}")
    else:
        print("✗ 配置加载失败")
        return False

    return True


def testPromptTemplates():
    """测试提示词模板"""
    print("\n测试提示词模板...")

    try:
        # 测试阅读助手模板
        template = PromptTemplates.readingAssistant("This is a test article.", 5)
        print("✓ 阅读助手模板生成成功")
        print(f"  消息数量: {len(template)}")

        # 测试词汇练习模板
        template = PromptTemplates.vocabularyPractice("hello", "Hello world!")
        print("✓ 词汇练习模板生成成功")

        # 测试写作反馈模板
        template = PromptTemplates.writingFeedback("My test essay.", "intermediate")
        print("✓ 写作反馈模板生成成功")

        return True

    except Exception as e:
        print(f"✗ 模板测试失败: {e}")
        return False


def testLLMService():
    """测试LLM服务"""
    print("\n测试LLM服务...")

    try:
        service = LLMService()

        # 测试简单消息
        messages = [LLMMessage(role='user', content='Hello, how are you?')]

        print("发送测试消息到LLM...")
        response = service.chat(messages, 'local', 'local-model')

        if response.success:
            print("✓ LLM服务调用成功")
            print(f"  响应内容: {response.content[:100]}...")
            if response.usage:
                print(f"  使用情况: {response.usage}")
            return True
        else:
            print(f"✗ LLM服务调用失败: {response.error}")
            return False

    except Exception as e:
        print(f"✗ LLM服务测试失败: {e}")
        return False


def testTemplateChat():
    """测试模板聊天"""
    print("\n测试模板聊天...")

    try:
        service = LLMService()

        # 使用阅读助手模板
        response = service.chatWithTemplate(
            PromptTemplates.readingAssistant(
                "The quick brown fox jumps over the lazy dog.",
                3
            )
        )

        if response.success:
            print("✓ 模板聊天成功")
            print(f"  响应内容: {response.content[:100]}...")
            return True
        else:
            print(f"✗ 模板聊天失败: {response.error}")
            return False

    except Exception as e:
        print(f"✗ 模板聊天测试失败: {e}")
        return False


def main():
    """主测试函数"""
    print("=== LLM模块功能测试 ===\n")

    tests = [
        ("配置测试", testLLMConfig),
        ("模板测试", testPromptTemplates),
        ("LLM服务测试", testLLMService),
        ("模板聊天测试", testTemplateChat),
    ]

    results = []
    for testName, testFunc in tests:
        try:
            result = testFunc()
            results.append((testName, result))
        except Exception as e:
            print(f"✗ {testName}出现异常: {e}")
            results.append((testName, False))

    # 输出测试结果
    print("\n=== 测试结果汇总 ===")
    successCount = 0
    for testName, result in results:
        status = "✓ 通过" if result else "✗ 失败"
        print(f"{testName}: {status}")
        if result:
            successCount += 1

    print(f"\n总计: {successCount}/{len(results)} 个测试通过")

    if successCount == len(results):
        print("🎉 所有测试通过！LLM模块工作正常。")
        return 0
    else:
        print("⚠️  部分测试失败，请检查配置和依赖。")
        return 1


if __name__ == '__main__':
    sys.exit(main())