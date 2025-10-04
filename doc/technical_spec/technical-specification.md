# 英语学习网站 - 技术规格说明书

## 项目概述

### 项目背景
智能英语阅读理解学习平台是一个基于大语言模型技术的个性化学习系统，通过AI实时生成内容和智能难度调节，为用户提供高效的英语阅读学习体验。系统采用0-100分的精确评分体系，实时追踪用户能力水平，确保学习者始终处于最佳学习区间。

### 技术目标
- 构建简洁高效的Web应用
- 实现个性化内容生成
- 支持学习进度跟踪
- 保证良好的用户体验

## 技术架构

### 整体架构
```
┌─────────────────┐     ┌─────────────────┐
│   前端 (React)   │────▶│  后端 (Flask)   │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  LLM API (OpenAI)│
                        └─────────────────┘
```

### 技术栈选择

#### 后端技术栈
- **框架**: Flask 3.0
  - 理由：轻量级、简单易用、文档完善、性能提升
- **Python版本**: 3.12
  - 理由：性能优化、更好的类型提示、更快的启动速度
- **依赖管理**: uv
  - 理由：极快的Python包管理器，支持项目依赖管理、虚拟环境管理、依赖锁定等功能
- **数据库**: PostgreSQL 16
  - 理由：性能提升、更好的并行处理、增强的JSON支持
- **ORM**: SQLAlchemy 2.0
  - 理由：功能完整、性能优秀、异步支持
- **认证**: Flask-JWT-Extended
- **API文档**: Flask-RESTX (自动生成Swagger)
- **任务队列**: Celery + Redis
  - 理由：处理异步任务如文章生成、数据分析等
- **缓存**: Redis
  - 理由：高速缓存、会话存储、实时数据存储

#### 前端技术栈
- **框架**: React 18.3
  - 理由：生态成熟、开发效率高、并发特性
- **构建工具**: Vite 6.0
  - 理由：快速启动、热更新、优化的构建性能
- **状态管理**: Zustand 5.0
  - 理由：轻量级、TypeScript友好、简化状态管理
- **UI框架**: Tailwind CSS 3.4
  - 理由：原子化CSS、灵活性高、优秀的性能
- **HTTP客户端**: Axios 1.7
  - 理由：成熟稳定、丰富的拦截器功能
- **图表库**: Chart.js / Recharts
  - 理由：用于学习数据可视化
- **动画库**: Framer Motion
  - 理由：流畅的动画效果、增强用户体验

## 核心功能实现

### 1. 自适应难度评分系统

#### 评分算法核心实现
```python
from dataclasses import dataclass
from typing import List, Dict, Tuple
import numpy as np
from datetime import datetime, timedelta

@dataclass
class QuestionResult:
    """题目结果数据结构"""
    is_correct: bool
    response_time_ms: int
    question_difficulty: float  # 0-100
    question_type: str
    timestamp: datetime

class AdaptiveScoringSystem:
    """自适应难度评分系统"""

    def __init__(self):
        self.alpha = 0.2  # EMA平滑因子
        self.window_size = 10  # 默认窗口大小
        self.min_window = 5
        self.max_window = 20

    def calculate_score_delta(self, result: QuestionResult) -> float:
        """计算单次答题的分数变化"""
        # 基础分数变化
        if result.is_correct:
            base_delta = 3.0
            # 快速答题加分
            if result.response_time_ms < self.get_standard_time(result.question_type):
                base_delta += 1.0
        else:
            base_delta = -2.0
            # 快速错误额外扣分
            if result.response_time_ms < self.get_standard_time(result.question_type) * 0.5:
                base_delta -= 1.0

        # 难度权重调整
        difficulty_multiplier = 1 + (result.question_difficulty - 50) / 100
        adjusted_delta = base_delta * difficulty_multiplier

        # 限制变化范围
        return max(-5, min(5, adjusted_delta))

    def update_user_score(self, current_score: float,
                         recent_results: List[QuestionResult]) -> float:
        """更新用户能力分数"""
        if not recent_results:
            return current_score

        # 计算加权平均变化
        total_weight = 0
        weighted_delta = 0

        for result in recent_results[-self.window_size:]:
            delta = self.calculate_score_delta(result)
            # 时间衰减权重（最近的题目权重更高）
            time_weight = np.exp(-0.1 * (datetime.now() - result.timestamp).days)
            weighted_delta += delta * time_weight
            total_weight += time_weight

        if total_weight == 0:
            return current_score

        avg_delta = weighted_delta / total_weight

        # 应用指数移动平均
        new_score = self.alpha * (current_score + avg_delta) + (1 - self.alpha) * current_score

        # 确保分数在0-100范围内
        return max(0, min(100, new_score))

    def should_adjust_difficulty(self, recent_results: List[QuestionResult]) -> Dict:
        """判断是否需要调整难度"""
        if len(recent_results) < 5:
            return {"adjust": False, "reason": "insufficient_data"}

        # 计算最近表现
        recent_accuracy = sum(r.is_correct for r in recent_results[-10:]) / min(10, len(recent_results))
        avg_response_time = np.mean([r.response_time_ms for r in recent_results[-10:]])

        # 判断调整策略
        if recent_accuracy > 0.85 and avg_response_time < self.get_standard_time("average"):
            return {"adjust": True, "direction": "increase", "amount": 5}
        elif recent_accuracy < 0.55:
            return {"adjust": True, "direction": "decrease", "amount": 5}
        elif recent_accuracy > 0.95:
            return {"adjust": True, "direction": "increase", "amount": 3}

        return {"adjust": False, "reason": "appropriate_level"}

    def get_standard_time(self, question_type: str) -> int:
        """获取不同题型的标准答题时间（毫秒）"""
        standard_times = {
            "vocabulary": 5000,
            "grammar": 8000,
            "reading_comprehension": 15000,
            "main_idea": 10000,
            "detail": 12000,
            "inference": 18000,
            "average": 10000
        }
        return standard_times.get(question_type, 10000)
```

