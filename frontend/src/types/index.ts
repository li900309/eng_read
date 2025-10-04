// Global type definitions for the Eng Read application

// User types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  preferences: UserPreferences;
  statistics: UserStatistics;
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: 'zh-CN' | 'en-US';
  theme: 'light' | 'dark' | 'system';
  dailyGoal: number;
  notifications: NotificationSettings;
  learning: LearningPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  studyReminders: boolean;
  achievementAlerts: boolean;
}

export interface LearningPreferences {
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  sessionDuration: number;
  reviewMode: 'spaced' | 'random' | 'sequential';
}

export interface UserStatistics {
  totalWordsLearned: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  totalSessions: number;
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: string;
  wordsLearned: number;
  timeSpent: number;
  accuracy: number;
  sessionsCompleted: number;
}

// Vocabulary types
export interface Vocabulary {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  translation: string;
  example: string;
  imageUrl?: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  frequency: number;
  tags: string[];
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  wordCount: number;
}

// Learning types
export interface LearningSession {
  id: number;
  userId: number;
  type: 'vocabulary' | 'reading' | 'listening' | 'comprehensive';
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  startTime: string;
  endTime?: string;
  wordsStudied: number;
  accuracy: number;
  timeSpent: number;
  settings: SessionSettings;
  progress: SessionProgress;
  results?: SessionResult[];
}

export interface SessionSettings {
  sessionSize: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  categories: number[];
  timeLimit?: number;
  reviewMode: 'new' | 'review' | 'mixed';
}

export interface SessionProgress {
  currentIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedWords: number;
  completionRate: number;
}

export interface SessionResult {
  vocabularyId: number;
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface LearningQueue {
  newWords: Vocabulary[];
  reviewWords: Vocabulary[];
  priorityWords: Vocabulary[];
}

// Achievement types
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'accuracy' | 'time' | 'social';
  requirement: AchievementRequirement;
  progress: AchievementProgress;
  isUnlocked: boolean;
  unlockedAt?: string;
  badgeColor: string;
}

export interface AchievementRequirement {
  type: 'words_learned' | 'streak_days' | 'accuracy_rate' | 'time_spent' | 'sessions_completed';
  target: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface ProfileFormData {
  username: string;
  firstName: string;
  lastName: string;
  avatar?: File;
  preferences: Partial<UserPreferences>;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  categories?: number[];
  difficulty?: string[];
  tags?: string[];
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'difficulty' | 'frequency';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FilterOptions {
  categories: Category[];
  difficulties: string[];
  tags: string[];
  sortBy: string[];
  sortOrder: string[];
}

// UI state types
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
  read: boolean;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  active?: boolean;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

// Statistics types
export interface DashboardStats {
  todayStats: TodayStats;
  weeklyProgress: WeeklyStats;
  monthlyProgress: MonthlyStats;
  overallProgress: OverallStats;
  recentAchievements: Achievement[];
  upcomingReviews: number;
  learningTrend: LearningTrend[];
}

export interface TodayStats {
  wordsLearned: number;
  timeSpent: number;
  accuracy: number;
  sessionsCompleted: number;
  goalProgress: number;
}

export interface WeeklyStats {
  wordsLearned: number;
  timeSpent: number;
  averageAccuracy: number;
  sessionsCompleted: number;
  dailyBreakdown: DailyStats[];
}

export interface MonthlyStats {
  wordsLearned: number;
  timeSpent: number;
  averageAccuracy: number;
  sessionsCompleted: number;
  weeklyBreakdown: WeeklyStats[];
}

export interface OverallStats {
  totalWordsLearned: number;
  totalTimeSpent: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalAchievements: number;
}

export interface DailyStats {
  date: string;
  wordsLearned: number;
  timeSpent: number;
  accuracy: number;
  sessionsCompleted: number;
}

export interface LearningTrend {
  date: string;
  wordsLearned: number;
  accuracy: number;
  timeSpent: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;