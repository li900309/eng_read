# 智能英语学习平台 - Nuxt.js全栈架构

基于Nuxt.js 3构建的现代化英语学习平台，采用全栈架构和AI技术，提供智能化的英语学习体验。

## ✨ 特性

- 🚀 **Nuxt.js 3全栈架构** - 统一的Vue.js全栈框架
- 🎯 **Prisma ORM** - 类型安全的数据库操作
- 🤖 **AI驱动学习** - 集成多种LLM服务
- 🎨 **现代UI设计** - Tailwind CSS + 自定义组件库
- 📱 **响应式设计** - 完美适配各种设备
- 🌙 **深色模式** - 支持明暗主题切换
- 🔒 **安全认证** - JWT令牌认证系统
- 📊 **数据分析** - 详细的学习进度追踪
- 🚀 **SEO优化** - 内置SSR/SSG支持

## 🏗️ 技术栈

### 前端
- **Nuxt.js 3** - 全栈Vue.js框架
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Tailwind CSS** - 原子化CSS框架
- **Zustand/Pinia** - 状态管理
- **Zod** - 运行时类型验证

### 后端
- **Nitro Engine** - Nuxt.js服务端引擎
- **Prisma ORM** - 类型安全的数据库ORM
- **PostgreSQL** - 生产级关系型数据库
- **JWT** - JSON Web Token认证
- **Bcrypt** - 密码哈希加密

### AI服务
- **OpenAI GPT** - 大语言模型API
- **Anthropic Claude** - Claude模型API
- **本地模型** - Ollama本地模型支持

### 开发工具
- **Vitest** - 单元测试框架
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查
- **Docker** - 容器化部署

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0
- (可选) Docker

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和API密钥
```

4. **数据库设置**
```bash
# 创建数据库迁移
npm run db:migrate

# 填充初始数据
npm run db:seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 可用脚本

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 数据库
npm run db:generate  # 生成Prisma客户端
npm run db:push      # 推送schema到数据库
npm run db:migrate   # 创建迁移文件
npm run db:studio    # 打开Prisma Studio
npm run db:seed      # 填充初始数据

# 代码质量
npm run lint         # 运行ESLint检查
npm run lint:fix     # 自动修复ESLint问题
npm run type-check   # TypeScript类型检查
npm run test         # 运行测试
npm run test:coverage # 运行测试并生成覆盖率报告

# 生产部署
npm run analyze     # 分析构建包大小
```

## 📁 项目结构

```
<项目根目录>/
├── assets/                    # 静态资源
│   └── css/
│       └── main.css           # 全局样式
├── components/                # Vue组件
│   ├── base/                  # 基础UI组件
│   │   └── Button.vue
│   ├── features/              # 功能组件
│   │   └── TranslationTool.vue
│   └── layout/                # 布局组件
├── composables/               # 组合式函数
│   ├── useAuth.ts            # 认证相关
│   ├── useVocabulary.ts      # 词汇管理
│   └── useLLM.ts             # LLM服务
├── layouts/                  # 页面布局
│   └── default.vue
├── middleware/               # 路由中间件
├── pages/                    # 页面路由
│   ├── index.vue             # 首页
│   ├── login.vue             # 登录页
│   ├── dashboard/            # 仪表板
│   ├── learning/             # 学习页面
│   └── vocabulary/           # 词汇管理
├── plugins/                  # Nuxt插件
├── prisma/                   # 数据库相关
│   ├── schema.prisma         # 数据库模式
│   ├── migrations/           # 数据库迁移
│   └── seed.ts               # 数据填充
├── server/                   # 服务端代码
│   ├── api/                  # API路由
│   │   ├── auth/             # 认证相关
│   │   ├── vocabulary/       # 词汇相关
│   │   ├── learning/         # 学习相关
│   │   ├── statistics/       # 统计相关
│   │   └── llm/              # AI服务
│   ├── middleware/           # 服务端中间件
│   ├── services/             # 业务逻辑服务
│   └── utils/                # 服务端工具
├── stores/                   # 状态管理
├── types/                    # TypeScript类型定义
│   ├── auth.ts
│   ├── vocabulary.ts
│   ├── learning.ts
│   ├── api.ts
│   └── llm.ts
├── utils/                    # 客户端工具
├── public/                   # 公共静态文件
├── doc/                      # 项目文档
│   ├── style.md              # 编码规范
│   └── technical_spec/       # 技术规格
├── .env.example              # 环境变量示例
├── nuxt.config.ts            # Nuxt配置
├── tailwind.config.js        # Tailwind配置
├── tsconfig.json            # TypeScript配置
├── vitest.config.ts         # Vitest配置
├── eslint.config.js         # ESLint配置
├── .prettierrc              # Prettier配置
├── Dockerfile               # Docker配置
├── docker-compose.yml       # Docker Compose配置
├── package.json             # 项目依赖
└── README.md               # 项目说明
```

## 🔧 环境配置

### 必需配置
```env
# 数据库
DATABASE_URL="postgresql://username:password@localhost:5432/eng_read_platform"

