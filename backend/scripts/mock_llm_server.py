#!/usr/bin/env python3
"""
本地LLM模拟服务器

用于在没有真实LLM API的情况下测试LLM服务。
"""

from flask import Flask, request, jsonify, Response
import json
import threading
import time
import random
from datetime import datetime


app = Flask(__name__)

# 模拟的LLM响应模板
MOCK_RESPONSES = {
    "reading_assistant": {
        "system": "你是一个专业的英语学习助手，帮助学生理解英语文章。",
        "responses": [
            "这篇文章主要讨论了{content}。让我为您提供详细分析：\n\n**中文翻译**：\n{content}\n\n**重点词汇解释**：\n- 单词1：解释\n- 单词2：解释\n\n**学习建议**：\n1. 建议多阅读类似文章\n2. 注意积累词汇\n3. 练习相关语法",
            "分析结果如下：\n\n**内容概要**：\n这是一篇关于{content}的文章\n\n**语言要点**：\n- 词汇：重点词汇分析\n- 语法：主要语法结构\n- 表达：常用表达方式\n\n**学习提示**：\n建议结合上下文理解，注重实用性。"
        ]
    },
    "vocabulary_practice": {
        "system": "你是一个词汇老师，帮助学生理解和记忆单词。",
        "responses": [
            """单词 '{word}' 在这个语境中的分析：

**中文释义**：
{word} - 相应的中文意思

**英文解释**：
{word} - English explanation with usage notes

**例句**：
1. Original sentence with the word
2. Another example sentence

**记忆技巧**：
- 词根词缀分析
- 联想记忆法
- 常见搭配"""
        ]
    },
    "writing_feedback": {
        "system": "你是一个写作老师，为学生提供写作反馈。",
        "responses": [
            """**写作评估报告**

**优点**：
- 内容表达清晰
- 词汇使用恰当

**改进建议**：
- 语法：注意时态一致性
- 词汇：可以增加一些高级词汇
- 结构：建议加强段落过渡
- 逻辑：论证过程可以更加严密

**整体评价**：
这是一篇{level}水平的作文，基础扎实，有很好的提升空间。"""
        ]
    },
    "general_chat": {
        "responses": [
            "这是一个模拟的LLM响应。在实际使用中，这里会显示真实的AI回复内容。",
            "感谢您的消息！这是一个模拟测试响应。",
            "我理解您的问题。在真实环境中，我会提供更有意义的模拟回答。"
        ]
    }
}


def generateMockResponse(messages):
    """生成模拟响应"""
    # 分析最后一条用户消息
    userMessage = ""
    for msg in reversed(messages):
        if msg.get('role') == 'user':
            userMessage = msg.get('content', '')
            break

    # 根据消息内容选择响应模板
    if "文章" in userMessage or "阅读" in userMessage:
        template = MOCK_RESPONSES["reading_assistant"]
    elif "单词" in userMessage or "vocabulary" in userMessage.lower():
        template = MOCK_RESPONSES["vocabulary_practice"]
    elif "写作" in userMessage or "writing" in userMessage.lower():
        template = MOCK_RESPONSES["writing_feedback"]
    else:
        template = MOCK_RESPONSES["general_chat"]

    # 随机选择一个响应
    response_text = random.choice(template.get("responses", ["这是一个模拟响应"]))

    # 简单的变量替换
    response_text = response_text.format(
        content=userMessage[:50] + "..." if len(userMessage) > 50 else userMessage,
        word="test_word",
        level="intermediate"
    )

    return response_text


@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """模拟OpenAI聊天完成接口"""
    try:
        data = request.get_json()

        # 添加一些延迟来模拟真实API调用
        time.sleep(0.5)

        # 生成模拟响应
        messages = data.get('messages', [])
        response_text = generateMockResponse(messages)

        # 模拟token使用情况
        prompt_tokens = sum(len(msg.get('content', '')) for msg in messages) // 4
        completion_tokens = len(response_text) // 4

        response = {
            "id": f"chatcmpl-{random.randint(1000000, 9999999)}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": data.get('model', 'local-model'),
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response_text
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": prompt_tokens + completion_tokens
            }
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({
            "error": {
                "message": f"模拟服务器错误: {str(e)}",
                "type": "server_error"
            }
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        "status": "healthy",
        "service": "mock-llm-server",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/', methods=['GET'])
def index():
    """首页"""
    return """
    <h1>本地LLM模拟服务器</h1>
    <p>这是一个用于测试的LLM模拟服务器。</p>
    <h2>可用接口：</h2>
    <ul>
        <li><code>POST /v1/chat/completions</code> - 模拟OpenAI聊天接口</li>
        <li><code>GET /health</code> - 健康检查</li>
    </ul>
    <h2>使用方法：</h2>
    <pre>
    curl -X POST http://localhost:8000/v1/chat/completions \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer local-key" \\
      -d '{
        "model": "local-model",
        "messages": [
          {"role": "user", "content": "Hello, how are you?"}
        ]
      }'
    </pre>
    """


def run_server():
    """运行服务器"""
    print("启动本地LLM模拟服务器...")
    print("服务器地址: http://localhost:8000")
    print("健康检查: http://localhost:8000/health")
    print("按 Ctrl+C 停止服务器")

    app.run(host='0.0.0.0', port=8000, debug=False)


if __name__ == '__main__':
    run_server()