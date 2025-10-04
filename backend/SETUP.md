# Eng Read Backend - 快速开始指南

## 概述

Eng Read Backend 是一个基于 Flask 的英语阅读学习平台后端 API 服务，使用现代化的 UV 包管理器和最佳实践构建。

## 技术栈

- **Python**: 3.11+
- **Web框架**: Flask 2.3
- **数据库**: PostgreSQL (生产) / SQLite (开发)
- **ORM**: SQLAlchemy 2.0 + Flask-Migrate
- **认证**: JWT (Flask-JWT-Extended)
- **缓存**: Redis
- **包管理**: UV
- **API文档**: RESTful API

## 快速开始

### 方法一：自动设置（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd backend

# 2. 运行自动设置脚本
python scripts/dev_setup.py
```

自动设置脚本将完成：
- 检查 Python 版本
- 安装 UV 包管理器
- 创建虚拟环境
- 安装所有依赖
- 初始化数据库
- 填充种子数据
- 创建测试账户

### 方法二：手动设置

#### 1. 环境准备

```bash
# 检查 Python 版本（需要 3.11+）
python --version

# 安装 UV 包管理器
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### 2. 项目设置

```bash
# 克隆项目
git clone <repository-url>
cd backend

# 创建虚拟环境
uv venv

# 激活虚拟环境
source .venv/bin/activate  # Linux/Mac
# 或 .venv\Scripts\activate  # Windows

# 安装依赖
uv sync --all-extras
```

#### 3. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量（设置数据库连接等）
nano .env
```

#### 4. 数据库初始化

```bash
# 初始化数据库迁移
python scripts/migrate.py init

# 创建初始迁移
python scripts/migrate.py migrate "Initial migration"

# 应用迁移
python scripts/migrate.py upgrade

# 填充种子数据
python scripts/seed_data.py
```

#### 5. 启动应用

```bash
# 启动开发服务器
uv run python run.py

# 或使用 Makefile
make run
```

应用将在 http://localhost:5000 启动

## API 端点

### 基础端点

- `GET /` - 欢迎信息
- `GET /health` - 健康检查
- `GET /api` - API 信息

### 认证端点 `/api/auth`

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 词汇端点 `/api/vocabulary`

- `GET /api/vocabulary` - 获取词汇列表
- `GET /api/vocabulary/{id}` - 获取词汇详情
- `POST /api/vocabulary` - 添加词汇（管理员）
- `PUT /api/vocabulary/{id}` - 更新词汇（管理员）
- `DELETE /api/vocabulary/{id}` - 删除词汇（管理员）
- `GET /api/vocabulary/search` - 搜索词汇
- `GET /api/vocabulary/categories` - 获取分类列表
- `GET /api/vocabulary/random` - 获取随机词汇

### 学习端点 `/api/learning`

- `POST /api/learning/session` - 创建学习会话
- `GET /api/learning/session/{id}` - 获取会话信息
- `POST /api/learning/session/{id}/answer` - 提交答案
- `POST /api/learning/session/{id}/complete` - 完成会话
- `GET /api/learning/queue` - 获取学习队列
- `GET /api/learning/stats` - 获取学习统计
- `GET /api/learning/recommendations` - 获取推荐词汇

### 统计端点 `/api/statistics`

- `GET /api/statistics/dashboard` - 获取仪表板数据
- `GET /api/statistics/progress` - 获取学习进度
- `GET /api/statistics/achievements` - 获取成就列表
- `GET /api/statistics/learning-trend` - 获取学习趋势

## 测试账户

设置完成后，可以使用以下测试账户：

- **管理员**: admin@engread.com / admin123
- **普通用户**: user@engread.com / user123
- **学习者**: learner@engread.com / learn123

## 开发工具

### Makefile 命令

```bash
# 开发
make run           # 启动开发服务器
make test          # 运行测试
make test-cov      # 运行测试并生成覆盖率报告

