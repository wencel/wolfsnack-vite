import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createTestStore } from '@/test/test-utils';
import { Provider } from 'react-redux';
import { useLocalities } from './useLocalities';

// Mock the store hooks
const mockUseAppSelector = vi.hoisted(() => vi.fn());
const mockUseAppDispatch = vi.hoisted(() => vi.fn());

vi.mock('@/store/hooks', () => ({
  useAppSelector: mockUseAppSelector,
  useAppDispatch: mockUseAppDispatch,
}));

// Mock the localities slice actions
const mockFetchLocalities = vi.hoisted(() => vi.fn());

vi.mock('@/store/slices/localitiesSlice', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    fetchLocalities: mockFetchLocalities,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useLocalities Hook', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
  });

  describe('State values', () => {
    it('returns correct localities state values', () => {
      const mockLocalitiesState = {
        localities: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(mockLocalitiesState.localities);
    });

    it('returns empty array when no localities', () => {
      const mockLocalitiesState = {
        localities: [],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual([]);
    });

    it('handles single locality correctly', () => {
      const mockLocalitiesState = {
        localities: ['Buenos Aires'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['Buenos Aires']);
      expect(result.current.localities).toHaveLength(1);
    });

    it('handles localities with special characters correctly', () => {
      const mockLocalitiesState = {
        localities: ['São Paulo', 'México D.F.', 'Buenos Aires', 'Córdoba'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['São Paulo', 'México D.F.', 'Buenos Aires', 'Córdoba']);
      expect(result.current.localities).toHaveLength(4);
    });

    it('handles localities with numbers and spaces correctly', () => {
      const mockLocalitiesState = {
        localities: ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['New York', 'Los Angeles', 'San Francisco', 'Las Vegas']);
      expect(result.current.localities).toHaveLength(4);
    });
  });

  describe('Actions', () => {
    it('calls fetchLocalities action correctly', () => {
      const mockLocalitiesState = {
        localities: [],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      result.current.fetchLocalities();

      expect(mockDispatch).toHaveBeenCalledWith(mockFetchLocalities());
    });

    it('calls fetchLocalities action multiple times correctly', () => {
      const mockLocalitiesState = {
        localities: ['Buenos Aires', 'Córdoba'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      // Call multiple times
      result.current.fetchLocalities();
      result.current.fetchLocalities();
      result.current.fetchLocalities();

      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockDispatch).toHaveBeenCalledWith(mockFetchLocalities());
    });
  });

  describe('Edge cases', () => {
    it('handles undefined localities array gracefully', () => {
      const mockLocalitiesState = {
        localities: undefined as any,
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toBeUndefined();
    });

    it('handles null localities array gracefully', () => {
      const mockLocalitiesState = {
        localities: null as any,
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toBeNull();
    });

    it('handles empty string localities correctly', () => {
      const mockLocalitiesState = {
        localities: ['', 'Buenos Aires', '', 'Córdoba'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['', 'Buenos Aires', '', 'Córdoba']);
      expect(result.current.localities).toHaveLength(4);
    });

    it('handles very long locality names correctly', () => {
      const longLocalityName = 'This is a very long locality name that contains many characters and should be handled properly by the hook without any issues or truncation';
      
      const mockLocalitiesState = {
        localities: [longLocalityName, 'Short Name'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual([longLocalityName, 'Short Name']);
      expect(result.current.localities[0]).toBe(longLocalityName);
      expect(result.current.localities).toHaveLength(2);
    });

    it('handles localities with only whitespace correctly', () => {
      const mockLocalitiesState = {
        localities: ['   ', 'Buenos Aires', '  ', 'Córdoba'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['   ', 'Buenos Aires', '  ', 'Córdoba']);
      expect(result.current.localities).toHaveLength(4);
    });

    it('handles large number of localities correctly', () => {
      const largeLocalitiesList = Array.from({ length: 1000 }, (_, index) => 
        `Locality ${index}`
      );

      const mockLocalitiesState = {
        localities: largeLocalitiesList,
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toHaveLength(1000);
      expect(result.current.localities[0]).toBe('Locality 0');
      expect(result.current.localities[999]).toBe('Locality 999');
    });

    it('handles localities with unicode characters correctly', () => {
      const mockLocalitiesState = {
        localities: ['北京', '東京', '서울', 'Mumbai', 'Delhi'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['北京', '東京', '서울', 'Mumbai', 'Delhi']);
      expect(result.current.localities).toHaveLength(5);
    });

    it('handles localities with emojis correctly', () => {
      const mockLocalitiesState = {
        localities: ['New York 🗽', 'London 🇬🇧', 'Paris 🇫🇷', 'Tokyo 🗾'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['New York 🗽', 'London 🇬🇧', 'Paris 🇫🇷', 'Tokyo 🗾']);
      expect(result.current.localities).toHaveLength(4);
    });
  });

  describe('Hook behavior', () => {
    it('maintains referential equality for dispatch function', () => {
      const mockLocalitiesState = {
        localities: ['Buenos Aires'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockLocalitiesState);

      const { result, rerender } = renderHook(() => useLocalities(), { wrapper });

      const firstFetchLocalities = result.current.fetchLocalities;

      // Rerender with same state
      rerender();

      const secondFetchLocalities = result.current.fetchLocalities;

      // The function should maintain referential equality due to useCallback
      expect(secondFetchLocalities).toBe(firstFetchLocalities);
    });

    it('updates localities when state changes', () => {
      const initialLocalitiesState = {
        localities: ['Buenos Aires'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(initialLocalitiesState);

      const { result, rerender } = renderHook(() => useLocalities(), { wrapper });

      expect(result.current.localities).toEqual(['Buenos Aires']);

      // Update state
      const updatedLocalitiesState = {
        localities: ['Buenos Aires', 'Córdoba', 'Santa Fe'],
        loading: false,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(updatedLocalitiesState);
      rerender();

      expect(result.current.localities).toEqual(['Buenos Aires', 'Córdoba', 'Santa Fe']);
    });
  });
});

