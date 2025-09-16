import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { setLoading } from '@/store/slices/loadingSlice';
import { extractErrorMessage } from '@/lib/errorUtils';

interface PresentationsState {
  presentations: string[];
  loading: boolean;
  error: string | null;
}

const initialState: PresentationsState = {
  presentations: [],
  loading: false,
  error: null,
};

export const fetchPresentations = createAsyncThunk(
  'presentations/fetchPresentations',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.utils.getPresentations();
      return response.data; // string[]
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(extractErrorMessage(axiosError));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const presentationsSlice = createSlice({
  name: 'presentations',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetPresentations: state => {
      state.presentations = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPresentations.fulfilled, (state, action) => {
        state.presentations = action.payload;
        state.error = null;
      })
      .addCase(fetchPresentations.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetPresentations } = presentationsSlice.actions;
export default presentationsSlice.reducer;

