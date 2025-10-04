"""
服务模块 - 业务逻辑层

本模块包含所有业务逻辑服务类，负责处理数据和业务规则。

服务列表:
- UserService: 用户相关服务
- VocabularyService: 词汇相关服务
- LearningService: 学习相关服务，包含智能算法
- StatisticsService: 统计相关服务
- LLMService: LLM相关服务，提供AI功能支持
"""

from .userService import UserService
from .vocabularyService import VocabularyService
from .learningService import LearningService
from .statisticsService import StatisticsService
from .llmService import (
    LLMService,
    getLLMService,
    getLLMServiceWithConfig,
    resetLLMServices,
    PromptTemplates,
    LLMMessage,
    LLMResponse
)

__all__ = [
    'UserService',
    'VocabularyService',
    'LearningService',
    'StatisticsService',
    'LLMService',
    'getLLMService',
    'getLLMServiceWithConfig',
    'resetLLMServices',
    'PromptTemplates',
    'LLMMessage',
    'LLMResponse'
]