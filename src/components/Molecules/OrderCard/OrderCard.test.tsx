import { screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { testRender } from '@/test/test-utils';
import OrderCard from './';
import type { Order, Product } from './OrderCard';

// Mock data for testing
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Wolf Snack Mix',
    presentation: 'Bolsa',
    weight: 500,
    basePrice: 12.99,
  },
  {
    _id: '2',
    name: 'Premium Treats',
    presentation: 'Caja',
    weight: 250,
    basePrice: 8.5,
  },
];

const mockOrder: Order = {
  _id: 'order1',
  orderId: 12345,
  orderDate: '2024-01-15T10:00:00.000Z',
  products: [
    { product: '1', quantity: 2 },
    { product: '2', quantity: 1 },
  ],
  totalPrice: 34.48,
};

const mockOrderSingleProduct: Order = {
  _id: 'order2',
  orderId: 67890,
  orderDate: '2024-01-20T14:30:00.000Z',
  products: [{ product: '1', quantity: 3 }],
  totalPrice: 38.97,
};

describe('OrderCard', () => {
  it('renders order information correctly', () => {
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    // Title is a heading level 2 starting with "Pedido" and includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Pedido/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('12.345');

    // Check order date is displayed in the card (RTL normalizes whitespace to single spaces)
    const card = screen.getByRole('article');
    expect(within(card).getByText(/15º enero 2024/)).toBeVisible();

    // Check products are displayed in the card
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/2 Unidades/)).toBeVisible();
    expect(within(card).getByText(/Premium Treats Caja/)).toBeVisible();
    expect(within(card).getByText(/250g/)).toBeVisible();
    expect(within(card).getByText(/1 Unidades/)).toBeVisible();

    // Check total price is displayed in the card
    expect(within(card).getByText(/\$34,48/)).toBeVisible();
  });

  it('renders single product order correctly', () => {
    testRender(
      <OrderCard order={mockOrderSingleProduct} products={mockProducts} />
    );

    // Title heading includes the formatted id
    const title = screen.getByRole('heading', { level: 2, name: /^Pedido/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('67.890');

    // Check order date is displayed in the card
    const card = screen.getByRole('article');
    expect(within(card).getByText(/20º enero 2024/)).toBeVisible();

    // Check single product is displayed in the card
    const singleProductCard = screen.getByRole('article');
    expect(
      within(singleProductCard).getByText(/Wolf Snack Mix Bolsa/)
    ).toBeVisible();
    expect(within(singleProductCard).getByText(/500g/)).toBeVisible();
    expect(within(singleProductCard).getByText(/3 Unidades/)).toBeVisible();

    // Check total price is displayed in the card (there are two instances: product total and order total)
    const totalPriceElements =
      within(singleProductCard).getAllByText(/\$38,97/);
    expect(totalPriceElements.length).toBeGreaterThan(0);
  });

  it('renders navigation header when navigate prop is true', () => {
    testRender(
      <OrderCard order={mockOrder} products={mockProducts} navigate={true} />
    );

    // The link accessible name includes the # prefix
    const orderLink = screen.getByRole('link', { name: /Pedido #12\.345/i });
    expect(orderLink).toBeVisible();
    expect(orderLink).toHaveAttribute('href', '/orders/order1');
  });

  it('renders plain text when navigate prop is false', () => {
    testRender(
      <OrderCard order={mockOrder} products={mockProducts} navigate={false} />
    );

    // Check that order ID is displayed as text, not a link
    const title = screen.getByRole('heading', { level: 2, name: /^Pedido/ });
    expect(title).toBeVisible();
    expect(title).toHaveTextContent('12.345');
    expect(
      screen.queryByRole('link', { name: /pedido #?12\.345/i })
    ).not.toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    const editButton = screen.getByRole('button', { name: /editar pedido/i });
    expect(editButton).toBeVisible();

    // Check that the button is inside a link with correct href
    const editLink = editButton.closest('a');
    expect(editLink).toHaveAttribute('href', '/orders/order1/edit');
  });

  it('renders delete button', () => {
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
    });
    expect(deleteButton).toBeVisible();
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
    });
    fireEvent.click(deleteButton);

    // Check that the modal is displayed
    expect(
      screen.getByText(/Confirmas que deseas eliminar el pedido/i)
    ).toBeVisible();

    // Check that modal title is visible
    expect(screen.getByText('Eliminar pedido')).toBeVisible();

    // Check that the modal contains the order ID and date
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('#12.345');
    expect(modal).toHaveTextContent('15º enero');
    expect(modal).toHaveTextContent('2024');
  });

  it('calls deleteOrder function when confirmed', () => {
    const mockDeleteOrder = vi.fn();
    testRender(
      <OrderCard
        order={mockOrder}
        products={mockProducts}
        deleteOrder={mockDeleteOrder}
      />
    );

    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteOrder).toHaveBeenCalledWith('order1');
  });

  it('closes modal when cancel button is clicked', () => {
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
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
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
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
    const customClass = 'custom-order-card';
    testRender(
      <OrderCard
        order={mockOrder}
        products={mockProducts}
        className={customClass}
      />
    );

    // Find the card element using its accessible role
    const cardElement = screen.getByRole('article');
    expect(cardElement).toBeVisible();

    // Verify it contains the order information
    expect(cardElement).toHaveTextContent(/Pedido 12\.345/);
  });

  it('handles order without deleteOrder function', () => {
    testRender(<OrderCard order={mockOrder} products={mockProducts} />);

    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    // Should not crash, just close the modal
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays formatted order ID with thousand separators', () => {
    const orderWithLongId: Order = {
      ...mockOrder,
      orderId: 123456789,
    };

    testRender(<OrderCard order={orderWithLongId} products={mockProducts} />);

    const title = screen.getByRole('heading', { level: 2, name: /^Pedido/ });
    expect(title).toBeVisible();
    // Use getAllByText to handle multiple instances
    const orderIdElements = screen.getAllByText(/123\.456\.789/);
    expect(orderIdElements.length).toBeGreaterThan(0);
  });

  it('displays formatted prices with thousand separators', () => {
    const orderWithHighPrice: Order = {
      ...mockOrder,
      totalPrice: 1234567.89,
    };

    testRender(
      <OrderCard order={orderWithHighPrice} products={mockProducts} />
    );

    expect(screen.getByText(/\$1\.234\.567,89/)).toBeVisible();
  });

  it('displays product total prices when not navigating', () => {
    testRender(
      <OrderCard order={mockOrder} products={mockProducts} navigate={false} />
    );

    // Check product total prices in the card
    const card = screen.getByRole('article');
    expect(
      within(card).getByText((_, node) => node?.textContent === '$25,98')
    ).toBeVisible();
    const smallPriceMatches = within(card).getAllByText(
      (_, node) => node?.textContent === '$8,5'
    );
    expect(smallPriceMatches.length).toBeGreaterThan(0);
  });

  it('does not display product total prices when navigating', () => {
    testRender(
      <OrderCard order={mockOrder} products={mockProducts} navigate={true} />
    );

    // Ensure product total price elements are not present
    expect(
      screen.queryByText((_, node) => node?.textContent === '$25,98')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText((_, node) => node?.textContent === '$8,50')
    ).not.toBeInTheDocument();
  });

  it('handles missing product information gracefully', () => {
    const orderWithMissingProduct: Order = {
      ...mockOrder,
      products: [
        { product: '1', quantity: 2 },
        { product: 'nonexistent', quantity: 1 },
      ],
    };

    testRender(
      <OrderCard order={orderWithMissingProduct} products={mockProducts} />
    );

    // Should still render the order without crashing
    const title = screen.getByRole('heading', { level: 2, name: /^Pedido/ });
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
    const orderWithZeroQuantity: Order = {
      ...mockOrder,
      products: [{ product: '1', quantity: 0 }],
    };

    testRender(
      <OrderCard order={orderWithZeroQuantity} products={mockProducts} />
    );

    const card = screen.getByRole('article');
    expect(within(card).getByText(/Wolf Snack Mix Bolsa/)).toBeVisible();
    expect(within(card).getByText(/500g/)).toBeVisible();
    expect(within(card).getByText(/0 Unidades/)).toBeVisible();
  });

  it('displays correct date format', () => {
    const orderWithSpecificDate: Order = {
      ...mockOrder,
      orderDate: '2024-12-25T00:00:00.000Z',
    };

    testRender(
      <OrderCard order={orderWithSpecificDate} products={mockProducts} />
    );

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
});
