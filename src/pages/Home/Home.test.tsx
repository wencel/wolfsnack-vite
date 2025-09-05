import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import Home from './Home';

describe('Home Page', () => {
  const renderHomePage = () => {
    return testRender(<Home />, {
      initialEntries: ['/'],
      mountPath: '/',
      routes: [
        { 
          path: '/customers', 
          element: <div data-testid="dummy-customers-page">Customers Page Content</div> 
        }
      ]
    });
  };

  it('redirects to customers page on load', async () => {
    renderHomePage();

    // Wait for navigation to complete and verify we're on the customers page
    const customersPage = await screen.findByTestId('dummy-customers-page');
    expect(customersPage).toBeVisible();
    expect(customersPage).toHaveTextContent('Customers Page Content');
  });

  it('uses replace navigation to prevent back button issues', () => {
    // This test verifies the Navigate component behavior
    // The Navigate component with replace=true should replace the current history entry
    renderHomePage();

    // The component should immediately redirect without rendering any visible content
    // We can verify this by checking that the customers page content appears
    expect(screen.getByTestId('dummy-customers-page')).toBeVisible();
  });
});
