import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { textConstants } from '@/lib/appConstants';
import buttonStyles from '@/components/Atoms/Button/Button.module.sass';

// Helper function to render component with MemoryRouter
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <BottomNavigation />
    </MemoryRouter>
  );
};

describe('BottomNavigation Component', () => {
  it('renders all navigation buttons with correct text and icons', () => {
    renderWithRouter(['/']);

    // Check if all navigation buttons are rendered
    expect(screen.getByText(textConstants.navbar.CUSTOMERS)).toBeVisible();
    expect(screen.getByText(textConstants.navbar.PRODUCTS)).toBeVisible();
    expect(screen.getByText(textConstants.navbar.SALES)).toBeVisible();
    expect(screen.getByText(textConstants.navbar.ORDERS)).toBeVisible();

    // Check if all buttons are rendered as links
    expect(screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS })).toBeVisible();
    expect(screen.getByRole('link', { name: textConstants.navbar.PRODUCTS })).toBeVisible();
    expect(screen.getByRole('link', { name: textConstants.navbar.SALES })).toBeVisible();
    expect(screen.getByRole('link', { name: textConstants.navbar.ORDERS })).toBeVisible();
  });

  it('renders navigation buttons with correct href attributes', () => {
    renderWithRouter(['/']);

    expect(screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS })).toHaveAttribute('href', '/customers');
    expect(screen.getByRole('link', { name: textConstants.navbar.PRODUCTS })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: textConstants.navbar.SALES })).toHaveAttribute('href', '/sales');
    expect(screen.getByRole('link', { name: textConstants.navbar.ORDERS })).toHaveAttribute('href', '/orders');
  });

  it('applies correct theme to all navigation buttons', () => {
    renderWithRouter(['/']);

    const customersButton = screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS });
    const productsButton = screen.getByRole('link', { name: textConstants.navbar.PRODUCTS });
    const salesButton = screen.getByRole('link', { name: textConstants.navbar.SALES });
    const ordersButton = screen.getByRole('link', { name: textConstants.navbar.ORDERS });

    expect(customersButton).toHaveClass(buttonStyles.BottomNavigation);
    expect(productsButton).toHaveClass(buttonStyles.BottomNavigation);
    expect(salesButton).toHaveClass(buttonStyles.BottomNavigation);
    expect(ordersButton).toHaveClass(buttonStyles.BottomNavigation);
  });

  it('shows active state for customers page when on /customers path', () => {
    renderWithRouter(['/customers']);

    const customersButton = screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS });
    const productsButton = screen.getByRole('link', { name: textConstants.navbar.PRODUCTS });
    const salesButton = screen.getByRole('link', { name: textConstants.navbar.SALES });
    const ordersButton = screen.getByRole('link', { name: textConstants.navbar.ORDERS });

    expect(customersButton).toHaveClass(buttonStyles.active);
    expect(productsButton).not.toHaveClass(buttonStyles.active);
    expect(salesButton).not.toHaveClass(buttonStyles.active);
    expect(ordersButton).not.toHaveClass(buttonStyles.active);
  });

  it('shows active state for products page when on /products path', () => {
    renderWithRouter(['/products']);

    const customersButton = screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS });
    const productsButton = screen.getByRole('link', { name: textConstants.navbar.PRODUCTS });
    const salesButton = screen.getByRole('link', { name: textConstants.navbar.SALES });
    const ordersButton = screen.getByRole('link', { name: textConstants.navbar.ORDERS });

    expect(customersButton).not.toHaveClass(buttonStyles.active);
    expect(productsButton).toHaveClass(buttonStyles.active);
    expect(salesButton).not.toHaveClass(buttonStyles.active);
    expect(ordersButton).not.toHaveClass(buttonStyles.active);
  });

  it('shows active state for sales page when on /sales path', () => {
    renderWithRouter(['/sales']);

    const customersButton = screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS });
    const productsButton = screen.getByRole('link', { name: textConstants.navbar.PRODUCTS });
    const salesButton = screen.getByRole('link', { name: textConstants.navbar.SALES });
    const ordersButton = screen.getByRole('link', { name: textConstants.navbar.ORDERS });

    expect(customersButton).not.toHaveClass(buttonStyles.active);
    expect(productsButton).not.toHaveClass(buttonStyles.active);
    expect(salesButton).toHaveClass(buttonStyles.active);
    expect(ordersButton).not.toHaveClass(buttonStyles.active);
  });

  it('shows active state for orders page when on /orders path', () => {
    renderWithRouter(['/orders']);

    const customersButton = screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS });
    const productsButton = screen.getByRole('link', { name: textConstants.navbar.PRODUCTS });
    const salesButton = screen.getByRole('link', { name: textConstants.navbar.SALES });
    const ordersButton = screen.getByRole('link', { name: textConstants.navbar.ORDERS });

    expect(customersButton).not.toHaveClass(buttonStyles.active);
    expect(productsButton).not.toHaveClass(buttonStyles.active);
    expect(salesButton).not.toHaveClass(buttonStyles.active);
    expect(ordersButton).toHaveClass(buttonStyles.active);
  });

  it('handles unknown paths without errors', () => {
    renderWithRouter(['/unknown']);

    // All buttons should be rendered but none should be active
    expect(screen.getByRole('link', { name: textConstants.navbar.CUSTOMERS })).toBeVisible();
    expect(screen.getByRole('link', { name: textConstants.navbar.PRODUCTS })).toBeVisible();
    expect(screen.getByRole('link', { name: textConstants.navbar.SALES })).toBeVisible();
    expect(screen.getByRole('link', { name: textConstants.navbar.ORDERS })).toBeVisible();

    // No button should be active
    const allButtons = screen.getAllByRole('link');
    allButtons.forEach(button => {
      expect(button).not.toHaveClass(buttonStyles.active);
    });
  });

  it('maintains navigation structure regardless of current path', () => {
    const paths = ['/customers', '/products', '/sales', '/orders', '/', '/unknown'];
    
    paths.forEach(path => {
      const { unmount } = renderWithRouter([path]);
      
      // Verify all navigation items are always present
      expect(screen.getByText(textConstants.navbar.CUSTOMERS)).toBeVisible();
      expect(screen.getByText(textConstants.navbar.PRODUCTS)).toBeVisible();
      expect(screen.getByText(textConstants.navbar.SALES)).toBeVisible();
      expect(screen.getByText(textConstants.navbar.ORDERS)).toBeVisible();
      
      unmount();
    });
  });
});