#### 实时评分更新服务
```python
from flask import current_app
from app.models.user import User
from app.models.learning_record import LearningSession
from app import db
import redis

class RealTimeScoringService:
    """实时评分服务"""

    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.scoring_system = AdaptiveScoringSystem()

    def update_score_after_answer(self, user_id: int, question_result: QuestionResult):
        """答题后实时更新分数"""
        # 获取当前用户分数
        user = User.query.get(user_id)
        current_score = user.current_ability_score or 30.0

        # 获取最近的答题记录
        cache_key = f"user:{user_id}:recent_results"
        recent_results_bytes = self.redis_client.lrange(cache_key, 0, -1)

        # 反序列化历史记录
        recent_results = []
        for result_bytes in recent_results_bytes:
            recent_results.append(self.deserialize_result(result_bytes))

        # 添加新结果
        recent_results.append(question_result)

        # 更新分数
        new_score = self.scoring_system.update_user_score(current_score, recent_results)

        # 更新数据库
        user.current_ability_score = new_score
        user.last_score_update = datetime.utcnow()

        # 检查是否需要调整难度
        adjustment = self.scoring_system.should_adjust_difficulty(recent_results)
        if adjustment["adjust"]:
            user.suggested_difficulty = max(0, min(100,
                new_score + adjustment["amount"] if adjustment["direction"] == "increase"
                else new_score - adjustment["amount"]))

        db.session.commit()

        # 更新缓存
        self.redis_client.rpush(cache_key, self.serialize_result(question_result))
        self.redis_client.ltrim(cache_key, -20, -1)  # 保留最近20条记录
        self.redis_client.setex(f"user:{user_id}:current_score", 3600, str(new_score))

        return {
            "new_score": new_score,
            "score_change": new_score - current_score,
            "difficulty_adjustment": adjustment
        }
```

### 2. 用户认证系统

#### JWT认证实现
```python
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

class AuthService:
    def __init__(self):
        self.secret_key = os.getenv('JWT_SECRET_KEY')

    def generate_token(self, user_id: int) -> str:
        """生成访问令牌"""
        return create_access_token(
            identity=user_id,
            expires_delta=timedelta(days=7)
        )

    @jwt_required()
    def verify_token(self):
        """验证令牌"""
        return get_jwt_identity()
```

#### 密码安全
- 使用bcrypt进行密码哈希
- 设置密码强度要求
- 实现登录失败限制

### 2. LLM内容生成

#### 文章生成服务
```python
import openai

class ContentGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def generate_article(self, difficulty: str, topic: str, word_count: int):
        """生成个性化文章"""
        prompt = f"""
        请生成一篇{difficulty}级别的英语文章：
        - 主题：{topic}
        - 字数：约{word_count}词
        - 包含5道阅读理解题
        """

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        return self.parse_content(response.choices[0].message.content)
```

