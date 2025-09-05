import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import AuthProvider from './AuthProvider';

describe('AuthProvider', () => {
  it('should show loading skeleton when not initialized', () => {
    testRender(
      <AuthProvider>
        <div>Test Content</div>
      </AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: false,
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
          },
        },
      }
    );

    expect(screen.getByTestId('loading-skeleton')).toBeVisible();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should render children when initialized', () => {
    testRender(
      <AuthProvider>
        <div>Test Content</div>
      </AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: true,
            isAuthenticated: true,
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
            token: 'test-token',
            error: null,
          },
        },
      }
    );

    expect(screen.getByText('Test Content')).toBeVisible();
    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });

  it('should render children when initialized but not authenticated', () => {
    testRender(
      <AuthProvider>
        <div>Test Content</div>
      </AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: true,
            isAuthenticated: false,
            user: null,
            token: null,
            error: 'Authentication failed',
          },
        },
      }
    );

    expect(screen.getByText('Test Content')).toBeVisible();
    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });

  it('should handle multiple children correctly', () => {
    testRender(
      <AuthProvider>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: true,
            isAuthenticated: true,
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
            token: 'test-token',
            error: null,
          },
        },
      }
    );

    expect(screen.getByText('First Child')).toBeVisible();
    expect(screen.getByText('Second Child')).toBeVisible();
    expect(screen.getByText('Third Child')).toBeVisible();
  });

  it('should handle empty children gracefully', () => {
    testRender(
      <AuthProvider>{null}</AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: true,
            isAuthenticated: true,
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
            token: 'test-token',
            error: null,
          },
        },
      }
    );

    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });

  it('should handle undefined children gracefully', () => {
    testRender(
      <AuthProvider>{undefined}</AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: true,
            isAuthenticated: true,
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
            token: 'test-token',
            error: null,
          },
        },
      }
    );

    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });

  it('should handle complex nested children', () => {
    testRender(
      <AuthProvider>
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Click me</button>
        </div>
      </AuthProvider>,
      {
        preloadedState: {
          auth: {
            initialized: true,
            isAuthenticated: true,
            user: { _id: '1', name: 'Test User', email: 'test@example.com', active: true, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
            token: 'test-token',
            error: null,
          },
        },
      }
    );

    expect(screen.getByRole('heading', { name: 'Title' })).toBeVisible();
    expect(screen.getByText('Description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeVisible();
  });
});
