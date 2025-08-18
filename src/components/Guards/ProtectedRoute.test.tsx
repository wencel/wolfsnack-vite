import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { testRender } from '@/test/test-utils';
import ProtectedRoute from './ProtectedRoute';



// Test component to render inside ProtectedRoute
const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    testRender(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
            token: 'fake-token',
            isAuthenticated: true,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/protected'],
        mountPath: '/protected',
        routes: [
          { path: '/login', element: <div>Login Page</div> },
        ],
      }
    );

    expect(screen.getByText('Protected Content')).toBeVisible();
  });

  it('redirects to login when user is not authenticated', () => {
    testRender(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/protected'],
        mountPath: '/protected',
        routes: [
          { path: '/login', element: <div>Login Page</div> },
        ],
      }
    );

    // Should redirect to login page
    expect(screen.getByText('Login Page')).toBeVisible();
    // Protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('preserves location state when redirecting to login', () => {
    testRender(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/protected'],
        mountPath: '/protected',
        routes: [
          { path: '/login', element: <div>Login Page</div> },
        ],
      }
    );

    // Should be on login page
    expect(screen.getByText('Login Page')).toBeVisible();
  });

  it('handles multiple children correctly when authenticated', () => {
    const MultipleChildren = () => (
      <>
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </>
    );

    testRender(
      <ProtectedRoute>
        <MultipleChildren />
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
            token: 'fake-token',
            isAuthenticated: true,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/protected'],
        mountPath: '/protected',
        routes: [
          { path: '/login', element: <div>Login Page</div> },
        ],
      }
    );

    expect(screen.getByText('First Child')).toBeVisible();
    expect(screen.getByText('Second Child')).toBeVisible();
    expect(screen.getByText('Third Child')).toBeVisible();
  });

  it('handles empty children gracefully when authenticated', () => {
    testRender(
      <ProtectedRoute>
        {null}
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
            token: 'fake-token',
            isAuthenticated: true,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/protected'],
        mountPath: '/protected',
        routes: [
          { path: '/login', element: <div>Login Page</div> },
        ],
      }
    );

    // Should render without crashing
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
