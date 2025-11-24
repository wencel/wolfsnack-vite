import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Order } from '@/lib/data';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { apiToast } from '@/lib/toastService';
import {
  setLoading,
  setSubmitting,
  setFetching,
} from '@/store/slices/loadingSlice';
import {
  setSubmitError,
  clearSubmitError,
  setGeneralError,
  clearGeneralError,
} from '@/store/slices/errorSlice';
import { textConstants } from '@/lib/appConstants';
import { extractErrorMessage } from '@/lib/errorUtils';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  total: number;
  skip: number;
  error: string | null;
}

interface FetchOrdersParams {
  limit: number;
  textQuery?: string;
  sortBy?: string;
  skip?: number;
  [key: string]: unknown; // To match ApiParams
}

export interface CreateOrderData {
  orderId: number;
  orderDate: string;
  totalPrice: number;
  products: Array<{
    product: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }>;
}

interface CreateOrderThunkArg {
  orderData: CreateOrderData;
  navigate?: (path: string) => void;
}

interface UpdateOrderThunkArg {
  id: string;
  orderData: Partial<CreateOrderData>;
  navigate?: (path: string) => void;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  total: 0,
  skip: 0,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: FetchOrdersParams, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearGeneralError());
      // Use 'loading' for initial load (skip=0), 'fetching' for pagination (skip>0)
      const isInitialLoad = !params.skip || params.skip === 0;
      if (isInitialLoad) {
        dispatch(setLoading(true));
      } else {
        dispatch(setFetching(true));
      }
      const response = await api.orders.getAll(params);
      return response.data; // PaginatedResponse<Order>
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);

      // Set error in Redux state for display
      dispatch(setGeneralError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
      dispatch(setFetching(false));
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearGeneralError());
      dispatch(setLoading(true));
      const response = await api.orders.getById(orderId);
      return response.data; // Order
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);

      // Set error in Redux state for display
      dispatch(setGeneralError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (
    { orderData, navigate }: CreateOrderThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.orders.create(
        orderData as unknown as Omit<Order, '_id'>
      );

      // Show success toast
      apiToast.success(textConstants.addOrder.ADD_ORDER_SUCCESS);

      // Navigate to the created order page
      if (navigate) {
        navigate(`/orders/${response.data._id}`);
      }

      return response.data; // Order
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);

      // Set error in Redux state for form to display
      dispatch(setSubmitError(errorMessage));

      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (
    { id, orderData, navigate }: UpdateOrderThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.orders.update(
        id,
        orderData as unknown as Partial<Order>
      );

      // Show success toast
      apiToast.success(textConstants.editOrder.EDIT_ORDER_SUCCESS);

      // Navigate to the updated order page
      if (navigate) {
        navigate(`/orders/${id}`);
      }

      return response.data; // Order
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);

      // Set error in Redux state for form to display
      dispatch(setSubmitError(errorMessage));

      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSubmitting(true));
      await api.orders.delete(orderId);
      apiToast.success(textConstants.orderPage.DELETE_SUCCESS);
      return orderId;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);
      apiToast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetOrders: state => {
      state.orders = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },
    resetCurrentOrder: state => {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        const { data: orders, total, skip } = action.payload; // Destructure data
        if (skip === 0) {
          state.orders = orders;
        } else {
          state.orders = [...state.orders, ...orders];
        }
        state.total = total;
        state.skip = skip;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.currentOrder = null;
        state.error = action.payload as string;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload); // Add to beginning of list
        state.total += 1;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        // Update in orders list
        const index = state.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        // Update current order if it's the same one
        if (state.currentOrder?._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          order => order._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetOrders, resetCurrentOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
