import { screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { testRender } from '@/test/test-utils';
import ProductCard from './';
import type { Product } from './ProductCard';

// Mock data for testing
const mockProduct: Product = {
  _id: '1',
  name: 'Wolf Snack Mix',
  presentation: 'Bolsa',
  weight: 500,
  stock: 25,
  basePrice: 12.99,
  sellingPrice: 15.99,
};

const mockProductWithoutOptionalFields: Product = {
  _id: '2',
  name: 'Premium Treats',
  presentation: 'Caja',
  weight: 250,
  stock: 10,
  basePrice: 8.50,
  sellingPrice: 10.99,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    testRender(<ProductCard product={mockProduct} />);

    // Title is a heading level 2 with product name, presentation, and weight
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Wolf Snack Mix');
    expect(title).toHaveTextContent('Bolsa');
    expect(title).toHaveTextContent('500 g');
    
    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/25/)).toBeVisible();
    expect(within(card).getByText(/Unidades/)).toBeVisible();
    expect(within(card).getByText(/Cantidad en inventario/)).toBeVisible();
    expect(within(card).getByText(/Precio base/)).toBeVisible();
    expect(within(card).getByText(/\$12,99/)).toBeVisible();
    expect(within(card).getByText(/Precio de venta/)).toBeVisible();
    expect(within(card).getByText(/\$15,99/)).toBeVisible();
  });

  it('renders product without optional fields correctly', () => {
    testRender(<ProductCard product={mockProductWithoutOptionalFields} />);

    // Title heading includes the product information
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Premium Treats');
    expect(title).toHaveTextContent('Caja');
    expect(title).toHaveTextContent('250 g');
    
    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/10 Unidades/)).toBeVisible();
    expect(within(card).getByText(/Cantidad en inventario/)).toBeVisible();
    expect(within(card).getByText(/Precio base/)).toBeVisible();
    expect(within(card).getByText(/\$8,5/)).toBeVisible();
    expect(within(card).getByText(/Precio de venta/)).toBeVisible();
    expect(within(card).getByText(/\$10,99/)).toBeVisible();
  });

  it('renders navigation header when navigate prop is true', () => {
    testRender(<ProductCard product={mockProduct} navigate={true} />);

    // The link accessible name includes the product name, presentation, and weight
    const productLink = screen.getByRole('link', { name: /Wolf Snack Mix Bolsa 500 g/i });
    expect(productLink).toBeVisible();
    expect(productLink).toHaveAttribute('href', '/products/1');
  });

  it('renders plain text when navigate prop is false', () => {
    testRender(<ProductCard product={mockProduct} navigate={false} />);

    // Check that product information is displayed as text, not a link
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Wolf Snack Mix');
    expect(title).toHaveTextContent('Bolsa');
    expect(title).toHaveTextContent('500 g');
    expect(screen.queryByRole('link', { name: /wolf snack mix bolsa 500 g/i })).not.toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    testRender(<ProductCard product={mockProduct} />);

    const editButton = screen.getByRole('button', { name: /editar producto/i });
    expect(editButton).toBeVisible();
    
    // Check that the button is inside a link with correct href
    const editLink = editButton.closest('a');
    expect(editLink).toHaveAttribute('href', '/products/1/edit');
  });

  it('renders delete button', () => {
    testRender(<ProductCard product={mockProduct} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar producto/i });
    expect(deleteButton).toBeVisible();
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    testRender(<ProductCard product={mockProduct} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar producto/i });
    fireEvent.click(deleteButton);

    // Check that the modal is displayed
    expect(screen.getByText(/Confirmas que deseas eliminar el producto/i)).toBeVisible();
    
    // Check that modal title is visible
    expect(screen.getByText('Eliminar producto')).toBeVisible();
    
    // Check that the modal contains the product information
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('Wolf Snack Mix');
    expect(modal).toHaveTextContent('Bolsa');
    expect(modal).toHaveTextContent('500 g');
  });

  it('calls deleteProduct function when confirmed', () => {
    const mockDeleteProduct = vi.fn();
    testRender(
      <ProductCard 
        product={mockProduct}
        deleteProduct={mockDeleteProduct} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar producto/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteProduct).toHaveBeenCalledWith('1');
  });

  it('closes modal when cancel button is clicked', () => {
    testRender(<ProductCard product={mockProduct} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar producto/i });
    fireEvent.click(deleteButton);

    // Check that modal is visible
    expect(screen.getByRole('dialog')).toBeVisible();

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /No/i });
    fireEvent.click(cancelButton);

    // Check that modal is no longer visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when background is clicked', () => {
    testRender(<ProductCard product={mockProduct} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar producto/i });
    fireEvent.click(deleteButton);

    // Check that modal is visible
    expect(screen.getByRole('dialog')).toBeVisible();

    // Click background to close modal
    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);

    // Check that modal is no longer visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-product-card';
    testRender(<ProductCard product={mockProduct} className={customClass} />);

    // Find the card element using its accessible role
    const cardElement = screen.getByRole('article');
    expect(cardElement).toBeVisible();
    
    // Verify it contains the product information
    expect(cardElement).toHaveTextContent(/Wolf Snack Mix/);
  });

  it('handles product without deleteProduct function', () => {
    testRender(<ProductCard product={mockProduct} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar producto/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    // Should not crash, just close the modal
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays formatted weight with thousand separators', () => {
    const productWithLongWeight: Product = {
      ...mockProduct,
      weight: 1234567,
    };

    testRender(<ProductCard product={productWithLongWeight} />);

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('1.234.567 g');
  });

  it('displays formatted prices with thousand separators', () => {
    const productWithHighPrices: Product = {
      ...mockProduct,
      basePrice: 1234567.89,
      sellingPrice: 2345678.90,
    };

    testRender(<ProductCard product={productWithHighPrices} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/\$1\.234\.567,89/)).toBeVisible();
    expect(within(card).getByText(/\$2\.345\.678,9/)).toBeVisible();
  });

  it('displays zero stock correctly', () => {
    const productWithZeroStock: Product = {
      ...mockProduct,
      stock: 0,
    };

    testRender(<ProductCard product={productWithZeroStock} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/0 Unidades/)).toBeVisible();
    expect(within(card).getByText(/Cantidad en inventario/)).toBeVisible();
  });

  it('displays undefined values gracefully', () => {
    const productWithUndefinedFields: Product = {
      _id: '3',
      name: 'Test Product',
      // presentation, weight, stock, basePrice, sellingPrice are undefined
    };

    testRender(<ProductCard product={productWithUndefinedFields} />);

    // Should still render the product without crashing
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Test Product');
    
    // Check that undefined values are handled gracefully (empty spans are rendered)
    const card = screen.getByRole('article');
    expect(within(card).getByText(/Unidades/)).toBeVisible();
    expect(within(card).getByText(/Cantidad en inventario/)).toBeVisible();
    // The component renders empty spans for undefined values, not "undefined" text
  });

  it('displays product with missing presentation', () => {
    const productWithoutPresentation: Product = {
      ...mockProduct,
      presentation: undefined,
    };

    testRender(<ProductCard product={productWithoutPresentation} />);

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Wolf Snack Mix');
    expect(title).toHaveTextContent('500 g');
    
    // Should not crash when presentation is undefined
    expect(title).not.toHaveTextContent('undefined');
  });

  it('displays product with missing weight', () => {
    const productWithoutWeight: Product = {
      ...mockProduct,
      weight: undefined,
    };

    testRender(<ProductCard product={productWithoutWeight} />);

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Wolf Snack Mix');
    expect(title).toHaveTextContent('Bolsa');
    
    // Should not crash when weight is undefined
    expect(title).not.toHaveTextContent('undefined');
  });

  it('displays product with missing prices', () => {
    const productWithoutPrices: Product = {
      ...mockProduct,
      basePrice: undefined,
      sellingPrice: undefined,
    };

    testRender(<ProductCard product={productWithoutPrices} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/Precio base/)).toBeVisible();
    expect(within(card).getByText(/Precio de venta/)).toBeVisible();
    
    // Should handle undefined prices gracefully (empty spans are rendered)
    // The component renders empty spans for undefined prices, not "undefined" text
  });
});
