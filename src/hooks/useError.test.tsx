import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createTestStore } from '@/test/test-utils';
import { Provider } from 'react-redux';
import { useError } from './useError';

// Mock the store hooks - use vi.hoisted to avoid initialization issues
const mockUseAppSelector = vi.hoisted(() => vi.fn());

vi.mock('@/store/hooks', () => ({
  useAppSelector: mockUseAppSelector,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useError Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct error state values', () => {
    const mockErrorState = {
      submitError: 'Form submission failed',
      generalError: 'Network error occurred',
    };

    mockUseAppSelector.mockReturnValue(mockErrorState);

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.submitError).toBe(mockErrorState.submitError);
    expect(result.current.generalError).toBe(mockErrorState.generalError);
  });

  it('returns null for error values when no errors', () => {
    const mockErrorState = {
      submitError: null,
      generalError: null,
    };

    mockUseAppSelector.mockReturnValue(mockErrorState);

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.submitError).toBeNull();
    expect(result.current.generalError).toBeNull();
  });

  it('returns empty string for error values when errors are empty strings', () => {
    const mockErrorState = {
      submitError: '',
      generalError: '',
    };

    mockUseAppSelector.mockReturnValue(mockErrorState);

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.submitError).toBe('');
    expect(result.current.generalError).toBe('');
  });

  it('handles mixed error states correctly', () => {
    const mockErrorState = {
      submitError: 'Validation error',
      generalError: null,
    };

    mockUseAppSelector.mockReturnValue(mockErrorState);

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.submitError).toBe('Validation error');
    expect(result.current.generalError).toBeNull();
  });

  it('handles long error messages correctly', () => {
    const longErrorMessage =
      'This is a very long error message that contains many characters and should be handled properly by the hook without any issues or truncation';

    const mockErrorState = {
      submitError: longErrorMessage,
      generalError: 'Another long error message',
    };

    mockUseAppSelector.mockReturnValue(mockErrorState);

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.submitError).toBe(longErrorMessage);
    expect(result.current.generalError).toBe('Another long error message');
  });

  it('handles special characters in error messages correctly', () => {
    const specialCharError =
      'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

    const mockErrorState = {
      submitError: specialCharError,
      generalError: 'Error with quotes: "test" and \'single quotes\'',
    };

    mockUseAppSelector.mockReturnValue(mockErrorState);

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.submitError).toBe(specialCharError);
    expect(result.current.generalError).toBe(
      'Error with quotes: "test" and \'single quotes\''
    );
  });
});
