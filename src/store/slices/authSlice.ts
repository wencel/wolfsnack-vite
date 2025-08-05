import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/lib/data';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { apiToast } from '@/lib/toastService';
import { textConstants } from '@/lib/appConstants';
import { setLoading, setSubmitting } from '@/store/slices/loadingSlice';

interface LoginCredentials {
  email: string;
  password: string;
  rememberUser: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  initialized: boolean; // Track if initial auth check is complete
}

// Get token from storage (source of truth)
const getStoredToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Set token in storage (source of truth)
const setStoredToken = (token: string, rememberUser: boolean): void => {
  if (rememberUser) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

// Clear token from storage (source of truth)
const clearStoredToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Initial state - initialize from storage
const initialState: AuthState = {
  user: null,
  token: getStoredToken(), // Cache token in Redux state
  isAuthenticated: false, // Start as false until we validate
  error: null,
  initialized: false,
};

// Helper function to extract error message
const getErrorMessage = (error: AxiosError): string => {
  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return error.response.data.message as string;
  }
  return error.message || 'Request failed';
};

// Async thunk to check authentication with server
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = getStoredToken(); // Always read from storage

      if (!token) {
        throw new Error('No token found');
      }

      // Validate token with server using Axios
      // /users/me returns only the user object, not the token
      const response = await api.auth.checkAuth();
      return response.data; // This is just the user object
    } catch (error) {
      // Clear any invalid tokens from storage
      clearStoredToken();

      const axiosError = error as AxiosError;
      return rejectWithValue(getErrorMessage(axiosError));
    }
  }
);

// Async thunk for login
export const loginRequest = createAsyncThunk(
  'auth/loginRequest',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSubmitting(true));

      const response = await api.auth.login({
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      // Store token in storage (source of truth)
      setStoredToken(data.token, credentials.rememberUser);

      // Show success toast
      apiToast.success(textConstants.login.LOGIN_SUCCESS);

      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(getErrorMessage(axiosError));
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

// Async thunk for logout
export const logoutRequest = createAsyncThunk(
  'auth/logoutRequest',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      // Call the logout API endpoint
      await api.auth.logout();

      // Show logout toast
      apiToast.info(textConstants.login.LOGOUT_SUCCESS);

      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(getErrorMessage(axiosError));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Sync token from storage (useful for external token updates)
    syncTokenFromStorage: state => {
      const storedToken = getStoredToken();
      state.token = storedToken;
      state.isAuthenticated = !!storedToken;
    },
    // Force logout (for cases where API call fails)
    forceLogout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearStoredToken();
    },
  },
  extraReducers: builder => {
    builder
      // checkAuth cases
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload; // action.payload is the user object
        state.token = getStoredToken(); // Keep existing token from storage
        state.isAuthenticated = true;
        state.initialized = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.initialized = true;
        state.error = action.payload as string;
      })
      // loginRequest cases
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token; // Update cached token
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // logoutRequest cases
      .addCase(logoutRequest.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        clearStoredToken();
      })
      .addCase(logoutRequest.rejected, (state, action) => {
        // Even if logout API fails, we should still clear local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        clearStoredToken();
      });
  },
});

export const { clearError, setUser, syncTokenFromStorage, forceLogout } =
  authSlice.actions;
export default authSlice.reducer;
