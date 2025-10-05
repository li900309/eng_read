# 智能英语学习平台 - Nuxt.js全栈架构技术规格文档

## 目录
1. [架构决策和设计原则](#1-架构决策和设计原则)
2. [项目结构重组方案](#2-项目结构重组方案)
3. [服务端API架构](#3-服务端api架构)
4. [数据层重构](#4-数据层重构)
5. [认证和授权系统](#5-认证和授权系统)
6. [LLM服务集成架构](#6-llm服务集成架构)
7. [前端架构重构](#7-前端架构重构)
8. [性能和SEO优化](#8-性能和seo优化)
9. [开发和工具链](#9-开发和工具链)
10. [部署和运维](#10-部署和运维)
11. [迁移实施计划](#11-迁移实施计划)

---

## 1. 架构决策和设计原则

### 1.1 全栈架构选型分析

#### 技术选型对比矩阵

| 特性 | Nuxt.js | Next.js | SvelteKit | 现有Flask+React |
|------|---------|---------|-----------|-----------------|
| **开发体验** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **类型安全** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **SEO能力** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **生态系统** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **学习曲线** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **全栈能力** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

#### 选择Nuxt.js的核心理由

1. **Vue生态系统优势**
   - 与现有团队技术栈更匹配
   - Composition API提供更好的逻辑复用
   - Vue的响应式系统更直观易理解
   - 更低的入门门槛，更快的开发速度

2. **Nitro引擎优势**
   - 原生支持多种部署模式（SSR/SSG/SPA）
   - 优秀的边缘计算支持
   - 内置缓存优化
   - 服务端API路由简化开发

3. **开发效率提升**
   - 文件系统路由自动生成
   - 自动导入组件和API
   - 内置SEO优化
   - 热模块替换（HMR）性能优异

4. **架构统一性**
   - 单一代码库管理前后端
   - 类型安全的API调用
   - 统一的配置管理
   - 简化的部署流程

### 1.2 架构设计原则

#### 核心原则

1. **简洁性原则**
   - 避免过度设计，保持架构简洁
   - 优先使用Nuxt.js内置功能
   - 减少第三方依赖
   - 保持代码库的整洁和可维护性

2. **类型安全优先**
   - 全面使用TypeScript
   - Prisma提供类型安全的数据库操作
   - Zod进行运行时类型验证
   - 端到端的类型推断

3. **性能优先**
   - 利用Vue 3的响应式系统
   - 智能代码分割和懒加载
   - 图片优化和缓存策略
   - SSR/SSG混合渲染策略

4. **可扩展性设计**
   - 模块化的插件架构
   - 微服务友好的API设计
   - 水平扩展准备
   - 多租户支持预留

---

## 2. 项目结构重组方案

### 2.1 Nuxt.js项目目录结构

```
nuxt-english-platform/
├── .nuxt/                    # Nuxt构建文件
├── .output/                  # 构建输出
├── assets/                   # 静态资源
│   ├── css/                  # 样式文件
│   ├── fonts/                # 字体文件
│   └── images/               # 图片资源
├── components/               # Vue组件
│   ├── base/                 # 基础UI组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Modal/
│   ├── features/             # 功能组件
│   │   ├── ReadingCard/
│   │   ├── VocabularyList/
│   │   ├── ProgressChart/
│   │   └── QuizComponent/
│   └── layout/               # 布局组件
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       └── AppFooter.vue
├── composables/              # 组合式函数
│   ├── useAuth.ts
│   ├── useVocabulary.ts
│   ├── useLearning.ts
│   └── useStatistics.ts
├── layouts/                  # 页面布局
│   ├── default.vue
│   ├── auth.vue
│   └── dashboard.vue
├── middleware/               # 路由中间件
│   ├── auth.global.ts
│   ├── admin.ts
│   └── guest.ts
├── pages/                    # 页面路由
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   ├── dashboard/
│   │   ├── index.vue
│   │   └── statistics.vue
│   ├── learning/
│   │   ├── index.vue
│   │   ├── [id].vue
│   │   └── quiz.vue
│   └── vocabulary/
│       ├── index.vue
│       └── [word].vue
├── plugins/                  # Nuxt插件
│   ├── prisma.client.ts
│   ├── api.client.ts
│   └── llm.client.ts
├── prisma/                   # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── server/                   # 服务端代码
│   ├── api/                  # API路由
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   └── refresh.post.ts
│   │   ├── vocabulary/
│   │   │   ├── index.get.ts
│   │   │   ├── create.post.ts
│   │   │   └── [id].delete.ts
│   │   ├── learning/
│   │   │   ├── content.get.ts
│   │   │   ├── submit.post.ts
│   │   │   └── progress.get.ts
│   │   ├── statistics/
│   │   │   ├── dashboard.get.ts
│   │   │   └── analytics.get.ts
│   │   └── llm/
│   │       ├── generate.post.ts
│   │       ├── translate.post.ts
│   │       └── feedback.post.ts
│   ├── middleware/           # 服务端中间件
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   ├── rate-limit.ts
│   │   └── error-handler.ts
│   ├── services/             # 服务层
│   │   ├── auth.service.ts
│   │   ├── vocabulary.service.ts
│   │   ├── learning.service.ts
│   │   ├── statistics.service.ts
│   │   └── llm.service.ts
│   └── utils/                # 服务端工具
│       ├── jwt.ts
│       ├── cache.ts
│       └── logger.ts
├── stores/                   # Pinia状态管理
│   ├── auth.ts
│   ├── vocabulary.ts
│   ├── learning.ts
│   └── ui.ts
├── types/                    # TypeScript类型定义
│   ├── api.ts
│   ├── auth.ts
│   ├── vocabulary.ts
│   ├── learning.ts
│   └── llm.ts
├── utils/                    # 客户端工具
│   ├── api.ts
│   ├── validation.ts
│   └── helpers.ts
├── public/                   # 公共静态文件
├── .env.example              # 环境变量示例
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── nuxt.config.ts            # Nuxt配置
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

### 2.2 Flask蓝图到Nuxt路由映射

| Flask蓝图 | Nuxt API路由 | 功能描述 |
|------------|--------------|----------|
| `auth.py` | `/server/api/auth/*` | 用户认证相关API |
| `vocabulary.py` | `/server/api/vocabulary/*` | 词汇管理API |
| `learning.py` | `/server/api/learning/*` | 学习核心功能API |
| `statistics.py` | `/server/api/statistics/*` | 统计数据API |
| `llm.py` | `/server/api/llm/*` | AI服务API |

### 2.3 组件迁移策略

#### React到Vue组件映射

```typescript
// React组件迁移示例
// Before: React + TypeScript
interface VocabularyCardProps {
  word: Word;
  onLearn: (id: string) => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, onLearn }) => {
  return (
    <div className="card" onClick={() => onLearn(word.id)}>
      <h3>{word.term}</h3>
      <p>{word.definition}</p>
    </div>
  );
};

// After: Vue 3 + Composition API
// components/features/VocabularyCard/VocabularyCard.vue
<script setup lang="ts">
interface Props {
  word: Word;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  learn: [id: string];
}>();

const handleLearn = () => {
  emit('learn', props.word.id);
};
</script>

<template>
  <div class="card" @click="handleLearn">
    <h3>{{ word.term }}</h3>
    <p>{{ word.definition }}</p>
  </div>
</template>
```

---

## 3. 服务端API架构

### 3.1 Nuxt Server Routes设计

#### API路由结构

```typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 验证输入
  const validatedData = loginSchema.parse(body);

  // 调用服务层
  const result = await authService.login(validatedData);

  // 设置Cookie
  setCookie(event, 'auth-token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7天
  });

  return {
    user: result.user,
    token: result.token,
  };
});
```

#### API中间件架构

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // 跳过公开路由
  if (isPublicRoute(event.node.req.url)) {
    return;
  }

  // 验证JWT
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  try {
    const decoded = verifyJWT(token);
    event.context.auth = decoded;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }
});
```

### 3.2 中间件实现

#### 认证中间件
```typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken';

interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

export default defineEventHandler(async (event) => {
  const isApiRoute = event.node.req.url?.startsWith('/api');

  if (!isApiRoute) return;

  const publicPaths = ['/api/auth/login', '/api/auth/register'];
  const isPublic = publicPaths.some(path =>
    event.node.req.url?.startsWith(path)
  );

  if (isPublic) return;

  const token = getCookie(event, 'auth-token') ||
                getHeader(event, 'authorization')?.replace('Bearer ', '');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthContext;
    event.context.auth = decoded;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token',
    });
  }
});
```

#### 缓存中间件
```typescript
// server/middleware/cache.ts
import { storage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import redisDriver from 'unstorage/drivers/redis';

const storage = storage({
  driver: process.env.NODE_ENV === 'production'
    ? redisDriver({ base: 'redis://localhost:6379' })
    : fsDriver({ base: './.cache' }),
});

export default defineEventHandler(async (event) => {
  const cacheKey = `cache:${event.node.req.url}`;

  // 尝试从缓存获取
  const cached = await storage.getItem(cacheKey);
  if (cached) {
    event.node.res.setHeader('X-Cache', 'HIT');
    return cached;
  }

  // 继续处理请求
  const response = await handleEvent(event);

  // 存储到缓存（仅缓存GET请求）
  if (event.node.req.method === 'GET') {
    await storage.setItem(cacheKey, response, {
      ttl: 60 * 5 // 5分钟
    });
    event.node.res.setHeader('X-Cache', 'MISS');
  }

  return response;
});
```

#### 限流中间件
```typescript
// server/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';
import { memoryStore } from 'express-rate-limit';

const limiter = rateLimit({
  store: memoryStore(),
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100个请求
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default defineEventHandler(async (event) => {
  await limiter(event.node.req, event.node.res);
});
```

---

## 4. 数据层重构

### 4.1 Prisma Schema设计

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // 或 "sqlite" 用于开发
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String?   @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  avatar        String?
  level         Level     @default(BEGINNER)
  experience    Int       @default(0)
  studyStreak   Int       @default(0)
  lastStudyAt   DateTime?
  preferences   Json?     // 用户偏好设置
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 关系
  vocabulary    Vocabulary[]
  learningRecords LearningRecord[]
  achievements  UserAchievement[]
  sessions      StudySession[]

  @@map("users")
}

model Vocabulary {
  id          String   @id @default(cuid())
  userId      String
  word        String
  definition  String
  pronunciation String?
  example     String?
  translation String?
  difficulty  Int      @default(1)
  mastery     Mastery  @default(NEW)
  reviewCount Int      @default(0)
  lastReviewAt DateTime?
  nextReviewAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 关系
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  contexts    WordContext[]

  @@unique([userId, word])
  @@map("vocabulary")
}

model WordContext {
  id           String   @id @default(cuid())
  vocabularyId String
  articleTitle String
  sentence     String
  position     Int
  createdAt    DateTime @default(now())

  // 关系
  vocabulary   Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)

  @@map("word_contexts")
}

model Article {
  id          String     @id @default(cuid())
  title       String
  content     String
  summary     String?
  difficulty  Level
  category    String
  tags        String[]
  readTime    Int        // 预估阅读时间（分钟）
  wordCount   Int
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // 关系
  questions   Question[]
  learningRecords LearningRecord[]

  @@map("articles")
}

model Question {
  id          String       @id @default(cuid())
  articleId   String
  type        QuestionType
  question    String
  options     String[]     // JSON数组
  correctAnswer Int
  explanation String?
  position    Int
  createdAt   DateTime     @default(now())

  // 关系
  article     Article      @relation(fields: [articleId], references: [id], onDelete: Cascade)
  answers     Answer[]

  @@map("questions")
}

model Answer {
  id          String   @id @default(cuid())
  questionId  String
  userId      String
  selected    Int
  isCorrect   Boolean
  timeSpent   Int      // 耗时（秒）
  createdAt   DateTime @default(now())

  // 关系
  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([questionId, userId])
  @@map("answers")
}

model LearningRecord {
  id          String       @id @default(cuid())
  userId      String
  articleId   String
  startedAt   DateTime     @default(now())
  completedAt DateTime?
  timeSpent   Int          // 总耗时（秒）
  accuracy    Float?       // 正确率
  wordsRead   Int          // 阅读单词数
  newWords    Int          // 新单词数
  status      RecordStatus @default(IN_PROGRESS)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // 关系
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  article     Article      @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@map("learning_records")
}

model StudySession {
  id          String   @id @default(cuid())
  userId      String
  startTime   DateTime @default(now())
  endTime     DateTime?
  duration    Int?     // 持续时间（秒）
  wordsLearned Int     @default(0)
  accuracy    Float?   // 平均正确率
  createdAt   DateTime @default(now())

  // 关系
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("study_sessions")
}

model Achievement {
  id          String     @id @default(cuid())
  name        String
  description String
  icon        String
  condition   Json       // 解锁条件
  points      Int        @default(0)
  createdAt   DateTime   @default(now())

  // 关系
  users       UserAchievement[]

  @@map("achievements")
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())

  // 关系
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
  @@map("user_achievements")
}

// 枚举类型
enum Level {
  BEGINNER    // A2
  ELEMENTARY  // B1
  INTERMEDIATE // B2
  ADVANCED    // C1
  EXPERT      // C2
}

enum Mastery {
  NEW
  LEARNING
  REVIEW
  FAMILIAR
  MASTERED
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  FILL_BLANK
  MATCHING
}

enum RecordStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}
```

### 4.2 Prisma客户端配置

```typescript
// server/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 优雅关闭
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### 4.3 服务层实现

```typescript
// server/services/vocabulary.service.ts
import { prisma } from '../lib/prisma';
import { CreateVocabularyData, UpdateVocabularyData } from '~/types/vocabulary';

export class VocabularyService {
  async createVocabulary(userId: string, data: CreateVocabularyData) {
    return await prisma.vocabulary.create({
      data: {
        ...data,
        userId,
        nextReviewAt: this.calculateNextReview(new Date(), 0),
      },
      include: {
        contexts: true,
      },
    });
  }

  async getUserVocabulary(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contexts: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.vocabulary.count({ where: { userId } }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateMastery(wordId: string, isCorrect: boolean) {
    const word = await prisma.vocabulary.findUnique({
      where: { id: wordId },
    });

    if (!word) throw new Error('Word not found');

    const newMastery = this.calculateMastery(word.mastery, isCorrect);
    const reviewCount = word.reviewCount + 1;
    const nextReviewAt = this.calculateNextReview(
      new Date(),
      reviewCount,
      isCorrect
    );

    return await prisma.vocabulary.update({
      where: { id: wordId },
      data: {
        mastery: newMastery,
        reviewCount,
        lastReviewAt: new Date(),
        nextReviewAt,
      },
    });
  }

  private calculateMastery(current: Mastery, isCorrect: boolean): Mastery {
    const masteryLevels = Object.values(Mastery);
    const currentIndex = masteryLevels.indexOf(current);

    if (isCorrect && currentIndex < masteryLevels.length - 1) {
      return masteryLevels[currentIndex + 1];
    } else if (!isCorrect && currentIndex > 0) {
      return masteryLevels[currentIndex - 1];
    }

    return current;
  }

  private calculateNextReview(
    lastReview: Date,
    reviewCount: number,
    isCorrect = true
  ): Date {
    // 间隔重复算法（简化版）
    const intervals = [1, 3, 7, 14, 30]; // 天数
    const interval = intervals[Math.min(reviewCount, intervals.length - 1)];

    const nextReview = new Date(lastReview);
    nextReview.setDate(nextReview.getDate() + interval);

    return nextReview;
  }
}

export const vocabularyService = new VocabularyService();
```

---

## 5. 认证和授权系统

### 5.1 JWT实现方案

```typescript
// server/utils/jwt.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (user: Pick<User, 'id' | 'email' | 'role'>): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role || 'user',
    } as JWTPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### 5.2 认证服务

```typescript
// server/services/auth.service.ts
import { prisma } from '../lib/prisma';
import { generateToken, hashPassword, comparePassword } from '../utils/jwt';
import { LoginData, RegisterData } from '~/types/auth';

export class AuthService {
  async register(data: RegisterData) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    const token = generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(data.password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async refreshToken(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = generateToken(user);

    return {
      token,
    };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
```

### 5.3 客户端认证状态管理

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = useCookie('auth-token');
  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials: LoginData) => {
    const { data } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });

    user.value = data.user;
    token.value = data.token;

    await navigateTo('/dashboard');
  };

  const register = async (userData: RegisterData) => {
    const { data } = await $fetch('/api/auth/register', {
      method: 'POST',
      body: userData,
    });

    user.value = data.user;
    token.value = data.token;

    await navigateTo('/dashboard');
  };

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' });

    user.value = null;
    token.value = null;

    await navigateTo('/login');
  };

  const refreshAuth = async () => {
    if (!token.value) return;

    try {
      const { data } = await $fetch('/api/auth/refresh', {
        method: 'POST',
      });

      user.value = data.user;
      token.value = data.token;
    } catch (error) {
      logout();
    }
  };

  // 初始化认证状态
  const initAuth = async () => {
    if (token.value) {
      try {
        const { data } = await $fetch('/api/auth/me');
        user.value = data.user;
      } catch (error) {
        logout();
      }
    }
  };

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    register,
    logout,
    refreshAuth,
    initAuth,
  };
});
```

---

## 6. LLM服务集成架构

### 6.1 LLM服务抽象层

```typescript
// server/services/llm/base.service.ts
export interface LLMProvider {
  name: string;
  generate(prompt: string, options?: GenerateOptions): Promise<string>;
  generateStream(prompt: string, options?: GenerateOptions): AsyncGenerator<string>;
  translate(text: string, targetLang: string): Promise<string>;
  explain(word: string, context?: string): Promise<string>;
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
```

### 6.2 OpenAI提供器实现

```typescript
// server/services/llm/openai.service.ts
import OpenAI from 'openai';
import { LLMProvider, GenerateOptions } from './base.service';

export class OpenAIService implements LLMProvider {
  name = 'OpenAI';
  private client: OpenAI;
  private defaultModel = 'gpt-3.5-turbo';

  constructor(config: { apiKey: string; baseUrl?: string }) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: [
        ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
    });

    return completion.choices[0]?.message?.content || '';
  }

  async *generateStream(prompt: string, options: GenerateOptions = {}): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: options.model || this.defaultModel,
      messages: [
        ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  async translate(text: string, targetLang: string): Promise<string> {
    const prompt = `Translate the following English text to ${targetLang}: "${text}"`;
    return this.generate(prompt, { temperature: 0.3 });
  }

  async explain(word: string, context?: string): Promise<string> {
    const prompt = context
      ? `Explain the word "${word}" in the context: "${context}". Provide definition, pronunciation, and example sentences.`
      : `Explain the word "${word}". Provide definition, pronunciation, and example sentences.`;

    return this.generate(prompt, { temperature: 0.5 });
  }
}
```

### 6.3 LLM管理器

```typescript
// server/services/llm/manager.service.ts
import { OpenAIService } from './openai.service';
import { AnthropicService } from './anthropic.service';
import { LocalLLMService } from './local.service';
import { LLMProvider, LLMConfig } from './base.service';

export class LLMManager {
  private providers: Map<string, LLMProvider> = new Map();
  private defaultProvider: string;

  constructor(configs: Record<string, LLMConfig>) {
    // 初始化提供器
    if (configs.openai) {
      this.providers.set('openai', new OpenAIService(configs.openai));
    }

    if (configs.anthropic) {
      this.providers.set('anthropic', new AnthropicService(configs.anthropic));
    }

    if (configs.local) {
      this.providers.set('local', new LocalLLMService(configs.local));
    }

    this.defaultProvider = process.env.DEFAULT_LLM_PROVIDER || 'openai';
  }

  getProvider(name?: string): LLMProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new Error(`LLM provider "${providerName}" not found`);
    }

    return provider;
  }

  async generateWithFallback(
    prompt: string,
    options?: GenerateOptions,
    providerNames?: string[]
  ): Promise<string> {
    const providers = providerNames || [this.defaultProvider];

    for (const name of providers) {
      try {
        const provider = this.getProvider(name);
        return await provider.generate(prompt, options);
      } catch (error) {
        console.error(`Provider ${name} failed:`, error);
        continue;
      }
    }

    throw new Error('All LLM providers failed');
  }

  async generateArticle(options: {
    level: string;
    topic: string;
    length: number;
    style: string;
  }): Promise<string> {
    const prompt = this.generateArticlePrompt(options);

    return this.generateWithFallback(prompt, {
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: 'You are an expert English language content creator.',
    });
  }

  private generateArticlePrompt(options: {
    level: string;
    topic: string;
    length: number;
    style: string;
  }): string {
    return `
Generate an English article with the following specifications:
- CEFR Level: ${options.level}
- Topic: ${options.topic}
- Length: ${options.length} words
- Style: ${options.style}
- Include 5-7 vocabulary words suitable for this level
- Make it engaging and educational

The article should be suitable for English learners and include natural, context-rich sentences.
    `.trim();
  }
}

// 初始化LLM管理器
export const llmManager = new LLMManager({
  openai: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-3.5-turbo',
  },
  anthropic: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-3-haiku-20240307',
  },
  local: {
    provider: 'local',
    baseUrl: process.env.LOCAL_LLM_URL || 'http://localhost:11434',
    model: 'llama2',
  },
});
```

### 6.4 Nitro服务器集成

```typescript
// server/api/llm/generate.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, prompt, options } = body;

  try {
    switch (type) {
      case 'article':
        const article = await llmManager.generateArticle(options);
        return { content: article };

      case 'explanation':
        const explanation = await llmManager
          .getProvider()
          .explain(options.word, options.context);
        return { explanation };

      case 'translation':
        const translation = await llmManager
          .getProvider()
          .translate(options.text, options.targetLang);
        return { translation };

      default:
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid generation type',
        });
    }
  } catch (error) {
    console.error('LLM generation error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate content',
    });
  }
});

// server/api/llm/generate-stream.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt, options } = body;

  // 设置SSE头
  setHeader(event, 'Content-Type', 'text/event-stream');
  setHeader(event, 'Cache-Control', 'no-cache');
  setHeader(event, 'Connection', 'keep-alive');

  const provider = llmManager.getProvider(options?.provider);
  const stream = provider.generateStream(prompt, options);

  try {
    for await (const chunk of stream) {
      event.node.res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
  } catch (error) {
    event.node.res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  } finally {
    event.node.res.end();
  }
});
```

---

## 7. 前端架构重构

### 7.1 Vue 3 Composition API迁移

#### 组合式函数设计

```typescript
// composables/useVocabulary.ts
export const useVocabulary = () => {
  const { $fetch } = useNuxtApp();
  const userStore = useAuthStore();

  const vocabulary = ref<Vocabulary[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // 获取词汇列表
  const fetchVocabulary = async (page = 1, filters?: VocabularyFilters) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch('/api/vocabulary', {
        query: { page, ...filters },
      });

      vocabulary.value = data.items;
      pagination.value = data.pagination;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to fetch vocabulary:', err);
    } finally {
      loading.value = false;
    }
  };

  // 添加生词
  const addVocabulary = async (word: CreateVocabularyData) => {
    try {
      const { data } = await $fetch('/api/vocabulary', {
        method: 'POST',
        body: word,
      });

      vocabulary.value.unshift(data);

      // 显示成功提示
      const toast = useToast();
      toast.success('单词已添加到生词本');

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 更新掌握度
  const updateMastery = async (wordId: string, isCorrect: boolean) => {
    try {
      const { data } = await $fetch(`/api/vocabulary/${wordId}/mastery`, {
        method: 'PATCH',
        body: { isCorrect },
      });

      // 更新本地状态
      const index = vocabulary.value.findIndex(v => v.id === wordId);
      if (index !== -1) {
        vocabulary.value[index] = data;
      }

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 删除词汇
  const deleteVocabulary = async (wordId: string) => {
    try {
      await $fetch(`/api/vocabulary/${wordId}`, {
        method: 'DELETE',
      });

      // 更新本地状态
      vocabulary.value = vocabulary.value.filter(v => v.id !== wordId);

      const toast = useToast();
      toast.success('单词已删除');
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 批量操作
  const batchUpdate = async (wordIds: string[], updates: Partial<Vocabulary>) => {
    try {
      const { data } = await $fetch('/api/vocabulary/batch', {
        method: 'PATCH',
        body: { wordIds, updates },
      });

      // 更新本地状态
      data.forEach((updated: Vocabulary) => {
        const index = vocabulary.value.findIndex(v => v.id === updated.id);
        if (index !== -1) {
          vocabulary.value[index] = updated;
        }
      });

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // 搜索词汇
  const searchVocabulary = async (query: string) => {
    if (!query) {
      await fetchVocabulary();
      return;
    }

    loading.value = true;
    try {
      const { data } = await $fetch('/api/vocabulary/search', {
        query: { q: query },
      });

      vocabulary.value = data.items;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // 计算属性
  const masteredCount = computed(() =>
    vocabulary.value.filter(v => v.mastery === 'MASTERED').length
  );

  const learningCount = computed(() =>
    vocabulary.value.filter(v => ['NEW', 'LEARNING', 'REVIEW'].includes(v.mastery)).length
  );

  const reviewDueCount = computed(() =>
    vocabulary.value.filter(v => {
      if (!v.nextReviewAt) return false;
      return new Date(v.nextReviewAt) <= new Date();
    }).length
  );

  return {
    // 状态
    vocabulary: readonly(vocabulary),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // 计算属性
    masteredCount,
    learningCount,
    reviewDueCount,

    // 方法
    fetchVocabulary,
    addVocabulary,
    updateMastery,
    deleteVocabulary,
    batchUpdate,
    searchVocabulary,
  };
};
```

### 7.2 Pinia状态管理

```typescript
// stores/learning.ts
interface LearningState {
  currentArticle: Article | null;
  currentPosition: number;
  startTime: Date | null;
  answers: Answer[];
  isCompleted: boolean;
  statistics: {
    accuracy: number;
    wordsRead: number;
    timeSpent: number;
    newWords: number;
  } | null;
}

export const useLearningStore = defineStore('learning', {
  state: (): LearningState => ({
    currentArticle: null,
    currentPosition: 0,
    startTime: null,
    answers: [],
    isCompleted: false,
    statistics: null,
  }),

  getters: {
    progress: (state) => {
      if (!state.currentArticle) return 0;
      return (state.currentPosition / state.currentArticle.wordCount) * 100;
    },

    currentWord: (state) => {
      if (!state.currentArticle) return null;
      const words = state.currentArticle.content.split(' ');
      return words[state.currentPosition] || null;
    },

    remainingWords: (state) => {
      if (!state.currentArticle) return 0;
      return state.currentArticle.wordCount - state.currentPosition;
    },
  },

  actions: {
    startLearning(article: Article) {
      this.currentArticle = article;
      this.currentPosition = 0;
      this.startTime = new Date();
      this.answers = [];
      this.isCompleted = false;
      this.statistics = null;
    },

    updatePosition(position: number) {
      this.currentPosition = position;
    },

    recordAnswer(answer: Answer) {
      this.answers.push(answer);
    },

    async completeLearning() {
      if (!this.startTime || !this.currentArticle) return;

      const timeSpent = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
      const correctAnswers = this.answers.filter(a => a.isCorrect).length;
      const accuracy = this.answers.length > 0 ? correctAnswers / this.answers.length : 0;

      this.statistics = {
        accuracy,
        wordsRead: this.currentPosition,
        timeSpent,
        newWords: 0, // 需要从API获取
      };

      this.isCompleted = true;

      // 提交学习记录
      const { $fetch } = useNuxtApp();
      try {
        await $fetch('/api/learning/complete', {
          method: 'POST',
          body: {
            articleId: this.currentArticle.id,
            timeSpent,
            accuracy,
            wordsRead: this.currentPosition,
            answers: this.answers,
          },
        });
      } catch (error) {
        console.error('Failed to save learning record:', error);
      }
    },

    reset() {
      this.currentArticle = null;
      this.currentPosition = 0;
      this.startTime = null;
      this.answers = [];
      this.isCompleted = false;
      this.statistics = null;
    },
  },
});
```

### 7.3 Vue Use生态集成

```typescript
// composables/useReading.ts
import { useIntersectionObserver, useMagicKeys, useWindowSize } from '@vueuse/core';

export const useReading = () => {
  const articleRef = ref<HTMLElement>();
  const isReading = ref(false);
  const readingTime = ref(0);
  const wordsPerMinute = ref(0);

  // 阅读进度追踪
  const { stop } = useIntersectionObserver(
    articleRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !isReading.value) {
        startReading();
      } else if (!isIntersecting && isReading.value) {
        pauseReading();
      }
    }
  );

  // 键盘快捷键
  const { space, arrowRight, arrowLeft } = useMagicKeys();

  watch(space, (v) => {
    if (v) {
      toggleReading();
    }
  });

  // 响应式字体大小
  const { width } = useWindowSize();
  const fontSize = computed(() => {
    if (width.value < 640) return '16px';
    if (width.value < 1024) return '18px';
    return '20px';
  });

  // 阅读计时器
  let timer: NodeJS.Timeout | null = null;

  const startReading = () => {
    isReading.value = true;
    timer = setInterval(() => {
      readingTime.value += 1;
    }, 1000);
  };

  const pauseReading = () => {
    isReading.value = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const toggleReading = () => {
    if (isReading.value) {
      pauseReading();
    } else {
      startReading();
    }
  };

  // 计算阅读速度
  const calculateWPM = (wordCount: number) => {
    if (readingTime.value === 0) return 0;
    const minutes = readingTime.value / 60;
    return Math.round(wordCount / minutes);
  };

  // 自动标记生词
  const selectedText = ref('');
  const handleSelection = () => {
    const selection = window.getSelection();
    selectedText.value = selection?.toString() || '';

    if (selectedText.value.trim()) {
      // 触发生词添加
      const vocabularyStore = useVocabularyStore();
      vocabularyStore.quickAdd(selectedText.value.trim());
    }
  };

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  return {
    articleRef,
    isReading,
    readingTime,
    wordsPerMinute,
    fontSize,
    selectedText,
    handleSelection,
    toggleReading,
    calculateWPM,
  };
};
```

### 7.4 转场动画

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- 全局加载指示器 -->
    <ClientOnly>
      <NuxtLoadingIndicator />
    </ClientOnly>

    <!-- 全局通知 -->
    <UNotifications />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
  transform: translateX(30px);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s ease;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
```

---

## 8. 性能和SEO优化

### 8.1 渲染策略配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 渲染模式
  nitro: {
    prerender: {
      routes: [
        '/',
        '/about',
        '/features',
      ],
    },
  },

  // 页面渲染策略
  routeRules: {
    '/': { prerender: true },                // 静态生成
    '/about': { prerender: true },            // 静态生成
    '/features': { prerender: true },         // 静态生成
    '/dashboard': { ssr: false },             // 客户端渲染
    '/learning/**': { ssr: false },           // 客户端渲染
    '/api/**': { ssr: false },                // 仅服务端
  },

  // 缓存配置
  experimental: {
    payloadExtraction: false,
  },

  // 性能优化
  features: {
    inlineStyles: false,
  },

  // 压缩
  nitro: {
    minify: true,
    compressPublicAssets: true,
  },
});
```

### 8.2 缓存策略

```typescript
// server/utils/cache.ts
import { storage } from 'unstorage';
import redisDriver from 'unstorage/drivers/redis';
import fsDriver from 'unstorage/drivers/fs';

const cache = storage({
  driver: process.env.NODE_ENV === 'production'
    ? redisDriver({ base: process.env.REDIS_URL! })
    : fsDriver({ base: './.cache' }),
});

// 缓存装饰器
export const withCache = (
  key: string,
  ttl: number = 300,
  condition?: (args: any[]) => boolean
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // 检查缓存条件
      if (condition && !condition(args)) {
        return originalMethod.apply(this, args);
      }

      // 生成缓存键
      const cacheKey = `${key}:${JSON.stringify(args)}`;

      // 尝试从缓存获取
      const cached = await cache.getItem(cacheKey);
      if (cached) {
        return cached;
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args);

      // 存储到缓存
      await cache.setItem(cacheKey, result, { ttl });

      return result;
    };

    return descriptor;
  };
};

// 使用示例
class ArticleService {
  @withCache('article', 600) // 10分钟缓存
  async getArticle(id: string) {
    // 从数据库获取文章
  }
}
```

### 8.3 图片优化

```vue
<!-- components/base/OptimizedImage.vue -->
<template>
  <NuxtPicture
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :format="format"
    :sizes="sizes"
    :modifiers="modifiers"
    class="optimized-image"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  format?: string;
  sizes?: string;
  modifiers?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  format: 'webp',
  sizes: 'sm:100vw md:50vw lg:400px',
});

const emit = defineEmits<{
  load: [event: Event];
  error: [event: Event];
}>();

const handleLoad = (event: Event) => {
  emit('load', event);
};

const handleError = (event: Event) => {
  emit('error', event);
};
</script>

<style scoped>
.optimized-image {
  @apply transition-opacity duration-300;
}
</style>
```

### 8.4 SEO管理

```typescript
// composables/useSEO.ts
export const useSEO = (options: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
  author?: string;
}) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const title = computed(() =>
    options.title
      ? `${options.title} | 智能英语学习平台`
      : '智能英语学习平台 - AI驱动的个性化英语阅读训练'
  );

  const description = computed(() =>
    options.description ||
    '通过AI技术和个性化算法，提供高效的英语阅读理解学习体验。智能难度调节、生词管理、学习数据分析。'
  );

  const image = computed(() =>
    options.image || '/images/og-default.jpg'
  );

  const url = computed(() =>
    options.url || `${config.public.siteUrl}${route.fullPath}`
  );

  useHead({
    title: title.value,
    meta: [
      { name: 'description', content: description.value },
      { name: 'keywords', content: options.keywords?.join(', ') || '英语学习,阅读理解,AI教育,个性化学习' },
      { name: 'author', content: options.author || '智能英语学习平台' },

      // Open Graph
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:image', content: image.value },
      { property: 'og:url', content: url.value },
      { property: 'og:type', content: options.type || 'website' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title.value },
      { name: 'twitter:description', content: description.value },
      { name: 'twitter:image', content: image.value },

      // Viewport
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // Theme Color
      { name: 'theme-color', content: '#3B82F6' },

      // Robots
      { name: 'robots', content: 'index, follow' },
    ],
    link: [
      { rel: 'canonical', href: url.value },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    ],
  });

  // 结构化数据
  useSchemaOrg([
    {
      '@type': 'WebSite',
      name: '智能英语学习平台',
      description: description.value,
      url: config.public.siteUrl,
    },
    ...(options.type === 'article' ? [{
      '@type': 'Article',
      headline: options.title,
      description: description.value,
      image: image.value,
      datePublished: new Date().toISOString(),
    }] : []),
  ]);
};
```

---

## 9. 开发和工具链

### 9.1 TypeScript配置

```json
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "~/*": ["./*"],
      "@components/*": ["./components/*"],
      "@stores/*": ["./stores/*"],
      "@types/*": ["./types/*"],
      "@utils/*": ["./utils/*"],
      "@server/*": ["./server/*"]
    },
    "typeRoots": [
      "./types",
      "./node_modules/@types"
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.vue",
    "types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".nuxt",
    ".output",
    "dist"
  ]
}
```

### 9.2 ESLint配置

```javascript
// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  typescript: true,
  formatters: true,
  rules: {
    // 自定义规则
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 1 },
      multiline: { max: 1 }
    }],
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  },
});
```

### 9.3 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '~': resolve(__dirname, '.'),
    },
  },
});

// test/setup.ts
import { config } from '@vue/test-utils';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

// 全局配置
config.global.plugins = [createPinia()];

// Mock Nuxt
config.global.mockNuxt = {
  $fetch: vi.fn(),
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
  },
};
```

### 9.4 Prettier配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": true
}
```

---

## 10. 部署和运维

### 10.1 Docker配置

```dockerfile
# Dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

# 安装依赖
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 构建应用
COPY . .
RUN npm run build

# 生产镜像
FROM node:18-alpine AS runner

# 安全配置
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt
USER nuxt

# 安装pino（生产日志）
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
RUN npm install pino -g

# 暴露端口
EXPOSE 3000

# 环境变量
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NODE_ENV=production

# 启动命令
CMD ["node", ".output/server/index.mjs"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/eng_read
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=eng_read
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### 10.2 Nginx配置

```nginx
# nginx.conf
events {
  worker_connections 1024;
}

http {
  upstream app {
    server app:3000;
  }

  # HTTP重定向到HTTPS
  server {
    listen 80;
    server_name _;
    return 301 https://$server_name$request_uri;
  }

  # HTTPS配置
  server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # SSL优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 缓存静态资源
    location /_nuxt/ {
      proxy_pass http://app;
      add_header Cache-Control 'public, max-age=31536000';
    }

    # API代理
    location /api/ {
      proxy_pass http://app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }

    # 页面代理
    location / {
      proxy_pass http://app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

### 10.3 CI/CD配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: yourusername/eng-read:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/eng-read
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

### 10.4 监控和日志

```typescript
// server/utils/logger.ts
import pino from 'pino';
import pretty from 'pino-pretty';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    pid: process.pid,
    hostname: process.env.HOSTNAME,
  },
}, process.env.NODE_ENV === 'production'
  ? pino.destination({ dest: '/var/log/app.log', sync: false })
  : pretty({ colorize: true })
);

export default logger;

// 错误追踪
export const logError = (error: Error, context?: any) => {
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  });
};

// 性能监控
export const logPerformance = (operation: string, duration: number) => {
  logger.info({
    operation,
    duration,
    type: 'performance',
  });
};
```

---

## 11. 迁移实施计划

### 11.1 分阶段迁移路线图

#### 第一阶段：基础设施搭建（1-2周）

**目标**：建立Nuxt.js项目基础架构

**任务清单**：
- [ ] 初始化Nuxt.js项目
- [ ] 配置TypeScript和开发工具
- [ ] 设置Prisma ORM和数据库
- [ ] 实现基础认证系统
- [ ] 创建通用组件库
- [ ] 配置CI/CD流水线

**交付物**：
- 可运行的Nuxt.js项目骨架
- 基础的API服务
- 前端路由和布局

#### 第二阶段：核心功能迁移（3-4周）

**目标**：迁移用户认证和词汇管理功能

**任务清单**：
- [ ] 迁移用户注册/登录功能
- [ ] 实现JWT认证中间件
- [ ] 迁移词汇CRUD操作
- [ ] 实现生词本功能
- [ ] 开发搜索和筛选功能
- [ ] 集成LLM服务

**交付物**：
- 完整的认证系统
- 词汇管理功能
- AI集成服务

#### 第三阶段：学习系统迁移（3-4周）

**目标**：迁移核心学习功能

**任务清单**：
- [ ] 迁移文章阅读功能
- [ ] 实现难度自适应算法
- [ ] 开发测验和评分系统
- [ ] 实现学习进度追踪
- [ ] 集成数据分析功能

**交付物**：
- 阅读理解训练系统
- 智能难度调节
- 学习数据分析

#### 第四阶段：优化和部署（2-3周）

**目标**：性能优化和生产部署

**任务清单**：
- [ ] 性能优化和代码分割
- [ ] SEO优化
- [ ] 数据迁移
- [ ] 生产环境部署
- [ ] 监控和日志系统
- [ ] 压力测试

**交付物**：
- 生产就绪的应用
- 完整的监控体系
- 迁移文档

### 11.2 风险评估和缓解措施

| 风险项 | 风险等级 | 影响 | 缓解措施 |
|--------|----------|------|----------|
| 数据丢失 | 高 | 严重 | 完整的数据备份策略、增量迁移、验证脚本 |
| 功能缺失 | 中 | 严重 | 详细的功能对比清单、自动化测试 |
| 性能下降 | 中 | 中等 | 性能基准测试、持续监控、优化预案 |
| 延期交付 | 中 | 中等 | 敏捷开发、每日站会、风险预警机制 |
| 用户流失 | 低 | 严重 | 平滑过渡、功能预告、用户培训 |

### 11.3 数据迁移方案

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';
import * as oldData from './old-data.json';

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('Migrating users...');

  for (const user of oldData.users) {
    await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash: user.password_hash,
        firstName: user.first_name,
        lastName: user.last_name,
        level: mapLevel(user.level),
        experience: user.experience || 0,
        studyStreak: user.study_streak || 0,
        lastStudyAt: user.last_study_at ? new Date(user.last_study_at) : null,
        preferences: user.preferences || {},
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      },
    });
  }

  console.log(`Migrated ${oldData.users.length} users`);
}

async function migrateVocabulary() {
  console.log('Migrating vocabulary...');

  for (const vocab of oldData.vocabulary) {
    await prisma.vocabulary.create({
      data: {
        userId: vocab.user_id,
        word: vocab.word,
        definition: vocab.definition,
        pronunciation: vocab.pronunciation,
        example: vocab.example,
        translation: vocab.translation,
        difficulty: vocab.difficulty || 1,
        mastery: mapMastery(vocab.mastery),
        reviewCount: vocab.review_count || 0,
        lastReviewAt: vocab.last_review_at ? new Date(vocab.last_review_at) : null,
        nextReviewAt: vocab.next_review_at ? new Date(vocab.next_review_at) : null,
        createdAt: new Date(vocab.created_at),
        updatedAt: new Date(vocab.updated_at),
      },
    });
  }

  console.log(`Migrated ${oldData.vocabulary.length} vocabulary items`);
}

// 运行迁移
async function runMigration() {
  try {
    await migrateUsers();
    await migrateVocabulary();
    // ... 其他迁移函数

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
```

### 11.4 回滚策略

1. **快速回滚**（部署后24小时内）
   - 切换回Flask服务器
   - 数据库回滚到迁移前状态
   - 通知用户服务维护

2. **灰度回滚**（部署后1周内）
   - 逐步切换流量
   - 监控关键指标
   - 必要时回滚部分功能

3. **数据一致性保障**
   - 双写数据库（过渡期）
   - 数据校验脚本
   - 增量同步机制

### 11.5 成功标准

**技术指标**：
- [ ] 所有功能正常运行
- [ ] API响应时间 < 200ms
- [ ] 页面加载时间 < 2s
- [ ] 99.9% 服务可用性

**业务指标**：
- [ ] 用户留存率不下降
- [ ] 学习完成率保持或提升
- [ ] 用户满意度 > 4.5/5
- [ ] 系统稳定性 > 99%

**迁移目标**：
- [ ] 零数据丢失
- [ ] 最小化用户影响
- [ ] 按时完成迁移
- [ ] 成本控制在预算内

---

## 总结

本技术规格文档详细规划了从Flask+React架构到Nuxt.js全栈架构的完整迁移方案。通过采用Nuxt.js的Nitro引擎和Vue 3的Composition API，我们将实现：

1. **简化的架构**：统一的技术栈减少维护复杂度
2. **更好的开发体验**：类型安全和自动导入提升开发效率
3. **优化的性能**：SSR/SSG混合渲染策略和智能缓存
4. **完善的SEO**：原生支持的SEO优化功能
5. **灵活的扩展性**：插件化架构支持未来功能扩展

迁移过程将分4个阶段进行，确保平稳过渡，最小化对用户的影响。通过详细的风险评估和回滚策略，保障迁移过程的安全性。

**下一步行动**：
1. 组建迁移团队，分配任务
2. 搭建开发环境，初始化项目
3. 开始第一阶段的基础设施搭建
4. 建立项目管理和沟通机制

通过这次架构升级，智能英语学习平台将获得更强的技术实力和更好的用户体验，为未来的发展奠定坚实基础。