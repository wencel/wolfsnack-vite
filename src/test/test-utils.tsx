/* eslint-disable react-refresh/only-export-components */
import React, { type ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import {  MemoryRouter, Routes, Route } from 'react-router-dom';
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

interface TestRenderOptions {
  preloadedState?: Partial<RootState>;
  initialEntries?: string[];
  mountPath?: string;
  routes?: Array<{ path: string; element: React.ReactElement }>;
}

const testRender = (
  ui: ReactElement,
  options: TestRenderOptions = {}
) => {
  const {
    preloadedState = {},
    initialEntries = ['/'],
    mountPath = '/',
    routes = [],
  } = options;

  const store = createTestStore(preloadedState);

  const result = render(
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={mountPath} element={ui} />
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  );

  // Create a custom rerender function that maintains the same context
  const testRerender = (newUi: ReactElement) => {
    return result.rerender(
      <Provider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path={mountPath} element={newUi} />
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </Provider>
    );
  };

  return {
    ...result,
    testRerender,
  };
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
export { testRender };
export { createTestStore, mockAxios, resetAxiosMocks };
