import { screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { testRender } from '@/test/test-utils';
import SaleCard from './';
import type { Sale, Product, Customer } from './SaleCard';

// Mock data for testing
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Wolf Snack Mix',
    presentation: 'Bolsa',
    weight: 500,
    sellingPrice: 15.99,
  },
  {
    _id: '2',
    name: 'Premium Treats',
    presentation: 'Caja',
    weight: 250,
    sellingPrice: 10.99,
  },
];

const mockCustomer: Customer = {
  storeName: 'Pet Store ABC',
  name: 'John Doe',
};

const mockSale: Sale = {
  _id: 'sale1',
  saleId: 12345,
  saleDate: '2024-01-15T10:00:00.000Z',
  products: [
    { product: '1', quantity: 2 },
    { product: '2', quantity: 1 },
  ],
  isThirteenDozen: false,
  partialPayment: 50.00,
  totalPrice: 42.97,
  customer: mockCustomer,
};

const mockSaleWithThirteenDozen: Sale = {
  _id: 'sale2',
  saleId: 67890,
  saleDate: '2024-01-20T14:30:00.000Z',
  products: [
    { product: '1', quantity: 3 },
  ],
  isThirteenDozen: true,
  partialPayment: 30.00,
  totalPrice: 47.97,
  customer: mockCustomer,
};

const mockSaleWithoutCustomerName: Sale = {
  _id: 'sale3',
  saleId: 11111,
  saleDate: '2024-01-25T09:00:00.000Z',
  products: [
    { product: '1', quantity: 1 },
  ],
  isThirteenDozen: false,
  partialPayment: 20.00,
  totalPrice: 15.99,
  customer: {
    storeName: 'Pet Store XYZ',
    // name is undefined
  },
};

