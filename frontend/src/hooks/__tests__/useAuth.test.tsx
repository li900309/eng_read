import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { createMockUser } from '@/test/utils/test-utils';
import { vi } from 'vitest';

// Mock store
vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    isLoading: false,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth Hook', () => {
  it('returns initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(typeof result.current.login).toBe('function');
  });

  it('provides register function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(typeof result.current.register).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(typeof result.current.logout).toBe('function');
  });

  it('provides updateProfile function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(typeof result.current.updateProfile).toBe('function');
  });

  it('provides getDisplayName function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(typeof result.current.getDisplayName).toBe('function');
  });

  it('returns display name correctly when user exists', () => {
    // Mock the hook with a user
    vi.doMock('@/store/authStore', () => ({
      useAuthStore: () => ({
        user: createMockUser({ firstName: 'John', lastName: 'Doe' }),
        token: 'test-token',
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
        isLoading: false,
      }),
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.getDisplayName()).toBe('John Doe');
  });

  it('returns username when firstName and lastName are not available', () => {
    vi.doMock('@/store/authStore', () => ({
      useAuthStore: () => ({
        user: createMockUser({ firstName: '', lastName: '', username: 'johndoe' }),
        token: 'test-token',
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
        isLoading: false,
      }),
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.getDisplayName()).toBe('johndoe');
  });

  it('returns email as fallback when other names are not available', () => {
    vi.doMock('@/store/authStore', () => ({
      useAuthStore: () => ({
        user: createMockUser({ firstName: '', lastName: '', username: '', email: 'john@example.com' }),
        token: 'test-token',
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
        isLoading: false,
      }),
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    expect(result.current.getDisplayName()).toBe('john@example.com');
  });

  it('handles authentication state changes', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Initially not authenticated
    expect(result.current.isAuthenticated).toBe(false);

    // Mock authentication state change
    vi.doMock('@/store/authStore', () => ({
      useAuthStore: () => ({
        user: createMockUser(),
        token: 'test-token',
        isAuthenticated: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        updateProfile: vi.fn(),
        isLoading: false,
      }),
    }));

    rerender();

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });
});