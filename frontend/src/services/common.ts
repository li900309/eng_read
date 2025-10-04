import { BaseApiService, ApiResponse, PaginatedResponse } from './api';

// 通用类型定义
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  studyReminders: boolean;
  achievementAlerts: boolean;
  weeklyReports: boolean;
  socialUpdates: boolean;
}

export interface UserNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
}

export interface FeedbackRequest {
  type: 'bug' | 'feature' | 'general' | 'content';
  title: string;
  description: string;
  email?: string;
  attachments?: string[];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: Array<{
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    lastChecked: string;
  }>;
  version: string;
  uptime: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'vocabulary' | 'category' | 'user' | 'help';
  count?: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  owner: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  isMember: boolean;
  role?: 'owner' | 'admin' | 'member';
}

export interface StudySession {
  id: string;
  groupId: string;
  name: string;
  description: string;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  isJoinable: boolean;
  participants: Array<{
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    joinedAt: string;
  }>;
  createdBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export class CommonService extends BaseApiService {
  // 文件上传
  async uploadFile(file: File, type: 'avatar' | 'audio' | 'image' | 'document' = 'image', onProgress?: (progress: number) => void): Promise<UploadResponse> {
    return this.upload<UploadResponse>(`/upload/${type}`, file, onProgress);
  }

  // 批量文件上传
  async uploadMultipleFiles(files: File[], type: 'avatar' | 'audio' | 'image' | 'document' = 'image', onProgress?: (progress: number) => void): Promise<UploadResponse[]> {
    const results: UploadResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadFile(file, type, (progress) => {
          const totalProgress = ((i * 100) + progress) / files.length;
          onProgress?.(totalProgress);
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  // 获取通知列表
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<PaginatedResponse<UserNotification>> {
    return this.get<PaginatedResponse<UserNotification>>('/notifications', {
      params: { page, limit, unreadOnly }
    });
  }

  // 标记通知为已读
  async markNotificationAsRead(notificationId: string): Promise<void> {
    return this.patch<void>(`/notifications/${notificationId}/read`);
  }

  // 批量标记通知为已读
  async markAllNotificationsAsRead(): Promise<void> {
    return this.patch<void>('/notifications/read-all');
  }

  // 删除通知
  async deleteNotification(notificationId: string): Promise<void> {
    return this.delete<void>(`/notifications/${notificationId}`);
  }

  // 获取通知偏好设置
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return this.get<NotificationPreferences>('/notifications/preferences');
  }

  // 更新通知偏好设置
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return this.patch<NotificationPreferences>('/notifications/preferences', preferences);
  }

  // 搜索建议
  async getSearchSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    return this.get<SearchSuggestion[]>('/search/suggestions', {
      params: { query, limit }
    });
  }

  // 提交反馈
  async submitFeedback(feedback: FeedbackRequest): Promise<void> {
    return this.post<void>('/feedback', feedback);
  }

  // 获取帮助文章
  async getHelpArticles(category?: string, tags?: string[]): Promise<HelpArticle[]> {
    return this.get<HelpArticle[]>('/help/articles', {
      params: { category, tags: tags?.join(',') }
    });
  }

  // 获取帮助文章详情
  async getHelpArticle(id: string): Promise<HelpArticle> {
    return this.get<HelpArticle>(`/help/articles/${id}`);
  }

  // 搜索帮助文章
  async searchHelpArticles(query: string): Promise<HelpArticle[]> {
    return this.get<HelpArticle[]>('/help/search', {
      params: { query }
    });
  }

  // 标记帮助文章为有帮助
  async markHelpArticleAsHelpful(articleId: string, helpful: boolean): Promise<void> {
    return this.post<void>(`/help/articles/${articleId}/feedback`, { helpful });
  }

  // 获取系统健康状态
  async getSystemHealth(): Promise<SystemHealth> {
    return this.get<SystemHealth>('/system/health');
  }

  // 获取应用版本信息
  async getAppVersion(): Promise<{
    version: string;
    buildNumber: string;
    updateAvailable: boolean;
    updateInfo?: {
      version: string;
      description: string;
      downloadUrl: string;
      required: boolean;
    };
  }> {
    return this.get<any>('/system/version');
  }

  // 获取学习小组列表
  async getStudyGroups(page: number = 1, limit: number = 20): Promise<PaginatedResponse<StudyGroup>> {
    return this.get<PaginatedResponse<StudyGroup>>('/study-groups', {
      params: { page, limit }
    });
  }

  // 创建学习小组
  async createStudyGroup(data: {
    name: string;
    description: string;
    isPrivate: boolean;
  }): Promise<StudyGroup> {
    return this.post<StudyGroup>('/study-groups', data);
  }

  // 加入学习小组
  async joinStudyGroup(groupId: string): Promise<void> {
    return this.post<void>(`/study-groups/${groupId}/join`);
  }

  // 离开学习小组
  async leaveStudyGroup(groupId: string): Promise<void> {
    return this.post<void>(`/study-groups/${groupId}/leave`);
  }

  // 获取学习小组详情
  async getStudyGroup(groupId: string): Promise<StudyGroup> {
    return this.get<StudyGroup>(`/study-groups/${groupId}`);
  }

  // 获取学习会话列表
  async getStudySessions(groupId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<StudySession>> {
    return this.get<PaginatedResponse<StudySession>>(`/study-groups/${groupId}/sessions`, {
      params: { page, limit }
    });
  }

  // 创建学习会话
  async createStudySession(groupId: string, data: {
    name: string;
    description: string;
    scheduledAt: string;
    duration: number;
    maxParticipants: number;
  }): Promise<StudySession> {
    return this.post<StudySession>(`/study-groups/${groupId}/sessions`, data);
  }

  // 加入学习会话
  async joinStudySession(sessionId: string): Promise<void> {
    return this.post<void>(`/study-sessions/${sessionId}/join`);
  }

  // 离开学习会话
  async leaveStudySession(sessionId: string): Promise<void> {
    return this.post<void>(`/study-sessions/${sessionId}/leave`);
  }

  // 获取邀请链接
  async generateInviteLink(groupId: string, expiresIn?: number): Promise<{
    link: string;
    expiresAt?: string;
  }> {
    return this.post<any>(`/study-groups/${groupId}/invite`, {
      expiresIn
    });
  }

  // 通过邀请链接加入小组
  async joinViaInviteLink(token: string): Promise<void> {
    return this.post<void>('/study-groups/join-invite', { token });
  }

  // 获取用户统计概览
  async getUserStatsOverview(): Promise<{
    wordsLearned: number;
    studyStreak: number;
    studyTime: number;
    accuracy: number;
    rank: number;
    achievements: number;
  }> {
    return this.get<any>('/user/stats/overview');
  }

  // 获取用户活动历史
  async getUserActivityHistory(page: number = 1, limit: number = 20): Promise<PaginatedResponse<{
    id: string;
    type: string;
    description: string;
    data: any;
    createdAt: string;
  }>> {
    return this.get<PaginatedResponse<any>>('/user/activity', {
      params: { page, limit }
    });
  }

  // 导出用户数据
  async exportUserData(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await this.client.get('/user/export', {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  // 删除用户账户
  async deleteUserAccount(password: string): Promise<void> {
    return this.delete<void>('/user/account', {
      data: { password }
    });
  }

  // 获取隐私设置
  async getPrivacySettings(): Promise<{
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
    shareProgress: boolean;
    shareAchievements: boolean;
  }> {
    return this.get<any>('/user/privacy');
  }

  // 更新隐私设置
  async updatePrivacySettings(settings: {
    profileVisibility?: 'public' | 'friends' | 'private';
    showOnlineStatus?: boolean;
    allowFriendRequests?: boolean;
    shareProgress?: boolean;
    shareAchievements?: boolean;
  }): Promise<void> {
    return this.patch<void>('/user/privacy', settings);
  }

  // 获取应用配置
  async getAppConfig(): Promise<{
    features: {
      studyGroups: boolean;
      achievements: boolean;
      leaderboards: boolean;
      socialFeatures: boolean;
    };
    limits: {
      maxWordsPerDay: number;
      maxStudyGroups: number;
      maxFileSize: number;
    };
    maintenance: {
      scheduled: boolean;
      message?: string;
      startTime?: string;
      endTime?: string;
    };
  }> {
    return this.get<any>('/system/config');
  }
}

// 创建通用服务实例
export const commonService = new CommonService();

// 导出默认实例
export default commonService;