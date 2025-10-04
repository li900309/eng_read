#!/usr/bin/env python3
"""
测试新的配置文件加载功能

验证LLM服务能否正确加载新的JSON配置格式。
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

from app.services import getLLMServiceWithConfig, getLLMService, resetLLMServices


def testNewConfigFormat():
    """测试新配置格式"""
    print("=== 测试新的JSON配置格式 ===\n")

    # 测试文件路径
    configFile = projectRoot / 'test_api_providers.json'

    if not configFile.exists():
        print(f"✗ 测试配置文件不存在: {configFile}")
        return False

    try:
        print(f"加载配置文件: {configFile}")
        llmService = getLLMServiceWithConfig(str(configFile))

        # 检查配置是否正确加载
        providers = llmService.configManager.getAllProviders()
        print(f"✓ 成功加载 {len(providers)} 个供应商")

        for providerName, providerConfig in providers.items():
            print(f"\n供应商: {providerName}")
            print(f"  名称: {providerConfig.get('name', 'Unknown')}")
            print(f"  基础URL: {providerConfig.get('base_url', 'Unknown')}")

            models = providerConfig.get('models', {})
            for modelName, modelConfig in models.items():
                print(f"  模型: {modelName}")
                print(f"    最大tokens: {modelConfig.get('max_tokens', 'Unknown')}")
                print(f"    温度: {modelConfig.get('temperature', 'Unknown')}")

        return True

    except Exception as e:
        print(f"✗ 加载配置失败: {e}")
        return False


def testDirectConfigData():
    """测试直接传入配置数据"""
    print("\n=== 测试直接传入配置数据 ===\n")

    # 模拟配置数据
    configData = [
        {
            "test-model": {
                "baseurl": "https://api.test.com/v1/",
                "modelname": "Test Model",
                "apikey": "test-key-123",
                "max_tokens": 2000,
                "temperature": 0.5
            }
        }
    ]

    try:
        print("创建LLM服务实例...")
        llmService = getLLMService(configData=configData)

        # 检查配置
        firstProvider = llmService.configManager.getFirstAvailableProvider()
        if firstProvider:
            print(f"✓ 第一个可用供应商: {firstProvider}")

            # 获取模型配置
            models = llmService.configManager.getProvider(firstProvider).get('models', {})
            if models:
                firstModel = list(models.keys())[0]
                print(f"✓ 第一个可用模型: {firstModel}")

                return True

        print("✗ 未找到可用的供应商或模型")
        return False

    except Exception as e:
        print(f"✗ 测试失败: {e}")
        return False


def testTemplateWithNewConfig():
    """测试使用新配置进行模板聊天"""
    print("\n=== 测试模板聊天功能 ===\n")

    configFile = projectRoot / 'test_api_providers.json'

    if not configFile.exists():
        print(f"✗ 测试配置文件不存在: {configFile}")
        return False

    try:
        # 重置服务实例
        resetLLMServices()

        # 使用新配置创建服务
        llmService = getLLMServiceWithConfig(str(configFile))

        from app.services import PromptTemplates

        # 使用阅读助手模板
        print("使用阅读助手模板发送请求...")
        response = llmService.chatWithTemplate(
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
        print(f"✗ 测试失败: {e}")
        return False


def testConfigComparison():
    """测试配置格式对比"""
    print("\n=== 配置格式对比测试 ===\n")

    # 传统配置格式
    traditionalConfig = {
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

    # 新格式
    newConfig = [
        {
            "glm-4.5-flash": {
                "baseurl": "https://open.bigmodel.cn/api/paas/v4/",
                "modelname": "GLM-4.5-Flash",
                "apikey": "test-key"
            }
        }
    ]

    try:
        # 测试传统格式
        resetLLMServices()
        service1 = getLLMService(configData=traditionalConfig)
        providers1 = service1.configManager.getAllProviders()
        print(f"✓ 传统格式加载成功: {len(providers1)} 个供应商")

        # 测试新格式
        service2 = getLLMService(configData=newConfig)
        providers2 = service2.configManager.getAllProviders()
        print(f"✓ 新格式加载成功: {len(providers2)} 个供应商")

        return True

    except Exception as e:
        print(f"✗ 格式对比测试失败: {e}")
        return False


def main():
    """主测试函数"""
    print("=== LLM新配置格式功能测试 ===\n")

    tests = [
        ("新配置格式测试", testNewConfigFormat),
        ("直接配置数据测试", testDirectConfigData),
        ("模板聊天测试", testTemplateWithNewConfig),
        ("配置格式对比测试", testConfigComparison),
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
        print("🎉 所有测试通过！新配置格式工作正常。")
        return 0
    else:
        print("⚠️  部分测试失败，请检查实现。")
        return 1


if __name__ == '__main__':
    sys.exit(main())