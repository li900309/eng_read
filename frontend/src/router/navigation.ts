import { NavigationItem } from '@/types';

// Main navigation structure
export const mainNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'learning',
    label: '学习',
    href: '/learning',
    icon: 'BookOpen',
    children: [
      {
        id: 'learning-session',
        label: '学习会话',
        href: '/learning/session',
        icon: 'Play',
      },
      {
        id: 'learning-review',
        label: '复习',
        href: '/learning/review',
        icon: 'RotateCcw',
      },
      {
        id: 'learning-practice',
        label: '练习',
        href: '/learning/practice',
        icon: 'Target',
      },
    ],
  },
  {
    id: 'vocabulary',
    label: '词汇',
    href: '/vocabulary',
    icon: 'Library',
    children: [
      {
        id: 'vocabulary-list',
        label: '词汇列表',
        href: '/vocabulary/list',
        icon: 'List',
      },
      {
        id: 'vocabulary-search',
        label: '搜索词汇',
        href: '/vocabulary/search',
        icon: 'Search',
      },
      {
        id: 'vocabulary-categories',
        label: '分类',
        href: '/vocabulary/categories',
        icon: 'Folder',
      },
    ],
  },
  {
    id: 'statistics',
    label: '统计',
    href: '/statistics',
    icon: 'BarChart3',
    children: [
      {
        id: 'statistics-overview',
        label: '概览',
        href: '/statistics/overview',
        icon: 'PieChart',
      },
      {
        id: 'statistics-progress',
        label: '学习进度',
        href: '/statistics/progress',
        icon: 'TrendingUp',
      },
      {
        id: 'statistics-achievements',
        label: '成就',
        href: '/statistics/achievements',
        icon: 'Trophy',
      },
    ],
  },
];

// User menu navigation
export const userMenuNavigation: NavigationItem[] = [
  {
    id: 'profile',
    label: '个人资料',
    href: '/profile',
    icon: 'User',
  },
  {
    id: 'settings',
    label: '设置',
    href: '/settings',
    icon: 'Settings',
  },
  {
    id: 'help',
    label: '帮助',
    href: '/help',
    icon: 'HelpCircle',
  },
  {
    id: 'logout',
    label: '退出登录',
    href: '/logout',
    icon: 'LogOut',
  },
];

// Settings navigation
export const settingsNavigation: NavigationItem[] = [
  {
    id: 'account',
    label: '账户设置',
    href: '/settings/account',
    icon: 'User',
  },
  {
    id: 'learning',
    label: '学习设置',
    href: '/settings/learning',
    icon: 'BookOpen',
  },
  {
    id: 'notifications',
    label: '通知设置',
    href: '/settings/notifications',
    icon: 'Bell',
  },
  {
    id: 'privacy',
    label: '隐私设置',
    href: '/settings/privacy',
    icon: 'Shield',
  },
  {
    id: 'subscription',
    label: '订阅管理',
    href: '/settings/subscription',
    icon: 'CreditCard',
  },
];

// Public navigation (for non-authenticated users)
export const publicNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: '首页',
    href: '/',
    icon: 'Home',
  },
  {
    id: 'features',
    label: '功能特性',
    href: '/features',
    icon: 'Star',
  },
  {
    id: 'pricing',
    label: '价格',
    href: '/pricing',
    icon: 'DollarSign',
  },
  {
    id: 'about',
    label: '关于我们',
    href: '/about',
    icon: 'Info',
  },
];

// Footer navigation
export const footerNavigation: NavigationItem[] = [
  {
    id: 'privacy',
    label: '隐私政策',
    href: '/privacy',
    icon: 'Shield',
  },
  {
    id: 'terms',
    label: '服务条款',
    href: '/terms',
    icon: 'FileText',
  },
  {
    id: 'contact',
    label: '联系我们',
    href: '/contact',
    icon: 'Mail',
  },
  {
    id: 'support',
    label: '支持',
    href: '/support',
    icon: 'HelpCircle',
  },
];

