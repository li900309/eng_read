import { BaseApiService, ApiResponse, PaginatedResponse } from './api';
import { Vocabulary } from '@/types';

// 词汇相关类型定义
export interface VocabularySearchParams {
  query?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  partOfSpeech?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'word' | 'createdAt' | 'updatedAt' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

export interface VocabularyCreateRequest {
  word: string;
  definition: string;
  pronunciation?: string;
  partOfSpeech: string;
  difficulty: Vocabulary['difficulty'];
  category: string;
  examples: string[];
  synonyms: string[];
  translations: string[];
  tags?: string[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface VocabularyUpdateRequest {
  definition?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  difficulty?: Vocabulary['difficulty'];
  category?: string;
  examples?: string[];
  synonyms?: string[];
  translations?: string[];
  tags?: string[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface VocabularyLearningResponse {
  id: string;
  vocabulary: Vocabulary;
  status: 'new' | 'learning' | 'review' | 'mastered';
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  interval: number;
  easeFactor: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningSessionRequest {
  count?: number;
  difficulty?: Vocabulary['difficulty'];
  categories?: string[];
  includeNew?: boolean;
  includeReview?: boolean;
}

export interface LearningSessionResponse {
  id: string;
  items: VocabularyLearningResponse[];
  startedAt: string;
  estimatedDuration: number;
}

export interface ReviewResult {
  vocabularyId: string;
  isCorrect: boolean;
  responseTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class VocabularyService extends BaseApiService {
  // 获取词汇列表
  async getVocabulary(params?: VocabularySearchParams): Promise<PaginatedResponse<Vocabulary>> {
    return this.get<PaginatedResponse<Vocabulary>>('/vocabulary', { params });
  }

  // 获取单个词汇详情
  async getVocabularyById(id: string): Promise<Vocabulary> {
    return this.get<Vocabulary>(`/vocabulary/${id}`);
  }

  // 搜索词汇
  async searchVocabulary(query: string, options?: Partial<VocabularySearchParams>): Promise<PaginatedResponse<Vocabulary>> {
    return this.get<PaginatedResponse<Vocabulary>>('/vocabulary/search', {
      params: { query, ...options }
    });
  }

  // 创建新词汇
  async createVocabulary(data: VocabularyCreateRequest): Promise<Vocabulary> {
    return this.post<Vocabulary>('/vocabulary', data);
  }

  // 更新词汇
  async updateVocabulary(id: string, data: VocabularyUpdateRequest): Promise<Vocabulary> {
    return this.patch<Vocabulary>(`/vocabulary/${id}`, data);
  }

  // 删除词汇
  async deleteVocabulary(id: string): Promise<void> {
    return this.delete<void>(`/vocabulary/${id}`);
  }

  // 批量导入词汇
  async importVocabulary(file: File, onProgress?: (progress: number) => void): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    return this.upload<any>('/vocabulary/import', file, onProgress);
  }

  // 导出词汇
  async exportVocabulary(format: 'json' | 'csv' | 'xlsx', filters?: Partial<VocabularySearchParams>): Promise<Blob> {
    const response = await this.client.get('/vocabulary/export', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  }

  // 获取用户学习的词汇
  async getMyVocabulary(params?: Partial<VocabularySearchParams>): Promise<PaginatedResponse<VocabularyLearningResponse>> {
    return this.get<PaginatedResponse<VocabularyLearningResponse>>('/vocabulary/my', { params });
  }

  // 获取待复习的词汇
  async getVocabularyForReview(count: number = 20): Promise<VocabularyLearningResponse[]> {
    return this.get<VocabularyLearningResponse[]>('/vocabulary/review', {
      params: { count }
    });
  }

  // 开始学习会话
  async startLearningSession(request?: LearningSessionRequest): Promise<LearningSessionResponse> {
    return this.post<LearningSessionResponse>('/vocabulary/session', request);
  }

  // 完成学习会话
  async completeLearningSession(sessionId: string, results: ReviewResult[]): Promise<{
    correct: number;
    incorrect: number;
    accuracy: number;
    timeSpent: number;
    improvements: VocabularyLearningResponse[];
  }> {
    return this.post<any>(`/vocabulary/session/${sessionId}/complete`, { results });
  }

  // 提交学习结果
  async submitLearningResult(vocabularyId: string, result: ReviewResult): Promise<VocabularyLearningResponse> {
    return this.post<VocabularyLearningResponse>(`/vocabulary/${vocabularyId}/learn`, result);
  }

  // 标记词汇为已掌握
  async markAsMastered(vocabularyId: string): Promise<VocabularyLearningResponse> {
    return this.post<VocabularyLearningResponse>(`/vocabulary/${vocabularyId}/master`);
  }

  // 重置词汇学习进度
  async resetLearningProgress(vocabularyId: string): Promise<VocabularyLearningResponse> {
    return this.post<VocabularyLearningResponse>(`/vocabulary/${vocabularyId}/reset`);
  }

  // 获取词汇统计信息
  async getVocabularyStats(timeRange?: 'day' | 'week' | 'month' | 'year'): Promise<{
    total: number;
    new: number;
    learning: number;
    review: number;
    mastered: number;
    accuracy: number;
    streakDays: number;
    timeSpent: number;
    progress: Array<{
      date: string;
      learned: number;
      reviewed: number;
      accuracy: number;
    }>;
  }> {
    return this.get<any>('/vocabulary/stats', {
      params: { timeRange }
    });
  }

  // 获取推荐词汇
  async getRecommendedVocabulary(count: number = 10): Promise<Vocabulary[]> {
    return this.get<Vocabulary[]>('/vocabulary/recommendations', {
      params: { count }
    });
  }

  // 收藏词汇
  async bookmarkVocabulary(vocabularyId: string): Promise<void> {
    return this.post<void>(`/vocabulary/${vocabularyId}/bookmark`);
  }

  // 取消收藏词汇
  async unbookmarkVocabulary(vocabularyId: string): Promise<void> {
    return this.delete<void>(`/vocabulary/${vocabularyId}/bookmark`);
  }

  // 获取收藏的词汇
  async getBookmarkedVocabulary(params?: Partial<VocabularySearchParams>): Promise<PaginatedResponse<Vocabulary>> {
    return this.get<PaginatedResponse<Vocabulary>>('/vocabulary/bookmarked', { params });
  }

  // 添加词汇笔记
  async addVocabularyNote(vocabularyId: string, note: string): Promise<{
    id: string;
    note: string;
    createdAt: string;
  }> {
    return this.post<any>(`/vocabulary/${vocabularyId}/notes`, { note });
  }

  // 获取词汇笔记
  async getVocabularyNotes(vocabularyId: string): Promise<Array<{
    id: string;
    note: string;
    createdAt: string;
  }>> {
    return this.get<any>(`/vocabulary/${vocabularyId}/notes`);
  }

  // 删除词汇笔记
  async deleteVocabularyNote(vocabularyId: string, noteId: string): Promise<void> {
    return this.delete<void>(`/vocabulary/${vocabularyId}/notes/${noteId}`);
  }

  // 记录词汇搜索历史
  async recordSearchHistory(word: string): Promise<void> {
    return this.post<void>('/vocabulary/search-history', { word });
  }

  // 获取搜索历史
  async getSearchHistory(limit: number = 20): Promise<Array<{
    word: string;
    searchedAt: string;
  }>> {
    return this.get<any>('/vocabulary/search-history', {
      params: { limit }
    });
  }

  // 清除搜索历史
  async clearSearchHistory(): Promise<void> {
    return this.delete<void>('/vocabulary/search-history');
  }

  // 获取词汇分类
  async getVocabularyCategories(): Promise<Array<{
    id: string;
    name: string;
    description?: string;
    count: number;
  }>> {
    return this.get<any>('/vocabulary/categories');
  }

  // 获取热门词汇
  async getPopularVocabulary(limit: number = 10): Promise<Vocabulary[]> {
    return this.get<Vocabulary[]>('/vocabulary/popular', {
      params: { limit }
    });
  }

  // 获取随机词汇
  async getRandomVocabulary(count: number = 1, filters?: Partial<VocabularySearchParams>): Promise<Vocabulary[]> {
    return this.get<Vocabulary[]>('/vocabulary/random', {
      params: { count, ...filters }
    });
  }

  // 验证词汇重复
  async checkVocabularyDuplicate(word: string): Promise<{ exists: boolean; suggestions?: Vocabulary[] }> {
    return this.get<any>('/vocabulary/check-duplicate', {
      params: { word }
    });
  }
}

// 创建词汇服务实例
export const vocabularyService = new VocabularyService();

// 导出默认实例
export default vocabularyService;