import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createTestStore } from '@/test/test-utils';
import { Provider } from 'react-redux';
import useLoading from './useLoading';

// Mock the store hooks - use vi.hoisted to avoid initialization issues
const mockUseAppSelector = vi.hoisted(() => vi.fn());

vi.mock('@/store/hooks', () => ({
  useAppSelector: mockUseAppSelector,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useLoading Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct loading state values', () => {
    const mockLoadingState = {
      loading: true,
      submitting: false,
      fetching: true,
    };

    mockUseAppSelector.mockReturnValue(mockLoadingState);

    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.loading).toBe(mockLoadingState.loading);
    expect(result.current.submitting).toBe(mockLoadingState.submitting);
    expect(result.current.fetching).toBe(mockLoadingState.fetching);
  });

  it('returns correct helper values', () => {
    const mockLoadingState = {
      loading: true,
      submitting: false,
      fetching: true,
    };

    mockUseAppSelector.mockReturnValue(mockLoadingState);

    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.isLoading).toBe(mockLoadingState.loading);
    expect(result.current.isSubmitting).toBe(mockLoadingState.submitting);
    expect(result.current.isFetching).toBe(mockLoadingState.fetching);
  });

  it('returns false for all loading states when not loading', () => {
    const mockLoadingState = {
      loading: false,
      submitting: false,
      fetching: false,
    };

    mockUseAppSelector.mockReturnValue(mockLoadingState);

    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.submitting).toBe(false);
    expect(result.current.fetching).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('returns true for all loading states when loading', () => {
    const mockLoadingState = {
      loading: true,
      submitting: true,
      fetching: true,
    };

    mockUseAppSelector.mockReturnValue(mockLoadingState);

    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.submitting).toBe(true);
    expect(result.current.fetching).toBe(true);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.isFetching).toBe(true);
  });

  it('handles mixed loading states correctly', () => {
    const mockLoadingState = {
      loading: false,
      submitting: true,
      fetching: false,
    };

    mockUseAppSelector.mockReturnValue(mockLoadingState);

    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.submitting).toBe(true);
    expect(result.current.fetching).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.isFetching).toBe(false);
  });

  it('provides consistent values between direct and helper properties', () => {
    const mockLoadingState = {
      loading: true,
      submitting: false,
      fetching: true,
    };

    mockUseAppSelector.mockReturnValue(mockLoadingState);

    const { result } = renderHook(() => useLoading(), { wrapper });

    // Direct properties should equal helper properties
    expect(result.current.loading).toBe(result.current.isLoading);
    expect(result.current.submitting).toBe(result.current.isSubmitting);
    expect(result.current.fetching).toBe(result.current.isFetching);
  });

  it('handles state changes correctly', () => {
    const mockLoadingState1 = {
      loading: false,
      submitting: false,
      fetching: false,
    };

    const mockLoadingState2 = {
      loading: true,
      submitting: true,
      fetching: false,
    };

    mockUseAppSelector
      .mockReturnValueOnce(mockLoadingState1)
      .mockReturnValueOnce(mockLoadingState2);

    const { result, rerender } = renderHook(() => useLoading(), { wrapper });

    // Initial state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isFetching).toBe(false);

    // After state change
    rerender();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.isFetching).toBe(false);
  });
});
