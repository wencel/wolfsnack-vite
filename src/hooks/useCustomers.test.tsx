import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createTestStore } from '@/test/test-utils';
import { Provider } from 'react-redux';
import { useCustomers } from './useCustomers';

// Mock the store hooks
const mockUseAppSelector = vi.hoisted(() => vi.fn());
const mockUseAppDispatch = vi.hoisted(() => vi.fn());

vi.mock('@/store/hooks', () => ({
  useAppSelector: mockUseAppSelector,
  useAppDispatch: mockUseAppDispatch,
}));

// Mock the customers slice actions
const mockFetchCustomers = vi.hoisted(() => vi.fn());
const mockFetchCustomer = vi.hoisted(() => vi.fn());
const mockCreateCustomer = vi.hoisted(() => vi.fn());
const mockUpdateCustomer = vi.hoisted(() => vi.fn());
const mockDeleteCustomer = vi.hoisted(() => vi.fn());
const mockResetCustomers = vi.hoisted(() => vi.fn());
const mockResetCurrentCustomer = vi.hoisted(() => vi.fn());

vi.mock('@/store/slices/customersSlice', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    fetchCustomers: mockFetchCustomers,
    fetchCustomer: mockFetchCustomer,
    createCustomer: mockCreateCustomer,
    updateCustomer: mockUpdateCustomer,
    deleteCustomer: mockDeleteCustomer,
    resetCustomers: mockResetCustomers,
    resetCurrentCustomer: mockResetCurrentCustomer,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useCustomers Hook', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
  });

  describe('State values', () => {
    it('returns correct customers state values', () => {
      const mockCustomersState = {
        customers: [
          {
            _id: '1',
            storeName: 'Test Store 1',
            name: 'Test Customer 1',
            address: '123 Test St',
            email: 'test1@example.com',
            phoneNumber: '123-456-7890',
            locality: 'Test Locality',
            town: 'Test Town',
            user: 'user1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            _id: '2',
            storeName: 'Test Store 2',
            name: 'Test Customer 2',
            address: '456 Test Ave',
            email: 'test2@example.com',
            phoneNumber: '098-765-4321',
            locality: 'Test Locality 2',
            town: 'Test Town 2',
            user: 'user1',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
          },
        ],
        currentCustomer: null,
        total: 2,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toEqual(mockCustomersState.customers);
      expect(result.current.currentCustomer).toBe(mockCustomersState.currentCustomer);
      expect(result.current.total).toBe(mockCustomersState.total);
      expect(result.current.skip).toBe(mockCustomersState.skip);
      expect(result.current.error).toBe(mockCustomersState.error);
    });

    it('returns empty state when no customers', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toEqual([]);
      expect(result.current.currentCustomer).toBeNull();
      expect(result.current.total).toBe(0);
      expect(result.current.skip).toBe(0);
      expect(result.current.error).toBeNull();
    });

    it('handles current customer state correctly', () => {
      const mockCurrentCustomer = {
        _id: '1',
        storeName: 'Current Store',
        name: 'Current Customer',
        address: '789 Current St',
        email: 'current@example.com',
        phoneNumber: '555-123-4567',
        locality: 'Current Locality',
        town: 'Current Town',
        user: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockCustomersState = {
        customers: [],
        currentCustomer: mockCurrentCustomer,
        total: 1,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.currentCustomer).toEqual(mockCurrentCustomer);
    });

    it('handles error state correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: 'Failed to fetch customers',
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.error).toBe('Failed to fetch customers');
    });

    it('handles pagination state correctly', () => {
      const mockCustomersState = {
        customers: [
          {
            _id: '1',
            storeName: 'Test Store 1',
            name: 'Test Customer 1',
            address: '123 Test St',
            email: 'test1@example.com',
            phoneNumber: '123-456-7890',
            locality: 'Test Locality',
            town: 'Test Town',
            user: 'user1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        currentCustomer: null,
        total: 5,
        skip: 1,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.skip).toBe(1);
      expect(result.current.total).toBe(5);
    });
  });

  describe('Actions', () => {
    it('calls fetchCustomers action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      const params = {
        limit: 10,
        textQuery: 'test',
        sortBy: 'storeName',
        skip: 0,
      };

      result.current.fetchCustomers(params);

      expect(mockDispatch).toHaveBeenCalledWith(mockFetchCustomers(params));
    });

    it('calls fetchCustomer action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      result.current.fetchCustomer('customer-123');

      expect(mockDispatch).toHaveBeenCalledWith(mockFetchCustomer('customer-123'));
    });

    it('calls createCustomer action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      const customerData = {
        storeName: 'New Store',
        name: 'New Customer',
        address: '999 New St',
        email: 'new@example.com',
        phoneNumber: '999-999-9999',
        locality: 'New Locality',
        town: 'New Town',
      };

      const params = {
        customerData,
        navigate: vi.fn(),
      };

      result.current.createCustomer(params);

      expect(mockDispatch).toHaveBeenCalledWith(mockCreateCustomer(params));
    });

    it('calls updateCustomer action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      const customerData = {
        storeName: 'Updated Store',
        name: 'Updated Customer',
        address: '888 Updated St',
      };

      const params = {
        id: 'customer-123',
        customerData,
        navigate: vi.fn(),
      };

      result.current.updateCustomer(params);

      expect(mockDispatch).toHaveBeenCalledWith(mockUpdateCustomer(params));
    });

    it('calls deleteCustomer action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      result.current.deleteCustomer('customer-123');

      expect(mockDispatch).toHaveBeenCalledWith(mockDeleteCustomer('customer-123'));
    });

    it('calls resetCustomers action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      result.current.resetCustomers();

      expect(mockDispatch).toHaveBeenCalledWith(mockResetCustomers());
    });

    it('calls resetCurrentCustomer action correctly', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      result.current.resetCurrentCustomer();

      expect(mockDispatch).toHaveBeenCalledWith(mockResetCurrentCustomer());
    });
  });

  describe('Helper methods', () => {
    it('returns correct hasCustomers value when customers exist', () => {
      const mockCustomersState = {
        customers: [
          {
            _id: '1',
            storeName: 'Test Store 1',
            name: 'Test Customer 1',
            address: '123 Test St',
            email: 'test1@example.com',
            phoneNumber: '123-456-7890',
            locality: 'Test Locality',
            town: 'Test Town',
            user: 'user1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        currentCustomer: null,
        total: 1,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.hasCustomers).toBe(true);
    });

    it('returns correct hasCustomers value when no customers', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.hasCustomers).toBe(false);
    });

    it('returns correct hasMoreCustomers value when more customers available', () => {
      const mockCustomersState = {
        customers: [
          {
            _id: '1',
            storeName: 'Test Store 1',
            name: 'Test Customer 1',
            address: '123 Test St',
            email: 'test1@example.com',
            phoneNumber: '123-456-7890',
            locality: 'Test Locality',
            town: 'Test Town',
            user: 'user1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        currentCustomer: null,
        total: 5,
        skip: 1,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.hasMoreCustomers).toBe(true);
    });

    it('returns correct hasMoreCustomers value when all customers loaded', () => {
      const mockCustomersState = {
        customers: [
          {
            _id: '1',
            storeName: 'Test Store 1',
            name: 'Test Customer 1',
            address: '123 Test St',
            email: 'test1@example.com',
            phoneNumber: '123-456-7890',
            locality: 'Test Locality',
            town: 'Test Town',
            user: 'user1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            _id: '2',
            storeName: 'Test Store 2',
            name: 'Test Customer 2',
            address: '456 Test Ave',
            email: 'test2@example.com',
            phoneNumber: '098-765-4321',
            locality: 'Test Locality 2',
            town: 'Test Town 2',
            user: 'user1',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
          },
        ],
        currentCustomer: null,
        total: 2,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.hasMoreCustomers).toBe(false);
    });

    it('returns correct hasMoreCustomers value when no customers and total is 0', () => {
      const mockCustomersState = {
        customers: [],
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.hasMoreCustomers).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('handles undefined customers array gracefully', () => {
      const mockCustomersState = {
        customers: undefined as any,
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toBeUndefined();
      expect(result.current.hasCustomers).toBe(false);
      expect(result.current.hasMoreCustomers).toBe(false);
    });

    it('handles null customers array gracefully', () => {
      const mockCustomersState = {
        customers: null as any,
        currentCustomer: null,
        total: 0,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toBeNull();
      expect(result.current.hasCustomers).toBe(false);
      expect(result.current.hasMoreCustomers).toBe(false);
    });

    it('handles complex customer object structure', () => {
      const complexCustomer = {
        _id: 'complex-123',
        storeName: 'Complex Store',
        name: 'Complex Customer',
        address: 'Complex Address with special chars: !@#$%^&*()',
        email: 'complex+test@example-domain.com',
        phoneNumber: '+1-555-123-4567',
        secondaryPhoneNumber: '+1-555-987-6543',
        locality: 'Complex Locality with spaces',
        town: 'Complex Town with numbers 123',
        idNumber: 'ID-12345-67890',
        user: 'complex-user-id',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const mockCustomersState = {
        customers: [complexCustomer],
        currentCustomer: complexCustomer,
        total: 1,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toEqual([complexCustomer]);
      expect(result.current.currentCustomer).toEqual(complexCustomer);
      expect(result.current.hasCustomers).toBe(true);
      expect(result.current.hasMoreCustomers).toBe(false);
    });

    it('handles customer with minimal required fields', () => {
      const minimalCustomer = {
        _id: 'minimal-123',
        storeName: 'Minimal Store',
        address: 'Minimal Address',
        phoneNumber: '123-456-7890',
        user: 'minimal-user',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockCustomersState = {
        customers: [minimalCustomer],
        currentCustomer: minimalCustomer,
        total: 1,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toEqual([minimalCustomer]);
      expect(result.current.currentCustomer).toEqual(minimalCustomer);
      expect(result.current.hasCustomers).toBe(true);
    });

    it('handles large number of customers correctly', () => {
      const largeCustomersList = Array.from({ length: 1000 }, (_, index) => ({
        _id: `customer-${index}`,
        storeName: `Store ${index}`,
        name: `Customer ${index}`,
        address: `Address ${index}`,
        email: `customer${index}@example.com`,
        phoneNumber: `555-${String(index).padStart(3, '0')}-${String(index).padStart(4, '0')}`,
        locality: `Locality ${index}`,
        town: `Town ${index}`,
        user: 'user1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }));

      const mockCustomersState = {
        customers: largeCustomersList,
        currentCustomer: null,
        total: 1000,
        skip: 0,
        error: null,
      };

      mockUseAppSelector.mockReturnValue(mockCustomersState);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      expect(result.current.customers).toHaveLength(1000);
      expect(result.current.total).toBe(1000);
      expect(result.current.hasCustomers).toBe(true);
      expect(result.current.hasMoreCustomers).toBe(false);
    });
  });
});
