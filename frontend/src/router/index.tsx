import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingFallback } from '@/components/common/Loading';

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const LearningPage = React.lazy(() => import('@/pages/LearningPage'));
const VocabularyPage = React.lazy(() => import('@/pages/VocabularyPage'));
const StatisticsPage = React.lazy(() => import('@/pages/StatisticsPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="spinner mx-auto" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route wrapper (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route definitions
export const routes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
    index: true,
  },
  {
    path: 'login',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: 'register',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingFallback />}>
          <RegisterPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: 'learning',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LearningPage />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/learning/session" replace />,
      },
      {
        path: 'session',
        lazy: () => import('@/pages/learning/LearningSessionPage'),
      },
      {
        path: 'review',
        lazy: () => import('@/pages/learning/ReviewPage'),
      },
      {
        path: 'practice/:type',
        lazy: () => import('@/pages/learning/PracticePage'),
      },
    ],
  },
  {
    path: 'vocabulary',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <VocabularyPage />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/vocabulary/list" replace />,
      },
      {
        path: 'list',
        lazy: () => import('@/pages/vocabulary/VocabularyListPage'),
      },
      {
        path: 'category/:categoryId',
        lazy: () => import('@/pages/vocabulary/VocabularyCategoryPage'),
      },
      {
        path: 'word/:wordId',
        lazy: () => import('@/pages/vocabulary/VocabularyDetailPage'),
      },
      {
        path: 'search',
        lazy: () => import('@/pages/vocabulary/VocabularySearchPage'),
      },
    ],
  },
  {
    path: 'statistics',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <StatisticsPage />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/statistics/overview" replace />,
      },
      {
        path: 'overview',
        lazy: () => import('@/pages/statistics/OverviewPage'),
      },
      {
        path: 'progress',
        lazy: () => import('@/pages/statistics/ProgressPage'),
      },
      {
        path: 'achievements',
        lazy: () => import('@/pages/statistics/AchievementsPage'),
      },
      {
        path: 'trends',
        lazy: () => import('@/pages/statistics/TrendsPage'),
      },
    ],
  },
  {
    path: 'profile',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <ProfilePage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: 'settings',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <SettingsPage />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/settings/account" replace />,
      },
      {
        path: 'account',
        lazy: () => import('@/pages/settings/AccountSettingsPage'),
      },
      {
        path: 'learning',
        lazy: () => import('@/pages/settings/LearningSettingsPage'),
      },
      {
        path: 'notifications',
        lazy: () => import('@/pages/settings/NotificationSettingsPage'),
      },
      {
        path: 'privacy',
        lazy: () => import('@/pages/settings/PrivacySettingsPage'),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

// Create router instance
export const router = createBrowserRouter([
  {
    path: '/',
    children: routes,
  },
]);

// Router component with error boundary
export const AppRouter: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

// Route hooks for navigation
export const useCurrentRoute = () => {
  const location = window.location;
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
};

// Route utilities
export const isRouteActive = (route: string, currentPath: string) => {
  if (route === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(route);
};

export const getRouteTitle = (pathname: string): string => {
  const routeTitles: Record<string, string> = {
    '/': '首页',
    '/login': '登录',
    '/register': '注册',
    '/dashboard': '仪表板',
    '/learning': '学习',
    '/learning/session': '学习会话',
    '/learning/review': '复习',
    '/vocabulary': '词汇',
    '/vocabulary/list': '词汇列表',
    '/vocabulary/search': '搜索词汇',
    '/statistics': '统计',
    '/statistics/overview': '统计概览',
    '/statistics/progress': '学习进度',
    '/statistics/achievements': '成就',
    '/profile': '个人资料',
    '/settings': '设置',
    '/settings/account': '账户设置',
    '/settings/learning': '学习设置',
  };

  return routeTitles[pathname] || 'Eng Read';
};

export { routes, router, AppRouter as Router };