"""
视图模块 - API接口层

本模块包含所有API接口视图，处理HTTP请求和响应。

蓝图列表:
- auth: 认证相关接口
- vocabulary: 词汇相关接口
- learning: 学习相关接口
- statistics: 统计相关接口
- llm: LLM相关接口
"""

from .auth import authBlueprint
from .vocabulary import vocabularyBlueprint
from .learning import learningBlueprint
from .statistics import statisticsBlueprint
from .llm import llmBlueprint

__all__ = [
    'authBlueprint',
    'vocabularyBlueprint',
    'learningBlueprint',
    'statisticsBlueprint',
    'llmBlueprint'
]