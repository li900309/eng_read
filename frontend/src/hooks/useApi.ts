import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ApiError } from '@/services/api';
import { services } from '@/services';

// 通用查询选项
const defaultQueryOptions: Omit<UseQueryOptions<any, ApiError>, 'queryKey' | 'queryFn'> = {
  staleTime: 5 * 60 * 1000, // 5 分钟
  retry: (failureCount, error) => {
    // 不重试认证错误和客户端错误
    if (error.status === 401 || error.status === 403 || (error.status && error.status < 500)) {
      return false;
    }
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// 通用变更选项
const defaultMutationOptions: UseMutationOptions<any, ApiError, any> = {
  onError: (error) => {
    const message = error.message || '操作失败';
    toast.error(message);
  },
};

// 通用 hooks
export const useApiQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T, ApiError>({
    queryKey,
    queryFn,
    ...defaultQueryOptions,
    ...options,
  });
};

export const useApiMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T, ApiError, V>
) => {
  const queryClient = useQueryClient();

  return useMutation<T, ApiError, V>({
    mutationFn,
    onSuccess: () => {
      // 刷新相关的查询缓存
      queryClient.invalidateQueries();
    },
    ...defaultMutationOptions,
    ...options,
  });
};

// 认证 hooks
export const useLogin = () => {
  return useApiMutation(
    services.auth.login,
    {
      onSuccess: (data) => {
        toast.success('登录成功！欢迎回来');
        return data;
      },
    }
  );
};

export const useRegister = () => {
  return useApiMutation(
    services.auth.register,
    {
      onSuccess: (data) => {
        toast.success('注册成功！欢迎加入 Eng Read');
        return data;
      },
    }
  );
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    services.auth.logout,
    {
      onSuccess: () => {
        toast.success('已安全退出');
        // 清除所有缓存
        queryClient.clear();
      },
    }
  );
};

export const useCurrentUser = (enabled?: boolean) => {
  return useApiQuery(
    ['auth', 'user'],
    services.auth.getCurrentUser,
    {
      enabled: enabled !== false,
      staleTime: 2 * 60 * 1000, // 2 分钟
    }
  );
};

export const useUpdateProfile = () => {
  return useApiMutation(
    services.auth.updateProfile,
    {
      onSuccess: () => {
        toast.success('个人资料更新成功');
      },
    }
  );
};

export const useChangePassword = () => {
  return useApiMutation(
    ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      services.auth.changePassword(currentPassword, newPassword),
    {
      onSuccess: () => {
        toast.success('密码修改成功');
      },
    }
  );
};

// 词汇相关 hooks
export const useVocabulary = (params?: any) => {
  return useApiQuery(
    ['vocabulary', 'list', params],
    () => services.vocabulary.getVocabulary(params),
    {
      staleTime: 10 * 60 * 1000, // 10 分钟
    }
  );
};

export const useVocabularySearch = (query: string, options?: any) => {
  return useApiQuery(
    ['vocabulary', 'search', { query, ...options }],
    () => services.vocabulary.searchVocabulary(query, options),
    {
      enabled: !!query && query.length >= 2,
      staleTime: 2 * 60 * 1000, // 2 分钟
    }
  );
};

export const useMyVocabulary = (params?: any) => {
  return useApiQuery(
    ['vocabulary', 'my', params],
    () => services.vocabulary.getMyVocabulary(params),
    {
      staleTime: 5 * 60 * 1000, // 5 分钟
    }
  );
};

export const useVocabularyForReview = (count: number = 20) => {
  return useApiQuery(
    ['vocabulary', 'review', { count }],
    () => services.vocabulary.getVocabularyForReview(count),
    {
      staleTime: 60 * 1000, // 1 分钟
    }
  );
};

export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    services.vocabulary.createVocabulary,
    {
      onSuccess: () => {
        toast.success('词汇创建成功');
        queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      },
    }
  );
};

export const useUpdateVocabulary = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    ({ id, data }: { id: string; data: any }) => services.vocabulary.updateVocabulary(id, data),
    {
      onSuccess: () => {
        toast.success('词汇更新成功');
        queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      },
    }
  );
};

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    services.vocabulary.deleteVocabulary,
    {
      onSuccess: () => {
        toast.success('词汇删除成功');
        queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      },
    }
  );
};

