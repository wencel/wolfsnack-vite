import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { testRender } from '@/test/test-utils';
import PublicRoute from './';

// Test component to render inside PublicRoute
const TestComponent = () => <div>Public Content</div>;

// testRender is provided by test-utils

describe('PublicRoute', () => {
  it('renders children when user is not authenticated', () => {
    testRender(
      <PublicRoute>
        <TestComponent />
      </PublicRoute>,
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
        initialEntries: ['/public'],
        mountPath: '/public',
        routes: [
          { path: '/customers', element: <div>Customers Page</div> },
          { path: '/dashboard', element: <div>Dashboard Page</div> },
          { path: '/orders', element: <div>Orders Page</div> },
          { path: '/products', element: <div>Products Page</div> },
          { path: '/sales', element: <div>Sales Page</div> },
        ],
      }
    );

    expect(screen.getByText('Public Content')).toBeVisible();
  });

  it('redirects authenticated users to default route when no redirectTo specified', () => {
    testRender(
      <PublicRoute>
        <TestComponent />
      </PublicRoute>,
      {
        preloadedState: {
          auth: {
            user: {
              _id: '1',
              name: 'Test User',
              email: 'test@example.com',
              active: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
            token: 'fake-token',
            isAuthenticated: true,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/public'],
        mountPath: '/public',
        routes: [
          { path: '/customers', element: <div>Customers Page</div> },
          { path: '/dashboard', element: <div>Dashboard Page</div> },
          { path: '/orders', element: <div>Orders Page</div> },
          { path: '/products', element: <div>Products Page</div> },
          { path: '/sales', element: <div>Sales Page</div> },
        ],
      }
    );

    // Should redirect to default customers page
    expect(screen.getByText('Customers Page')).toBeVisible();
    // Public content should not be visible
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('redirects authenticated users to custom route when redirectTo specified', () => {
    testRender(
      <PublicRoute redirectTo="/dashboard">
        <TestComponent />
      </PublicRoute>,
      {
        preloadedState: {
          auth: {
            user: {
              _id: '1',
              name: 'Test User',
              email: 'test@example.com',
              active: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
            token: 'fake-token',
            isAuthenticated: true,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/public'],
        mountPath: '/public',
        routes: [
          { path: '/customers', element: <div>Customers Page</div> },
          { path: '/dashboard', element: <div>Dashboard Page</div> },
          { path: '/orders', element: <div>Orders Page</div> },
          { path: '/products', element: <div>Products Page</div> },
          { path: '/sales', element: <div>Sales Page</div> },
        ],
      }
    );

    // Should redirect to custom dashboard page
    expect(screen.getByText('Dashboard Page')).toBeVisible();
    // Public content should not be visible
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('preserves location state when redirecting authenticated users', () => {
    testRender(
      <PublicRoute>
        <TestComponent />
      </PublicRoute>,
      {
        preloadedState: {
          auth: {
            user: {
              _id: '1',
              name: 'Test User',
              email: 'test@example.com',
              active: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
            token: 'fake-token',
            isAuthenticated: true,
            error: null,
            initialized: true,
          },
        },
        initialEntries: ['/public'],
        mountPath: '/public',
        routes: [
          { path: '/customers', element: <div>Customers Page</div> },
          { path: '/dashboard', element: <div>Dashboard Page</div> },
          { path: '/orders', element: <div>Orders Page</div> },
          { path: '/products', element: <div>Products Page</div> },
          { path: '/sales', element: <div>Sales Page</div> },
        ],
      }
    );

    // Should be on customers page (default redirect)
    expect(screen.getByText('Customers Page')).toBeVisible();
  });

  it('handles multiple children correctly when not authenticated', () => {
    const MultipleChildren = () => (
      <>
        <div>First Public Child</div>
        <div>Second Public Child</div>
        <div>Third Public Child</div>
      </>
    );

    testRender(
      <PublicRoute>
        <MultipleChildren />
      </PublicRoute>,
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
        initialEntries: ['/public'],
        mountPath: '/public',
        routes: [
          { path: '/customers', element: <div>Customers Page</div> },
          { path: '/dashboard', element: <div>Dashboard Page</div> },
          { path: '/orders', element: <div>Orders Page</div> },
          { path: '/products', element: <div>Products Page</div> },
          { path: '/sales', element: <div>Sales Page</div> },
        ],
      }
    );

    expect(screen.getByText('First Public Child')).toBeVisible();
    expect(screen.getByText('Second Public Child')).toBeVisible();
    expect(screen.getByText('Third Public Child')).toBeVisible();
  });

  it('handles empty children gracefully when not authenticated', () => {
    testRender(<PublicRoute>{null}</PublicRoute>, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          initialized: true,
        },
      },
      initialEntries: ['/public'],
      mountPath: '/public',
      routes: [
        { path: '/customers', element: <div>Customers Page</div> },
        { path: '/dashboard', element: <div>Dashboard Page</div> },
        { path: '/orders', element: <div>Orders Page</div> },
        { path: '/products', element: <div>Products Page</div> },
        { path: '/sales', element: <div>Sales Page</div> },
      ],
    });

    // Should render without crashing
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });

  it('works with different redirect paths', () => {
    const customRedirects = ['/orders', '/products', '/sales'];

    customRedirects.forEach(redirectPath => {
      const { unmount } = testRender(
        <PublicRoute redirectTo={redirectPath}>
          <TestComponent />
        </PublicRoute>,
        {
          preloadedState: {
            auth: {
              user: {
                _id: '1',
                name: 'Test User',
                email: 'test@example.com',
                active: true,
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
              token: 'fake-token',
              isAuthenticated: true,
              error: null,
              initialized: true,
            },
          },
          initialEntries: ['/public'],
          mountPath: '/public',
          routes: [
            { path: '/customers', element: <div>Customers Page</div> },
            { path: '/dashboard', element: <div>Dashboard Page</div> },
            { path: '/orders', element: <div>Orders Page</div> },
            { path: '/products', element: <div>Products Page</div> },
            { path: '/sales', element: <div>Sales Page</div> },
          ],
        }
      );

      // Should redirect to the custom path
      expect(
        screen.getByText(
          `${redirectPath.slice(1).charAt(0).toUpperCase() + redirectPath.slice(2)} Page`
        )
      ).toBeVisible();
      unmount();
    });
  });
});
