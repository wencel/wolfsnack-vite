import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { setLoading } from '@/store/slices/loadingSlice';
import { extractErrorMessage } from '@/lib/errorUtils';

interface ProductTypesState {
  productTypes: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductTypesState = {
  productTypes: [],
  loading: false,
  error: null,
};

export const fetchProductTypes = createAsyncThunk(
  'productTypes/fetchProductTypes',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.utils.getProductTypes();
      return response.data; // string[]
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(extractErrorMessage(axiosError));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const productTypesSlice = createSlice({
  name: 'productTypes',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetProductTypes: state => {
      state.productTypes = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProductTypes.fulfilled, (state, action) => {
        state.productTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchProductTypes.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetProductTypes } = productTypesSlice.actions;
export default productTypesSlice.reducer;
