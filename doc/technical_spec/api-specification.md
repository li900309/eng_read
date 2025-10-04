# API接口规格文档

## 基础信息

- **Base URL**: `http://localhost:5000/api`
- **API版本**: v1
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8
- **Content-Type**: `application/json`

## 认证说明

所有需要认证的接口都需要在请求头中包含：
```
Authorization: Bearer <your-jwt-token>
```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "errorCode",
    "message": "错误描述"
  }
}
```

## 1. 认证接口

### 1.1 用户注册
- **URL**: `POST /auth/register`
- **说明**: 新用户注册
- **认证**: 无需认证

**请求参数**:
```json
{
  "username": "string",      // 用户名，3-50字符
  "email": "string",         // 邮箱地址
  "password": "string",      // 密码，至少8位
  "confirmPassword": "string" // 确认密码
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatarUrl": null,
      "createdAt": "2025-10-04T10:00:00Z"
    },
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 3600
  }
}
```

### 1.2 用户登录
- **URL**: `POST /auth/login`
- **说明**: 用户登录
- **认证**: 无需认证

**请求参数**:
```json
{
  "email": "string",      // 邮箱
  "password": "string"    // 密码
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatarUrl": null,
      "createdAt": "2025-10-04T10:00:00Z"
    },
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 3600
  }
}
```

### 1.3 刷新Token
- **URL**: `POST /auth/refresh`
- **说明**: 刷新访问令牌
- **认证**: 需要有效的Refresh Token

**请求参数**:
```json
{
  "refreshToken": "string"  // 刷新令牌
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 3600
  }
}
```

### 1.4 用户登出
- **URL**: `POST /auth/logout`
- **说明**: 用户登出，使令牌失效
- **认证**: 需要JWT Token

**响应示例**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

## 2. 用户管理接口

### 2.1 获取用户信息
- **URL**: `GET /users/me`
- **说明**: 获取当前用户信息
- **认证**: 需要JWT Token

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "avatarUrl": null,
    "createdAt": "2025-10-04T10:00:00Z",
    "preferences": {
      "dailyGoal": 20,
      "preferredDifficulty": "medium",
      "soundEnabled": true,
      "theme": "light"
    }
  }
}
```

### 2.2 更新用户信息
- **URL**: `PUT /users/me`
- **说明**: 更新当前用户信息
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "username": "string",      // 可选
  "avatarUrl": "string",      // 可选
  "preferences": {
    "dailyGoal": 20,
    "preferredDifficulty": "medium",
    "soundEnabled": true,
    "notificationsEnabled": true,
    "theme": "light",
    "language": "zh-CN",
    "autoPronunciation": true,
    "studyReminderTime": "19:00"
  }
}
```

## 3. 词汇管理接口

### 3.1 获取词汇列表
- **URL**: `GET /vocabularies`
- **说明**: 获取词汇库列表
- **认证**: 需要JWT Token

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认50
- `category_id`: 分类ID，可选
- `difficulty`: 难度筛选（easy, medium, hard），可选
- `search`: 搜索关键词，可选

**响应示例**:
```json
{
  "success": true,
  "data": {
    "vocabularies": [
      {
        "id": 1,
        "word": "example",
        "pronunciation": "/ɪɡˈzæmpəl/",
        "definition": "例子，范例",
        "exampleSentence": "This is a good example.",
        "translation": "这是一个好例子。",
        "difficulty": "easy",
        "category": {
          "id": 1,
          "name": "日常用语"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1000,
      "totalPages": 20
    }
  }
}
```

### 3.2 获取词汇详情
- **URL**: `GET /vocabularies/{vocabulary_id}`
- **说明**: 获取指定词汇的详细信息
- **认证**: 需要JWT Token

**路径参数**:
- `vocabulary_id`: 词汇ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "word": "example",
    "pronunciation": "/ɪɡˈzæmpəl/",
    "definition": "例子，范例",
    "exampleSentence": "This is a good example.",
    "translation": "这是一个好例子。",
    "difficulty": "easy",
    "audioUrl": "https://example.com/audio/example.mp3",
    "imageUrl": "https://example.com/images/example.jpg",
    "category": {
      "id": 1,
      "name": "日常用语"
    },
    "tags": ["常用词", "基础词汇"],
    "synonyms": ["instance", "sample"],
    "antonyms": []
  }
}
```

### 3.3 添加词汇到学习列表
- **URL**: `POST /vocabularies/{vocabulary_id}/add`
- **说明**: 将词汇添加到用户学习列表
- **认证**: 需要JWT Token

**路径参数**:
- `vocabulary_id`: 词汇ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "userVocabularyId": 123,
    "message": "词汇已添加到学习列表"
  }
}
```

### 3.4 获取词汇分类
- **URL**: `GET /categories`
- **说明**: 获取所有词汇分类
- **认证**: 无需认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "日常用语",
        "description": "日常生活中常用的词汇",
        "icon": "home",
        "color": "#3B82F6",
        "vocabularyCount": 500
      }
    ]
  }
}
```

