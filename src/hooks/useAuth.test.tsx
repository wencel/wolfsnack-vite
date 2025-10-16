import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createTestStore } from '@/test/test-utils';
import { Provider } from 'react-redux';
import { useAuth } from './useAuth';

// Mock the store hooks
const mockUseAppSelector = vi.hoisted(() => vi.fn());
const mockUseAppDispatch = vi.hoisted(() => vi.fn());

vi.mock('@/store/hooks', () => ({
  useAppSelector: mockUseAppSelector,
  useAppDispatch: mockUseAppDispatch,
}));

// Mock the auth slice actions
const mockLogoutRequest = vi.hoisted(() => vi.fn());
const mockForceLogout = vi.hoisted(() => vi.fn());
const mockSyncTokenFromStorage = vi.hoisted(() => vi.fn());

vi.mock('@/store/slices/authSlice', async importOriginal => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    logoutRequest: mockLogoutRequest,
    forceLogout: mockForceLogout,
    syncTokenFromStorage: mockSyncTokenFromStorage,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useAuth Hook', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
  });

  describe('State values', () => {
    it('returns correct auth state values', () => {
      const mockAuthState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState) // First call for auth state
        .mockReturnValueOnce(mockLoadingState); // Second call for loading state

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toEqual(mockAuthState.user);
      expect(result.current.token).toBe(mockAuthState.token);
      expect(result.current.isAuthenticated).toBe(
        mockAuthState.isAuthenticated
      );
      expect(result.current.error).toBe(mockAuthState.error);
      expect(result.current.initialized).toBe(mockAuthState.initialized);
      expect(result.current.loading).toBe(mockLoadingState.loading);
      expect(result.current.submitting).toBe(mockLoadingState.submitting);
    });

    it('returns null values when not authenticated', () => {
      const mockAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.initialized).toBe(true);
    });

    it('handles error state correctly', () => {
      const mockAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        error: 'Authentication failed',
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.error).toBe('Authentication failed');
    });

    it('handles loading states correctly', () => {
      const mockAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        initialized: false,
      };

      const mockLoadingState = {
        loading: true,
        submitting: true,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.submitting).toBe(true);
      expect(result.current.initialized).toBe(false);
    });
  });

  describe('Actions', () => {
    it('calls logout action correctly', () => {
      const mockAuthState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      expect(mockDispatch).toHaveBeenCalledWith(mockLogoutRequest());
    });

    it('calls forceLogout action correctly', () => {
      const mockAuthState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.forceLogout();

      expect(mockDispatch).toHaveBeenCalledWith(mockForceLogout());
    });

    it('calls syncTokenFromStorage action correctly', () => {
      const mockAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        initialized: false,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.syncTokenFromStorage();

      expect(mockDispatch).toHaveBeenCalledWith(mockSyncTokenFromStorage());
    });
  });

  describe('Helper methods', () => {
    it('returns correct hasToken value when token exists', () => {
      const mockAuthState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.hasToken).toBe(true);
    });

    it('returns correct hasToken value when token is null', () => {
      const mockAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.hasToken).toBe(false);
    });

    it('returns correct hasToken value when token is empty string', () => {
      const mockAuthState = {
        user: null,
        token: '',
        isAuthenticated: false,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.hasToken).toBe(false);
    });

    it('returns correct isLoggedIn value when authenticated with token', () => {
      const mockAuthState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoggedIn).toBe(true);
    });

    it('returns correct isLoggedIn value when not authenticated', () => {
      const mockAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoggedIn).toBe(false);
    });

    it('returns correct isLoggedIn value when authenticated but no token', () => {
      const mockAuthState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: null,
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoggedIn).toBe(false);
    });

    it('returns correct isLoggedIn value when has token but not authenticated', () => {
      const mockAuthState = {
        user: null,
        token: 'test-token-123',
        isAuthenticated: false,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('handles undefined user object gracefully', () => {
      const mockAuthState = {
        user: undefined as any,
        token: 'test-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeUndefined();
      expect(result.current.isLoggedIn).toBe(true); // Still true because has token and isAuthenticated
    });

    it('handles complex user object structure', () => {
      const complexUser = {
        id: '1',
        name: 'Complex User',
        email: 'complex@example.com',
        profile: {
          avatar: 'avatar.jpg',
          preferences: {
            theme: 'dark',
            language: 'en',
          },
        },
        roles: ['admin', 'user'],
        metadata: {
          lastLogin: '2024-01-01T00:00:00Z',
          loginCount: 42,
        },
      };

      const mockAuthState = {
        user: complexUser,
        token: 'complex-token-123',
        isAuthenticated: true,
        error: null,
        initialized: true,
      };

      const mockLoadingState = {
        loading: false,
        submitting: false,
      };

      mockUseAppSelector
        .mockReturnValueOnce(mockAuthState)
        .mockReturnValueOnce(mockLoadingState);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toEqual(complexUser);
      expect(result.current.hasToken).toBe(true);
      expect(result.current.isLoggedIn).toBe(true);
    });
  });
});