# 代码质量
make format        # 格式化代码
make lint          # 代码检查
make check         # 运行所有检查

# 数据库
make db-init       # 初始化数据库
make db-migrate    # 创建迁移
make db-upgrade    # 应用迁移
make db-seed       # 填充种子数据
make db-reset      # 重置数据库

# 工具
make clean         # 清理缓存和临时文件
make info          # 显示环境信息
```

### UV 命令

```bash
# 依赖管理
uv add package-name          # 添加依赖
uv add --dev package-name    # 添加开发依赖
uv remove package-name       # 移除依赖
uv sync                      # 同步依赖

# 运行命令
uv run python run.py         # 运行应用
uv run pytest               # 运行测试
uv run flask --help         # Flask 命令
```

### 数据库管理

```bash
# 迁移管理
python scripts/migrate.py init              # 初始化迁移
python scripts/migrate.py migrate "message"  # 创建迁移
python scripts/migrate.py upgrade           # 应用迁移
python scripts/migrate.py downgrade         # 降级数据库
python scripts/migrate.py status            # 检查状态
python scripts/migrate.py history           # 查看历史

# 种子数据
python scripts/seed_data.py                # 填充种子数据
```

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
│   │   ├── auth.py        # 认证接口
│   │   ├── vocabulary.py  # 词汇接口
│   │   ├── learning.py    # 学习接口
│   │   ├── statistics.py  # 统计接口
│   │   └── main.py        # 主接口
│   ├── services/          # 业务逻辑层
│   │   ├── userService.py
│   │   ├── vocabularyService.py
│   │   ├── learningService.py
│   │   └── statisticsService.py
│   └── utils/             # 工具函数
│       ├── auth.py        # 认证工具
│       ├── validators.py  # 验证器
│       ├── decorators.py  # 装饰器
│       └── helpers.py     # 辅助函数
├── scripts/               # 脚本文件
│   ├── dev_setup.py      # 开发环境设置
│   ├── migrate.py        # 数据库迁移
│   └── seed_data.py      # 种子数据
├── tests/                 # 测试文件
├── migrations/            # 数据库迁移
├── logs/                  # 日志文件
├── uploads/               # 上传文件
├── pyproject.toml         # 项目配置
├── uv.lock               # 依赖锁定文件
├── Makefile              # 便捷命令
├── .env.example          # 环境变量示例
└── run.py                # 应用入口
```

## 环境变量

主要环境变量：

```bash
# Flask 配置
FLASK_ENV=development
SECRET_KEY=your-secret-key

# 数据库
DATABASE_URL=sqlite:///eng_read.db
# PostgreSQL: postgresql://user:pass@localhost/eng_read

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ORIGINS=http://localhost:3000
```

## 部署

### 开发环境

```bash
uv run python run.py
```

### 生产环境

```bash
# 使用 Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app

# 使用 Makefile
make deploy
```

### Docker 部署

```bash
# 构建镜像
docker build -t eng-read-backend .

# 运行容器
docker run -p 5000:5000 eng-read-backend
```

## 故障排除

### 常见问题

1. **UV 命令未找到**
   ```bash
   # 重新安装 UV
   curl -LsSf https://astral.sh/uv/install.sh | sh
   # 重新加载环境
   source ~/.bashrc
   ```

2. **数据库连接错误**
   ```bash
   # 检查数据库状态
   python scripts/migrate.py status

   # 重置数据库
   make db-reset
   ```

3. **依赖安装失败**
   ```bash
   # 清理并重新安装
   uv cache clean
   uv sync --all-extras
   ```

4. **端口占用**
   ```bash
   # 查看端口占用
   lsof -i :5000
   # 使用其他端口
   uv run python run.py --port 5001
   ```

### 获取帮助

- 查看项目文档：`README.md`
- 查看 API 文档：`/api`
- 健康检查：`/health`
- 环境信息：`make info`

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 运行测试：`make test`
5. 代码检查：`make lint`
6. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。