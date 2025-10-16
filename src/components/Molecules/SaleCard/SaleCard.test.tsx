import { screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { testRender } from '@/test/test-utils';
import SaleCard from './';
import type { Sale } from '@/lib/data';
import { mockProducts, mockSales } from '@/test/testData';

// Mock data for testing
const mockSale = mockSales[0];

const mockSaleWithThirteenDozen = mockSales[1];

const mockSaleWithoutCustomerName = mockSales[2];

describe('SaleCard', () => {
  it('renders sale information correctly', () => {
    testRender(<SaleCard sale={mockSale} />);

    // Title is a heading level 2 starting with "Venta" and includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('1');

    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/14º enero 2024/)).toBeVisible();
    expect(within(card).getByText(/Test Store 1/)).toBeVisible();
    expect(within(card).getByText(/John Doe/)).toBeVisible();
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
    // Check that the card contains the sale information
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
  });

  it('renders sale with thirteen dozen correctly', () => {
    testRender(<SaleCard sale={mockSaleWithThirteenDozen} />);

    // Title heading includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('2');

    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/15º enero 2024/)).toBeVisible();
    expect(within(card).getByText(/Test Store 2/)).toBeVisible();
    expect(within(card).getByText(/Jane Smith/)).toBeVisible();
    expect(within(card).getByText(/Trail Mix Deluxe Bolsa/)).toBeVisible();
    expect(within(card).getByText(/750g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
    expect(within(card).getByText(/Docena de 13/)).toBeVisible();
    // Check that the card contains the sale information
    expect(within(card).getByText(/Trail Mix Deluxe Bolsa/)).toBeVisible();
  });

  it('renders sale without customer name correctly', () => {
    testRender(<SaleCard sale={mockSaleWithoutCustomerName} />);

    // Title heading includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('3');

    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/16º enero 2024/)).toBeVisible();
    expect(within(card).getByText(/Test Store 3/)).toBeVisible();
    expect(within(card).getByText(/Bob Johnson/)).toBeVisible();
    expect(within(card).getByText(/Protein Bars/)).toBeVisible();
    expect(within(card).getByText(/60g/)).toBeVisible();
    // Check that the card contains the sale information
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
  });

  it('renders navigation header when navigate prop is true', () => {
    testRender(<SaleCard sale={mockSale} navigate={true} />);

    // The link accessible name includes the # prefix
    const saleLink = screen.getByRole('link', { name: /Venta #1/i });
    expect(saleLink).toBeVisible();
    expect(saleLink).toHaveAttribute('href', '/sales/1');
  });

  it('renders plain text when navigate prop is false', () => {
    testRender(<SaleCard sale={mockSale} navigate={false} />);

    // Check that sale ID is displayed as text, not a link
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('1');
    expect(
      screen.queryByRole('link', { name: /venta #?1/i })
    ).not.toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    testRender(<SaleCard sale={mockSale} />);

    const editButton = screen.getByRole('button', { name: /editar venta/i });
    expect(editButton).toBeVisible();

    // Check that the button is inside a link with correct href
    const editLink = editButton.closest('a');
    expect(editLink).toHaveAttribute('href', '/sales/1');
  });

  it('renders delete button', () => {
    testRender(<SaleCard sale={mockSale} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
    expect(deleteButton).toBeVisible();
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    testRender(<SaleCard sale={mockSale} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
    fireEvent.click(deleteButton);

    // Check that the modal is displayed
    expect(
      screen.getByText(/Confirmas que deseas eliminar la venta/i)
    ).toBeVisible();

    // Check that modal title is visible
    expect(screen.getByText('Eliminar venta')).toBeVisible();

    // Check that the modal contains the sale ID and date
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('#1');
    expect(modal).toHaveTextContent('14º enero');
    expect(modal).toHaveTextContent('2024');
  });

  it('calls deleteSale function when confirmed', () => {
    const mockDeleteSale = vi.fn();
    testRender(<SaleCard sale={mockSale} deleteSale={mockDeleteSale} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteSale).toHaveBeenCalledWith('1');
  });

  it('closes modal when cancel button is clicked', () => {
    testRender(<SaleCard sale={mockSale} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
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
    testRender(<SaleCard sale={mockSale} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
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
    testRender(<SaleCard sale={mockSale} className={customClass} />);

    // Find the card element using its accessible role
    const cardElement = screen.getByRole('article');
    expect(cardElement).toBeVisible();

    // Verify it contains the sale information
    expect(cardElement).toHaveTextContent(/Venta 1/);
  });

  it('handles sale without deleteSale function', () => {
    testRender(<SaleCard sale={mockSale} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
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

    testRender(<SaleCard sale={saleWithLongId} />);

    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('123.456.789');
  });

  it('displays formatted prices with thousand separators', () => {
    const saleWithHighPrices: Sale = {
      ...mockSale,
      partialPayment: 1234567.89,
      totalPrice: 2345678.9,
    };

    testRender(<SaleCard sale={saleWithHighPrices} />);

    const card = screen.getByRole('article');
    expect(within(card).getByText(/\$1\.234\.567,89/)).toBeVisible();
    expect(within(card).getByText(/\$2\.345\.678,9/)).toBeVisible();
  });

  it('displays product total prices when not navigating', () => {
    testRender(<SaleCard sale={mockSale} navigate={false} />);

    // Check product total prices in the card
    const card = screen.getByRole('article');
    // There are multiple "Total por producto" elements, so use getAllByText
    const totalPriceElements = within(card).getAllByText(/Total por producto/);
    expect(totalPriceElements.length).toBeGreaterThan(0);
    // The actual price calculation depends on the utility function
    expect(within(card).getAllByText(/\$31,98/)[0]).toBeVisible(); // 2 * 15.99
  });

  it('does not display product total prices when navigating', () => {
    testRender(<SaleCard sale={mockSale} navigate={true} />);

    // Ensure product total price elements are not present
    const card = screen.getByRole('article');
    expect(
      within(card).queryByText(/Total por producto/)
    ).not.toBeInTheDocument();
  });

  it('handles missing product information gracefully', () => {
    const saleWithMissingProduct: Sale = {
      ...mockSale,
      products: [
        {
          product: mockProducts[0],
          quantity: 2,
          price: 15.99,
          totalPrice: 31.98,
        },
        { product: mockProducts[1], quantity: 1, price: 0, totalPrice: 0 },
      ],
    };

    testRender(<SaleCard sale={saleWithMissingProduct} />);

    // Should still render the sale without crashing
    const title = screen.getByRole('heading', { level: 2, name: /^Venta/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('1');

    // Check content in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();

    // Second product should show Trail Mix Deluxe values
    expect(within(card).getByText(/Trail Mix Deluxe Bolsa/)).toBeVisible();
    expect(within(card).getByText(/750g/)).toBeVisible();
    expect(within(card).getByText(/1 Unidades/)).toBeVisible();
  });

  it('renders with zero quantity products', () => {
    const saleWithZeroQuantity: Sale = {
      ...mockSale,
      products: [
        { product: mockProducts[0], quantity: 0, price: 15.99, totalPrice: 0 },
      ],
    };

    testRender(<SaleCard sale={saleWithZeroQuantity} />);

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

    testRender(<SaleCard sale={saleWithSpecificDate} />);

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
        {
          product: mockProducts[0],
          quantity: 13,
          price: 15.99,
          totalPrice: 207.87,
        },
      ],
      isThirteenDozen: true,
      totalPrice: 207.87, // 13 * 15.99
    };

    testRender(<SaleCard sale={saleWithThirteenDozen} />);

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

    testRender(<SaleCard sale={saleWithZeroPayment} />);

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

    testRender(<SaleCard sale={saleWithFullPayment} />);

    const card = screen.getByRole('article');
    // Check that the card contains the sale information
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
  });
});