## 4. 学习接口

### 4.1 开始学习会话
- **URL**: `POST /learning/sessions`
- **说明**: 开始新的学习会话
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "sessionType": "vocabulary",     // vocabulary, review, mixed
  "categoryId": 1,                // 可选，分类ID
  "difficulty": "medium",          // 可选，难度级别
  "wordCount": 20                 // 可选，学习词汇数量
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "sessionId": 123,
    "vocabularies": [
      {
        "id": 1,
        "word": "example",
        "pronunciation": "/ɪɡˈzæmpəl/",
        "definition": "例子，范例",
        "difficulty": "easy"
      }
    ],
    "sessionInfo": {
      "totalWords": 20,
      "estimatedTime": 15
    }
  }
}
```

### 4.2 提交学习答案
- **URL**: `POST /learning/sessions/{session_id}/answer`
- **说明**: 提交词汇学习答案
- **认证**: 需要JWT Token

**路径参数**:
- `session_id`: 学习会话ID

**请求参数**:
```json
{
  "vocabularyId": 1,
  "answer": "例子",
  "responseTimeMs": 5000,
  "questionType": "meaning"     // meaning, spelling, pronunciation
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctAnswer": "例子",
    "explanation": "example的意思是例子、范例",
    "masteryLevel": 0.6,
    "nextReviewAt": "2025-10-06T10:00:00Z",
    "pointsEarned": 10
  }
}
```

### 4.3 完成学习会话
- **URL**: `POST /learning/sessions/{session_id}/complete`
- **说明**: 完成学习会话
- **认证**: 需要JWT Token

**路径参数**:
- `session_id`: 学习会话ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "sessionSummary": {
      "durationSeconds": 900,
      "wordsStudied": 20,
      "correctAnswers": 16,
      "accuracyRate": 80.0,
      "pointsEarned": 160
    },
    "achievements": [
      {
        "type": "accuracy_master",
        "name": "准确度大师",
        "description": "单次学习准确率达到80%"
      }
    ]
  }
}
```

### 4.4 获取学习队列
- **URL**: `GET /learning/queue`
- **说明**: 获取待学习的词汇队列
- **认证**: 需要JWT Token

**查询参数**:
- `limit`: 词汇数量，默认20
- `type`: 队列类型（review, new, all），默认all

**响应示例**:
```json
{
  "success": true,
  "data": {
    "vocabularies": [
      {
        "id": 1,
        "word": "example",
        "pronunciation": "/ɪɡˈzæmpəl/",
        "definition": "例子，范例",
        "masteryLevel": 0.5,
        "reviewCount": 3,
        "nextReviewAt": "2025-10-05T10:00:00Z",
        "priorityScore": 0.8
      }
    ],
    "queueInfo": {
      "totalDue": 15,
      "reviewCount": 10,
      "newCount": 5
    }
  }
}
```

### 4.5 获取用户词汇列表
- **URL**: `GET /learning/vocabularies`
- **说明**: 获取用户学习词汇列表
- **认证**: 需要JWT Token

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `filter`: 筛选类型（all, due, learned, favorite），可选
- `sortBy`: 排序方式（addedAt, masteryLevel, nextReview），可选

**响应示例**:
```json
{
  "success": true,
  "data": {
    "userVocabularies": [
      {
        "id": 123,
        "vocabulary": {
          "id": 1,
          "word": "example",
          "pronunciation": "/ɪɡˈzæmpəl/",
          "definition": "例子，范例"
        },
        "masteryLevel": 3,
        "reviewCount": 10,
        "correctCount": 8,
        "consecutiveCorrect": 3,
        "lastReviewAt": "2025-10-04T10:00:00Z",
        "nextReviewAt": "2025-10-07T10:00:00Z",
        "isFavorite": false,
        "notes": "常用的例子词汇"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    },
    "statistics": {
      "totalWords": 150,
      "wordsDueToday": 5,
      "masteredWords": 30,
      "learningWords": 120
    }
  }
}
```

### 4.6 更新词汇笔记
- **URL**: `PUT /learning/vocabularies/{user_vocabulary_id}/notes`
- **说明**: 更新词汇学习笔记
- **认证**: 需要JWT Token

**路径参数**:
- `user_vocabulary_id`: 用户词汇关联ID

**请求参数**:
```json
{
  "notes": "这个词在商务英语中很常用",
  "isFavorite": true
}
```

## 5. 统计接口

### 5.1 获取学习统计
- **URL**: `GET /statistics/overview`
- **说明**: 获取用户学习统计概览
- **认证**: 需要JWT Token

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalVocabulary": 150,
    "masteredVocabulary": 30,
    "accuracyRate": 0.85,
    "todayStudyTime": 1800,
    "todayWordsStudied": 15,
    "currentStreak": 7,
    "longestStreak": 15,
    "masteryProgress": 0.2
  }
}
```

### 5.2 获取学习趋势
- **URL**: `GET /statistics/trends`
- **说明**: 获取学习趋势数据
- **认证**: 需要JWT Token

**查询参数**:
- `period`: 统计周期（day, week, month），默认week
- `days`: 天数，默认30

**响应示例**:
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "date": "2025-10-04",
        "studyTime": 1800,
        "wordsStudied": 15,
        "accuracyRate": 0.85,
        "sessionsCount": 2
      }
    ],
    "summary": {
      "averageDailyTime": 1500,
      "averageDailyWords": 12,
      "averageAccuracy": 0.82
    }
  }
}
```

