import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';
import errorReducer from './slices/errorSlice';
import customersReducer from './slices/customersSlice';
import productsReducer from './slices/productsSlice';
import salesReducer from './slices/salesSlice';
import ordersReducer from './slices/ordersSlice';
import localitiesReducer from './slices/localitiesSlice';
import presentationsReducer from './slices/presentationsSlice';
import productTypesReducer from './slices/productTypesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    error: errorReducer,
    customers: customersReducer,
    products: productsReducer,
    sales: salesReducer,
    orders: ordersReducer,
    localities: localitiesReducer,
    presentations: presentationsReducer,
    productTypes: productTypesReducer,
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
