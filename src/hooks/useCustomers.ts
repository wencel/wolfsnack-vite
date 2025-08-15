import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback } from 'react';
import {
  fetchCustomers,
  fetchCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  resetCustomers,
  resetCurrentCustomer,
} from '@/store/slices/customersSlice';

export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const { customers, currentCustomer, total, skip, error } = useAppSelector(
    state => state.customers
  );

  const fetchCustomersAction = useCallback(
    (params: {
      limit: number;
      textQuery?: string;
      sortBy?: string;
      skip?: number;
    }) => dispatch(fetchCustomers(params)),
    [dispatch]
  );

  const fetchCustomerAction = useCallback(
    (customerId: string) => dispatch(fetchCustomer(customerId)),
    [dispatch]
  );

  const createCustomerAction = useCallback(
    (params: {
      customerData: {
        storeName: string;
        name?: string;
        address: string;
        email?: string;
        phoneNumber: string;
        secondaryPhoneNumber?: string;
        locality?: string;
        town?: string;
        idNumber?: string;
      };
      navigate?: (path: string) => void;
    }) => dispatch(createCustomer(params)),
    [dispatch]
  );

  const updateCustomerAction = useCallback(
    (params: {
      id: string;
      customerData: Partial<{
        storeName: string;
        name?: string;
        address: string;
        email?: string;
        phoneNumber: string;
        secondaryPhoneNumber?: string;
        locality?: string;
        town?: string;
        idNumber?: string;
      }>;
      navigate?: (path: string) => void;
    }) => dispatch(updateCustomer(params)),
    [dispatch]
  );

  const deleteCustomerAction = useCallback(
    (customerId: string) => dispatch(deleteCustomer(customerId)),
    [dispatch]
  );

  const resetCustomersAction = useCallback(
    () => dispatch(resetCustomers()),
    [dispatch]
  );

  const resetCurrentCustomerAction = useCallback(
    () => dispatch(resetCurrentCustomer()),
    [dispatch]
  );

  return {
    // State
    customers,
    currentCustomer,
    total,
    skip,
    error,

    // Actions
    fetchCustomers: fetchCustomersAction,
    fetchCustomer: fetchCustomerAction,
    createCustomer: createCustomerAction,
    updateCustomer: updateCustomerAction,
    deleteCustomer: deleteCustomerAction,
    resetCustomers: resetCustomersAction,
    resetCurrentCustomer: resetCurrentCustomerAction,

    // Helpers
    hasCustomers: customers.length > 0,
    hasMoreCustomers: customers.length < total,
  };
};

export default useCustomers;
