# LLM服务测试套件

本目录包含了LLM服务的完整测试套件，涵盖了基础功能、配置加载、API连接、模板功能和集成测试。

## 测试文件说明

### 核心测试文件

1. **`test_llm_basic.py`** - 基础功能测试
   - 测试LLM消息和响应类
   - 测试配置管理器
   - 测试LLM服务类
   - 测试提示词模板
   - 测试服务函数

2. **`test_llm_config.py`** - 配置加载测试
   - 测试不同配置格式（标准格式和简化格式）
   - 测试配置文件加载和解析
   - 测试环境变量替换
   - 测试字段映射
   - 测试`test_api_providers.json`文件

3. **`test_llm_api.py`** - API连接测试
   - 测试API调用成功场景
   - 测试API错误处理（认证、限流、超时等）
   - 测试真实API连接（如果配置可用）
   - 测试模拟API服务器
   - 测试各种错误格式

4. **`test_llm_templates.py`** - 模板功能测试
   - 测试提示词模板结构
   - 测试参数替换和验证
   - 测试消息验证
   - 测试模板与LLM服务集成
   - 测试模板自定义和性能

5. **`test_llm_integration.py`** - 集成测试
   - 端到端工作流测试
   - 多供应商场景测试
   - 错误恢复场景测试
   - 性能和负载测试

6. **`run_all_tests.py`** - 测试运行器
   - 统一运行所有测试
   - 支持不同测试模式
   - 生成测试报告
   - 快速检查功能

## 使用方法

### 快速开始

1. **快速检查**（推荐先运行）
   ```bash
   python tests/run_all_tests.py quick
   ```

2. **运行完整测试套件**
   ```bash
   python tests/run_all_tests.py
   ```

### 单独运行测试模块

```bash
# 基础功能测试
python tests/run_all_tests.py basic

# 配置加载测试
python tests/run_all_tests.py config

# API连接测试
python tests/run_all_tests.py api

# 模板功能测试
python tests/run_all_tests.py templates

# 集成测试
python tests/run_all_tests.py integration
```

### 直接运行单个测试文件

```bash
# 运行基础测试
python tests/test_llm_basic.py

# 运行配置测试
python tests/test_llm_config.py

# 运行API测试
python tests/test_llm_api.py

# 运行模板测试
python tests/test_llm_templates.py

# 运行集成测试
python tests/test_llm_integration.py
```

## 测试配置

### 测试配置文件

测试使用的主要配置文件：
- `config/llm_config.json` - 标准格式配置
- `test_api_providers.json` - 简化格式配置（用于测试新格式）

### 环境变量

如果需要测试真实API连接，可以设置以下环境变量：
```bash
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"
export LLM_PROVIDER="openai"  # 或其他供应商
export LLM_MODEL="gpt-4"      # 或其他模型
```

## 测试场景

### 1. 基础功能测试

- ✅ 消息和响应类创建和属性
- ✅ 配置管理器初始化和配置获取
- ✅ LLM服务创建和基本方法
- ✅ 提示词模板生成和结构
- ✅ 服务函数和实例管理

### 2. 配置加载测试

- ✅ 标准格式配置解析
- ✅ 简化格式配置转换
- ✅ 环境变量替换
- ✅ 配置文件加载和错误处理
- ✅ 字段映射和验证

### 3. API连接测试

- ✅ 模拟API成功调用
- ✅ API认证错误处理
- ✅ API限流和超时处理
- ✅ 连接错误和服务器错误处理
- ✅ 真实API连接测试（可选）

### 4. 模板功能测试

- ✅ 阅读助手模板生成
- ✅ 词汇练习模板生成
- ✅ 写作反馈模板生成
- ✅ 参数替换和特殊字符处理
- ✅ 模板性能测试

### 5. 集成测试

- ✅ 端到端工作流测试
- ✅ 多供应商切换和对比
- ✅ 错误恢复和回退机制
- ✅ 并发请求和性能测试

## 测试报告

测试运行后会在 `test_reports/` 目录下生成Markdown格式的测试报告，包含：
- 测试执行时间
- 各测试套件结果
- 详细的错误信息
- 成功率统计

## 模拟服务器

测试包含对模拟API服务器的支持：

### 启动模拟服务器
```bash
python scripts/mock_llm_server.py
```

模拟服务器提供：
- 标准OpenAI兼容API
- 多种响应模板
- 健康检查接口
- 可配置的延迟和错误

## 故障排除

### 常见问题

1. **导入错误**
   ```
   ImportError: No module named 'flask'
   ```
   - 解决方案：安装所需依赖或使用虚拟环境
   - 或者只运行不依赖Flask的配置测试

2. **API连接失败**
   - 检查网络连接
   - 验证API密钥配置
   - 确认API服务可用性

3. **配置文件错误**
   - 检查JSON格式是否正确
   - 验证必需字段是否存在
   - 确认文件路径正确

### 调试模式

设置环境变量启用详细日志：
```bash
export LLM_TEST_DEBUG=1
python tests/run_all_tests.py
```

## 持续集成

这些测试设计为可以在CI/CD环境中运行：

```yaml
# GitHub Actions 示例
- name: Run LLM Tests
  run: |
    python tests/run_all_tests.py quick
    python tests/run_all_tests.py basic
    python tests/run_all_tests.py config
```

## 贡献指南

### 添加新测试

1. 在相应的测试文件中添加测试方法
2. 确保测试方法以`test_`开头
3. 添加适当的断言和错误处理
4. 更新文档

### 测试命名约定

- 测试类：`Test<功能名>`
- 测试方法：`test_<具体场景>`
- 模拟数据：使用`mock_`前缀
- 配置数据：使用`test_`前缀

## 性能基准

测试套件的性能目标：
- 快速检查：< 5秒
- 基础测试：< 30秒
- 完整测试：< 2分钟

## 版本兼容性

测试套件支持：
- Python 3.8+
- 主要操作系统（Windows、macOS、Linux）
- 虚拟环境和容器环境

---

**注意**：在运行真实API测试前，请确保已正确配置API密钥，并注意可能的费用产生。建议先使用模拟服务器进行开发和测试。