### 3. 学习进度跟踪

#### 进度计算逻辑
```python
class ProgressTracker:
    def calculate_reading_progress(self, user_id: int, article_id: int):
        """计算阅读进度"""
        # 获取用户阅读记录
        records = self.get_reading_records(user_id, article_id)

        # 计算完成度
        total_words = self.get_article_word_count(article_id)
        read_words = sum(record.words_read for record in records)

        progress = min(100, (read_words / total_words) * 100)

        return {
            'progress': progress,
            'time_spent': sum(record.time_spent for record in records),
            'completion_status': 'completed' if progress >= 100 else 'in_progress'
        }
```

### 4. 生词管理

#### 生词识别算法
```python
class VocabularyManager:
    def identify_new_words(self, text: str, user_level: str):
        """识别生词"""
        # 获取用户已掌握词汇
        known_words = self.get_user_vocabulary(user_level)

        # 分词并识别生词
        words = self.tokenize(text)
        new_words = []

        for word in set(words):
            if word.lower() not in known_words and len(word) > 2:
                word_info = self.get_word_definition(word)
                if word_info:
                    new_words.append(word_info)

        return new_words[:20]  # 限制生词数量

    def schedule_review(self, word_id: int, mastery_level: float):
        """安排复习时间（简化版艾宾浩斯）"""
        intervals = [1, 3, 7, 14, 30]  # 天数
        interval = intervals[min(int(mastery_level * 5), 4)]

        return datetime.now() + timedelta(days=interval)
```

## 数据模型设计

### 用户相关表

```sql
-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 用户档案表
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_level VARCHAR(10) DEFAULT 'A2',
    daily_target INTEGER DEFAULT 15,  -- 每日学习目标（分钟）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 学习内容表

```sql
-- 文章表
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    difficulty_level VARCHAR(10) NOT NULL,
    word_count INTEGER NOT NULL,
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 题目表
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,  -- {"A": "...", "B": "...", "C": "...", "D": "..."}
    correct_answer CHAR(1) NOT NULL,
    explanation TEXT
);
```

### 学习记录表

```sql
-- 学习会话表
CREATE TABLE learning_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER,  -- 秒
    articles_read INTEGER DEFAULT 0,
    accuracy_score DECIMAL(5,2)
);

-- 用户生词本
CREATE TABLE user_vocabulary (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    definition TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mastery_level DECIMAL(3,2) DEFAULT 0.0,
    next_review TIMESTAMP,
    UNIQUE(user_id, word)
);
```

## 部署方案

### 开发环境
```yaml
本地开发设置:
  - Python 3.11
  - uv - Python包管理器
  - PostgreSQL 15 (本地或Docker)
  - Redis (可选，用于缓存)

快速启动:
  1. 确保已安装uv: curl -LsSf https://astral.sh/uv/install.sh | sh
  2. 克隆项目后进入backend目录
  3. 安装项目依赖: uv sync
  4. 创建数据库: createdb english_learning
  5. 运行项目: uv run flask run

uv优势:
  - 极快的安装速度（比pip快10-100倍）
  - 自动创建和管理虚拟环境
  - 智能依赖解析，避免版本冲突
  - 支持pyproject.toml和uv.lock锁文件
  - 与pip和pipx兼容
```

### 生产环境
```yaml
简单部署方案:
  服务器:
    - 单台VPS (2核4G内存)
    - Ubuntu 22.04 LTS
    - Python 3.11
    - uv - 生产环境依赖管理

  Web服务器:
    - Nginx (反向代理)
    - Gunicorn (WSGI服务器)

  数据库:
    - PostgreSQL 15
    - 定期备份脚本

  部署流程:
    1. 安装uv: curl -LsSf https://astral.sh/uv/install.sh | sh
    2. 克隆代码: git clone <repository>
    3. 同步依赖: uv sync
    4. 运行迁移: uv run flask db upgrade
    5. 启动服务: uv run gunicorn app:app

  部署脚本:
    - 使用git进行代码部署
    - systemd管理服务进程
    - 简单的shell脚本自动化
