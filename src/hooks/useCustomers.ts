import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback } from 'react';
import {
  fetchCustomers,
  deleteCustomer,
  resetCustomers,
} from '@/store/slices/customersSlice';

export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const { customers, total, skip, error } = useAppSelector(
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

  const deleteCustomerAction = useCallback(
    (customerId: string) => dispatch(deleteCustomer(customerId)),
    [dispatch]
  );

  const resetCustomersAction = useCallback(
    () => dispatch(resetCustomers()),
    [dispatch]
  );

  return {
    // State
    customers,
    total,
    skip,
    error,

    // Actions
    fetchCustomers: fetchCustomersAction,
    deleteCustomer: deleteCustomerAction,
    resetCustomers: resetCustomersAction,

    // Helpers
    hasCustomers: customers.length > 0,
    hasMoreCustomers: customers.length < total,
  };
};

export default useCustomers;
