// Store entry point
// Exports all store hooks and utilities

// Auth store
export {
  useAuthStore,
  useCurrentUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
} from './authStore';
export type { AuthState } from './authStore';

// Learning store
export {
  useLearningStore,
  useCurrentSession,
  useCurrentWord,
  useSessionResults,
  useLearningQueue,
  useLearningLoading,
  useLearningError,
} from './learningStore';
export type { LearningState } from './learningStore';

// UI store
export {
  useUIStore,
  useTheme,
  useSidebarOpen,
  useMobileMenuOpen,
  useIsLoading,
  useIsPageLoading,
  useError,
  useGlobalError,
  useNotifications,
  useUnreadNotifications,
  useBreadcrumbs,
  useCurrentPage,
  useModals,
} from './uiStore';
export type { UIState } from './uiStore';

// Store utilities
export const useStoreActions = () => ({
  // Auth actions
  login: useAuthStore((state) => state.login),
  logout: useAuthStore((state) => state.logout),
  register: useAuthStore((state) => state.register),
  refreshAuth: useAuthStore((state) => state.refreshAuth),
  updateProfile: useAuthStore((state) => state.updateProfile),

  // Learning actions
  startSession: useLearningStore((state) => state.startSession),
  pauseSession: useLearningStore((state) => state.pauseSession),
  resumeSession: useLearningStore((state) => state.resumeSession),
  completeSession: useLearningStore((state) => state.completeSession),
  abandonSession: useLearningStore((state) => state.abandonSession),
  nextWord: useLearningStore((state) => state.nextWord),
  previousWord: useLearningStore((state) => state.previousWord),
  submitAnswer: useLearningStore((state) => state.submitAnswer),
  skipWord: useLearningStore((state) => state.skipWord),
  loadLearningQueue: useLearningStore((state) => state.loadLearningQueue),

  // UI actions
  setTheme: useUIStore((state) => state.setTheme),
  toggleSidebar: useUIStore((state) => state.toggleSidebar),
  addNotification: useUIStore((state) => state.addNotification),
  removeNotification: useUIStore((state) => state.removeNotification),
  setBreadcrumbs: useUIStore((state) => state.setBreadcrumbs),
  openModal: useUIStore((state) => state.openModal),
  closeModal: useUIStore((state) => state.closeModal),
});

// Store selectors for common combinations
export const useAuthState = () => ({
  user: useAuthStore((state) => state.user),
  isAuthenticated: useAuthStore((state) => state.isAuthenticated),
  isLoading: useAuthStore((state) => state.isLoading),
  error: useAuthStore((state) => state.error),
});

export const useLearningState = () => ({
  currentSession: useLearningStore((state) => state.currentSession),
  currentWord: useLearningStore((state) => state.currentWord),
  sessionResults: useLearningStore((state) => state.sessionResults),
  learningQueue: useLearningStore((state) => state.learningQueue),
  isLoading: useLearningStore((state) => state.isLoading),
  isSubmitting: useLearningStore((state) => state.isSubmitting),
  error: useLearningStore((state) => state.error),
});

export const useUIState = () => ({
  theme: useUIStore((state) => state.theme),
  sidebarOpen: useUIStore((state) => state.sidebarOpen),
  mobileMenuOpen: useUIStore((state) => state.mobileMenuOpen),
  isLoading: useUIStore((state) => state.isLoading),
  isPageLoading: useUIStore((state) => state.isPageLoading),
  error: useUIStore((state) => state.error),
  notifications: useUIStore((state) => state.notifications),
  breadcrumbs: useUIStore((state) => state.breadcrumbs),
  currentPage: useUIStore((state) => state.currentPage),
  modals: useUIStore((state) => state.modals),
});

// Combined store hooks for common use cases
export const useAppInitialization = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();
  const theme = useTheme();
  const setTheme = useUIStore((state) => state.setTheme);

  return {
    isAuthenticated,
    user,
    theme,
    setTheme,
  };
};

export const useLearningActions = () => ({
  startSession: useLearningStore((state) => state.startSession),
  submitAnswer: useLearningStore((state) => state.submitAnswer),
  skipWord: useLearningStore((state) => state.skipWord),
  pauseSession: useLearningStore((state) => state.pauseSession),
  resumeSession: useLearningStore((state) => state.resumeSession),
  completeSession: useLearningStore((state) => state.completeSession),
});

export const useNotificationActions = () => ({
  addNotification: useUIStore((state) => state.addNotification),
  removeNotification: useUIStore((state) => state.removeNotification),
  markAsRead: useUIStore((state) => state.markNotificationAsRead),
  markAllAsRead: useUIStore((state) => state.markAllNotificationsAsRead),
  clearAll: useUIStore((state) => state.clearNotifications),
});