"""
通用辅助函数
提供各种实用的工具函数
"""

import json
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Union
from decimal import Decimal, ROUND_HALF_UP

from flask import request, url_for
from math import ceil


def generateId() -> str:
    """生成唯一ID"""
    return str(uuid.uuid4())


def generateToken(length: int = 32) -> str:
    """生成随机令牌"""
    return secrets.token_urlsafe(length)


def generateApiKey() -> str:
    """生成API密钥"""
    return secrets.token_urlsafe(32)


def hashString(text: str, salt: str = None) -> str:
    """字符串哈希"""
    if salt:
        text = f"{text}{salt}"
    return hashlib.sha256(text.encode()).hexdigest()


def formatFileSize(size: int) -> str:
    """格式化文件大小"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} PB"


def formatDuration(seconds: int) -> str:
    """格式化持续时间"""
    if seconds < 60:
        return f"{seconds}秒"
    elif seconds < 3600:
        minutes = seconds // 60
        remainingSeconds = seconds % 60
        return f"{minutes}分{remainingSeconds}秒"
    else:
        hours = seconds // 3600
        remainingMinutes = (seconds % 3600) // 60
        return f"{hours}小时{remainingMinutes}分钟"


def formatDate(dateObj: Union[datetime, str], formatStr: str = '%Y-%m-%d %H:%M:%S') -> str:
    """格式化日期"""
    if isinstance(dateObj, str):
        try:
            dateObj = datetime.fromisoformat(dateObj.replace('Z', '+00:00'))
        except ValueError:
            return dateObj

    if isinstance(dateObj, datetime):
        return dateObj.strftime(formatStr)

    return str(dateObj)


def timeAgo(dateObj: Union[datetime, str]) -> str:
    """计算相对时间"""
    if isinstance(dateObj, str):
        try:
            dateObj = datetime.fromisoformat(dateObj.replace('Z', '+00:00'))
        except ValueError:
            return dateObj

    if not isinstance(dateObj, datetime):
        return dateObj

    now = datetime.utcnow()
    diff = now - dateObj

    seconds = diff.total_seconds()

    if seconds < 60:
        return '刚刚'
    elif seconds < 3600:
        minutes = int(seconds // 60)
        return f'{minutes}分钟前'
    elif seconds < 86400:
        hours = int(seconds // 3600)
        return f'{hours}小时前'
    elif seconds < 2592000:  # 30天
        days = int(seconds // 86400)
        return f'{days}天前'
    else:
        return dateObj.strftime('%Y-%m-%d')


def createPaginationInfo(totalItems: int, page: int, perPage: int) -> Dict[str, Any]:
    """创建分页信息"""
    totalPages = ceil(totalItems / perPage) if perPage > 0 else 0

    return {
        'totalItems': totalItems,
        'totalPages': totalPages,
        'currentPage': page,
        'perPage': perPage,
        'hasNext': page < totalPages,
        'hasPrev': page > 1,
        'nextPage': page + 1 if page < totalPages else None,
        'prevPage': page - 1 if page > 1 else None
    }


def createApiResponse(success: bool = True, data: Any = None, error: Dict[str, Any] = None,
                     meta: Dict[str, Any] = None) -> Dict[str, Any]:
    """创建标准API响应"""
    response = {
        'success': success,
        'timestamp': datetime.utcnow().isoformat()
    }

    if success:
        response['data'] = data
        if meta:
            response['meta'] = meta
    else:
        response['error'] = error or {
            'code': 'UNKNOWN_ERROR',
            'message': '未知错误'
        }

    return response


def sanitizeHtml(text: str) -> str:
    """清理HTML文本"""
    import re
    # 移除HTML标签
    cleanText = re.sub(r'<[^>]+>', '', text)
    # 解码HTML实体
    htmlEntities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    }
    for entity, char in htmlEntities.items():
        cleanText = cleanText.replace(entity, char)
    return cleanText.strip()


def truncateText(text: str, maxLength: int = 100, suffix: str = '...') -> str:
    """截断文本"""
    if len(text) <= maxLength:
        return text
    return text[:maxLength - len(suffix)] + suffix


def extractKeywords(text: str, minWordLength: int = 3, maxKeywords: int = 10) -> List[str]:
    """提取关键词"""
    import re
    from collections import Counter

    # 转换为小写并提取单词
    words = re.findall(r'\b[a-zA-Z]{' + str(minWordLength) + r',}\b', text.lower())

    # 过滤常用词
    stopWords = {
        'the', 'and', 'for', 'are', 'with', 'this', 'that', 'from', 'they', 'have',
        'been', 'has', 'had', 'was', 'were', 'will', 'would', 'could', 'should',
        'can', 'may', 'might', 'must', 'shall'
    }

    filteredWords = [word for word in words if word not in stopWords]

    # 统计词频并返回最常见的关键词
    wordFreq = Counter(filteredWords)
    return [word for word, _ in wordFreq.most_common(maxKeywords)]


def calculatePercentage(part: int, total: int, decimalPlaces: int = 2) -> float:
    """计算百分比"""
    if total == 0:
        return 0.0
    percentage = (part / total) * 100
    return round(percentage, decimalPlaces)


def roundDecimal(number: Union[float, Decimal], decimalPlaces: int = 2) -> Decimal:
    """四舍五入到指定小数位"""
    decimalNumber = Decimal(str(number))
    roundingContext = Decimal('1.' + '0' * decimalPlaces)
    return decimalNumber.quantize(roundingContext, rounding=ROUND_HALF_UP)


def isValidUrl(url: str) -> bool:
    """验证URL格式"""
    import re
    urlPattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return urlPattern.match(url) is not None


def createSlug(text: str) -> str:
    """创建URL友好的slug"""
    import re
    # 转换为小写
    text = text.lower()
    # 替换空格和特殊字符为连字符
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # 移除开头和结尾的连字符
    text = text.strip('-')
    # 限制长度
    return text[:50]


def deepMerge(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """深度合并字典"""
    result = dict1.copy()
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deepMerge(result[key], value)
        else:
            result[key] = value
    return result


def flattenDict(d: Dict[str, Any], parentKey: str = '', sep: str = '.') -> Dict[str, Any]:
    """扁平化嵌套字典"""
    items = []
    for key, value in d.items():
        newKey = f"{parentKey}{sep}{key}" if parentKey else key
        if isinstance(value, dict):
            items.extend(flattenDict(value, newKey, sep=sep).items())
        else:
            items.append((newKey, value))
    return dict(items)


def chunkList(lst: List[Any], chunkSize: int) -> List[List[Any]]:
    """将列表分块"""
    return [lst[i:i + chunkSize] for i in range(0, len(lst), chunkSize)]


def retryOnFailure(maxRetries: int = 3, delay: float = 1.0, exceptions: tuple = (Exception,)):
    """重试装饰器的辅助函数"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            import time
            lastException = None
            currentDelay = delay

            for attempt in range(maxRetries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    lastException = e
                    if attempt < maxRetries:
                        time.sleep(currentDelay)
                        currentDelay *= 2

            raise lastException
        return wrapper
    return decorator


def getClientIp() -> str:
    """获取客户端IP地址"""
    if request.headers.getlist("X-Forwarded-For"):
        return request.headers.getlist("X-Forwarded-For")[0]
    elif request.headers.get("X-Real-IP"):
        return request.headers.get("X-Real-IP")
    else:
        return request.remote_addr


def getUserAgent() -> str:
    """获取用户代理字符串"""
    return request.headers.get('User-Agent', '')


def isSecureConnection() -> bool:
    """检查是否为安全连接"""
    return request.is_secure or request.headers.get('X-Forwarded-Proto') == 'https'


def generateETag(data: Any) -> str:
    """生成ETag"""
    dataString = json.dumps(data, sort_keys=True, separators=(',', ':'))
    return hashlib.md5(dataString.encode()).hexdigest()


def parseAcceptLanguage() -> List[str]:
    """解析Accept-Language头"""
    acceptLanguage = request.headers.get('Accept-Language', '')
    languages = []
    for lang in acceptLanguage.split(','):
        if ';' in lang:
            lang = lang.split(';')[0]
        languages.append(lang.strip())
    return languages