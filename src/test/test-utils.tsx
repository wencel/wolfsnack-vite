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
import productsReducer from '@/store/slices/productsSlice';
import localitiesReducer from '@/store/slices/localitiesSlice';
import presentationsReducer from '@/store/slices/presentationsSlice';
import productTypesReducer from '@/store/slices/productTypesSlice';
import type { RootState } from '@/store';
import ToastProvider from '@/components/Providers/ToastProvider';

// Create a test store with initial state
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      loading: loadingReducer,
      error: errorReducer,
      customers: customersReducer,
      products: productsReducer,
      localities: localitiesReducer,
      presentations: presentationsReducer,
      productTypes: productTypesReducer,
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

// Re-export everything
export * from '@testing-library/react';
export { testRender };
export { createTestStore };
