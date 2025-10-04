import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Notification, BreadcrumbItem } from '@/types';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';

  // Layout
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;

  // Loading states
  isLoading: boolean;
  isPageLoading: boolean;

  // Error handling
  error: string | null;
  globalError: string | null;

  // Notifications
  notifications: Notification[];

  // Navigation
  breadcrumbs: BreadcrumbItem[];
  currentPage: string;

  // Modal states
  modals: {
    profile: boolean;
    settings: boolean;
    help: boolean;
    feedback: boolean;
  };

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPageLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setGlobalError: (error: string | null) => void;
  clearError: () => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Navigation actions
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  setCurrentPage: (page: string) => void;
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;

  // Modal actions
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;

  // Utility actions
  resetUIState: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      mobileMenuOpen: false,
      isLoading: false,
      isPageLoading: false,
      error: null,
      globalError: null,
      notifications: [],
      breadcrumbs: [],
      currentPage: '',
      modals: {
        profile: false,
        settings: false,
        help: false,
        feedback: false,
      },

      // Theme actions
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set((state) => {
          state.theme = theme;
        });

        // Apply theme to document
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }

        // Store in localStorage for SSR
        localStorage.setItem('theme', theme);
      },

      // Sidebar actions
      toggleSidebar: () => {
        set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        });
      },

      setSidebarOpen: (open: boolean) => {
        set((state) => {
          state.sidebarOpen = open;
        });
      },

      // Mobile menu actions
      toggleMobileMenu: () => {
        set((state) => {
          state.mobileMenuOpen = !state.mobileMenuOpen;
        });
      },

      setMobileMenuOpen: (open: boolean) => {
        set((state) => {
          state.mobileMenuOpen = open;
        });
      },

      // Loading actions
      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      setPageLoading: (loading: boolean) => {
        set((state) => {
          state.isPageLoading = loading;
        });
      },

      // Error actions
      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      setGlobalError: (error: string | null) => {
        set((state) => {
          state.globalError = error;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
          state.globalError = null;
        });
      },

      // Notification actions
      addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const id = Date.now().toString();
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
          read: false,
        };

        set((state) => {
          state.notifications = [newNotification, ...state.notifications];
        });

        // Auto-remove notification after duration (if specified)
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },

      removeNotification: (id: string) => {
        set((state) => {
          state.notifications = state.notifications.filter(
            notification => notification.id !== id
          );
        });
      },

      markNotificationAsRead: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification) {
            notification.read = true;
          }
        });
      },

      markAllNotificationsAsRead: () => {
        set((state) => {
          state.notifications.forEach(notification => {
            notification.read = true;
          });
        });
      },

      clearNotifications: () => {
        set((state) => {
          state.notifications = [];
        });
      },

      // Navigation actions
      setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
        set((state) => {
          state.breadcrumbs = breadcrumbs;
        });
      },

      setCurrentPage: (page: string) => {
        set((state) => {
          state.currentPage = page;
        });
      },

      addBreadcrumb: (breadcrumb: BreadcrumbItem) => {
        set((state) => {
          // Remove any active breadcrumbs after this position
          const activeIndex = state.breadcrumbs.findIndex(b => b.active);
          if (activeIndex >= 0) {
            state.breadcrumbs = state.breadcrumbs.slice(0, activeIndex);
          }

          // Add the new breadcrumb
          state.breadcrumbs = [...state.breadcrumbs, { ...breadcrumb, active: false }];

          // Mark the last breadcrumb as active
          if (state.breadcrumbs.length > 0) {
            state.breadcrumbs[state.breadcrumbs.length - 1].active = true;
          }
        });
      },

      // Modal actions
      openModal: (modal: keyof UIState['modals']) => {
        set((state) => {
          state.modals[modal] = true;
        });
      },

      closeModal: (modal: keyof UIState['modals']) => {
        set((state) => {
          state.modals[modal] = false;
        });
      },

      closeAllModals: () => {
        set((state) => {
          Object.keys(state.modals).forEach(key => {
            state.modals[key as keyof UIState['modals']] = false;
          });
        });
      },

      // Utility actions
      resetUIState: () => {
        set((state) => {
          state.error = null;
          state.globalError = null;
          state.notifications = [];
          state.isPageLoading = false;
          state.mobileMenuOpen = false;
          state.closeAllModals();
        });
      },
    })),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        notifications: state.notifications.filter(n => !n.read), // Only persist unread notifications
      }),
    }
  )
);

// Selectors
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useMobileMenuOpen = () => useUIStore((state) => state.mobileMenuOpen);
export const useIsLoading = () => useUIStore((state) => state.isLoading);
export const useIsPageLoading = () => useUIStore((state) => state.isPageLoading);
export const useError = () => useUIStore((state) => state.error);
export const useGlobalError = () => useUIStore((state) => state.globalError);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useUnreadNotifications = () => useUIStore((state) =>
  state.notifications.filter(n => !n.read)
);
export const useBreadcrumbs = () => useUIStore((state) => state.breadcrumbs);
export const useCurrentPage = () => useUIStore((state) => state.currentPage);
export const useModals = () => useUIStore((state) => state.modals);