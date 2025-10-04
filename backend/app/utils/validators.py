"""
数据验证工具函数
提供各种数据格式的验证功能
"""

import re
from typing import Any, Dict, List, Optional
from datetime import datetime, date
from marshmallow import ValidationError


class ValidationError(Exception):
    """自定义验证错误"""
    pass


def validateEmail(email: str) -> bool:
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validateUsername(username: str) -> Dict[str, Any]:
    """验证用户名格式"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not username:
        result['isValid'] = False
        result['errors'].append('用户名不能为空')
        return result

    if len(username) < 3:
        result['isValid'] = False
        result['errors'].append('用户名长度至少需要3个字符')

    if len(username) > 50:
        result['isValid'] = False
        result['errors'].append('用户名长度不能超过50个字符')

    # 只允许字母、数字、下划线和连字符
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        result['isValid'] = False
        result['errors'].append('用户名只能包含字母、数字、下划线和连字符')

    # 不能以下划线或连字符开头或结尾
    if username.startswith('_') or username.startswith('-') or \
       username.endswith('_') or username.endswith('-'):
        result['isValid'] = False
        result['errors'].append('用户名不能以下划线或连字符开头或结尾')

    return result


def validatePassword(password: str, confirmPassword: str = None) -> Dict[str, Any]:
    """验证密码格式"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not password:
        result['isValid'] = False
        result['errors'].append('密码不能为空')
        return result

    if len(password) < 8:
        result['isValid'] = False
        result['errors'].append('密码长度至少需要8个字符')

    if len(password) > 128:
        result['isValid'] = False
        result['errors'].append('密码长度不能超过128个字符')

    # 检查密码复杂度
    hasUpper = any(c.isupper() for c in password)
    hasLower = any(c.islower() for c in password)
    hasDigit = any(c.isdigit() for c in password)

    if not (hasUpper and hasLower and hasDigit):
        result['errors'].append('密码需要包含大写字母、小写字母和数字')

    # 检查确认密码
    if confirmPassword is not None and password != confirmPassword:
        result['isValid'] = False
        result['errors'].append('两次输入的密码不一致')

    return result


def validateWord(word: str) -> Dict[str, Any]:
    """验证单词格式"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not word:
        result['isValid'] = False
        result['errors'].append('单词不能为空')
        return result

    if len(word.strip()) < 1:
        result['isValid'] = False
        result['errors'].append('单词不能为空白字符')
        return result

    word = word.strip()

    if len(word) > 100:
        result['isValid'] = False
        result['errors'].append('单词长度不能超过100个字符')

    # 检查是否只包含字母和连字符
    if not re.match(r'^[a-zA-Z]+(?:-[a-zA-Z]+)*$', word):
        result['isValid'] = False
        result['errors'].append('单词只能包含字母和连字符')

    return result


def validateDefinition(definition: str) -> Dict[str, Any]:
    """验证定义格式"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not definition:
        result['isValid'] = False
        result['errors'].append('定义不能为空')
        return result

    if len(definition.strip()) < 1:
        result['isValid'] = False
        result['errors'].append('定义不能为空白字符')
        return result

    definition = definition.strip()

    if len(definition) > 1000:
        result['isValid'] = False
        result['errors'].append('定义长度不能超过1000个字符')

    return result


def validateDifficulty(difficulty: int) -> Dict[str, Any]:
    """验证难度等级"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not isinstance(difficulty, int):
        result['isValid'] = False
        result['errors'].append('难度等级必须是整数')
        return result

    if difficulty < 1 or difficulty > 5:
        result['isValid'] = False
        result['errors'].append('难度等级必须在1-5之间')

    return result


def validatePagination(page: int, perPage: int) -> Dict[str, Any]:
    """验证分页参数"""
    result = {
        'isValid': True,
        'errors': []
    }

    # 验证页码
    if not isinstance(page, int) or page < 1:
        result['isValid'] = False
        result['errors'].append('页码必须是大于0的整数')

    # 验证每页数量
    if not isinstance(perPage, int) or perPage < 1:
        result['isValid'] = False
        result['errors'].append('每页数量必须是大于0的整数')

    if perPage > 100:
        result['isValid'] = False
        result['errors'].append('每页数量不能超过100')

    return result


def validateDateRange(startDate: str, endDate: str) -> Dict[str, Any]:
    """验证日期范围"""
    result = {
        'isValid': True,
        'errors': []
    }

    try:
        if startDate:
            start = datetime.strptime(startDate, '%Y-%m-%d').date()
        else:
            start = None

        if endDate:
            end = datetime.strptime(endDate, '%Y-%m-%d').date()
        else:
            end = None

        if start and end and start > end:
            result['isValid'] = False
            result['errors'].append('开始日期不能晚于结束日期')

        # 检查日期是否合理（不能太久远）
        today = date.today()
        minDate = date(2000, 1, 1)
        maxDate = date(today.year + 1, 12, 31)

        if start and (start < minDate or start > maxDate):
            result['isValid'] = False
            result['errors'].append('开始日期超出合理范围')

        if end and (end < minDate or end > maxDate):
            result['isValid'] = False
            result['errors'].append('结束日期超出合理范围')

    except ValueError:
        result['isValid'] = False
        result['errors'].append('日期格式不正确，请使用YYYY-MM-DD格式')

    return result


def validateJsonData(data: Any, requiredFields: List[str] = None) -> Dict[str, Any]:
    """验证JSON数据格式"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not isinstance(data, dict):
        result['isValid'] = False
        result['errors'].append('数据必须是JSON对象格式')
        return result

    # 检查必需字段
    if requiredFields:
        for field in requiredFields:
            if field not in data:
                result['isValid'] = False
                result['errors'].append(f'缺少必需字段: {field}')

    return result


def validateLearningSessionData(data: Dict[str, Any]) -> Dict[str, Any]:
    """验证学习会话数据"""
    result = {
        'isValid': True,
        'errors': []
    }

    # 验证会话类型
    sessionType = data.get('sessionType', 'review')
    validTypes = ['review', 'study', 'test']
    if sessionType not in validTypes:
        result['isValid'] = False
        result['errors'].append(f'会话类型必须是: {", ".join(validTypes)}')

    # 验证词汇数量
    wordCount = data.get('wordCount', 0)
    if not isinstance(wordCount, int) or wordCount < 1:
        result['isValid'] = False
        result['errors'].append('词汇数量必须是大于0的整数')

    if wordCount > 100:
        result['isValid'] = False
        result['errors'].append('单次学习词汇数量不能超过100')

    return result


def sanitizeString(text: str, maxLength: int = None) -> str:
    """清理字符串数据"""
    if not text:
        return ''

    # 移除前后空白字符
    text = text.strip()

    # 限制长度
    if maxLength and len(text) > maxLength:
        text = text[:maxLength]

    # 移除控制字符
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')

    return text


def validateFileUpload(filename: str, contentLength: int, allowedExtensions: List[str]) -> Dict[str, Any]:
    """验证文件上传"""
    result = {
        'isValid': True,
        'errors': []
    }

    if not filename:
        result['isValid'] = False
        result['errors'].append('文件名不能为空')
        return result

    # 检查文件扩展名
    fileExtension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    if fileExtension not in allowedExtensions:
        result['isValid'] = False
        result['errors'].append(f'文件类型不支持，允许的类型: {", ".join(allowedExtensions)}')

    # 检查文件大小（16MB限制）
    maxSize = 16 * 1024 * 1024
    if contentLength > maxSize:
        result['isValid'] = False
        result['errors'].append('文件大小不能超过16MB')

    return result