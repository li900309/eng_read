# API接口文档

## 基础信息

- **Base URL**: `http://localhost:5000/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

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
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 1. 用户认证接口

### 1.1 用户注册
- **URL**: `POST /auth/register`
- **说明**: 新用户注册

**请求参数**:
```json
{
  "username": "string",      // 用户名，3-50字符
  "email": "string",         // 邮箱地址
  "password": "string",      // 密码，至少6位
  "confirm_password": "string" // 确认密码
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 604800
  }
}
```

### 1.2 用户登录
- **URL**: `POST /auth/login`
- **说明**: 用户登录

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
    "user_id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "current_level": "A2",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 604800
  }
}
```

### 1.3 刷新Token
- **URL**: `POST /auth/refresh`
- **说明**: 刷新访问令牌
- **认证**: 需要有效的JWT Token

**响应示例**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 604800
  }
}
```

## 2. 用户信息接口

### 2.1 获取用户档案
- **URL**: `GET /users/profile`
- **说明**: 获取用户学习档案
- **认证**: 需要JWT Token

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "profile": {
      "current_level": "A2",
      "target_level": "B1",
      "study_goal": "提升阅读能力",
      "daily_target_minutes": 15,
      "statistics": {
        "total_reading_time": 3600,
        "articles_completed": 12,
        "vocabulary_size": 150,
        "current_streak": 3,
        "longest_streak": 7
      }
    }
  }
}
```

### 2.2 更新用户档案
- **URL**: `PUT /users/profile`
- **说明**: 更新用户学习档案
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "target_level": "B1",           // 可选
  "study_goal": "通过考试",        // 可选
  "daily_target_minutes": 30,     // 可选
  "preferences": {                // 可选
    "font_size": 18,
    "theme": "light"
  }
}
```

## 3. 文章内容接口

### 3.1 生成新文章
- **URL**: `POST /articles/generate`
- **说明**: 根据用户需求生成个性化文章
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "difficulty_level": "A2",    // A2, B1, B2, C1
  "topic": "科技",             // 可选，文章主题
  "article_type": "news",      // news, story, academic
  "word_count": 300            // 200-500词
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "article_id": 123,
    "title": "New Technology Changes Our Lives",
    "content": "Technology is changing rapidly...",
    "difficulty_level": "A2",
    "word_count": 295,
    "estimated_reading_time": 3,
    "new_words": [
      {
        "word": "rapidly",
        "phonetic": "/ˈræpɪdli/",
        "definition": "快速地",
        "example": "Technology changes rapidly."
      }
    ],
    "questions": [
      {
        "question_id": 456,
        "type": "main_idea",
        "question": "What is the main idea of this article?",
        "options": {
          "A": "Technology is expensive",
          "B": "Technology brings changes to life",
          "C": "Technology is difficult",
          "D": "Technology is boring"
        },
        "correct_answer": "B"
      }
    ]
  }
}
```

### 3.2 获取文章详情
- **URL**: `GET /articles/{article_id}`
- **说明**: 获取指定文章的详细内容
- **认证**: 需要JWT Token

**路径参数**:
- `article_id`: 文章ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "article_id": 123,
    "title": "New Technology Changes Our Lives",
    "content": "Technology is changing rapidly...",
    "difficulty_level": "A2",
    "word_count": 295,
    "topic": "科技",
    "created_at": "2025-10-04T10:00:00Z"
  }
}
```

### 3.3 获取文章列表
- **URL**: `GET /articles`
- **说明**: 获取用户的文章历史
- **认证**: 需要JWT Token

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认10
- `difficulty`: 难度筛选，可选
- `status`: 状态筛选（completed, in_progress），可选

**响应示例**:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "article_id": 123,
        "title": "New Technology Changes Our Lives",
        "difficulty_level": "A2",
        "word_count": 295,
        "progress": 100,
        "completed_at": "2025-10-04T11:00:00Z",
        "accuracy_score": 80.0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

## 4. 学习记录接口

### 4.1 提交答题结果
- **URL**: `POST /learning/submit-answer`
- **说明**: 提交答题结果并获取反馈
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "session_id": 789,      // 学习会话ID
  "question_id": 456,     // 题目ID
  "answer": "B",          // 用户答案
  "response_time_ms": 5000 // 响应时间（毫秒）
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "is_correct": true,
    "correct_answer": "B",
    "explanation": "文章主要讲述了科技对生活的影响",
    "score_earned": 10,
    "new_difficulty_suggestion": "B1"
  }
}
```

