"""
ÆşB!W - API¥ãŒï1

,!W+@	API¥ã„İşHTTP÷BŒÍ”

İş:
- auth: ¤Áøs¥ã
- vocabulary: ÍG¡¥ã
- learning: f`øs¥ã
- statistics: ß¡¥ã
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