#!/usr/bin/env python3
"""
测试配置加载功能

快速验证新的配置文件加载功能是否正常工作。
"""

import sys
import os
import json
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

def testConfigFileLoading():
    """测试配置文件加载"""
    print("=== 测试配置文件加载功能 ===")

    # 测试1: 验证配置文件存在
    configFile = projectRoot / 'test_api_providers.json'
    if not configFile.exists():
        print(f"✗ 测试配置文件不存在: {configFile}")
        return False
    print(f"✓ 配置文件存在: {configFile}")

    # 测试2: 验证JSON格式
    try:
        with open(configFile, 'r', encoding='utf-8') as f:
            configData = json.load(f)
        print("✓ JSON格式正确")
    except Exception as e:
        print(f"✗ JSON格式错误: {e}")
        return False

    # 测试3: 验证配置数据结构
    if not isinstance(configData, list):
        print("✗ 配置应该是数组格式")
        return False

    if len(configData) == 0:
        print("✗ 配置数组为空")
        return False

    firstItem = configData[0]
    if not isinstance(firstItem, dict):
        print("✗ 配置项应该是对象")
        return False

    print(f"✓ 配置数据结构正确，包含 {len(configData)} 个配置项")

    # 测试4: 验证具体配置字段
    for configItem in configData:
        for model_name, model_config in configItem.items():
            print(f"  模型: {model_name}")
            print(f"    baseurl: {model_config.get('baseurl', 'N/A')}")
            print(f"    modelname: {model_config.get('modelname', 'N/A')}")
            print(f"    apikey: {'***' if model_config.get('apikey') else 'N/A'}")

    return True


def testServiceInstantiation():
    """测试服务实例化"""
    print("\n=== 测试服务实例化 ===")

    try:
        # 导入必要模块
        from app.services import getLLMServiceWithConfig, getLLMService, resetLLMServices

        # 重置服务实例
        resetLLMServices()
        print("✓ 服务实例重置成功")

        # 测试使用配置文件创建服务
        configFile = projectRoot / 'test_api_providers.json'
        llmService = getLLMServiceWithConfig(str(configFile))
        print("✓ 使用配置文件创建服务成功")

        # 测试配置管理器
        providers = llmService.configManager.getAllProviders()
        if providers:
            print(f"✓ 成功加载 {len(providers)} 个供应商")

            # 显示第一个供应商信息
            firstProvider = list(providers.keys())[0]
            providerConfig = providers[firstProvider]
            print(f"  第一个供应商: {firstProvider}")
            print(f"  供应商名称: {providerConfig.get('name', 'N/A')}")
            print(f"  基础URL: {providerConfig.get('base_url', 'N/A')}")

            # 显示模型信息
            models = providerConfig.get('models', {})
            if models:
                firstModel = list(models.keys())[0]
                print(f"  第一个模型: {firstModel}")
        else:
            print("✗ 未加载到任何供应商")
            return False

        return True

    except Exception as e:
        print(f"✗ 服务实例化失败: {e}")
        import traceback
        traceback.print_exc()
        return False


def testConfigConversion():
    """测试配置格式转换"""
    print("\n=== 测试配置格式转换 ===")

    try:
        from app.services import LLMConfigManager

        # 测试新格式转换
        newConfig = [
            {
                "test-model": {
                    "baseurl": "https://api.test.com/v1/",
                    "modelname": "Test Model",
                    "apikey": "test-key",
                    "max_tokens": 2000,
                    "temperature": 0.5
                }
            }
        ]

        configManager = LLMConfigManager(configData=newConfig)
        providers = configManager.getAllProviders()

        if providers:
            print("✓ 新格式转换成功")
            provider = list(providers.values())[0]
            print(f"  转换后名称: {provider.get('name')}")
            print(f"  转换后URL: {provider.get('base_url')}")

            # 验证字段映射
            models = provider.get('models', {})
            if models:
                model = list(models.values())[0]
                print(f"  模型配置: max_tokens={model.get('max_tokens')}")
            return True
        else:
            print("✗ 新格式转换失败")
            return False

    except Exception as e:
        print(f"✗ 配置转换测试失败: {e}")
        return False


def main():
    """主测试函数"""
    print("LLM配置加载功能测试\n")

    tests = [
        ("配置文件加载", testConfigFileLoading),
        ("服务实例化", testServiceInstantiation),
        ("配置格式转换", testConfigConversion),
    ]

    results = []
    for testName, testFunc in tests:
        try:
            result = testFunc()
            results.append((testName, result))
        except Exception as e:
            print(f"✗ {testName} 出现异常: {e}")
            results.append((testName, False))

    # 输出结果
    print("\n=== 测试结果 ===")
    passed = sum(1 for _, result in results if result)
    total = len(results)

    for testName, result in results:
        status = "✓ 通过" if result else "✗ 失败"
        print(f"{testName}: {status}")

    print(f"\n总计: {passed}/{total} 个测试通过")

    if passed == total:
        print("🎉 所有测试通过！配置加载功能正常工作。")
        return 0
    else:
        print("⚠️  部分测试失败，请检查配置和实现。")
        return 1


if __name__ == '__main__':
    sys.exit(main())