### 4.2 更新阅读进度
- **URL**: `POST /learning/update-reading-progress`
- **说明**: 更新用户的阅读进度
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "article_id": 123,
  "progress_percentage": 50,  // 进度百分比
  "reading_time_seconds": 180, // 阅读时间
  "current_position": 150      // 当前阅读位置（词数）
}
```

### 4.3 获取学习统计
- **URL**: `GET /learning/statistics`
- **说明**: 获取用户学习统计数据
- **认证**: 需要JWT Token

**查询参数**:
- `period`: 统计周期（day, week, month）
- `start_date`: 开始日期（YYYY-MM-DD）
- `end_date`: 结束日期（YYYY-MM-DD）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_time_minutes": 180,
      "articles_completed": 5,
      "questions_answered": 25,
      "accuracy_rate": 84.0,
      "words_learned": 35
    },
    "daily_data": [
      {
        "date": "2025-10-04",
        "time_minutes": 30,
        "articles": 1,
        "accuracy": 80.0
      }
    ],
    "progress": {
      "level_improvements": 1,
      "reading_speed_wpm": 150,
      "vocabulary_growth": 0.23
    }
  }
}
```

## 5. 生词管理接口

### 5.1 添加生词
- **URL**: `POST /vocabulary/add`
- **说明**: 添加单词到生词本
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "word": "rapidly",
  "context": "Technology changes rapidly.", // 可选
  "source_type": "reading",                 // reading, quiz, manual
  "source_id": 123                         // 可选，来源ID
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "vocabulary_id": 789,
    "word_info": {
      "word": "rapidly",
      "phonetic": "/ˈræpɪdli/",
      "definition": "快速地",
      "example": "Technology changes rapidly."
    },
    "next_review_at": "2025-10-05T10:00:00Z"
  }
}
```

### 5.2 获取生词列表
- **URL**: `GET /vocabulary/list`
- **说明**: 获取用户生词本列表
- **认证**: 需要JWT Token

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `filter`: 筛选类型（all, due, learned），可选
- `sort_by`: 排序方式（added_at, mastery_level），可选

**响应示例**:
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "vocabulary_id": 789,
        "word": "rapidly",
        "definition": "快速地",
        "mastery_level": 0.5,
        "review_count": 2,
        "next_review_at": "2025-10-05T10:00:00Z",
        "days_since_added": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    },
    "statistics": {
      "total_words": 150,
      "words_due_today": 5,
      "mastered_words": 30,
      "learning_words": 120
    }
  }
}
```

### 5.3 提交复习结果
- **URL**: `POST /vocabulary/review`
- **说明**: 提交单词复习结果
- **认证**: 需要JWT Token

**请求参数**:
```json
{
  "vocabulary_id": 789,
  "is_correct": true,
  "response_time_ms": 3000,
  "review_type": "flashcard"  // flashcard, quiz, spelling
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "new_mastery_level": 0.6,
    "next_review_at": "2025-10-07T10:00:00Z",
    "streak_updated": true,
    "points_earned": 5
  }
}
```

### 5.4 删除生词
- **URL**: `DELETE /vocabulary/{vocabulary_id}`
- **说明**: 从生词本删除单词
- **认证**: 需要JWT Token

**路径参数**:
- `vocabulary_id`: 生词ID

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
    "version": "1.0.0"
  }
}
```

### 6.2 获取难度级别
- **URL**: `GET /system/levels`
- **说明**: 获取所有支持的难度级别
- **认证**: 不需要

**响应示例**:
```json
{
  "success": true,
  "data": {
    "levels": [
      {
        "code": "A2",
        "name": "初级",
        "description": "基础英语水平"
      },
      {
        "code": "B1",
        "name": "中级",
        "description": "独立使用者水平"
      }
    ]
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
| INVALID_CREDENTIALS | 401 | 用户名或密码错误 |
| TOKEN_EXPIRED | 401 | 令牌已过期 |
| ARTICLE_GENERATION_FAILED | 500 | 文章生成失败 |
| INSUFFICIENT_CREDITS | 400 | 积分不足（如实现积分系统） |

## 请求限制

- 认证接口：每分钟最多5次请求
- 内容生成接口：每小时最多20次请求
- 其他接口：每分钟最多100次请求

## 注意事项

1. 所有时间戳均使用ISO 8601格式（UTC）
2. 分页查询的页码从1开始
3. 密码长度至少6位，包含字母和数字
4. 文章生成请求的响应时间可能较长（5-30秒）
5. 建议客户端实现请求超时处理

---

*文档版本: v1.0*
*最后更新: 2025-10-04*