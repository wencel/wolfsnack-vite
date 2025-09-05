import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { testRender } from '@/test/test-utils';
import Layout from './';

describe('Layout', () => {
  const TestChild = () => <div>Test Content</div>;

  it('renders children in main element', () => {
    testRender(
      <Layout>
        <TestChild />
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeVisible();
    expect(screen.getByRole('main')).toBeVisible();
  });

  it('renders Navbar component', () => {
    testRender(
      <Layout>
        <TestChild />
      </Layout>
    );

    // Navbar should always be visible
    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('renders with correct layout structure', () => {
    testRender(
      <Layout>
        <TestChild />
      </Layout>
    );

    const mainElement = screen.getByRole('main');
    const childElement = screen.getByText('Test Content');

    // Check that test child is inside main
    expect(mainElement).toContainElement(childElement);
  });

  it('renders multiple children correctly', () => {
    const MultipleChildren = () => (
      <>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </>
    );

    testRender(
      <Layout>
        <MultipleChildren />
      </Layout>
    );

    expect(screen.getByText('Child 1')).toBeVisible();
    expect(screen.getByText('Child 2')).toBeVisible();
    expect(screen.getByText('Child 3')).toBeVisible();
  });

  it('renders empty children without errors', () => {
    testRender(<Layout>{null}</Layout>);

    expect(screen.getByRole('navigation')).toBeVisible();
    expect(screen.getByRole('main')).toBeVisible();
  });

  it('renders with complex nested children', () => {
    const ComplexChild = () => (
      <div>
        <h1>Title</h1>
        <p>Description</p>
        <button type="button">Click me</button>
      </div>
    );

    testRender(
      <Layout>
        <ComplexChild />
      </Layout>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeVisible();
    expect(screen.getByText('Description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeVisible();
  });

  it('renders with different types of content', () => {
    const MixedContent = () => (
      <>
        <h2>Section Title</h2>
        <p>Some paragraph text</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <form>
          <input type="text" placeholder="Enter text" />
          <button type="submit">Submit</button>
        </form>
      </>
    );

    testRender(
      <Layout>
        <MixedContent />
      </Layout>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Section Title' })).toBeVisible();
    expect(screen.getByText('Some paragraph text')).toBeVisible();
    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByPlaceholderText('Enter text')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  it('maintains accessibility structure', () => {
    testRender(
      <Layout>
        <TestChild />
      </Layout>
    );

    // Check that the main landmark is present
    expect(screen.getByRole('main')).toBeVisible();
    
    // Check that navigation is present
    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('handles dynamic content changes', () => {
    const { testRerender } = testRender(
      <Layout>
        <div>Initial Content</div>
      </Layout>,
      {
        preloadedState: {
          loading: {
            loading: false,
            submitting: false,
            fetching: false,
          },
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            initialized: true,
          },
        },
      }
    );

    expect(screen.getByText('Initial Content')).toBeVisible();

    // Rerender with different content using our custom rerender
    testRerender(
      <Layout>
        <div>New Content</div>
      </Layout>
    );

    expect(screen.getByText('New Content')).toBeVisible();
    expect(screen.queryByText('Initial Content')).not.toBeInTheDocument();
  });

  it('renders Loading component with proper accessibility attributes when loading', () => {
    // Set initial state to have loading: true so the Loading component is visible
    testRender(
      <Layout>
        <TestChild />
      </Layout>,
      {
        preloadedState: {
          loading: {
            loading: true,
            submitting: false,
            fetching: false,
          },
        },
      }
    );

    // Now the Loading component should be visible and we can test its accessibility
    const loadingElement = screen.getByRole('status', { name: 'Loading overlay' });
    expect(loadingElement).toBeVisible();
    expect(loadingElement).toHaveAttribute('role', 'status');
    expect(loadingElement).toHaveAttribute('aria-label', 'Loading overlay');
  });

  it('renders BottomNavigation when user is authenticated', () => {
    // Set initial state to have an authenticated user so BottomNavigation is visible
    testRender(
      <Layout>
        <TestChild />
      </Layout>,
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
      }
    );

    // Now BottomNavigation should be visible since the user is authenticated
    expect(screen.getByRole('main')).toBeVisible();
    
    // We should have two navigation elements: Navbar and BottomNavigation
    const navigationElements = screen.getAllByRole('navigation');
    expect(navigationElements).toHaveLength(2);
    
    // Test that we can find the BottomNavigation content
    expect(screen.getByText('Clientes')).toBeVisible();
    expect(screen.getByText('Productos')).toBeVisible();
    expect(screen.getByText('Ventas')).toBeVisible();
    expect(screen.getByText('Pedidos')).toBeVisible();
  });

  it('does not render BottomNavigation when user is not authenticated', () => {
    // Set initial state to have no authenticated user
    testRender(
      <Layout>
        <TestChild />
      </Layout>,
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
      }
    );

    // Core layout elements should still be present
    expect(screen.getByRole('main')).toBeVisible();
    
    // Should only have one navigation element (the main Navbar)
    const navigationElements = screen.getAllByRole('navigation');
    expect(navigationElements).toHaveLength(1);
    
    // BottomNavigation content should not be present
    expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
    expect(screen.queryByText('Productos')).not.toBeInTheDocument();
    expect(screen.queryByText('Ventas')).not.toBeInTheDocument();
    expect(screen.queryByText('Pedidos')).not.toBeInTheDocument();
  });
});
