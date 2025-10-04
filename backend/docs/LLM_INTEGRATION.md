# LLM模块集成文档

## 概述

本文档描述了LLM模块的集成方式和使用方法。LLM模块提供了统一的AI能力接口，支持多个供应商（OpenAI、Anthropic、本地模型）。

## 架构设计

### 核心组件

1. **LLMService** (`app/services/llmService.py`)
   - 主要的LLM服务类
   - 提供统一的聊天接口
   - 支持多供应商配置

2. **LLMConfigManager**
   - 配置管理器
   - 处理供应商配置和环境变量替换
   - 支持配置文件热加载

3. **PromptTemplates**
   - 提示词模板管理
   - 提供常用的学习场景模板

4. **LLM API** (`app/views/llm.py`)
   - HTTP接口层
   - 提供RESTful API接口

## 配置文件

### LLM配置

支持两种配置格式：

#### 1. 标准格式 (`config/llm_config.json`)

```json
{
  "providers": {
    "openai": {
      "name": "OpenAI",
      "base_url": "https://api.openai.com/v1",
      "api_key": "${OPENAI_API_KEY}",
      "models": {
        "gpt-4": {
          "max_tokens": 4000,
          "temperature": 0.7
        }
      }
    },
    "local": {
      "name": "Local Model",
      "base_url": "http://localhost:8000/v1",
      "api_key": "local-key",
      "models": {
        "local-model": {
          "max_tokens": 4000,
          "temperature": 0.7
        }
      }
    }
  }
}
```

#### 2. 简化格式 (`test_api_providers.json`)

```json
[
  {
    "glm-4.5-flash": {
      "baseurl": "https://open.bigmodel.cn/api/paas/v4/",
      "modelname": "GLM-4.5-Flash",
      "apikey": "your-api-key-here",
      "max_tokens": 4000,
      "temperature": 0.7
    }
  }
]
```

**字段映射**：
- `baseurl` → `base_url`
- `modelname` → `name`
- `apikey` → `api_key`

### 环境变量 (`.env`)

```
# LLM配置
LLM_PROVIDER=local
LLM_MODEL=local-model

# OpenAI配置（可选）
OPENAI_API_KEY=your-openai-api-key

# Anthropic配置（可选）
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## API接口

### 1. 通用聊天接口

**POST** `/api/llm/chat`

```json
{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "provider": "local",
  "model": "local-model"
}
```

### 2. 阅读助手

**POST** `/api/llm/reading-assistant`

```json
{
  "content": "The article content here...",
  "difficulty": 5
}
```

### 3. 词汇练习

**POST** `/api/llm/vocabulary-practice`

```json
{
  "word": "hello",
  "context": "Hello world! This is a test."
}
```

### 4. 写作反馈

**POST** `/api/llm/writing-feedback`

```json
{
  "text": "My essay content here...",
  "level": "intermediate"
}
```

### 5. 获取供应商列表

**GET** `/api/llm/providers`

返回可用的供应商和模型列表。

### 6. 加载自定义配置

**POST** `/api/llm/load-config`

动态加载自定义配置文件。

```json
{
  "config_file": "/path/to/config.json"
}
```

## 使用示例

### 直接使用服务类

```python
from app.services import getLLMService, LLMMessage

# 使用默认配置
llmService = getLLMService()

# 使用自定义配置文件
llmService = getLLMService(configPath="/path/to/config.json")

# 使用配置数据
configData = [
    {
        "my-model": {
            "baseurl": "https://api.example.com/v1/",
            "modelname": "My Model",
            "apikey": "your-api-key"
        }
    }
]
llmService = getLLMService(configData=configData)

# 发送消息
messages = [LLMMessage(role='user', content='Hello')]
response = llmService.chat(messages)

if response.success:
    print(response.content)
```

### 使用配置文件

```python
from app.services import getLLMServiceWithConfig

# 加载配置文件
llmService = getLLMServiceWithConfig("test_api_providers.json")

# 使用模板
response = llmService.chatWithTemplate(
    PromptTemplates.readingAssistant("Article content", 5)
)
```

### 使用模板

```python
from app.services import getLLMService, PromptTemplates

llmService = getLLMService()

# 使用阅读助手模板
response = llmService.chatWithTemplate(
    PromptTemplates.readingAssistant("Article content", 5)
)
```

### 在视图中使用

```python
from flask import Blueprint, request, jsonify
from app.services import getLLMService, PromptTemplates

@llmBlueprint.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    llmService = getLLMService()

    response = llmService.chatWithTemplate(
        PromptTemplates.readingAssistant(
            data['content'],
            data.get('difficulty', 5)
        )
    )

    if response.success:
        return jsonify({
            'success': True,
            'data': {'content': response.content}
        })
```

## 开发和测试

### 启动模拟LLM服务器

```bash
python3 scripts/mock_llm_server.py
```

### 运行测试

```bash
# 运行单元测试
uv run pytest tests/test_llm_service.py

# 运行功能测试
uv run scripts/test_llm.py
```

## 安全考虑

1. **API密钥管理**
   - 使用环境变量存储API密钥
   - 不在代码中硬编码密钥
   - 配置文件使用变量替换

2. **请求限流**
   - 对LLM接口实施限流
   - 不同接口有不同的限流策略

3. **输入验证**
   - 验证消息格式
   - 限制消息长度
   - 防止恶意输入

## 扩展性

1. **添加新供应商**
   - 在配置文件中添加新供应商配置
   - 确保API格式兼容OpenAI标准

2. **添加新模板**
   - 在PromptTemplates类中添加新方法
   - 支持动态参数替换

3. **自定义模型参数**
   - 可在配置中设置max_tokens、temperature等参数
   - 支持不同模型的不同配置

## 性能优化

1. **缓存**
   - 对供应商列表使用缓存
   - 可考虑响应结果缓存

2. **异步处理**
   - 长时间的LLM调用可考虑异步处理
   - 使用任务队列处理重试逻辑

3. **连接池**
   - 复用HTTP连接
   - 减少网络开销

## 错误处理

1. **API错误**
   - 统一的错误格式
   - 详细的错误信息
   - 适当的HTTP状态码

2. **超时处理**
   - 设置合理的超时时间
   - 提供超时后的重试机制

3. **降级策略**
   - 当主供应商不可用时的备选方案
   - 本地模型的兜底处理

## 监控和日志

1. **请求日志**
   - 记录所有LLM请求
   - 包含请求参数和响应状态

2. **性能监控**
   - 记录响应时间
   - 监控API调用次数和费用

3. **错误监控**
   - 记录所有错误
   - 设置错误告警