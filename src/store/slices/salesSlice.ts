import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Sale } from '@/lib/data';
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

interface SalesState {
  sales: Sale[];
  currentSale: Sale | null;
  total: number;
  skip: number;
  error: string | null;
}

interface FetchSalesParams {
  limit: number;
  textQuery?: string;
  sortBy?: string;
  skip?: number;
  [key: string]: unknown; // To match ApiParams
}

interface CreateSaleData {
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
}

interface CreateSaleThunkArg {
  saleData: CreateSaleData;
  navigate?: (path: string) => void;
}

interface UpdateSaleThunkArg {
  id: string;
  saleData: Partial<CreateSaleData>;
  navigate?: (path: string) => void;
}

const initialState: SalesState = {
  sales: [],
  currentSale: null,
  total: 0,
  skip: 0,
  error: null,
};

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params: FetchSalesParams, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearGeneralError());
      // Use 'loading' for initial load (skip=0), 'fetching' for pagination (skip>0)
      const isInitialLoad = !params.skip || params.skip === 0;
      if (isInitialLoad) {
        dispatch(setLoading(true));
      } else {
        dispatch(setFetching(true));
      }
      const response = await api.sales.getAll(params);
      return response.data; // PaginatedResponse<Sale>
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

export const fetchSale = createAsyncThunk(
  'sales/fetchSale',
  async (saleId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearGeneralError());
      dispatch(setLoading(true));
      const response = await api.sales.getById(saleId);
      return response.data; // Sale
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

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (
    { saleData, navigate }: CreateSaleThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.sales.create(
        saleData as unknown as Omit<Sale, '_id'>
      );

      // Show success toast
      apiToast.success(textConstants.addSale.ADD_SALE_SUCCESS);

      // Navigate to the created sale page
      if (navigate) {
        navigate(`/sales/${response.data._id}`);
      }

      return response.data; // Sale
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

export const updateSale = createAsyncThunk(
  'sales/updateSale',
  async (
    { id, saleData, navigate }: UpdateSaleThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.sales.update(
        id,
        saleData as unknown as Partial<Sale>
      );

      // Show success toast
      apiToast.success(textConstants.editSale.EDIT_SALE_SUCCESS);

      // Navigate to the updated sale page
      if (navigate) {
        navigate(`/sales/${id}`);
      }

      return response.data; // Sale
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

export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (saleId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSubmitting(true));
      await api.sales.delete(saleId);
      apiToast.success(textConstants.salePage.DELETE_SUCCESS);
      return saleId;
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

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetSales: state => {
      state.sales = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },
    resetCurrentSale: state => {
      state.currentSale = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSales.fulfilled, (state, action) => {
        const { data: sales, total, skip } = action.payload; // Destructure data
        if (skip === 0) {
          state.sales = sales;
        } else {
          state.sales = [...state.sales, ...sales];
        }
        state.total = total;
        state.skip = skip;
        state.error = null;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchSale.fulfilled, (state, action) => {
        state.currentSale = action.payload;
        state.error = null;
      })
      .addCase(fetchSale.rejected, (state, action) => {
        state.currentSale = null;
        state.error = action.payload as string;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.sales.unshift(action.payload); // Add to beginning of list
        state.total += 1;
        state.error = null;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        const updatedSale = action.payload;
        // Update in sales list
        const index = state.sales.findIndex(s => s._id === updatedSale._id);
        if (index !== -1) {
          state.sales[index] = updatedSale;
        }
        // Update current sale if it's the same one
        if (state.currentSale?._id === updatedSale._id) {
          state.currentSale = updatedSale;
        }
        state.error = null;
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.sales = state.sales.filter(sale => sale._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSales, resetCurrentSale } = salesSlice.actions;
export default salesSlice.reducer;
