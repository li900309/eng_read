#!/usr/bin/env python3
"""
LLM配置使用示例

演示如何使用不同的配置方式来初始化LLM服务。
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

from app.services import getLLMService, getLLMServiceWithConfig, PromptTemplates


def example1_useDefaultConfig():
    """示例1: 使用默认配置"""
    print("=== 示例1: 使用默认配置 ===")

    # 使用默认配置文件 (config/llm_config.json)
    llmService = getLLMService()

    # 获取第一个可用的供应商
    firstProvider = llmService.configManager.getFirstAvailableProvider()
    print(f"默认供应商: {firstProvider}")

    # 发送消息
    from app.services import LLMMessage
    messages = [LLMMessage(role='user', content='Hello!')]

    print("发送消息到LLM...")
    response = llmService.chat(messages)

    if response.success:
        print(f"✓ 响应: {response.content[:100]}...")
    else:
        print(f"✗ 失败: {response.error}")


def example2_useCustomConfigFile():
    """示例2: 使用自定义配置文件"""
    print("\n=== 示例2: 使用自定义配置文件 ===")

    configFile = projectRoot / 'test_api_providers.json'

    if configFile.exists():
        print(f"使用配置文件: {configFile}")
        llmService = getLLMServiceWithConfig(str(configFile))

        # 显示加载的配置
        providers = llmService.configManager.getAllProviders()
        for providerName, providerConfig in providers.items():
            print(f"供应商: {providerName}")
            print(f"  名称: {providerConfig.get('name')}")
            print(f"  URL: {providerConfig.get('base_url')}")

        # 使用阅读助手模板
        print("\n使用阅读助手...")
        response = llmService.chatWithTemplate(
            PromptTemplates.readingAssistant(
                "Artificial intelligence is transforming education.",
                5
            )
        )

        if response.success:
            print(f"✓ AI分析结果: {response.content[:200]}...")
        else:
            print(f"✗ 失败: {response.error}")
    else:
        print(f"配置文件不存在: {configFile}")


def example3_useDirectConfig():
    """示例3: 直接传入配置数据"""
    print("\n=== 示例3: 直接传入配置数据 ===")

    # 直接定义配置数据
    configData = [
        {
            "custom-model": {
                "baseurl": "https://api.example.com/v1/",
                "modelname": "Custom AI Model",
                "apikey": "your-api-key-here",
                "max_tokens": 3000,
                "temperature": 0.8
            }
        }
    ]

    print("直接使用配置数据...")
    llmService = getLLMService(configData=configData)

    # 获取供应商信息
    firstProvider = llmService.configManager.getFirstAvailableProvider()
    providerConfig = llmService.configManager.getProvider(firstProvider)

    print(f"供应商名称: {providerConfig.get('name')}")
    print(f"模型配置: {list(providerConfig.get('models', {}).keys())}")

    # 使用词汇练习模板
    print("\n测试词汇练习...")
    response = llmService.chatWithTemplate(
        PromptTemplates.vocabularyPractice("algorithm", "The algorithm solves this problem efficiently.")
    )

    if response.success:
        print(f"✓ 词汇分析: {response.content[:200]}...")
    else:
        print(f"✗ 失败: {response.error}")


def example4_multiProviderComparison():
    """示例4: 多供应商配置对比"""
    print("\n=== 示例4: 多供应商配置 ===")

    # 多供应商配置
    multiProviderConfig = {
        "providers": {
            "provider1": {
                "name": "Provider One",
                "base_url": "https://api.provider1.com/v1",
                "api_key": "key1",
                "models": {
                    "model-a": {"max_tokens": 2000, "temperature": 0.7},
                    "model-b": {"max_tokens": 4000, "temperature": 0.5}
                }
            },
            "provider2": {
                "name": "Provider Two",
                "base_url": "https://api.provider2.com/v1",
                "api_key": "key2",
                "models": {
                    "model-x": {"max_tokens": 3000, "temperature": 0.8}
                }
            }
        }
    }

    print("加载多供应商配置...")
    llmService = getLLMService(configData=multiProviderConfig)

    # 列出所有供应商
    providers = llmService.configManager.getAllProviders()
    print(f"可用供应商数量: {len(providers)}")

    for providerName, providerConfig in providers.items():
        print(f"\n供应商: {providerName}")
        print(f"  名称: {providerConfig.get('name')}")
        models = providerConfig.get('models', {})
        for modelName, modelConfig in models.items():
            print(f"  模型: {modelName}")
            print(f"    max_tokens: {modelConfig.get('max_tokens')}")
            print(f"    temperature: {modelConfig.get('temperature')}")


def example5_errorHandling():
    """示例5: 错误处理"""
    print("\n=== 示例5: 错误处理 ===")

    # 测试不存在的配置文件
    try:
        llmService = getLLMServiceWithConfig("nonexistent_config.json")
    except FileNotFoundError as e:
        print(f"✓ 正确捕获文件不存在错误: {e}")

    # 测试格式错误的配置
    try:
        badConfig = {"invalid": "format"}
        llmService = getLLMService(configData=badConfig)
        print("✓ 无效格式被正确处理，使用备用配置")
    except Exception as e:
        print(f"✓ 捕获配置错误: {e}")


def main():
    """主函数"""
    print("=== LLM配置使用示例 ===\n")

    examples = [
        ("默认配置", example1_useDefaultConfig),
        ("自定义配置文件", example2_useCustomConfigFile),
        ("直接配置数据", example3_useDirectConfig),
        ("多供应商配置", example4_multiProviderComparison),
        ("错误处理", example5_errorHandling),
    ]

    for exampleName, exampleFunc in examples:
        try:
            exampleFunc()
        except Exception as e:
            print(f"✗ {exampleName} 示例失败: {e}")
        print("-" * 50)

    print("\n=== 使用建议 ===")
    print("1. 开发环境: 使用默认配置文件 config/llm_config.json")
    print("2. 测试环境: 使用 getLLMServiceWithConfig() 加载测试配置")
    print("3. 生产环境: 通过环境变量管理API密钥")
    print("4. 动态配置: 使用 getLLMService(configData=data) 传入运行时配置")
    print("5. 多供应商: 在配置中定义多个供应商，便于切换和对比")


if __name__ == '__main__':
    main()