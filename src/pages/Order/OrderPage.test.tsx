import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import OrderPage from './';
import { axiosMock } from '@/test/setup';
import {
  mockOrders,
  mockProducts,
  mockPaginatedResponse,
} from '../../test/testData';
import { textConstants } from '@/lib/appConstants';

describe('OrderPage', () => {
  beforeEach(() => {
    // Mock window.history.back
    window.history.back = vi.fn();
  });

  afterEach(() => {
    axiosMock.reset();
    vi.clearAllMocks();
  });

  const renderOrderPage = (orderId: string = '1') => {
    return testRender(<OrderPage />, {
      initialEntries: [`/orders/${orderId}`],
      mountPath: '/orders/:id',
    });
  };

  it('fetches and displays order details from API', async () => {
    // Mock the order fetch API call
    axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    // Wait for loading to complete and order to display
    const article = await screen.findByRole('article');

    // Verify order details are rendered
    expect(
      within(article).getByRole('heading', { level: 2, name: /^Pedido 1/ })
    ).toBeVisible();
  });

  it('displays loading spinner while fetching order', async () => {
    // Mock a delayed response
    axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    // Should show loading initially
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeVisible();

    // Wait for loading to complete
    await screen.findByRole('heading', { level: 2, name: /Pedido/ });
  });

  it('renders top action buttons correctly', async () => {
    axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    await screen.findByRole('heading', { level: 2, name: /Pedido/ });

    const backButton = screen.getByRole('link', {
      name: textConstants.misc.BACK,
    });
    const addOrderButton = screen.getByRole('link', {
      name: textConstants.addOrder.ADD_ORDER,
    });

    expect(backButton).toBeVisible();
    expect(addOrderButton).toBeVisible();
    expect(backButton).toHaveAttribute('href', '/orders');
    expect(addOrderButton).toHaveAttribute('href', '/orders/new');
  });

  it('displays order card with correct information', async () => {
    axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    const article = await screen.findByRole('article');

    // Check order card content
    expect(
      screen.getByRole('heading', { level: 2, name: /Pedido 1/ })
    ).toBeVisible();

    // Check product information - using text queries as content is in divs without semantic roles
    expect(within(article).getByText(/Wolf Snack Mix/)).toBeVisible();
    expect(within(article).getByText(/Bolsa/)).toBeVisible();
    expect(within(article).getByText(/500g/)).toBeVisible();
    expect(within(article).getByText(/2 Unidades/)).toBeVisible();

    // Check pricing information using data-testid
    const productTotalPrice = within(article).getByTestId(
      'product-total-price'
    );
    const orderTotalPrice = within(article).getByTestId('order-total-price');
    expect(productTotalPrice).toBeVisible();
    expect(orderTotalPrice).toBeVisible();
    // Verify actual price values are displayed
    // NumericFormat displays prices with $ prefix, comma as decimal separator
    // mockOrders[0].totalPrice is 25.98, displayed as "$25,98"
    expect(productTotalPrice).toHaveTextContent('$25,98');
    expect(orderTotalPrice).toHaveTextContent('$25,98');
  });

  it('handles API errors gracefully', async () => {
    axiosMock
      .onGet('/orders/1')
      .reply(500, { message: 'Internal Server Error' });
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    // Should not crash and should show loading state
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeVisible();
  });

  it('displays order with product information from API', async () => {
    // Order data from API should already include product IDs
    axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    const article = await screen.findByRole('article');

    // Should display product information from order data
    expect(
      screen.getByRole('heading', { level: 2, name: /Pedido 1/ })
    ).toBeVisible();
    // Using text queries as product information is in divs without semantic roles
    expect(within(article).getByText(/Wolf Snack Mix/)).toBeVisible();
    expect(within(article).getByText(/Bolsa/)).toBeVisible();
  });

  it('handles delete order functionality and navigates back', async () => {
    axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
    axiosMock.onDelete('/orders/1').reply(200);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    await screen.findByRole('heading', { level: 2, name: /Pedido/ });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', {
      name: /eliminar pedido/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    // Verify window.history.back was called
    expect(window.history.back).toHaveBeenCalled();
  });

  it('displays order even when order has no products', async () => {
    const orderWithoutProducts = {
      ...mockOrders[0],
      products: [],
    };

    axiosMock.onGet('/orders/1').reply(200, orderWithoutProducts);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('1');

    // Should still display order information even without products
    const heading = await screen.findByRole('heading', {
      level: 2,
      name: /Pedido 1/,
    });
    expect(heading).toBeVisible();
  });

  it('displays not found message when order does not exist', async () => {
    axiosMock.onGet('/orders/999').reply(404, { message: 'Order not found' });
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrderPage('999');

    // Wait for loading to complete
    const notFoundHeading = await screen.findByRole('heading', {
      name: textConstants.misc.ORDER_NOT_FOUND,
    });
    expect(notFoundHeading).toBeVisible();
    // Description is not in a semantic element, but we can verify it exists
    expect(
      screen.getByText(textConstants.misc.ORDER_NOT_FOUND_DESCRIPTION)
    ).toBeVisible();
  });
});
