import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback } from 'react';
import {
  fetchSales,
  fetchSale,
  createSale,
  updateSale,
  deleteSale,
  resetSales,
  resetCurrentSale,
} from '@/store/slices/salesSlice';

export const useSales = () => {
  const dispatch = useAppDispatch();
  const { sales, currentSale, total, skip, error } = useAppSelector(
    state => state.sales
  );

  const fetchSalesAction = useCallback(
    (params: {
      limit: number;
      textQuery?: string;
      sortBy?: string;
      skip?: number;
    }) => dispatch(fetchSales(params)),
    [dispatch]
  );

  const fetchSaleAction = useCallback(
    (saleId: string) => dispatch(fetchSale(saleId)),
    [dispatch]
  );

  const createSaleAction = useCallback(
    (params: {
      saleData: {
        saleId: number;
        saleDate: string;
        customer: string;
        isThirteenDozen: boolean;
        owes: boolean;
        partialPayment: number;
        totalPrice: number;
        products: Array<{
          product: string;
          price: number;
          quantity: number;
          totalPrice: number;
        }>;
      };
      navigate?: (path: string) => void;
    }) => dispatch(createSale(params)),
    [dispatch]
  );

  const updateSaleAction = useCallback(
    (params: {
      id: string;
      saleData: Partial<{
        saleId: number;
        saleDate: string;
        customer: string;
        isThirteenDozen: boolean;
        owes: boolean;
        partialPayment: number;
        totalPrice: number;
        products: Array<{
          product: string;
          price: number;
          quantity: number;
          totalPrice: number;
        }>;
      }>;
      navigate?: (path: string) => void;
    }) => dispatch(updateSale(params)),
    [dispatch]
  );

  const deleteSaleAction = useCallback(
    (saleId: string) => dispatch(deleteSale(saleId)),
    [dispatch]
  );

  const resetSalesAction = useCallback(
    () => dispatch(resetSales()),
    [dispatch]
  );

  const resetCurrentSaleAction = useCallback(
    () => dispatch(resetCurrentSale()),
    [dispatch]
  );

  return {
    // State
    sales,
    currentSale,
    total,
    skip,
    error,
    // Actions
    fetchSales: fetchSalesAction,
    fetchSale: fetchSaleAction,
    createSale: createSaleAction,
    updateSale: updateSaleAction,
    deleteSale: deleteSaleAction,
    resetSales: resetSalesAction,
    resetCurrentSale: resetCurrentSaleAction,
  };
};
