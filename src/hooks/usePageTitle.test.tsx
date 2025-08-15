import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import usePageTitle from './usePageTitle';

// Mock document.title
const mockDocumentTitle = vi.fn();
Object.defineProperty(document, 'title', {
  set: mockDocumentTitle,
  get: () => '',
  configurable: true,
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('usePageTitle Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.title = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets correct title for home route', () => {
    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith('Inicio - Wolf Snacks');
  });

  it('sets correct title for login route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith(
      'Iniciar sesión - Wolf Snacks'
    );
  });

  it('sets correct title for customers route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/customers' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith('Clientes - Wolf Snacks');
  });

  it('sets correct title for add customer route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/customers/new' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith(
      'Agregar cliente - Wolf Snacks'
    );
  });

  it('sets correct title for edit customer route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/customers/123/edit' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith(
      'Editar cliente - Wolf Snacks'
    );
  });

  it('sets correct title for customer details route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/customers/123' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith(
      'Detalles del cliente - Wolf Snacks'
    );
  });

  it('sets correct title for products route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/products' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith('Productos - Wolf Snacks');
  });

  it('sets correct title for orders route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/orders' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith('Pedidos - Wolf Snacks');
  });

  it('sets correct title for sales route', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/sales' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith('Ventas - Wolf Snacks');
  });

  it('handles unknown routes gracefully', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/unknown-route' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith(
      'unknown-route - Wolf Snacks'
    );
  });

  it('handles nested routes correctly', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/customers/123/orders/456' },
      writable: true,
    });

    renderHook(() => usePageTitle(), { wrapper });

    expect(mockDocumentTitle).toHaveBeenCalledWith(
      'customers - 123 - orders - 456 - Wolf Snacks'
    );
  });
});
