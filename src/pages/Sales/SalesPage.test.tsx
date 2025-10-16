import { describe, it, expect, afterEach } from 'vitest';
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import SalesPage from './';
import { axiosMock } from '@/test/setup';
import {
  mockSales,
  mockPaginatedResponse,
  mockCustomers,
  mockProducts,
} from '../../test/testData';
import { textConstants } from '@/lib/appConstants';

describe('SalesPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderSalesPage = () => {
    return testRender(<SalesPage />, {
      initialEntries: ['/sales'],
      mountPath: '/sales',
      routes: [
        {
          path: '/sales/:id',
          element: <div data-testid="dummy-sale-page">Sale Detail Page</div>,
        },
        {
          path: '/sales/new',
          element: <div data-testid="add-sale-page">Add Sale Page</div>,
        },
      ],
    });
  };

  it('fetches and displays sales from API', async () => {
    // Mock the sales.getAll API call
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    // Wait for sales to load and display
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Verify sales are rendered with basic information
    expect(within(cards[0]).getByText('Venta')).toBeVisible();
    expect(within(cards[0]).getByText('#1')).toBeVisible();
    expect(within(cards[0]).getByText(/John Doe/)).toBeVisible();
    expect(within(cards[0]).getAllByText(/31.98/)).toHaveLength(2);

    expect(within(cards[1]).getByText('Venta')).toBeVisible();
    expect(within(cards[1]).getByText('#2')).toBeVisible();
    expect(within(cards[1]).getByText(/Jane Smith/)).toBeVisible();
    expect(within(cards[1]).getByText(/39.98/)).toBeVisible(); // Only appears once for second sale (partialPayment > 0)

    expect(within(cards[2]).getByText('Venta')).toBeVisible();
    expect(within(cards[2]).getByText('#3')).toBeVisible();
    expect(within(cards[2]).getByText(/Bob Johnson/)).toBeVisible();
    expect(within(cards[2]).getAllByText(/23.98/)).toHaveLength(2);
  });

  it('displays empty state when no sales found', async () => {
    // Mock empty response
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse([], 0));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();
    const emptyTitle = await screen.findByText(
      textConstants.salePage.EMPTY_TITLE
    );
    const emptyDescription = screen.getByText(
      textConstants.salePage.EMPTY_DESCRIPTION
    );
    expect(emptyTitle).toBeVisible();
    expect(emptyDescription).toBeVisible();
  });

  it('displays loading spinner while fetching sales', async () => {
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    // Mock first page with first 10 sales
    axiosMock
      .onGet('/sales')
      .replyOnce(200, mockPaginatedResponse(mockSales, 20, 0));
    axiosMock
      .onGet('/sales')
      .replyOnce(200, mockPaginatedResponse(mockSales, 20, 10));

    renderSalesPage();

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
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    expect(screen.getByText(textConstants.salePage.TITLE)).toBeVisible();
    expect(screen.getByText(textConstants.salePage.DESCRIPTION)).toBeVisible();
  });

  it('renders top action buttons correctly', async () => {
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    const addSaleButton = screen.getByRole('link', {
      name: textConstants.addSale.ADD_SALE,
    });
    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    const resetFiltersButton = screen.getByRole('button', {
      name: textConstants.misc.RESET_FILTERS,
    });

    expect(addSaleButton).toBeVisible();
    expect(filtersButton).toBeVisible();
    expect(resetFiltersButton).toBeVisible();
  });

  it('navigates to add sale page when add sale button is clicked', async () => {
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    const addSaleButton = screen.getByRole('link', {
      name: textConstants.addSale.ADD_SALE,
    });
    await user.click(addSaleButton);

    expect(screen.getByTestId('add-sale-page')).toBeVisible();
  });

  it('opens filter modal when filters button is clicked', async () => {
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    await user.click(filtersButton);

    // Check if filter modal is visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(within(modal).getByText(textConstants.misc.FILTERS)).toBeVisible();
  });

  it('applies filters from modal correctly and resets filters when reset filters button is clicked', async () => {
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    // Mock initial load with all sales
    axiosMock
      .onGet('/sales')
      .replyOnce(200, mockPaginatedResponse(mockSales.slice(0, 10), 10));
    // Mock filtered results (only sales where owes=true)
    const filteredSales = mockSales.filter(sale => sale.owes === true);
    axiosMock
      .onGet('/sales')
      .replyOnce(
        200,
        mockPaginatedResponse(filteredSales, filteredSales.length)
      );
    // Mock reset filters - return all sales again
    axiosMock
      .onGet('/sales')
      .replyOnce(200, mockPaginatedResponse(mockSales.slice(0, 10), 10));

    renderSalesPage();

    // Wait for initial load
    await screen.findAllByRole('article');

    // Open filter modal
    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    await user.click(filtersButton);

    // Apply filters through modal - select "owes" filter
    // Get all radio buttons with "Sí" and find the one with name="owes"
    const owesRadioButtons = screen.getAllByRole('radio', {
      name: textConstants.misc.YES,
    });
    const owesYesRadioButton = owesRadioButtons.find(
      radio => radio.getAttribute('name') === 'owes'
    );
    await user.click(owesYesRadioButton!);

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    await user.click(applyButton);

    // Wait for filtered results - the component should reset and fetch filtered data
    const filteredCards = await screen.findAllByRole('article');
    expect(filteredCards).toHaveLength(4); // Filtered results show only 4 sales where owes=true

    // Reset filters
    const resetFiltersButton = screen.getByRole('button', {
      name: textConstants.misc.RESET_FILTERS,
    });
    await user.click(resetFiltersButton);

    // Wait for reset results
    const resetCards = await screen.findAllByRole('article');
    expect(resetCards).toHaveLength(10);
  });

  it('handles sale deletion correctly', async () => {
    const mockDeleteResponse = { success: true };
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    axiosMock.onDelete('/sales/1').reply(200, mockDeleteResponse);
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    // Wait for sales to load
    let cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Find and click delete button for first sale
    const firstCard = screen.getAllByRole('article')[0];
    const deleteButton = within(firstCard).getByRole('button', {
      name: 'Eliminar venta',
    });
    await user.click(deleteButton);

    // Confirm deletion in modal
    const confirmButton = screen.getByRole('button', {
      name: textConstants.misc.YES,
    });
    await user.click(confirmButton);

    // Wait for sales to load
    cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(9);
  });

  it('navigates to sale detail page when sale card is clicked', async () => {
    axiosMock.onGet('/sales').reply(200, mockPaginatedResponse(mockSales, 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    // Wait for sales to load
    await screen.findAllByRole('article');

    // Click on first sale card header (which should be a link)
    const firstCard = screen.getAllByRole('article')[0];
    const saleLink = within(firstCard).getByRole('link', {
      name: /Venta #1/,
    });
    await user.click(saleLink);

    // Verify navigation to sale detail page
    expect(screen.getByTestId('dummy-sale-page')).toBeVisible();
  });

  it('handles infinite scroll pagination correctly', async () => {
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    // Mock first page with first 10 sales
    axiosMock
      .onGet('/sales')
      .replyOnce(200, mockPaginatedResponse(mockSales.slice(0, 10), 20, 0));
    // Mock second page with additional sales
    const additionalSales = Array.from({ length: 10 }, (_, index) => ({
      _id: `${index + 11}`,
      saleId: index + 11,
      saleDate: '2024-01-25T00:00:00.000Z',
      customer: mockCustomers[index % mockCustomers.length],
      isThirteenDozen: index % 2 === 0,
      owes: index % 3 === 0,
      partialPayment: index % 3 === 0 ? 10.0 : 0,
      totalPrice: 30.98 + index,
      products: [
        {
          product: mockProducts[index % mockProducts.length],
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
      .onGet('/sales')
      .replyOnce(200, mockPaginatedResponse(additionalSales, 20, 10));

    renderSalesPage();

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
      .onGet('/sales')
      .reply(200, mockPaginatedResponse(mockSales.slice(0, 10), 10));
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call (SalesPage fetches products on mount)
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    await screen.findAllByRole('article');
    const pageContainer = await screen.findByTestId('page-container');

    // Scroll multiple times quickly
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });

    // Should have two API calls: one for customers and one for sales
    expect(axiosMock.history.get).toHaveLength(2);
  });

  it('handles API errors gracefully', async () => {
    axiosMock.onGet('/sales').reply(500, { message: 'Internal Server Error' });
    // Mock customers API call
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));
    // Mock products API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderSalesPage();

    // Should not crash and should show empty state
    const emptyTitle = await screen.findByText(
      textConstants.salePage.EMPTY_TITLE
    );
    expect(emptyTitle).toBeVisible();
  });
});
