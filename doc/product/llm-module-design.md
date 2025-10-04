# LLM模块简化设计

## 核心设计原则

**极简主义**：只保留必要的功能，避免过度工程化
**单一职责**：每个组件只做一件事
**配置驱动**：通过配置文件管理供应商和模型

## 1. 系统架构

```
┌─────────────────────────────────────┐
│           LLM简化模块                │
├─────────────────────────────────────┤
│  应用层 (Application Layer)         │
│  ┌─────────────┬─────────────────┐   │
│  │ 阅读应用     │ 写作助手        │   │
│  └─────────────┴─────────────────┘   │
├─────────────────────────────────────┤
│  服务层 (Service Layer)             │
│  ┌─────────────┬─────────────────┐   │
│  │ LLM服务      │ 提示词管理      │   │
│  └─────────────┴─────────────────┘   │
├─────────────────────────────────────┤
│  配置层 (Config Layer)              │
│  ┌─────────────┬─────────────────┐   │
│  │ 供应商配置   │ 提示词模板      │   │
│  └─────────────┴─────────────────┘   │
└─────────────────────────────────────┘
```

## 2. 供应商配置

### 2.1 配置文件格式 (JSON)

```json
{
  "providers": {
    "openai": {
      "name": "OpenAI",
      "base_url": "https://api.openai.com/v1",
      "api_key": "your-api-key",
      "models": {
        "gpt-4": {
          "max_tokens": 4000,
          "temperature": 0.7
        },
        "gpt-3.5-turbo": {
          "max_tokens": 4000,
          "temperature": 0.7
        }
      }
    },
    "anthropic": {
      "name": "Anthropic",
      "base_url": "https://api.anthropic.com/v1",
      "api_key": "your-api-key",
      "models": {
        "claude-3-sonnet": {
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

### 2.2 启动参数

```bash
# 使用配置文件和指定供应商
python app.py --config llm_config.json --provider openai

# 使用特定模型
python app.py --config llm_config.json --provider openai --model gpt-4
```


## 4. 提示词系统

### 4.1 基础提示词模板

```python
class PromptTemplates:
    """简单的提示词模板管理"""

    @staticmethod
    def reading_assistant(content: str, difficulty: int = 5) -> List[dict]:
        """阅读助手提示词"""
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

    @staticmethod
    def vocabulary_practice(word: str, context: str) -> List[dict]:
        """词汇练习提示词"""
        return [
            {
                "role": "system",
                "content": "你是一个词汇老师，帮助学生理解和记忆单词。"
            },
            {
                "role": "user",
                "content": f"请解释单词 '{word}' 在以下语境中的含义和用法：\n\n{context}\n\n请提供：1. 中文释义 2. 英文解释 3. 例句 4. 记忆技巧"
            }
        ]

    @staticmethod
    def writing_feedback(text: str, level: str = "intermediate") -> List[dict]:
        """写作反馈提示词"""
        return [
            {
                "role": "system",
                "content": f"你是一个写作老师，为{level}水平的学生提供写作反馈。"
            },
            {
                "role": "user",
                "content": f"请评估以下英文写作，提供改进建议：\n\n{text}\n\n请从语法、词汇、结构、逻辑等方面给出具体建议。"
            }
        ]
```