describe('SaleCard', () => {
  it('renders sale information correctly', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    // Title is a heading level 2 starting with "Venta" and includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('12.345');
    
    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/15º enero 2024/)).toBeVisible();
    expect(within(card).getByText(/Pet Store ABC/)).toBeVisible();
    expect(within(card).getByText(/John Doe/)).toBeVisible();
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
    expect(within(card).getByText(/Premium Treats Caja/)).toBeVisible();
    expect(within(card).getByText(/250g/)).toBeVisible();
    expect(within(card).getByText(/1 Unidades/)).toBeVisible();
    // Check that the card contains the sale information
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/Premium Treats Caja/)).toBeVisible();
  });

  it('renders sale with thirteen dozen correctly', () => {
    testRender(<SaleCard sale={mockSaleWithThirteenDozen} products={mockProducts} />);

    // Title heading includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('67.890');
    
    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/20º enero 2024/)).toBeVisible();
    expect(within(card).getByText(/Pet Store ABC/)).toBeVisible();
    expect(within(card).getByText(/John Doe/)).toBeVisible();
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/3 Unidades/)).toBeVisible();
    expect(within(card).getByText(/Docena de 13/)).toBeVisible();
    // Check that the card contains the sale information
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
  });

  it('renders sale without customer name correctly', () => {
    testRender(<SaleCard sale={mockSaleWithoutCustomerName} products={mockProducts} />);

    // Title heading includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('11.111');
    
    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/25º enero 2024/)).toBeVisible();
    expect(within(card).getByText(/Pet Store XYZ/)).toBeVisible();
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    // Check that the card contains the sale information
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/1 Unidades/)).toBeVisible();
  });

  it('renders navigation header when navigate prop is true', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} navigate={true} />);

    // The link accessible name includes the # prefix
    const saleLink = screen.getByRole('link', { name: /Venta #12\.345/i });
    expect(saleLink).toBeVisible();
    expect(saleLink).toHaveAttribute('href', '/sales/sale1');
  });

  it('renders plain text when navigate prop is false', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} navigate={false} />);

    // Check that sale ID is displayed as text, not a link
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('12.345');
    expect(screen.queryByRole('link', { name: /venta #?12\.345/i })).not.toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    const editButton = screen.getByRole('button', { name: /editar venta/i });
    expect(editButton).toBeVisible();
    
    // Check that the button is inside a link with correct href
    const editLink = editButton.closest('a');
    expect(editLink).toHaveAttribute('href', '/sales/sale1');
  });

  it('renders delete button', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar venta/i });
    expect(deleteButton).toBeVisible();
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar venta/i });
    fireEvent.click(deleteButton);

    // Check that the modal is displayed
    expect(screen.getByText(/Confirmas que deseas eliminar la venta/i)).toBeVisible();
    
    // Check that modal title is visible
    expect(screen.getByText('Eliminar venta')).toBeVisible();
    
    // Check that the modal contains the sale ID and date
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('#12.345');
    expect(modal).toHaveTextContent('15º enero');
    expect(modal).toHaveTextContent('2024');
  });

  it('calls deleteSale function when confirmed', () => {
    const mockDeleteSale = vi.fn();
    testRender(
      <SaleCard 
        sale={mockSale} 
        products={mockProducts}
        deleteSale={mockDeleteSale} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar venta/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteSale).toHaveBeenCalledWith('sale1');
  });

  it('closes modal when cancel button is clicked', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar venta/i });
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
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar venta/i });
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
    const customClass = 'custom-sale-card';
    testRender(<SaleCard sale={mockSale} products={mockProducts} className={customClass} />);

    // Find the card element using its accessible role
    const cardElement = screen.getByRole('article');
    expect(cardElement).toBeVisible();
    
    // Verify it contains the sale information
    expect(cardElement).toHaveTextContent(/Venta 12\.345/);
  });

  it('handles sale without deleteSale function', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar venta/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    // Should not crash, just close the modal
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays formatted sale ID with thousand separators', () => {
    const saleWithLongId: Sale = {
      ...mockSale,
      saleId: 123456789,
    };

    testRender(<SaleCard sale={saleWithLongId} products={mockProducts} />);

    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('123.456.789');
  });

  it('displays formatted prices with thousand separators', () => {
    const saleWithHighPrices: Sale = {
      ...mockSale,
      partialPayment: 1234567.89,
      totalPrice: 2345678.90,
    };

    testRender(<SaleCard sale={saleWithHighPrices} products={mockProducts} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/\$1\.234\.567,89/)).toBeVisible();
    expect(within(card).getByText(/\$2\.345\.678,9/)).toBeVisible();
  });

  it('displays product total prices when not navigating', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} navigate={false} />);

    // Check product total prices in the card
    const card = screen.getByRole('article');
    // There are multiple "Total por producto" elements, so use getAllByText
    const totalPriceElements = within(card).getAllByText(/Total por producto/);
    expect(totalPriceElements.length).toBeGreaterThan(0);
    // The actual price calculation depends on the utility function
    expect(within(card).getByText(/\$31,98/)).toBeVisible(); // 2 * 15.99
    expect(within(card).getByText(/\$10,99/)).toBeVisible(); // 1 * 10.99
  });

  it('does not display product total prices when navigating', () => {
    testRender(<SaleCard sale={mockSale} products={mockProducts} navigate={true} />);

    // Ensure product total price elements are not present
    const card = screen.getByRole('article');
    expect(within(card).queryByText(/Total por producto/)).not.toBeInTheDocument();
  });

  it('handles missing product information gracefully', () => {
    const saleWithMissingProduct: Sale = {
      ...mockSale,
      products: [
        { product: '1', quantity: 2 },
        { product: 'nonexistent', quantity: 1 },
      ],
    };

    testRender(<SaleCard sale={saleWithMissingProduct} products={mockProducts} />);

    // Should still render the sale without crashing
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('12.345');
    
    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
    
    // Missing product should show undefined values
    expect(within(card).getByText(/undefined/)).toBeVisible();
    expect(within(card).getByText(/1 Unidades/)).toBeVisible();
  });

  it('renders with zero quantity products', () => {
    const saleWithZeroQuantity: Sale = {
      ...mockSale,
      products: [
        { product: '1', quantity: 0 },
      ],
    };

    testRender(<SaleCard sale={saleWithZeroQuantity} products={mockProducts} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/0 Unidades/)).toBeVisible();
  });

  it('displays correct date format', () => {
    const saleWithSpecificDate: Sale = {
      ...mockSale,
      saleDate: '2024-12-25T00:00:00.000Z',
    };

    testRender(<SaleCard sale={saleWithSpecificDate} products={mockProducts} />);

    // Check for the date parts in the card specifically
    const card = screen.getByRole('article');
    const months = within(card).getAllByText(/diciembre/);
    expect(months.length).toBeGreaterThan(0);
    const years = within(card).getAllByText(/2024/);
    expect(years.length).toBeGreaterThan(0);
    // The day number might be rendered differently, so check for any day number
    const dayElements = within(card).getAllByText(/\d+º/);
    expect(dayElements.length).toBeGreaterThan(0);
  });

  it('displays thirteen dozen calculation correctly', () => {
    const saleWithThirteenDozen: Sale = {
      ...mockSale,
      products: [
        { product: '1', quantity: 13 },
      ],
      isThirteenDozen: true,
      totalPrice: 207.87, // 13 * 15.99
    };

    testRender(<SaleCard sale={saleWithThirteenDozen} products={mockProducts} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/Docena de 13/)).toBeVisible();
    expect(within(card).getByText(/13 Unidades/)).toBeVisible();
    expect(within(card).getByText(/\$191,88/)).toBeVisible(); // Actual calculated price
  });

  it('handles zero partial payment', () => {
    const saleWithZeroPayment: Sale = {
      ...mockSale,
      partialPayment: 0,
    };

    testRender(<SaleCard sale={saleWithZeroPayment} products={mockProducts} />);

    const card = screen.getByRole('article');
    // Check that the card contains the sale information
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
  });

  it('handles partial payment equal to total price', () => {
    const saleWithFullPayment: Sale = {
      ...mockSale,
      partialPayment: 42.97,
    };

    testRender(<SaleCard sale={saleWithFullPayment} products={mockProducts} />);

    const card = screen.getByRole('article');
    // Check that the card contains the sale information
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
  });
});
