import { ComponentType, ReactElement } from 'react';
import { RenderOptions } from '@testing-library/react';

// 测试用的自定义渲染选项
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: import('@tanstack/react-query').QueryClient;
}

// 测试用用户数据
export interface TestUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'teacher' | 'admin';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    dailyGoal: number;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// 测试用词汇数据
export interface TestVocabulary {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  examples: string[];
  synonyms: string[];
  translations: string[];
  audioUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// 测试用统计数据
export interface TestStats {
  todayStats: {
    wordsLearned: number;
    timeSpent: number;
    accuracy: number;
    currentStreak: number;
  };
  weeklyProgress: {
    totalWords: number;
    totalTime: number;
    dailyBreakdown: Array<{
      date: string;
      wordsLearned: number;
    }>;
  };
  totalStats: {
    wordsLearned: number;
    totalTime: number;
    averageAccuracy: number;
    longestStreak: number;
  };
}

// API响应类型
export interface TestApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
}

// 测试包装器组件属性
export interface TestWrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
  queryClient?: import('@tanstack/react-query').QueryClient;
}

// Mock函数类型
export type MockFunction<T extends (...args: any[]) => any> = T & {
  mock: {
    calls: Array<Parameters<T>>;
    results: Array<{ type: 'return'; value: ReturnType<T> } | { type: 'throw'; value: any }>;
    implementations: Array<T>;
  };
};

// 测试环境配置
export interface TestEnvironment {
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
}

// 可访问性测试结果
export interface AccessibilityResult {
  hasAccessibleName: boolean;
  hasRole: boolean;
  isInteractive: boolean;
  isAccessible: boolean;
}

// 组件测试用例
export interface ComponentTestCase {
  name: string;
  props?: Record<string, any>;
  expected: {
    renders?: boolean;
    text?: string[];
    attributes?: Record<string, string>;
    classes?: string[];
    aria?: Record<string, string>;
  };
}

// 集成测试用例
export interface IntegrationTestCase {
  name: string;
  setup?: () => void;
  actions: Array<{
    type: 'click' | 'type' | 'navigate';
    target: string;
    value?: string;
  }>;
  expected: {
    route?: string;
    element?: string;
    state?: Record<string, any>;
  };
}

// E2E测试用例
export interface E2ETestCase {
  name: string;
  url: string;
  setup?: () => Promise<void>;
  steps: Array<{
    description: string;
    action: () => Promise<void>;
    verification: () => Promise<void>;
  }>;
  cleanup?: () => Promise<void>;
}

// 性能测试结果
export interface PerformanceTestResult {
  componentName: string;
  renderTime: number;
  reRenderCount: number;
  memoryUsage: number;
  props: Record<string, any>;
}

// 测试覆盖率报告
export interface CoverageReport {
  lines: {
    total: number;
    covered: number;
    percentage: number;
  };
  functions: {
    total: number;
    covered: number;
    percentage: number;
  };
  branches: {
    total: number;
    covered: number;
    percentage: number;
  };
  statements: {
    total: number;
    covered: number;
    percentage: number;
  };
}