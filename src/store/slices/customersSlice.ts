import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Customer } from '@/lib/data';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { apiToast } from '@/lib/toastService';
import {
  setLoading,
  setSubmitting,
  setFetching,
} from '@/store/slices/loadingSlice';
import { textConstants } from '@/lib/appConstants';

interface CustomersState {
  customers: Customer[];
  total: number;
  skip: number;
  error: string | null;
}

interface FetchCustomersParams {
  limit: number;
  textQuery?: string;
  sortBy?: string;
  skip?: number;
  [key: string]: unknown; // To match ApiParams
}

const initialState: CustomersState = {
  customers: [],
  total: 0,
  skip: 0,
  error: null,
};

const getErrorMessage = (error: AxiosError): string => {
  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return (error.response.data as { message: string }).message;
  }
  return error.message || 'Error desconocido';
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: FetchCustomersParams, { dispatch, rejectWithValue }) => {
    try {
      // Use 'loading' for initial load (skip=0), 'fetching' for pagination (skip>0)
      const isInitialLoad = !params.skip || params.skip === 0;
      if (isInitialLoad) {
        dispatch(setLoading(true));
      } else {
        dispatch(setFetching(true));
      }

      const response = await api.customers.getAll(params);
      return response.data; // PaginatedResponse<Customer>
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(getErrorMessage(axiosError));
    } finally {
      // Clear the appropriate loading state
      const isInitialLoad = !params.skip || params.skip === 0;
      if (isInitialLoad) {
        dispatch(setLoading(false));
      } else {
        dispatch(setFetching(false));
      }
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSubmitting(true));
      await api.customers.delete(customerId);
      apiToast.success(textConstants.customerPage.DELETE_SUCCESS);
      return customerId;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(getErrorMessage(axiosError));
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetCustomers: state => {
      state.customers = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        const { data: customers, total, skip } = action.payload; // Destructure data
        if (skip === 0) {
          state.customers = customers;
        } else {
          state.customers = [...state.customers, ...customers];
        }
        state.total = total;
        state.skip = skip;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          customer => customer._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetCustomers } = customersSlice.actions;
export default customersSlice.reducer;