# JWT密钥
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# API基础路径
API_BASE="/api"

# 开发环境
NODE_ENV="development"
PORT=3000
```

### 可选配置
```env
# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Anthropic API
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Redis缓存
REDIS_URL="redis://localhost:6379"

# OAuth提供商
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# 监控分析
VERCEL_ANALYTICS_ID=""
```

## 🤖 AI服务集成

### 支持的LLM提供商

1. **OpenAI GPT**
   - 需要配置 `OPENAI_API_KEY`
   - 默认模型：gpt-3.5-turbo

2. **Anthropic Claude**
   - 需要配置 `ANTHROPIC_API_KEY`
   - 默认模型：claude-3-haiku

3. **本地模型**
   - 使用Ollama运行本地模型
   - 默认模型：llama3.1:8b

### AI功能

- 📝 **智能翻译** - 多语言实时翻译
- ✍️ **语法检查** - AI驱动的语法纠错
- 📚 **词汇生成** - 智能生成学习词汇
- 📖 **阅读理解** - 自动生成阅读理解题
- 🎯 **个性化推荐** - 基于学习行为的智能推荐

## 🚀 部署指南

### Docker部署

1. **构建镜像**
```bash
docker build -t nuxt-english-platform .
```

2. **运行容器**
```bash
docker-compose up -d
```

### Vercel部署

1. **连接代码仓库**
```bash
npm install -g vercel
vercel
```

2. **配置环境变量**
   在Vercel控制台配置环境变量

3. **部署**
```bash
vercel --prod
```

### 传统服务器部署

1. **构建项目**
```bash
npm run build
```

2. **启动服务**
```bash
npm run preview
```

3. **配置反向代理**
   使用Nginx或Apache配置反向代理

## 📊 性能优化

### 前端优化
- 代码分割和懒加载
- 图片优化和WebP格式
- 缓存策略优化
- Service Worker支持

### 后端优化
- 数据库查询优化
- Redis缓存层
- CDN加速
- 负载均衡

### SEO优化
- 服务端渲染(SSR)
- 静态站点生成(SSG)
- 语义化HTML
- 结构化数据

## 🧪 测试

### 单元测试
```bash
npm run test
npm run test:coverage
```

### E2E测试
```bash
npm run test:e2e
```

### 性能测试
```bash
npm run test:performance
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 开发规范

- 遵循 `doc/style.md` 中的Nuxt.js编码规范
- 使用TypeScript提供类型定义
- 编写单元测试和集成测试
- 保持代码简洁和可维护性
- 提交前运行代码检查

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Nuxt.js](https://nuxt.com/) - 全栈Vue.js框架
- [Prisma](https://www.prisma.io/) - 现代数据库ORM
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架

## 📞 联系我们

- 项目主页：[GitHub Repository](https://github.com/your-username/nuxt-english-platform)
- 问题反馈：[Issues](https://github.com/your-username/nuxt-english-platform/issues)
- 邮箱：support@example.com

---

🌟 如果这个项目对你有帮助，请给我们一个Star！