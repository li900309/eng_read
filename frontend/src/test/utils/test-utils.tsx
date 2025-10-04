import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from '@/components/base/ConfigProvider';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';

// 创建测试用的QueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// 测试包装器组件
interface AllTheProvidersProps {
  children: React.ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

const AllTheProviders = ({
  children,
  initialEntries = ['/'],
  queryClient = createTestQueryClient()
}: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// 自定义渲染函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: string[];
    queryClient?: QueryClient;
  }
) => {
  const { initialEntries, queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        initialEntries={initialEntries}
        queryClient={queryClient}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock数据生成器
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  preferences: {
    theme: 'light',
    dailyGoal: 20,
    notifications: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockVocabulary = (overrides = {}) => ({
  id: '1',
  word: 'example',
  definition: 'a thing characteristic of its kind or illustrating a general rule',
  pronunciation: '/ɪɡˈzæmpəl/',
  partOfSpeech: 'noun',
  difficulty: 'intermediate',
  category: 'general',
  examples: [
    'This is an example of good design.',
    'For example, you could use this pattern.',
  ],
  synonyms: ['instance', 'sample', 'case'],
  translations: ['例子', '实例'],
  audioUrl: null,
  imageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockStats = (overrides = {}) => ({
  todayStats: {
    wordsLearned: 5,
    timeSpent: 1800,
    accuracy: 85,
    currentStreak: 7,
  },
  weeklyProgress: {
    totalWords: 35,
    totalTime: 12600,
    dailyBreakdown: [
      { date: new Date().toISOString(), wordsLearned: 5 },
      { date: new Date(Date.now() - 86400000).toISOString(), wordsLearned: 3 },
      { date: new Date(Date.now() - 172800000).toISOString(), wordsLearned: 7 },
    ],
  },
  totalStats: {
    wordsLearned: 250,
    totalTime: 90000,
    averageAccuracy: 82,
    longestStreak: 15,
  },
  ...overrides,
});

// 延迟函数用于测试loading状态
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API响应
export const createMockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

// 重新导出所有testing-library的工具
export * from '@testing-library/react';
export { customRender as render };