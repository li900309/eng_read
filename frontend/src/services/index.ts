// 导出所有服务
export { BaseApiService, apiClient, withRetry, requestCache, healthCheck } from './api';
export { authService } from './auth';
export { vocabularyService } from './vocabulary';
export { statisticsService } from './statistics';
export { commonService } from './common';

// 导出所有类型
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
} from './api';

export type {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ConfirmResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from './auth';

export type {
  VocabularySearchParams,
  VocabularyCreateRequest,
  VocabularyUpdateRequest,
  VocabularyLearningResponse,
  LearningSessionRequest,
  LearningSessionResponse,
  ReviewResult,
} from './vocabulary';

export type {
  DashboardStats,
  LearningAnalytics,
  Achievement,
  LeaderboardEntry,
  LearningReport,
} from './statistics';

export type {
  UploadResponse,
  NotificationPreferences,
  UserNotification,
  FeedbackRequest,
  SystemHealth,
  SearchSuggestion,
  HelpArticle,
  StudyGroup,
  StudySession,
} from './common';

// 创建服务聚合对象
export const services = {
  auth: authService,
  vocabulary: vocabularyService,
  statistics: statisticsService,
  common: commonService,
};

// 默认导出服务聚合对象
export default services;