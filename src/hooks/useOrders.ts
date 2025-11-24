import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback } from 'react';
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  resetOrders,
  resetCurrentOrder,
} from '@/store/slices/ordersSlice';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, currentOrder, total, skip, error } = useAppSelector(
    state => state.orders
  );

  const fetchOrdersAction = useCallback(
    (params: {
      limit: number;
      textQuery?: string;
      sortBy?: string;
      skip?: number;
    }) => dispatch(fetchOrders(params)),
    [dispatch]
  );

  const fetchOrderAction = useCallback(
    (orderId: string) => dispatch(fetchOrder(orderId)),
    [dispatch]
  );

  const createOrderAction = useCallback(
    (params: {
      orderData: {
        orderId: number;
        orderDate: string;
        totalPrice: number;
        products: Array<{
          product: string;
          price: number;
          quantity: number;
          totalPrice: number;
        }>;
      };
      navigate?: (path: string) => void;
    }) => dispatch(createOrder(params)),
    [dispatch]
  );

  const updateOrderAction = useCallback(
    (params: {
      id: string;
      orderData: Partial<{
        orderId: number;
        orderDate: string;
        totalPrice: number;
        products: Array<{
          product: string;
          price: number;
          quantity: number;
          totalPrice: number;
        }>;
      }>;
      navigate?: (path: string) => void;
    }) => dispatch(updateOrder(params)),
    [dispatch]
  );

  const deleteOrderAction = useCallback(
    (orderId: string) => dispatch(deleteOrder(orderId)),
    [dispatch]
  );

  const resetOrdersAction = useCallback(
    () => dispatch(resetOrders()),
    [dispatch]
  );

  const resetCurrentOrderAction = useCallback(
    () => dispatch(resetCurrentOrder()),
    [dispatch]
  );

  return {
    // State
    orders,
    currentOrder,
    total,
    skip,
    error,
    // Actions
    fetchOrders: fetchOrdersAction,
    fetchOrder: fetchOrderAction,
    createOrder: createOrderAction,
    updateOrder: updateOrderAction,
    deleteOrder: deleteOrderAction,
    resetOrders: resetOrdersAction,
    resetCurrentOrder: resetCurrentOrderAction,
  };
};