// Breadcrumb configuration
export const breadcrumbConfig = {
  '/dashboard': {
    label: '仪表板',
    parent: null,
  },
  '/learning': {
    label: '学习',
    parent: null,
  },
  '/learning/session': {
    label: '学习会话',
    parent: '/learning',
  },
  '/learning/review': {
    label: '复习',
    parent: '/learning',
  },
  '/learning/practice': {
    label: '练习',
    parent: '/learning',
  },
  '/vocabulary': {
    label: '词汇',
    parent: null,
  },
  '/vocabulary/list': {
    label: '词汇列表',
    parent: '/vocabulary',
  },
  '/vocabulary/category/:categoryId': {
    label: '词汇分类',
    parent: '/vocabulary',
  },
  '/vocabulary/word/:wordId': {
    label: '词汇详情',
    parent: '/vocabulary',
  },
  '/vocabulary/search': {
    label: '搜索词汇',
    parent: '/vocabulary',
  },
  '/statistics': {
    label: '统计',
    parent: null,
  },
  '/statistics/overview': {
    label: '概览',
    parent: '/statistics',
  },
  '/statistics/progress': {
    label: '学习进度',
    parent: '/statistics',
  },
  '/statistics/achievements': {
    label: '成就',
    parent: '/statistics',
  },
  '/statistics/trends': {
    label: '趋势分析',
    parent: '/statistics',
  },
  '/profile': {
    label: '个人资料',
    parent: null,
  },
  '/settings': {
    label: '设置',
    parent: null,
  },
  '/settings/account': {
    label: '账户设置',
    parent: '/settings',
  },
  '/settings/learning': {
    label: '学习设置',
    parent: '/settings',
  },
  '/settings/notifications': {
    label: '通知设置',
    parent: '/settings',
  },
  '/settings/privacy': {
    label: '隐私设置',
    parent: '/settings',
  },
};

// Navigation utilities
export const getNavigationItems = (
  userRole: 'student' | 'teacher' | 'admin',
  isAuthenticated: boolean
): NavigationItem[] => {
  if (!isAuthenticated) {
    return publicNavigation;
  }

  // Filter navigation based on user role
  const filteredNavigation = mainNavigation.map(item => {
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          // Add role-based filtering logic here
          switch (userRole) {
            case 'admin':
              return true; // Admins can access everything
            case 'teacher':
              return !['subscription', 'admin-only'].includes(child.id);
            case 'student':
              return !['admin-only', 'teacher-only'].includes(child.id);
            default:
              return true;
          }
        }),
      };
    }
    return item;
  });

  return filteredNavigation;
};

export const getNavigationItem = (
  navigation: NavigationItem[],
  id: string
): NavigationItem | undefined => {
  for (const item of navigation) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = getNavigationItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const isNavigationActive = (
  item: NavigationItem,
  currentPath: string
): boolean => {
  if (item.href === currentPath) return true;
  if (item.children) {
    return item.children.some(child => isNavigationActive(child, currentPath));
  }
  return false;
};

export const generateBreadcrumbs = (
  currentPath: string,
  params: Record<string, string> = {}
): Array<{ label: string; href?: string }> => {
  const breadcrumbs: Array<{ label: string; href?: string }> = [];
  let path = currentPath;

  // Replace route parameters
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });

  // Find breadcrumb configuration
  let currentConfig = breadcrumbConfig[path as keyof typeof breadcrumbConfig];

  // If exact match not found, try to find parent match
  if (!currentConfig) {
    const pathParts = path.split('/').filter(Boolean);
    const parentPath = '/' + pathParts.slice(0, -1).join('/');
    currentConfig = breadcrumbConfig[parentPath as keyof typeof breadcrumbConfig];
  }

  // Build breadcrumb trail
  while (currentConfig) {
    breadcrumbs.unshift({
      label: currentConfig.label,
      href: path !== currentPath ? path : undefined,
    });

    if (currentConfig.parent) {
      path = currentConfig.parent;
      currentConfig = breadcrumbConfig[currentConfig.parent as keyof typeof breadcrumbConfig];
    } else {
      break;
    }
  }

  return breadcrumbs;
};

// Icon mapping (would typically come from a component library)
export const iconMap = {
  LayoutDashboard: 'LayoutDashboard',
  BookOpen: 'BookOpen',
  Play: 'Play',
  RotateCcw: 'RotateCcw',
  Target: 'Target',
  Library: 'Library',
  List: 'List',
  Search: 'Search',
  Folder: 'Folder',
  BarChart3: 'BarChart3',
  PieChart: 'PieChart',
  TrendingUp: 'TrendingUp',
  Trophy: 'Trophy',
  User: 'User',
  Settings: 'Settings',
  HelpCircle: 'HelpCircle',
  LogOut: 'LogOut',
  Home: 'Home',
  Star: 'Star',
  DollarSign: 'DollarSign',
  Info: 'Info',
  Shield: 'Shield',
  FileText: 'FileText',
  Mail: 'Mail',
  CreditCard: 'CreditCard',
  Bell: 'Bell',
};