### 5.3 获取掌握度分布
- **URL**: `GET /statistics/mastery`
- **说明**: 获取词汇掌握度分布
- **认证**: 需要JWT Token

**响应示例**:
```json
{
  "success": true,
  "data": {
    "distribution": {
      "0": 20,  // 未开始
      "1": 30,  // 初级
      "2": 40,  // 中级
      "3": 35,  // 中高级
      "4": 20,  // 高级
      "5": 5    // 精通
    },
    "total": 150
  }
}
```

### 5.4 获取学习会话历史
- **URL**: `GET /statistics/sessions`
- **说明**: 获取学习会话历史记录
- **认证**: 需要JWT Token

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `start_date`: 开始日期，可选
- `end_date`: 结束日期，可选

**响应示例**:
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": 123,
        "sessionType": "vocabulary",
        "startTime": "2025-10-04T10:00:00Z",
        "duration": 900,
        "wordsStudied": 20,
        "correctAnswers": 16,
        "accuracyRate": 0.8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## 6. 系统接口

### 6.1 健康检查
- **URL**: `GET /health`
- **说明**: 检查系统健康状态
- **认证**: 不需要

**响应示例**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-04T12:00:00Z",
    "version": "1.0.0",
    "database": "connected",
    "redis": "connected"
  }
}
```

### 6.2 获取系统配置
- **URL**: `GET /system/config`
- **说明**: 获取公开的系统配置
- **认证**: 不需要

**响应示例**:
```json
{
  "success": true,
  "data": {
    "appName": "BDC - 英语词汇学习",
    "maxDailyWords": 50,
    "difficultyLevels": ["easy", "medium", "hard"],
    "sessionTypes": ["vocabulary", "review", "mixed"],
    "supportedLanguages": ["zh-CN", "en-US"]
  }
}
```

## 错误代码说明

| 错误代码 | HTTP状态码 | 说明 |
|---------|-----------|------|
| INVALID_REQUEST | 400 | 请求参数无效 |
| UNAUTHORIZED | 401 | 未授权访问 |
| FORBIDDEN | 403 | 禁止访问 |
| NOT_FOUND | 404 | 资源不存在 |
| RATE_LIMITED | 429 | 请求过于频繁 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| EMAIL_EXISTS | 400 | 邮箱已存在 |
| USERNAME_EXISTS | 400 | 用户名已存在 |
| INVALID_CREDENTIALS | 401 | 用户名或密码错误 |
| TOKEN_EXPIRED | 401 | 令牌已过期 |
| TOKEN_INVALID | 401 | 令牌无效 |
| VOCABULARY_NOT_FOUND | 404 | 词汇不存在 |
| SESSION_NOT_FOUND | 404 | 学习会话不存在 |
| SESSION_COMPLETED | 400 | 学习会话已完成 |
| USER_VOCABULARY_EXISTS | 400 | 词汇已在学习列表中 |
| INSUFFICIENT_PERMISSIONS | 403 | 权限不足 |

## 请求限制

- 认证接口：每分钟最多10次请求
- 学习接口：每分钟最多60次请求
- 统计接口：每分钟最多30次请求
- 其他接口：每分钟最多100次请求

## 通用响应头

所有API响应都包含以下标准响应头：
- `X-Request-ID`: 请求唯一标识符
- `X-RateLimit-Limit`: 请求限制总数
- `X-RateLimit-Remaining`: 剩余请求次数
- `X-RateLimit-Reset`: 限制重置时间（Unix时间戳）

## 分页参数

所有支持分页的接口都使用统一的分页参数：
- `page`: 页码，从1开始，默认1
- `limit`: 每页数量，默认20，最大100
- `sort`: 排序字段，默认按创建时间排序
- `order`: 排序方向，asc或desc，默认desc

分页响应格式：
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasPrev": false,
    "hasNext": true
  }
}
```

## 注意事项

1. **时间格式**: 所有时间戳均使用ISO 8601格式（UTC）
2. **字符编码**: 所有接口使用UTF-8编码
3. **密码要求**: 密码长度至少8位，建议包含大小写字母、数字和特殊字符
4. **请求超时**: 建议客户端设置30秒请求超时
5. **重试机制**: 对于5xx错误，建议实现指数退避重试
6. **缓存策略**: 静态数据（如词汇分类）可以缓存，用户相关数据不建议缓存
7. **版本控制**: API版本通过URL路径管理，当前版本为v1

## 开发环境

- **开发服务器**: `http://localhost:5000/api`
- **测试环境**: `https://api-test.bdc.com/api`
- **生产环境**: `https://api.bdc.com/api`