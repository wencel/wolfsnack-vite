import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  submitError: string | null;
  generalError: string | null;
}

const initialState: ErrorState = {
  submitError: null,
  generalError: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setSubmitError: (state, action: PayloadAction<string | null>) => {
      state.submitError = action.payload;
    },
    setGeneralError: (state, action: PayloadAction<string | null>) => {
      state.generalError = action.payload;
    },
    clearSubmitError: state => {
      state.submitError = null;
    },
    clearGeneralError: state => {
      state.generalError = null;
    },
    clearAllErrors: state => {
      state.submitError = null;
      state.generalError = null;
    },
  },
});

export const {
  setSubmitError,
  setGeneralError,
  clearSubmitError,
  clearGeneralError,
  clearAllErrors,
} = errorSlice.actions;

export default errorSlice.reducer;
