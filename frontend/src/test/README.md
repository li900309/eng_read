# 测试框架和工具文档

本项目的测试框架基于 Vitest + React Testing Library 构建，提供了全面的测试解决方案。

## 测试架构

### 核心工具

- **Vitest**: 快速的单元测试框架，与 Vite 深度集成
- **React Testing Library**: 组件测试库，专注于用户行为测试
- **jsdom**: 浏览器环境模拟
- **MSW**: API Mock 服务

### 测试类型

1. **单元测试**: 测试单个函数、组件或模块
2. **集成测试**: 测试多个组件协作
3. **E2E 测试**: 端到端用户流程测试
4. **性能测试**: 组件性能和加载时间测试
5. **可访问性测试**: a11y 合规性检查

## 测试配置

### 基础配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Mock 设置

测试环境自动 Mock 以下 API：
- `IntersectionObserver`
- `ResizeObserver`
- `matchMedia`
- `localStorage`
- `sessionStorage`
- `window.scrollTo`

## 测试工具

### 自定义渲染器

```typescript
import { render, screen } from '@/test/utils/test-utils';

// 自动包装所有必要的 Provider
render(<MyComponent />, {
  initialEntries: ['/dashboard'],
  queryClient: customQueryClient,
});

// 使用标准查询
expect(screen.getByRole('button')).toBeInTheDocument();
```

### Mock 数据生成器

```typescript
import {
  createMockUser,
  createMockVocabulary,
  createMockStats,
} from '@/test/utils/test-utils';

const user = createMockUser({ firstName: 'John', role: 'admin' });
const vocabulary = createMockVocabulary({ difficulty: 'advanced' });
```

### 自定义匹配器

```typescript
import { checkAccessibility } from '@/test/utils/matchers';

// 可访问性检查
const accessibility = checkAccessibility(element);
expect(accessibility.isAccessible).toBe(true);

// 自定义断言
expect(button).toBeLoading();
expect(input).toHaveError('This field is required');
```

## 测试最佳实践

### 1. 组件测试原则

```typescript
// ✅ 好的测试：从用户角度出发
test('用户可以成功登录', async () => {
  render(<LoginPage />);

  const emailInput = screen.getByLabelText(/邮箱地址/);
  const passwordInput = screen.getByLabelText(/密码/);
  const submitButton = screen.getByRole('button', { name: /登录/ });

  await user.type(emailInput, 'user@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  expect(screen.getByText(/欢迎回来/)).toBeInTheDocument();
});

// ❌ 避免：测试实现细节
test('login function is called with correct params', () => {
  // 避免直接测试内部函数调用
});
```

### 2. 异步测试

```typescript
// ✅ 使用 waitFor 处理异步
test('异步加载用户数据', async () => {
  render(<UserProfile />);

  expect(screen.getByText('加载中...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// ✅ 使用 findBy 查找异步元素
test('查找异步渲染的元素', async () => {
  render(<AsyncComponent />);

  const element = await screen.findByRole('heading', { name: /动态标题/ });
  expect(element).toBeInTheDocument();
});
```

### 3. Mock 策略

```typescript
// ✅ Mock 外部依赖
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: createMockUser(),
    login: vi.fn(),
    isAuthenticated: true,
  }),
}));

// ✅ Mock API 调用
test('获取词汇数据', async () => {
  const mockData = [createMockVocabulary()];

  vi.mock('@/services/vocabulary', () => ({
    getVocabulary: vi.fn().mockResolvedValue(mockData),
  }));

  render(<VocabularyList />);

  expect(await screen.findByText('example')).toBeInTheDocument();
});
```

### 4. 可访问性测试

```typescript
test('组件符合可访问性标准', async () => {
  const { container } = render(<MyComponent />);

  // 使用 axe-core 进行可访问性检查
  const results = await axe(container);
  expect(results).toHaveNoViolations();

  // 手动检查关键点
  expect(screen.getByRole('button')).toHaveAttribute('aria-label');
});
```

## 测试脚本

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# UI 界面
npm run test:ui

# 运行特定测试
npm run test:run -- VocabularyCard.test.tsx

# E2E 测试
npm run test:e2e

# 性能测试
npm run test:performance

# 可访问性测试
npm run test:accessibility

# 运行所有检查
npm run test:all
```

## 覆盖率要求

- **全局覆盖率**: 80%
- **组件覆盖率**: 90%
- **Hooks 覆盖率**: 85%
- **页面覆盖率**: 75%

## 目录结构

```
src/test/
├── setup.ts              # 测试环境设置
├── utils/
│   ├── test-utils.tsx    # 测试工具函数
│   ├── matchers.ts       # 自定义匹配器
│   └── mocks.ts          # Mock 数据
├── types/
│   └── test-types.ts     # 测试类型定义
└── fixtures/             # 测试固件数据
```

## 调试测试

### 1. 使用 screen.debug()

```typescript
test('调试组件输出', () => {
  render(<MyComponent />);

  // 打印当前 DOM 结构
  screen.debug();

  // 打印特定元素
  screen.debug(screen.getByRole('button'));
});
```

### 2. VS Code 调试

在 `.vscode/launch.json` 中添加：

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--no-coverage", "${file}"],
  "console": "integratedTerminal"
}
```

## 持续集成

### GitHub Actions

```yaml
- name: Run Tests
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 常见问题

### 1. 测试环境问题

```typescript
// 清理副作用
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### 2. 异步测试超时

```typescript
test('处理长时间异步操作', async () => {
  const result = await waitFor(
    () => expect(screen.findByText('完成')).toBeInTheDocument(),
    { timeout: 10000 }
  );
}, 15000); // 增加测试超时时间
```

### 3. Mock 恢复

```typescript
beforeEach(() => {
  vi.restoreAllMocks();
});
```

## 参考资源

- [Vitest 官方文档](https://vitest.dev/)
- [React Testing Library 官方文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)
- [可访问性测试指南](https://www.deque.com/axe/core-documentation/)