export const useSubmitLearningResult = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    ({ vocabularyId, result }: { vocabularyId: string; result: any }) =>
      services.vocabulary.submitLearningResult(vocabularyId, result),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vocabulary', 'my'] });
        queryClient.invalidateQueries({ queryKey: ['statistics'] });
      },
    }
  );
};

export const useStartLearningSession = () => {
  return useApiMutation(
    services.vocabulary.startLearningSession,
    {
      onSuccess: (data) => {
        toast.success('学习会话已开始');
        return data;
      },
    }
  );
};

export const useCompleteLearningSession = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    ({ sessionId, results }: { sessionId: string; results: any[] }) =>
      services.vocabulary.completeLearningSession(sessionId, results),
    {
      onSuccess: (data) => {
        toast.success(`学习完成！正确率: ${data.accuracy.toFixed(1)}%`);
        queryClient.invalidateQueries({ queryKey: ['statistics'] });
        queryClient.invalidateQueries({ queryKey: ['vocabulary', 'my'] });
        return data;
      },
    }
  );
};

// 统计相关 hooks
export const useDashboardStats = () => {
  return useApiQuery(
    ['statistics', 'dashboard'],
    services.statistics.getDashboardStats,
    {
      staleTime: 2 * 60 * 1000, // 2 分钟
    }
  );
};

export const useLearningAnalytics = (timeRange?: string) => {
  return useApiQuery(
    ['statistics', 'analytics', timeRange],
    () => services.statistics.getLearningAnalytics(timeRange as any),
    {
      staleTime: 30 * 60 * 1000, // 30 分钟
    }
  );
};

export const useAchievements = (category?: string) => {
  return useApiQuery(
    ['statistics', 'achievements', category],
    () => services.statistics.getAchievements(category as any),
    {
      staleTime: 15 * 60 * 1000, // 15 分钟
    }
  );
};

export const useLeaderboard = (type?: string, period?: string, limit?: number) => {
  return useApiQuery(
    ['statistics', 'leaderboard', { type, period, limit }],
    () => services.statistics.getLeaderboard(type as any, period as any, limit),
    {
      staleTime: 5 * 60 * 1000, // 5 分钟
    }
  );
};

export const useLearningReport = (type?: string, startDate?: string, endDate?: string) => {
  return useApiQuery(
    ['statistics', 'report', { type, startDate, endDate }],
    () => services.statistics.generateLearningReport(type as any, startDate, endDate),
    {
      staleTime: 60 * 60 * 1000, // 1 小时
      enabled: !!(type && startDate && endDate),
    }
  );
};

// 通用服务 hooks
export const useNotifications = (page?: number, limit?: number, unreadOnly?: boolean) => {
  return useApiQuery(
    ['notifications', { page, limit, unreadOnly }],
    () => services.common.getNotifications(page, limit, unreadOnly),
    {
      staleTime: 30 * 1000, // 30 秒
    }
  );
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    services.common.markNotificationAsRead,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    }
  );
};

export const useSearchSuggestions = (query: string) => {
  return useApiQuery(
    ['search', 'suggestions', { query }],
    () => services.common.getSearchSuggestions(query),
    {
      enabled: !!query && query.length >= 2,
      staleTime: 60 * 1000, // 1 分钟
    }
  );
};

export const useSubmitFeedback = () => {
  return useApiMutation(
    services.common.submitFeedback,
    {
      onSuccess: () => {
        toast.success('反馈已提交，感谢您的建议！');
      },
    }
  );
};

export const useUploadFile = () => {
  return useApiMutation(
    ({ file, type, onProgress }: { file: File; type?: string; onProgress?: (progress: number) => void }) =>
      services.common.uploadFile(file, type as any, onProgress),
    {
      onSuccess: () => {
        toast.success('文件上传成功');
      },
    }
  );
};

// 缓存管理 hooks
export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  return (queryKey?: string[]) => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    } else {
      queryClient.invalidateQueries();
    }
  };
};

export const useClearCache = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.clear();
  };
};

// 导出所有 hooks
export {
  useQuery as useBaseQuery,
  useMutation as useBaseMutation,
  useQueryClient,
} from '@tanstack/react-query';