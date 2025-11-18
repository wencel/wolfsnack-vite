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
import {
  setSubmitError,
  clearSubmitError,
  clearGeneralError,
  setGeneralError,
} from '@/store/slices/errorSlice';
import { textConstants } from '@/lib/appConstants';
import { extractErrorMessage } from '@/lib/errorUtils';

interface CustomersState {
  customers: Customer[];
  currentCustomer: Customer | null;
  total: number;
  skip: number;
  error: string | null;
}

interface FetchCustomersParams {
  limit: number;
  textQuery?: string;
  sortBy?: string;
  skip?: number;
  isFetching?: boolean;
  [key: string]: unknown; // To match ApiParams
}

interface CreateCustomerData {
  storeName: string;
  name?: string;
  address: string;
  email?: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  locality?: string;
  town?: string;
  idNumber?: string;
}

interface CreateCustomerThunkArg {
  customerData: CreateCustomerData;
  navigate?: (path: string) => void;
}

interface UpdateCustomerThunkArg {
  id: string;
  customerData: Partial<CreateCustomerData>;
  navigate?: (path: string) => void;
}

const initialState: CustomersState = {
  customers: [],
  currentCustomer: null,
  total: 0,
  skip: 0,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: FetchCustomersParams, { dispatch, rejectWithValue }) => {
    try {
      // Use 'loading' for initial load (skip=0), 'fetching' for pagination (skip>0)
      const { isFetching, skip } = params;
      const isInitialLoad = (!skip || skip === 0) && !isFetching;
      dispatch(clearGeneralError());
      if (isInitialLoad) {
        dispatch(setLoading(true));
      } else {
        dispatch(setFetching(true));
      }
      const response = await api.customers.getAll(params);
      return response.data; // PaginatedResponse<Customer>
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

export const fetchCustomer = createAsyncThunk(
  'customers/fetchCustomer',
  async (customerId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearGeneralError());
      dispatch(setLoading(true));
      const response = await api.customers.getById(customerId);
      return response.data; // Customer
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

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (
    { customerData, navigate }: CreateCustomerThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.customers.create(
        customerData as Omit<Customer, '_id'>
      );

      // Show success toast
      apiToast.success(textConstants.addCustomer.ADD_CUSTOMER_SUCCESS);

      // Navigate to the created customer page
      if (navigate) {
        navigate(`/customers/${response.data._id}`);
      }

      return response.data; // Customer
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

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (
    { id, customerData, navigate }: UpdateCustomerThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.customers.update(id, customerData);

      // Show success toast
      apiToast.success(textConstants.editCustomer.EDIT_CUSTOMER_SUCCESS);

      // Navigate to the updated customer page
      if (navigate) {
        navigate(`/customers/${id}`);
      }

      return response.data; // Customer
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
      const errorMessage = extractErrorMessage(axiosError);
      apiToast.error(errorMessage);
      return rejectWithValue(errorMessage);
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
    resetCurrentCustomer: state => {
      state.currentCustomer = null;
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
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.currentCustomer = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.currentCustomer = null;
        state.error = action.payload as string;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload); // Add to beginning of list
        state.total += 1;
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const updatedCustomer = action.payload;
        // Update in customers list
        const index = state.customers.findIndex(
          c => c._id === updatedCustomer._id
        );
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
        // Update current customer if it's the same one
        if (state.currentCustomer?._id === updatedCustomer._id) {
          state.currentCustomer = updatedCustomer;
        }
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
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

export const { clearError, resetCustomers, resetCurrentCustomer } =
  customersSlice.actions;
export default customersSlice.reducer;
