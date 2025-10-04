import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { LoginFormData, RegisterFormData } from '@/types';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAuth,
    updateProfile,
    clearError,
    setLoading,
  } = useAuthStore();

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    // Set up token refresh interval (refresh every 15 minutes)
    const refreshInterval = setInterval(async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, logout user
        logout();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(refreshInterval);
  }, [token, isAuthenticated, refreshAuth, logout]);

  // Handle login with error handling
  const handleLogin = useCallback(async (credentials: LoginFormData) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }, [login]);

  // Handle registration with error handling
  const handleRegister = useCallback(async (userData: RegisterFormData) => {
    try {
      await register(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }, [register]);

  // Handle logout with cleanup
  const handleLogout = useCallback(() => {
    logout();
    clearError();
  }, [logout, clearError]);

  // Check if user has specific role
  const hasRole = useCallback((role: 'student' | 'teacher' | 'admin') => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: ('student' | 'teacher' | 'admin')[]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  // Check if user has admin privileges
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Get user display name
  const getDisplayName = useCallback(() => {
    if (!user) return '';
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;
  }, [user]);

  // Get user avatar URL
  const getAvatarUrl = useCallback(() => {
    if (!user?.avatar) return null;

    // If avatar is a full URL, return as is
    if (user.avatar.startsWith('http')) {
      return user.avatar;
    }

    // Otherwise, construct the full URL
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/avatars/${user.avatar}`;
  }, [user]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshAuth,
    updateProfile,
    clearError,
    setLoading,

    // Utility methods
    hasRole,
    hasAnyRole,
    isAdmin,
    getDisplayName,
    getAvatarUrl,
  };
};