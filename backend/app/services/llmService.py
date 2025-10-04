"""
LLM服务模块 - 简化设计

提供统一的LLM调用接口，支持多个供应商。
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from pathlib import Path
from dataclasses import dataclass
import requests
from flask import current_app


@dataclass
class LLMMessage:
    """LLM消息结构"""
    role: str
    content: str


@dataclass
class LLMResponse:
    """LLM响应结构"""
    success: bool
    content: str
    error: Optional[str] = None
    usage: Optional[Dict[str, int]] = None


class LLMConfigManager:
    """LLM配置管理器"""

    def __init__(self, configPath: str = None, configData: Dict[str, Any] = None):
        self.configPath = configPath or self._getDefaultConfigPath()
        self.config = self._loadConfig(configData)
        self.logger = logging.getLogger(__name__)

    def _getDefaultConfigPath(self) -> str:
        """获取默认配置文件路径"""
        return str(Path(__file__).parent.parent.parent / 'config' / 'llm_config.json')

    def _loadConfig(self, configData: Dict[str, Any] = None) -> Dict[str, Any]:
        """加载配置文件或使用传入的配置数据"""
        if configData:
            # 直接使用传入的配置数据
            return self._convertToStandardFormat(configData)

        try:
            with open(self.configPath, 'r', encoding='utf-8') as f:
                config = json.load(f)

            # 检查是否为新格式（数组格式）
            if isinstance(config, list):
                return self._convertToStandardFormat(config)

            # 传统格式，替换环境变量
            self._replaceEnvVars(config)
            return config

        except FileNotFoundError:
            self.logger.warning(f"LLM配置文件未找到: {self.configPath}")
            return self._getFallbackConfig()
        except json.JSONDecodeError as e:
            self.logger.error(f"LLM配置文件格式错误: {e}")
            return self._getFallbackConfig()

    def _convertToStandardFormat(self, configData: Any) -> Dict[str, Any]:
        """将新格式配置转换为标准格式"""
        if isinstance(configData, list):
            # 新格式：[{"model-name": {"baseurl": "...", "modelname": "...", "apikey": "..."}}]
            providers = {}
            for provider_config in configData:
                for model_name, model_info in provider_config.items():
                    provider_name = f"provider_{model_name.replace('-', '_')}"
                    providers[provider_name] = {
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

            return {"providers": providers}

        elif isinstance(configData, dict) and "providers" in configData:
            # 已经是标准格式
            return configData

        else:
            # 尝试直接作为provider配置处理
            self.logger.warning("未知的配置格式，尝试转换为标准格式")
            return {"providers": {"default": configData}}

    def _replaceEnvVars(self, config: Dict[str, Any]):
        """递归替换配置中的环境变量"""
        for key, value in config.items():
            if isinstance(value, dict):
                self._replaceEnvVars(value)
            elif isinstance(value, str) and value.startswith('${') and value.endswith('}'):
                envVar = value[2:-1]
                config[key] = os.getenv(envVar, value)

    def _getFallbackConfig(self) -> Dict[str, Any]:
        """获取备用配置"""
        return {
            "providers": {
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

    def getProvider(self, providerName: str) -> Optional[Dict[str, Any]]:
        """获取供应商配置"""
        return self.config.get('providers', {}).get(providerName)

    def getModel(self, providerName: str, modelName: str) -> Optional[Dict[str, Any]]:
        """获取模型配置"""
        provider = self.getProvider(providerName)
        if provider:
            return provider.get('models', {}).get(modelName)
        return None

    def getAllProviders(self) -> Dict[str, Any]:
        """获取所有供应商配置"""
        return self.config.get('providers', {})

    def getFirstAvailableProvider(self) -> Optional[str]:
        """获取第一个可用的供应商名称"""
        providers = self.config.get('providers', {})
        if providers:
            return list(providers.keys())[0]
        return None


class LLMService:
    """LLM服务主类"""

    def __init__(self, configManager: LLMConfigManager = None, configPath: str = None, configData: Dict[str, Any] = None):
        if configManager:
            self.configManager = configManager
        elif configData:
            self.configManager = LLMConfigManager(configData=configData)
        elif configPath:
            self.configManager = LLMConfigManager(configPath=configPath)
        else:
            self.configManager = LLMConfigManager()

        self.logger = logging.getLogger(__name__)

    def _makeRequest(
        self,
        providerConfig: Dict[str, Any],
        modelConfig: Dict[str, Any],
        messages: List[LLMMessage],
        model: str
    ) -> LLMResponse:
        """发送LLM请求"""

        try:
            # 构建请求
            headers = {
                'Authorization': f"Bearer {providerConfig['api_key']}",
                'Content-Type': 'application/json'
            }

            payload = {
                'model': model,
                'messages': [{'role': msg.role, 'content': msg.content} for msg in messages],
                'max_tokens': modelConfig.get('max_tokens', 4000),
                'temperature': modelConfig.get('temperature', 0.7)
            }

            # 发送请求
            response = requests.post(
                f"{providerConfig['base_url']}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                content = data['choices'][0]['message']['content']
                usage = data.get('usage', {})

                return LLMResponse(
                    success=True,
                    content=content,
                    usage=usage
                )
            else:
                error_msg = f"LLM API请求失败: {response.status_code} - {response.text}"
                self.logger.error(error_msg)
                return LLMResponse(
                    success=False,
                    content="",
                    error=error_msg
                )

        except requests.exceptions.Timeout:
            error_msg = "LLM API请求超时: timeout"
            self.logger.error(error_msg)
            return LLMResponse(
                success=False,
                content="",
                error=error_msg
            )
        except requests.exceptions.ConnectionError as e:
            error_msg = f"LLM API请求异常: connection error"
            self.logger.error(error_msg)
            return LLMResponse(
                success=False,
                content="",
                error=error_msg
            )
        except Exception as e:
            error_msg = f"LLM API请求异常: {str(e)}"
            self.logger.error(error_msg)
            return LLMResponse(
                success=False,
                content="",
                error=error_msg
            )

    def chat(
        self,
        messages: List[LLMMessage],
        provider: str = "local",
        model: str = "local-model"
    ) -> LLMResponse:
        """LLM聊天接口"""

        # 获取配置
        providerConfig = self.configManager.getProvider(provider)
        if not providerConfig:
            return LLMResponse(
                success=False,
                content="",
                error=f"未找到供应商: {provider}"
            )

        modelConfig = self.configManager.getModel(provider, model)
        if not modelConfig:
            return LLMResponse(
                success=False,
                content="",
                error=f"未找到模型: {provider}/{model}"
            )

        # 发送请求
        return self._makeRequest(providerConfig, modelConfig, messages, model)

    def chatWithTemplate(
        self,
        template: List[Dict[str, str]],
        **kwargs
    ) -> LLMResponse:
        """使用模板进行聊天"""

        # 格式化模板
        messages = []
        for msg in template:
            content = msg['content'].format(**kwargs)
            messages.append(LLMMessage(role=msg['role'], content=content))

        # 获取默认配置
        provider = os.getenv('LLM_PROVIDER', None)
        model = os.getenv('LLM_MODEL', None)

        # 如果没有环境变量配置，使用第一个可用的供应商和模型
        if not provider:
            provider = self.configManager.getFirstAvailableProvider()
            if provider:
                # 获取该供应商的第一个模型
                models = self.configManager.getProvider(provider).get('models', {})
                if models:
                    model = list(models.keys())[0]

        # 如果仍然没有找到，使用默认值
        if not provider:
            provider = 'local'
        if not model:
            model = 'local-model'

        return self.chat(messages, provider, model)


class PromptTemplates:
    """提示词模板管理"""

    @staticmethod
    def readingAssistant(content: str, difficulty: int = 5) -> List[Dict[str, str]]:
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
    def vocabularyPractice(word: str, context: str) -> List[Dict[str, str]]:
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
    def writingFeedback(text: str, level: str = "intermediate") -> List[Dict[str, str]]:
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


# 全局实例字典
_llmServices = {}


def getLLMService(configPath: str = None, configData: Dict[str, Any] = None) -> LLMService:
    """获取LLM服务实例

    Args:
        configPath: 配置文件路径
        configData: 配置数据字典（支持新的JSON格式）

    Returns:
        LLMService实例
    """
    global _llmServices

    # 生成缓存键
    cache_key = 'default'
    if configPath:
        cache_key = f'path:{configPath}'
    elif configData:
        cache_key = f'data:{hash(str(configData))}'

    # 检查是否已存在实例
    if cache_key not in _llmServices:
        _llmServices[cache_key] = LLMService(configPath=configPath, configData=configData)

    return _llmServices[cache_key]


def getLLMServiceWithConfig(configFile: str) -> LLMService:
    """使用配置文件获取LLM服务实例

    Args:
        configFile: JSON配置文件路径

    Returns:
        LLMService实例
    """
    if not os.path.exists(configFile):
        raise FileNotFoundError(f"配置文件不存在: {configFile}")

    try:
        with open(configFile, 'r', encoding='utf-8') as f:
            configData = json.load(f)

        return getLLMService(configData=configData)
    except json.JSONDecodeError as e:
        raise ValueError(f"配置文件格式错误: {e}")


def resetLLMServices():
    """重置所有LLM服务实例（主要用于测试）"""
    global _llmServices
    _llmServices.clear()