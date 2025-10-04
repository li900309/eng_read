#!/usr/bin/env python3
"""
简化的配置测试（不依赖Flask）

仅测试配置文件格式和基本功能。
"""

import sys
import os
import json
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

def testConfigFormat():
    """测试配置格式"""
    print("=== 测试配置格式 ===")

    configFile = projectRoot / 'test_api_providers.json'
    if not configFile.exists():
        print(f"✗ 配置文件不存在: {configFile}")
        return False

    with open(configFile, 'r', encoding='utf-8') as f:
        configData = json.load(f)

    print("✓ 配置文件读取成功")
    print(f"配置类型: {type(configData)}")
    print(f"配置项数量: {len(configData)}")

    # 验证配置结构
    for i, configItem in enumerate(configData):
        print(f"\n配置项 {i+1}:")
        for modelName, modelConfig in configItem.items():
            print(f"  模型名称: {modelName}")
            print(f"  基础URL: {modelConfig.get('baseurl')}")
            print(f"  显示名称: {modelConfig.get('modelname')}")
            print(f"  API密钥: {'已设置' if modelConfig.get('apikey') else '未设置'}")

    return True


def testFieldMapping():
    """测试字段映射逻辑"""
    print("\n=== 测试字段映射 ===")

    # 模拟字段映射
    def mapFields(config):
        mapped_providers = {}
        for provider_config in config:
            for model_name, model_info in provider_config.items():
                provider_name = f"provider_{model_name.replace('-', '_')}"
                mapped_providers[provider_name] = {
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
        return mapped_providers

    # 测试数据
    testConfig = [
        {
            "glm-4.5-flash": {
                "baseurl": "https://open.bigmodel.cn/api/paas/v4/",
                "modelname": "GLM-4.5-Flash",
                "apikey": "test-key",
                "max_tokens": 2000,
                "temperature": 0.5
            }
        }
    ]

    mapped = mapFields(testConfig)

    if mapped:
        print("✓ 字段映射成功")
        for providerName, providerConfig in mapped.items():
            print(f"  供应商: {providerName}")
            print(f"    name: {providerConfig['name']}")
            print(f"    base_url: {providerConfig['base_url']}")
            print(f"    api_key: {'已设置' if providerConfig['api_key'] else '未设置'}")
        return True
    else:
        print("✗ 字段映射失败")
        return False


def testApiCompatibility():
    """测试API兼容性"""
    print("\n=== 测试API兼容性 ===")

    # 模拟API调用
    def simulateApiCall(base_url, api_key, model_name, messages):
        """模拟API调用"""
        return {
            "success": True,
            "response": f"模拟响应：模型 {model_name} 收到 {len(messages)} 条消息"
        }

    # 测试配置
    testConfig = [
        {
            "glm-4.5-flash": {
                "baseurl": "https://open.bigmodel.cn/api/paas/v4/",
                "modelname": "GLM-4.5-Flash",
                "apikey": "5b0a735f60c94c3cb1ec99fa4287d86e.lxs4elOazfNl0Ze8"
            }
        }
    ]

    for configItem in testConfig:
        for modelName, modelConfig in configItem.items():
            base_url = modelConfig.get('baseurl')
            api_key = modelConfig.get('apikey')

            print(f"测试模型: {modelName}")
            print(f"API端点: {base_url}")

            # 模拟API调用
            result = simulateApiCall(base_url, api_key, modelName, ["Hello"])
            print(f"✓ API模拟调用成功: {result['response']}")

    return True


def main():
    """主测试函数"""
    print("=== 简化配置测试 ===\n")

    tests = [
        ("配置格式验证", testConfigFormat),
        ("字段映射测试", testFieldMapping),
        ("API兼容性测试", testApiCompatibility),
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
        print("🎉 配置格式验证通过！")
        print("💡 下一步：安装依赖后进行完整功能测试")
        return 0
    else:
        print("⚠️  配置格式有问题，请检查。")
        return 1


if __name__ == '__main__':
    sys.exit(main())