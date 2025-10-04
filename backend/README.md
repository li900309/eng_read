# Eng Read 后端 API

英语阅读学习平台的后端 API 服务，基于 Flask 框架构建。

## 功能特性

- **用户管理**: 用户注册、登录、个人信息管理
- **词汇管理**: 词汇库维护、分类管理、用户词汇列表
- **学习系统**: 自适应学习算法、间隔重复、学习会话管理
- **统计分析**: 学习进度追踪、成就系统、数据可视化
- **安全认证**: JWT 令牌认证、权限控制、API 限流
- **缓存优化**: Redis 缓存、查询优化、性能监控

## 技术栈

- **框架**: Flask 2.3
- **数据库**: PostgreSQL (生产) / SQLite (开发)
- **ORM**: SQLAlchemy 2.0
- **缓存**: Redis
- **认证**: JWT (Flask-JWT-Extended)
- **API**: RESTful API
- **测试**: pytest
- **部署**: Gunicorn + Nginx

## 项目结构

```
backend/
├── app/                    # 应用主目录
│   ├── __init__.py        # 应用工厂
│   ├── config.py          # 配置管理
│   ├── extensions.py      # 扩展初始化
│   ├── models/            # 数据模型
│   │   ├── user.py        # 用户模型
│   │   ├── vocabulary.py  # 词汇模型
│   │   ├── learning.py    # 学习模型
│   │   └── statistics.py  # 统计模型
│   ├── views/             # 视图层 (蓝图)
│   ├── services/          # 业务逻辑层
│   └── utils/             # 工具函数
│       ├── auth.py        # 认证工具
│       ├── validators.py  # 验证器
│       ├── decorators.py  # 装饰器
│       └── helpers.py     # 辅助函数
├── tests/                 # 测试文件
├── migrations/            # 数据库迁移
├── pyproject.toml        # UV项目配置
├── uv.lock              # 依赖锁定文件
├── .env.example          # 环境变量示例
└── run.py                # 应用入口
```

## 快速开始

### 方式一：使用 UV 包管理器（推荐）

#### 1. 安装 UV

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm astral.sh/uv/install.sh | iex"

# 或使用 pip
pip install uv
```

#### 2. 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd backend

# 创建虚拟环境并安装依赖
uv venv
uv sync --all-extras
```

#### 3. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（设置数据库连接等）
```

#### 4. 数据库初始化

```bash
# 初始化数据库迁移
uv run flask db init

# 创建迁移文件
uv run flask db migrate -m "Initial migration"

# 应用迁移
uv run flask db upgrade
```

#### 5. 启动应用

```bash
# 启动开发服务器
uv run python run.py

# 或使用 Makefile（推荐）
make run
```

### 方式二：传统方式

#### 1. 环境准备

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements-dev.txt
```

### 2. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量文件，设置数据库连接等配置
```

### 3. 数据库初始化

```bash
# 初始化数据库迁移
flask db init

# 创建迁移文件
flask db migrate -m "Initial migration"

# 应用迁移
flask db upgrade
```

### 4. 启动应用

```bash
# 开发环境
python run.py

# 或使用 Flask 命令
flask run
```

应用将在 http://localhost:5000 启动

## API 文档

### 基础端点

- `GET /health` - 健康检查
- `GET /api` - API 信息

### 认证端点 (/api/auth)

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 词汇端点 (/api/vocabulary)

- `GET /api/vocabulary` - 获取词汇列表
- `GET /api/vocabulary/{id}` - 获取词汇详情
- `POST /api/vocabulary` - 添加词汇
- `PUT /api/vocabulary/{id}` - 更新词汇
- `DELETE /api/vocabulary/{id}` - 删除词汇
- `GET /api/vocabulary/categories` - 获取分类列表

### 学习端点 (/api/learning)

- `POST /api/learning/session` - 开始学习会话
- `GET /api/learning/session/{id}` - 获取会话信息
- `POST /api/learning/session/{id}/answer` - 提交答案
- `POST /api/learning/session/{id}/complete` - 完成会话
- `GET /apilearning/queue` - 获取学习队列

### 统计端点 (/api/statistics)

- `GET /api/statistics/dashboard` - 获取仪表板数据
- `GET /api/statistics/progress` - 获取学习进度
- `GET /api/statistics/achievements` - 获取成就列表
- `GET /api/statistics/daily` - 获取每日统计

## 开发指南

### 代码规范

项目遵循以下编码规范：

- Python: PEP 8 规范，使用 4 个空格缩进
- 命名: 小驼峰命名法 (camelCase)
- 注释: 使用英文编写注释和文档字符串
- 类型提示: 使用 typing 模块进行类型注解

### 测试

```bash
# 使用 UV 运行所有测试
uv run pytest

# 运行测试并生成覆盖率报告
uv run pytest --cov=app --cov-report=html

# 运行特定测试文件
uv run pytest tests/test_user.py

# 使用 Makefile
make test
make test-cov
```

### 代码质量

```bash
# 代码格式化
black app/ tests/

# 代码检查
flake8 app/ tests/

# 类型检查
mypy app/

# 安全检查
bandit -r app/
```

## 部署

### 开发环境

```bash
python run.py
```

### 生产环境

```bash
# 使用 Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# 使用 Gunicorn 配置文件
gunicorn -c gunicorn.conf.py run:app
```

### 使用 Makefile 部署

```bash
# 构建生产环境
make build

# 部署到生产环境
make deploy
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `FLASK_ENV` | Flask 环境 | `development` |
| `SECRET_KEY` | 应用密钥 | - |
| `DATABASE_URL` | 数据库连接 | `sqlite:///eng_read.db` |
| `JWT_SECRET_KEY` | JWT 密钥 | - |
| `REDIS_URL` | Redis 连接 | `redis://localhost:6379/0` |
| `CORS_ORIGINS` | CORS 源 | `*` |
| `LOG_LEVEL` | 日志级别 | `INFO` |

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目链接: [https://github.com/yourusername/eng-read](https://github.com/yourusername/eng-read)
- 问题反馈: [Issues](https://github.com/yourusername/eng-read/issues)