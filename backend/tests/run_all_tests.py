#!/usr/bin/env python3
"""
LLM服务测试套件运行器

统一运行所有LLM服务相关的测试。
"""

import sys
import os
import unittest
import time
from pathlib import Path

# 添加项目根目录到Python路径
projectRoot = Path(__file__).parent.parent
sys.path.insert(0, str(projectRoot))

# 导入测试模块
try:
    from test_llm_basic import run_basic_tests
    from test_llm_config import run_config_tests
    from test_llm_api import run_api_tests
    from test_llm_templates import run_template_tests
    from test_llm_integration import run_integration_tests
except ImportError as e:
    print(f"导入测试模块失败: {e}")
    print("请确保所有测试文件都在同一目录下")
    sys.exit(1)


class TestSuiteRunner:
    """测试套件运行器"""

    def __init__(self):
        self.test_suites = [
            ("基础功能测试", run_basic_tests),
            ("配置加载测试", run_config_tests),
            ("API连接测试", run_api_tests),
            ("模板功能测试", run_template_tests),
            ("集成测试", run_integration_tests)
        ]
        self.results = []

    def run_all_tests(self):
        """运行所有测试"""
        print("=" * 80)
        print("LLM服务完整测试套件")
        print("=" * 80)
        print(f"开始时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print()

        total_start_time = time.time()
        total_tests = 0
        total_failures = 0
        total_errors = 0
        total_skipped = 0

        for test_name, test_func in self.test_suites:
            print(f"🧪 运行 {test_name}")
            print("-" * 60)

            try:
                start_time = time.time()
                success = test_func()
                end_time = time.time()

                # 记录结果
                result = {
                    'name': test_name,
                    'success': success,
                    'duration': end_time - start_time,
                    'error': None
                }
                self.results.append(result)

                if success:
                    print(f"✅ {test_name} 通过")
                else:
                    print(f"❌ {test_name} 失败")

            except Exception as e:
                end_time = time.time()
                print(f"💥 {test_name} 异常: {e}")

                result = {
                    'name': test_name,
                    'success': False,
                    'duration': end_time - start_time,
                    'error': str(e)
                }
                self.results.append(result)

            print("-" * 60)
            print()

        total_end_time = time.time()
        total_duration = total_end_time - total_start_time

        # 输出总结
        self.print_summary(total_duration)

        # 生成报告
        self.generate_report(total_duration)

        return all(result['success'] for result in self.results)

    def print_summary(self, total_duration):
        """打印测试总结"""
        print("=" * 80)
        print("测试总结")
        print("=" * 80)

        passed_count = sum(1 for result in self.results if result['success'])
        total_count = len(self.results)

        print(f"测试套件: {passed_count}/{total_count} 通过")
        print(f"总耗时: {total_duration:.2f} 秒")

        print("\n详细结果:")
        for result in self.results:
            status = "✅ 通过" if result['success'] else "❌ 失败"
            duration = result['duration']
            print(f"  {result['name']}: {status} ({duration:.2f}s)")
            if result['error']:
                print(f"    错误: {result['error']}")

        print()

        if passed_count == total_count:
            print("🎉 所有测试套件都通过了！")
        else:
            print("⚠️  部分测试套件失败，请检查详细日志")

    def generate_report(self, total_duration):
        """生成测试报告"""
        report_path = projectRoot / 'test_reports' / f'llm_test_report_{int(time.time())}.md'

        # 确保报告目录存在
        report_path.parent.mkdir(exist_ok=True)

        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("# LLM服务测试报告\n\n")
            f.write(f"**生成时间**: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**总耗时**: {total_duration:.2f} 秒\n\n")

            f.write("## 测试结果概览\n\n")
            passed_count = sum(1 for result in self.results if result['success'])
            total_count = len(self.results)
            f.write(f"- **测试套件**: {passed_count}/{total_count} 通过\n")
            f.write(f"- **成功率**: {passed_count/total_count*100:.1f}%\n\n")

            f.write("## 详细结果\n\n")
            for result in self.results:
                status = "✅ 通过" if result['success'] else "❌ 失败"
                f.write(f"### {result['name']}\n\n")
                f.write(f"- **状态**: {status}\n")
                f.write(f"- **耗时**: {result['duration']:.2f}s\n")
                if result['error']:
                    f.write(f"- **错误**: {result['error']}\n")
                f.write("\n")

        print(f"📄 测试报告已生成: {report_path}")


class QuickTestRunner:
    """快速测试运行器"""

    def __init__(self):
        self.quick_tests = [
            ("配置加载", lambda: self._quick_config_test()),
            ("模板生成", lambda: self._quick_template_test()),
            ("服务创建", lambda: self._quick_service_test())
        ]

    def _quick_config_test(self):
        """快速配置测试"""
        try:
            from app.services.llmService import LLMConfigManager

            # 测试配置加载
            config_data = [
                {
                    "test-model": {
                        "baseurl": "https://api.test.com/v1/",
                        "modelname": "Test Model",
                        "apikey": "test-key"
                    }
                }
            ]

            config_manager = LLMConfigManager(configData=config_data)
            providers = config_manager.getAllProviders()
            return len(providers) > 0
        except Exception as e:
            print(f"配置测试异常: {e}")
            return False

    def _quick_template_test(self):
        """快速模板测试"""
        try:
            from app.services.llmService import PromptTemplates

            # 测试模板生成
            template = PromptTemplates.readingAssistant("Test content", 5)
            return len(template) == 2 and template[0]['role'] == 'system'
        except Exception as e:
            print(f"模板测试异常: {e}")
            return False

    def _quick_service_test(self):
        """快速服务测试"""
        try:
            from app.services.llmService import LLMService

            # 测试服务创建
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
            return llm_service.configManager is not None
        except Exception as e:
            print(f"服务测试异常: {e}")
            return False

    def run_quick_tests(self):
        """运行快速测试"""
        print("🚀 LLM服务快速检查")
        print("=" * 40)

        passed = 0
        total = len(self.quick_tests)

        for test_name, test_func in self.quick_tests:
            try:
                if test_func():
                    print(f"✅ {test_name}: 通过")
                    passed += 1
                else:
                    print(f"❌ {test_name}: 失败")
            except Exception as e:
                print(f"💥 {test_name}: 异常 - {e}")

        print("=" * 40)
        print(f"快速检查结果: {passed}/{total} 通过")

        if passed == total:
            print("🎉 快速检查全部通过！可以运行完整测试套件。")
        else:
            print("⚠️  快速检查发现问题，建议先解决基础问题。")

        return passed == total


def main():
    """主函数"""
    # 解析命令行参数
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        if mode == 'quick':
            # 快速测试模式
            runner = QuickTestRunner()
            success = runner.run_quick_tests()
            return 0 if success else 1
        elif mode == 'basic':
            # 只运行基础测试
            success = run_basic_tests()
            return 0 if success else 1
        elif mode == 'config':
            # 只运行配置测试
            success = run_config_tests()
            return 0 if success else 1
        elif mode == 'api':
            # 只运行API测试
            success = run_api_tests()
            return 0 if success else 1
        elif mode == 'templates':
            # 只运行模板测试
            success = run_template_tests()
            return 0 if success else 1
        elif mode == 'integration':
            # 只运行集成测试
            success = run_integration_tests()
            return 0 if success else 1
        else:
            print(f"未知模式: {mode}")
            print_usage()
            return 1
    else:
        # 运行完整测试套件
        runner = TestSuiteRunner()
        success = runner.run_all_tests()
        return 0 if success else 1


def print_usage():
    """打印使用说明"""
    print("LLM服务测试运行器")
    print()
    print("使用方法:")
    print("  python run_all_tests.py [mode]")
    print()
    print("可用模式:")
    print("  quick         - 快速检查（推荐先运行）")
    print("  basic         - 基础功能测试")
    print("  config        - 配置加载测试")
    print("  api           - API连接测试")
    print("  templates     - 模板功能测试")
    print("  integration   - 集成测试")
    print("  (无参数)      - 运行完整测试套件")
    print()
    print("示例:")
    print("  python run_all_tests.py quick")
    print("  python run_all_tests.py basic")
    print("  python run_all_tests.py")


if __name__ == '__main__':
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⏹️  测试被用户中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 测试运行器异常: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)