```

### 配置示例

```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://user:password@localhost/english_learning'
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
```

## 性能优化

### 数据库优化
- 为常用查询字段添加索引
- 使用连接池减少连接开销
- 实现查询结果缓存

### 前端优化
- 实现路由懒加载
- 使用React.memo避免不必要的重渲染
- 图片懒加载和压缩

### 缓存策略
- 文章内容缓存（生成后24小时）
- 用户会话缓存
- API响应缓存（非敏感数据）

## 测试计划

### 单元测试
- 测试覆盖目标：70%
- 工具：pytest
- 重点：业务逻辑、数据模型

### 集成测试
- API接口测试
- 数据库操作测试
- 第三方服务集成测试

### 简单测试流程
```bash
# 运行所有测试
pytest

# 运行测试并生成覆盖率报告
pytest --cov=app tests/

# 运行特定测试
pytest tests/test_auth.py
```

## 安全考虑

### 基础安全措施
- JWT令牌认证
- 密码加密存储
- SQL注入防护（通过ORM）
- XSS防护（前端输入验证）

### API安全
- 请求频率限制
- 输入数据验证
- 错误信息脱敏

## 项目结构

```
english-learning/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── migrations/
│   ├── config.py
│   ├── pyproject.toml      # 项目依赖配置文件
│   └── uv.lock            # uv锁文件
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── README.md
```

### uv配置示例 (pyproject.toml)

```toml
[project]
name = "english-learning-backend"
version = "1.0.0"
description = "英语学习平台后端"
dependencies = [
    "flask==2.3.3",
    "sqlalchemy==2.0.23",
    "psycopg2-binary==2.9.9",
    "flask-jwt-extended==4.6.0",
    "flask-restx==1.3.0",
    "bcrypt==4.1.2",
    "openai==1.3.8",
    "python-dotenv==1.0.0",
    "gunicorn==21.2.0"
]

[project.optional-dependencies]
dev = [
    "pytest==7.4.3",
    "pytest-cov==4.1.0",
    "black==23.11.0",
    "flake8==6.1.0"
]

[tool.uv]
dev-dependencies = [
    "pytest",
    "pytest-cov",
    "black",
    "flake8"
]
```

## uv 使用指南

### 安装uv
```bash
# Linux/macOS - 通过官方安装脚本
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows - PowerShell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或通过pip安装
pip install uv

# 或通过pipx安装（推荐）
pipx install uv
```

### 项目初始化
```bash
# 进入项目目录
cd backend

# 创建pyproject.toml（如不存在）
uv init

# 安装项目依赖
uv sync

# 添加新依赖
uv add package-name

# 添加开发依赖
uv add --dev package-name

# 移除依赖
uv remove package-name

# 更新依赖
uv lock --upgrade
```

### 常用命令
```bash
# 运行Flask应用
uv run flask run

# 运行测试
uv run pytest

# 代码格式化
uv run black .

# 代码检查
uv run flake8

# 数据库迁移
uv run flask db init
uv run flask db migrate -m "Initial migration"
uv run flask db upgrade

# 生产环境启动
uv run gunicorn -w 4 -b 0.0.0.0:8000 app:app

# 激活虚拟环境
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate     # Windows

# 查看已安装的包
uv pip list

# 安装特定版本的包
uv add package-name==1.2.3
```

### 优势特点
- **极快速度**: 使用Rust编写，安装和解析速度比pip快10-100倍
- **智能缓存**: 自动缓存已安装的包，避免重复下载
- **虚拟环境管理**: 自动创建和管理项目虚拟环境(.venv)
- **依赖锁定**: 通过uv.lock文件确保依赖版本一致性
- **跨平台兼容**: 支持Windows、macOS、Linux
- **PyPI兼容**: 完全兼容PyPI和标准Python包索引
- **项目管理**: 支持完整的Python项目生命周期管理

## 开发计划

### 第一阶段（MVP）
- [ ] 用户注册登录
- [ ] 基础文章生成
- [ ] 简单阅读界面
- [ ] 基础答题功能

### 第二阶段
- [ ] 生词本功能
- [ ] 学习进度跟踪
- [ ] 难度自适应
- [ ] UI/UX优化

### 第三阶段
- [ ] 数据统计
- [ ] 复习提醒
- [ ] 性能优化
- [ ] 功能扩展

---

*文档版本: v2.2 (使用uv依赖管理)*
*最后更新: 2025-10-04*