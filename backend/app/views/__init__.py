"""
��B!W - API���1

,!W+@	API����HTTP�B�͔

��:
- auth: ���s��
- vocabulary: �G���
- learning: f`�s��
- statistics: ߡ���
"""

from .auth import authBlueprint
from .vocabulary import vocabularyBlueprint
from .learning import learningBlueprint
from .statistics import statisticsBlueprint

__all__ = [
    'authBlueprint',
    'vocabularyBlueprint',
    'learningBlueprint',
    'statisticsBlueprint'
]