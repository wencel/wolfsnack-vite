/* eslint-disable react-refresh/only-export-components */
import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/slices/authSlice';
import loadingReducer from '@/store/slices/loadingSlice';
import errorReducer from '@/store/slices/errorSlice';
import customersReducer from '@/store/slices/customersSlice';
import localitiesReducer from '@/store/slices/localitiesSlice';
import type { RootState } from '@/store';
import ToastProvider from '@/components/Providers/ToastProvider';
import { vi } from 'vitest';

// Create a test store with initial state
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      loading: loadingReducer,
      error: errorReducer,
      customers: customersReducer,
      localities: localitiesReducer,
    },
    preloadedState,
  });
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  route?: string;
}

const AllTheProviders = ({
  children,
  preloadedState = {},
  route = '/',
}: {
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
  route?: string;
}) => {
  const store = createTestStore(preloadedState);

  // Set up router with initial route
  window.history.pushState({}, 'Test page', route);

  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ToastProvider>
    </Provider>
  );
};

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { preloadedState, route, ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders preloadedState={preloadedState} route={route}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock axios methods for the apiClient
const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}));

// Mock the apiClient module directly
vi.mock('@/lib/apiClient', () => ({
  default: {
    get: axiosMocks.get,
    post: axiosMocks.post,
    put: axiosMocks.put,
    delete: axiosMocks.delete,
    patch: axiosMocks.patch,
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
  api: {
    auth: {
      login: (credentials: unknown) =>
        axiosMocks.post('/users/login', credentials),
      checkAuth: () => axiosMocks.get('/users/me'),
      logout: () => axiosMocks.post('/users/logout'),
    },
    customers: {
      getAll: (params?: unknown) => axiosMocks.get('/customers', { params }),
      getById: (id: string) => axiosMocks.get(`/customers/${id}`),
      create: (data: unknown) => axiosMocks.post('/customers', data),
      update: (id: string, data: unknown) =>
        axiosMocks.patch(`/customers/${id}`, data),
      delete: (id: string) => axiosMocks.delete(`/customers/${id}`),
    },
    utils: {
      getLocalities: () => axiosMocks.get('/utils/localities'),
      getPresentations: () => axiosMocks.get('/utils/presentations'),
      getProductTypes: () => axiosMocks.get('/utils/productTypes'),
    },
  },
}));

const mockAxios = () => axiosMocks;

// Helper to reset all mocks - useful for test cleanup
const resetAxiosMocks = () => {
  Object.values(axiosMocks).forEach(mock => mock.mockReset());
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { createTestStore, mockAxios, resetAxiosMocks };
