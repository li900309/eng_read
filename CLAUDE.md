# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

智能英语学习平台 - 通过AI技术和个性化算法，提供高效的英语阅读理解学习体验。项目采用前后端分离架构，Python Flask后端 + React TypeScript前端，集成大语言模型API。

## 工作语言

- 本项目的工作语言是中文
- 本项目要求极高的设计和代码审美标准，一切力求简洁，如无必要勿增实体

## 开发环境设置

### 后端启动 (Flask + UV)

```bash
cd backend
make install          # 安装依赖并创建虚拟环境
make run              # 启动开发服务器 (默认端口 5000)
```

**常用后端命令:**
- `make dev` - 安装开发依赖
- `make test` - 运行测试
- `make test-cov` - 运行测试并生成覆盖率报告
- `make lint` - 代码检查 (flake8, mypy, bandit)
- `make format` - 代码格式化 (black, isort, autopep8)
- `make db-upgrade` - 应用数据库迁移
- `make db-migrate MSG="迁移描述"` - 创建数据库迁移
- `make db-seed` - 填充初始数据

### 前端启动 (React + Vite)

```bash
cd frontend
npm install
npm run dev          # 启动开发服务器 (端口 3000)
```

**常用前端命令:**
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run test` - 运行测试
- `npm run test:coverage` - 运行测试并生成覆盖率
- `npm run lint` - ESLint检查
- `npm run type-check` - TypeScript类型检查
- `npm run format` - Prettier格式化

## 架构设计

### 后端架构 (Flask)

**应用工厂模式:**
- `app/__init__.py` - 应用工厂函数 `createApp()`
- `app/config.py` - 多环境配置类 (Development, Production, Testing)
- `app/extensions.py` - Flask扩展初始化 (db, jwt, cache, limiter等)

**蓝图结构:**
- `app/views/auth.py` - 用户认证 (注册/登录/JWT)
- `app/views/vocabulary.py` - 词汇管理
- `app/views/learning.py` - 学习核心功能
- `app/views/statistics.py` - 统计数据
- `app/views/llm.py` - AI集成服务

**服务层:**
- `app/services/userService.py` - 用户业务逻辑
- `app/services/vocabularyService.py` - 词汇管理逻辑
- `app/services/learningService.py` - 学习算法和逻辑
- `app/services/statisticsService.py` - 数据统计分析
- `app/services/llmService.py` - 大语言模型集成

**数据模型:**
- `app/models/user.py` - 用户模型
- `app/models/vocabulary.py` - 词汇模型
- `app/models/learning.py` - 学习记录模型
- `app/models/statistics.py` - 统计数据模型

### 前端架构 (React + TypeScript)

**状态管理:**
- `src/store/authStore.ts` - Zustand认证状态
- `src/store/learningStore.ts` - 学习状态管理
- `src/store/uiStore.ts` - UI状态

**路由:**
- `src/router/index.tsx` - React Router配置
- `src/router/RouteGuards.tsx` - 路由守卫 (认证检查)

**核心页面:**
- `src/pages/HomePage.tsx` - 首页
- `src/pages/DashboardPage.tsx` - 学习仪表板
- `src/pages/LearningPage.tsx` - 阅读学习页面
- `src/pages/VocabularyPage.tsx` - 词汇管理

**组件架构:**
- `src/components/base/` - 基础UI组件 (Button, Input, Card等)
- `src/components/common/` - 通用组件 (Modal, Toast等)
- `src/components/features/` - 功能组件 (VocabularyCard, QuizOption等)

**API服务:**
- `src/services/api.ts` - Axios配置和拦截器
- `src/services/auth.ts` - 认证API
- `src/services/vocabulary.ts` - 词汇API
- `src/services/statistics.ts` - 统计API

## 关键配置

### 端口配置
- 后端: http://localhost:5000 (开发)
- 前端: http://localhost:3000 (Vite开发服务器)
- API代理: 前端通过 `/api` 代理到后端

### 环境变量
后端需配置 `.env` 文件 (参考 `backend/.env.example`):
- `FLASK_ENV=development`
- `SECRET_KEY` 和 `JWT_SECRET_KEY`
- `DATABASE_URL` (开发环境默认SQLite)
- `REDIS_URL` (缓存)
- `LLM_PROVIDER` 和相关API密钥

### 数据库
- 开发环境: SQLite (`eng_read.db`)
- 生产环境: PostgreSQL推荐
- 使用Flask-Migrate管理数据库迁移

## 测试策略

### 后端测试
```bash
cd backend
make test                # 运行所有测试
make test-cov           # 带覆盖率的测试
```

### 前端测试
```bash
cd frontend
npm run test            # Vitest单元测试
npm run test:e2e        # Playwright端到端测试
```

## 部署配置

### Docker部署
```bash
cd frontend
docker-compose up -d    # 启动完整服务栈
```

包含服务:
- Frontend (Nginx + React): 端口3000
- Backend (Flask): 端口3001
- PostgreSQL: 数据库
- Redis: 缓存
- Prometheus + Grafana: 监控

### 生产部署
- 后端: 使用Gunicorn + Gunicorn配置文件
- 前端: 构建后通过Nginx提供静态文件服务
- 数据库: PostgreSQL推荐
- 缓存: Redis

## LLM集成说明

项目支持多个LLM提供商，通过 `app/services/llmService.py` 统一接口:
- OpenAI (GPT系列)
- Anthropic (Claude)
- 本地模型 (Ollama等)
- 配置文件位于 `config/` 目录

## 代码风格要求

### Python (后端)
- 遵循PEP 8规范
- 使用Black格式化
- 类型注解 (Type Hints)
- 文档字符串 (Google风格)

### TypeScript (前端)
- 严格TypeScript配置
- ESLint + Prettier
- 组件文档注释
- Tailwind CSS用于样式

## 开发工作流

1. 启动开发环境: 后端 `make run` + 前端 `npm run dev`
2. 数据库迁移: `make db-upgrade`
3. 运行测试: `make test` 和 `npm run test`
4. 代码检查: `make lint` 和 `npm run lint`
5. 提交前确保: 格式化 + 检查 + 测试通过

## 调试技巧

- 后端日志: `logs/app.log` 或 `make logs`
- 前端热重载: Vite自动重载
- API调试: 后端Flask Debug模式 + 前端React DevTools
- 数据库: SQLite使用DB Browser for SQLite