import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';
import errorReducer from './slices/errorSlice';
import customersReducer from './slices/customersSlice';
import productsReducer from './slices/productsSlice';
import localitiesReducer from './slices/localitiesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    error: errorReducer,
    customers: customersReducer,
    products: productsReducer,
    localities: localitiesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess', 'auth/logout'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
