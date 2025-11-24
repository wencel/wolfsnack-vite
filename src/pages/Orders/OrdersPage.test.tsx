import { describe, it, expect, afterEach } from 'vitest';
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import OrdersPage from './';
import { axiosMock } from '@/test/setup';
import {
  mockOrders,
  mockPaginatedResponse,
  mockProducts,
} from '../../test/testData';
import { textConstants } from '@/lib/appConstants';

describe('OrdersPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderOrdersPage = () => {
    return testRender(<OrdersPage />, {
      initialEntries: ['/orders'],
      mountPath: '/orders',
      routes: [
        {
          path: '/orders/:id',
          element: <div data-testid="dummy-order-page">Order Detail Page</div>,
        },
        {
          path: '/orders/new',
          element: <div data-testid="add-order-page">Add Order Page</div>,
        },
      ],
    });
  };

  it('fetches and displays orders from API', async () => {
    // Mock the orders.getAll API call
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    // Wait for orders to load and display
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Verify orders are rendered with basic information
    expect(
      within(cards[0]).getByRole('heading', { name: /Pedido #1/ })
    ).toBeVisible();
  });

  it('displays empty state when no orders found', async () => {
    // Mock empty response
    axiosMock.onGet('/orders').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderOrdersPage();
    const emptyTitle = await screen.findByRole('heading', {
      name: textConstants.orderPage.EMPTY_TITLE,
    });
    expect(emptyTitle).toBeVisible();
    // Description is not in a semantic element, but we can verify it exists
    expect(
      screen.getByText(textConstants.orderPage.EMPTY_DESCRIPTION)
    ).toBeVisible();
  });

  it('displays loading spinner while fetching orders', async () => {
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    // Mock first page with first 10 orders
    axiosMock
      .onGet('/orders')
      .replyOnce(200, mockPaginatedResponse(mockOrders, 20, 0));
    axiosMock
      .onGet('/orders')
      .replyOnce(200, mockPaginatedResponse(mockOrders, 20, 10));

    renderOrdersPage();

    let cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);
    const pageContainer = await screen.findByTestId('page-container');
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeVisible();
    await waitForElementToBeRemoved(loadingSpinner);
    cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(20);
  });

  it('displays page title and description correctly', async () => {
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    expect(
      screen.getByRole('heading', { name: textConstants.orderPage.TITLE })
    ).toBeVisible();
    // Description is not in a semantic element, but we can verify it exists
    expect(screen.getByText(textConstants.orderPage.DESCRIPTION)).toBeVisible();
  });

  it('renders top action buttons correctly', async () => {
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    const addOrderButton = screen.getByRole('link', {
      name: textConstants.addOrder.ADD_ORDER,
    });
    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    const resetFiltersButton = screen.getByRole('button', {
      name: textConstants.misc.RESET_FILTERS,
    });

    expect(addOrderButton).toBeVisible();
    expect(filtersButton).toBeVisible();
    expect(resetFiltersButton).toBeVisible();
  });

  it('navigates to add order page when add order button is clicked', async () => {
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    const addOrderButton = screen.getByRole('link', {
      name: textConstants.addOrder.ADD_ORDER,
    });
    await user.click(addOrderButton);

    expect(screen.getByTestId('add-order-page')).toBeVisible();
  });

  it('opens filter modal when filters button is clicked', async () => {
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    await user.click(filtersButton);

    // Check if filter modal is visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(
      within(modal).getByRole('heading', { name: textConstants.misc.FILTERS })
    ).toBeVisible();
  });

  it('applies filters from modal correctly and resets filters when reset filters button is clicked', async () => {
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    // Mock initial load with all orders
    axiosMock
      .onGet('/orders')
      .replyOnce(200, mockPaginatedResponse(mockOrders.slice(0, 10), 10));
    // Mock filtered results (orders within date range)
    const filteredOrders = mockOrders.slice(0, 5);
    axiosMock
      .onGet('/orders')
      .replyOnce(
        200,
        mockPaginatedResponse(filteredOrders, filteredOrders.length)
      );
    // Mock reset filters - return all orders again
    axiosMock
      .onGet('/orders')
      .replyOnce(200, mockPaginatedResponse(mockOrders.slice(0, 10), 10));

    renderOrdersPage();

    // Wait for initial load
    await screen.findAllByRole('article');

    // Open filter modal
    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    await user.click(filtersButton);

    // Set date range by typing into the date input field
    const modal = screen.getByRole('dialog');
    // react-datepicker creates a textbox input for the date range
    const dateInput = within(modal).getByRole('textbox');
    // Clear and type date range in the format dd/MM/yyyy
    // For range picker, type start date first
    await user.clear(dateInput);
    await user.type(dateInput, '01/01/2024');
    // Type end date - react-datepicker range mode may require tab or clicking to set end date
    // But we can also try typing the full range string
    await user.type(dateInput, ' - 10/01/2024');

    // Apply filters
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    await user.click(applyButton);

    // Wait for filtered results - the component should reset and fetch filtered data
    const filteredCards = await screen.findAllByRole('article');
    expect(filteredCards).toHaveLength(5);

    // Reset filters
    const resetFiltersButton = screen.getByRole('button', {
      name: textConstants.misc.RESET_FILTERS,
    });
    await user.click(resetFiltersButton);

    // Wait for reset results - this should trigger a new API call
    const resetCards = await screen.findAllByRole('article');
    expect(resetCards).toHaveLength(10);
  });

  it('handles order deletion correctly', async () => {
    const mockDeleteResponse = { success: true };
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    axiosMock.onDelete('/orders/1').reply(200, mockDeleteResponse);
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    // Wait for orders to load
    let cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Find and click delete button for first order
    const firstCard = screen.getAllByRole('article')[0];
    const deleteButton = within(firstCard).getByRole('button', {
      name: 'Eliminar pedido',
    });
    await user.click(deleteButton);

    // Confirm deletion in modal
    const confirmButton = screen.getByRole('button', {
      name: textConstants.misc.YES,
    });
    await user.click(confirmButton);

    // Wait for orders to load
    cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(9);
  });

  it('navigates to order detail page when order card is clicked', async () => {
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders, 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    // Wait for orders to load
    await screen.findAllByRole('article');

    // Click on first order card header (which should be a link)
    const firstCard = screen.getAllByRole('article')[0];
    const orderLink = within(firstCard).getByRole('link', {
      name: /Pedido #1/,
    });
    await user.click(orderLink);

    // Verify navigation to order detail page
    expect(screen.getByTestId('dummy-order-page')).toBeVisible();
  });

  it('handles infinite scroll pagination correctly', async () => {
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    // Mock first page with first 10 orders
    axiosMock
      .onGet('/orders')
      .replyOnce(200, mockPaginatedResponse(mockOrders.slice(0, 10), 20, 0));
    // Mock second page with additional orders
    const additionalOrders = Array.from({ length: 10 }, (_, index) => ({
      _id: `${index + 11}`,
      orderId: index + 11,
      orderDate: '2024-01-25T00:00:00.000Z',
      totalPrice: 30.98 + index,
      products: [
        {
          product: `${(index % mockProducts.length) + 1}`,
          price: 15.99 + index,
          quantity: 2,
          totalPrice: 30.98 + index,
        },
      ],
      user: 'user1',
      createdAt: '2024-01-25T00:00:00.000Z',
      updatedAt: '2024-01-25T00:00:00.000Z',
    }));
    axiosMock
      .onGet('/orders')
      .replyOnce(200, mockPaginatedResponse(additionalOrders, 20, 10));

    renderOrdersPage();

    // Wait for first page to load
    let cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Scroll to trigger pagination
    const pageContainer = await screen.findByTestId('page-container');
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });

    // Wait for second page to load
    await waitForElementToBeRemoved(() => screen.getByRole('status'));
    cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(20);
  });

  it('prevents duplicate API calls during pagination', async () => {
    axiosMock
      .onGet('/orders')
      .reply(200, mockPaginatedResponse(mockOrders.slice(0, 10), 10));
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    await screen.findAllByRole('article');
    const pageContainer = await screen.findByTestId('page-container');

    // Scroll multiple times quickly
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });

    // Should have two API calls: one for products and one for orders
    expect(axiosMock.history.get).toHaveLength(2);
  });

  it('handles API errors gracefully', async () => {
    axiosMock.onGet('/orders').reply(500, { message: 'Internal Server Error' });
    // Mock products API call
    axiosMock
      .onGet('/products')
      .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

    renderOrdersPage();

    // Should not crash and should show empty state
    const emptyTitle = await screen.findByRole('heading', {
      name: textConstants.orderPage.EMPTY_TITLE,
    });
    expect(emptyTitle).toBeVisible();
  });
});
