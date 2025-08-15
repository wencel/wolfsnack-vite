import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { setLoading } from '@/store/slices/loadingSlice';
import { extractErrorMessage } from '@/lib/errorUtils';

interface LocalitiesState {
  localities: string[];
  loading: boolean;
  error: string | null;
}

const initialState: LocalitiesState = {
  localities: [],
  loading: false,
  error: null,
};

export const fetchLocalities = createAsyncThunk(
  'localities/fetchLocalities',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.utils.getLocalities();
      return response.data; // string[]
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(extractErrorMessage(axiosError));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const localitiesSlice = createSlice({
  name: 'localities',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetLocalities: state => {
      state.localities = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLocalities.fulfilled, (state, action) => {
        state.localities = action.payload;
        state.error = null;
      })
      .addCase(fetchLocalities.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetLocalities } = localitiesSlice.actions;
export default localitiesSlice.reducer;
