# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

智能英语学习平台 - 通过AI技术和个性化算法，提供高效的英语阅读理解学习体验。项目采用Nuxt.js全栈架构，集成Vue 3、TypeScript、Prisma和PostgreSQL，以及大语言模型API。

## 工作语言

- 本项目的工作语言是中文
- 本项目要求极高的设计和代码审美标准，一切力求简洁，如无必要勿增实体

## 开发环境设置

### 项目启动 (Nuxt.js + Prisma)

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和API密钥

# 数据库初始化
npm run db:generate  # 生成Prisma客户端
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 填充初始数据

# 启动开发服务器
npm run dev          # 启动开发服务器 (端口 3000)
```

**常用命令:**
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run type-check` - TypeScript类型检查
- `npm run lint` - ESLint代码检查
- `npm run lint:fix` - 自动修复ESLint问题
- `npm run test` - 运行测试
- `npm run test:coverage` - 运行测试并生成覆盖率报告

**数据库命令:**
- `npm run db:generate` - 生成Prisma客户端
- `npm run db:push` - 推送schema到数据库
- `npm run db:migrate` - 创建数据库迁移
- `npm run db:studio` - 打开Prisma Studio
- `npm run db:seed` - 填充初始数据

## 架构设计

### Nuxt.js全栈架构

**项目配置:**
- `nuxt.config.ts` - Nuxt主配置文件
- `tailwind.config.js` - Tailwind CSS配置
- `tsconfig.json` - TypeScript配置
- `vitest.config.ts` - 测试配置

**前端架构 (Vue 3 + Composition API):**
- `components/` - Vue组件库
  - `base/` - 基础UI组件 (Button, Input, Card等)
  - `features/` - 功能组件 (TranslationTool, VocabularyCard等)
  - `layout/` - 布局组件 (Header, Footer等)
- `pages/` - 页面路由 (自动路由生成)
- `layouts/` - 页面布局模板
- `composables/` - 组合式函数 (useAuth, useVocabulary, useLLM等)
- `stores/` - Pinia状态管理
- `utils/` - 客户端工具函数

**后端架构 (Nitro Engine + Prisma):**
- `server/` - 服务端代码
  - `api/` - API路由 (自动生成)
    - `auth/` - 用户认证API
    - `vocabulary/` - 词汇管理API
    - `learning/` - 学习功能API
    - `statistics/` - 统计数据API
    - `llm/` - AI服务API
  - `middleware/` - 服务端中间件 (认证、错误处理等)
  - `services/` - 业务逻辑服务
  - `utils/` - 服务端工具函数

**数据层:**
- `prisma/` - 数据库配置
  - `schema.prisma` - 数据库模式定义
  - `migrations/` - 数据库迁移文件
  - `seed.ts` - 数据填充脚本

**类型定义:**
- `types/` - TypeScript类型定义
  - `auth.ts` - 认证相关类型
  - `vocabulary.ts` - 词汇相关类型
  - `learning.ts` - 学习功能类型
  - `api.ts` - API响应类型
  - `llm.ts` - LLM服务类型

## 关键配置

### 端口配置
- 开发服务器: http://localhost:3000 (Nuxt.js)
- API服务: http://localhost:3000/api (内置)
- Prisma Studio: 启动后显示访问地址

### 环境变量
项目需配置 `.env` 文件 (参考 `.env.example`):
- `DATABASE_URL` - PostgreSQL数据库连接
- `JWT_SECRET` - JWT密钥
- `JWT_EXPIRES_IN` - JWT过期时间
- `NODE_ENV` - 环境类型 (development/production)
- `OPENAI_API_KEY` - OpenAI API密钥 (可选)
- `ANTHROPIC_API_KEY` - Anthropic API密钥 (可选)
- `REDIS_URL` - Redis缓存连接 (可选)

### 数据库
- 开发环境: PostgreSQL (推荐) 或 SQLite
- 生产环境: PostgreSQL (推荐)
- 使用Prisma ORM管理数据库操作和迁移

## 测试策略

### 单元测试
```bash
npm run test            # 运行所有测试
npm run test:coverage   # 带覆盖率的测试
```

### 类型检查
```bash
npm run type-check      # TypeScript类型检查
```

### 代码质量检查
```bash
npm run lint            # ESLint代码检查
npm run lint:fix        # 自动修复代码问题
```

## 部署配置

### Docker部署
```bash
docker-compose up -d    # 启动完整服务栈
```

包含服务:
- Nuxt.js应用: 端口3000
- PostgreSQL: 数据库
- Redis: 缓存 (可选)
- Nginx: 反向代理 (可选)

### Vercel部署
```bash
npm install -g vercel
vercel                  # 部署到预览环境
vercel --prod          # 部署到生产环境
```

### 传统服务器部署
```bash
npm run build          # 构建生产版本
npm run preview        # 预览构建结果
```

## LLM集成说明

项目支持多个LLM提供商，通过 `server/services/llm.service.ts` 统一接口:
- OpenAI (GPT系列) - 需配置 `OPENAI_API_KEY`
- Anthropic (Claude) - 需配置 `ANTHROPIC_API_KEY`
- 本地模型 (Ollama等) - 支持本地部署的模型

## 代码风格要求

### ⚠️ 重要：必须遵守编码规范
**所有代码必须严格遵守 `doc/style.md` 中定义的Nuxt.js编码规范**，这是项目的强制性要求。在提交任何代码之前，请确保：

1. 仔细阅读并理解 `doc/style.md` 中的所有规范要求
2. 使用格式化工具（Prettier等）自动格式化代码
3. 运行代码检查工具确保符合规范
4. 在代码审查中会重点检查编码规范的遵守情况

### TypeScript/Vue.js规范
- **必须遵守 `doc/style.md` TypeScript/Vue.js编码规范**
- 严格TypeScript配置和类型注解
- Vue 3 Composition API优先
- ESLint + Prettier代码格式化
- 组件文档注释
- Tailwind CSS用于样式

### 服务端代码规范
- TypeScript类型安全
- Zod运行时数据验证
- RESTful API设计原则
- 统一的错误处理机制
- 中间件架构模式

## 开发工作流

1. **环境准备**: 安装依赖、配置环境变量、初始化数据库
2. **开发**: 启动开发服务器 `npm run dev`
3. **数据库操作**: 使用Prisma Studio或命令行管理
4. **测试**: 运行测试和类型检查
5. **代码质量**: 运行代码检查和格式化
6. **提交前确保**: 测试通过 + 类型检查通过 + 代码检查通过 + **编码规范符合要求**

## 调试技巧

- **开发服务器**: Nuxt.js DevTools + Vue DevTools
- **API调试**: 浏览器开发者工具 + 服务端日志
- **数据库**: Prisma Studio可视化工具
- **类型检查**: TypeScript编译时错误提示
- **LLM服务**: 检查API密钥配置和网络连接

## 性能优化

- **代码分割**: Nuxt.js自动进行路由级别的代码分割
- **图片优化**: 使用Nuxt Image组件自动优化
- **缓存策略**: 利用Nitro引擎的缓存机制
- **SSR/SSG**: 根据页面需求选择渲染模式
- **数据库优化**: 使用Prisma的查询优化和索引

## 安全考虑

- JWT令牌认证和授权
- 密码哈希存储 (Bcrypt)
- API输入验证 (Zod)
- CORS配置
- SQL注入防护 (Prisma ORM)
- XSS防护 (Vue.js内置)