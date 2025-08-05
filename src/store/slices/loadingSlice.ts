import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  loading: boolean; // For GET requests and non-form operations
  submitting: boolean; // For POST, PUT, DELETE form submissions
  fetching: boolean; // For pagination/loading more data
}

const initialState: LoadingState = {
  loading: false,
  submitting: false,
  fetching: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.fetching = action.payload;
    },
    clearAll: state => {
      state.loading = false;
      state.submitting = false;
      state.fetching = false;
    },
  },
});

export const { setLoading, setSubmitting, setFetching, clearAll } =
  loadingSlice.actions;
export default loadingSlice.reducer;
