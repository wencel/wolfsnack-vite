import { describe, it, expect, afterEach } from 'vitest';
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import CustomersPage from './';
import { axiosMock } from '@/test/setup';
import { mockCustomers, mockPaginatedResponse } from '../../test/testData';
import { textConstants } from '@/lib/appConstants';

describe('CustomersPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderCustomersPage = () => {
    return testRender(<CustomersPage />, {
      initialEntries: ['/customers'],
      mountPath: '/customers',
      routes: [
        {
          path: '/customers/:id',
          element: (
            <div data-testid="dummy-customer-page">Customer Detail Page</div>
          ),
        },
        {
          path: '/customers/new',
          element: <div data-testid="add-customer-page">Add Customer Page</div>,
        },
      ],
    });
  };

  it('fetches and displays customers from API', async () => {
    // Mock the customers.getAll API call
    axiosMock
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    // Wait for customers to load and display
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Verify first customer details
    expect(within(cards[0]).getByText('Test Store 1')).toBeVisible();
    expect(within(cards[0]).getByText('John Doe')).toBeVisible();
    expect(
      within(cards[0]).getByText('123 Main St, Test City, Test Town')
    ).toBeVisible();
    expect(within(cards[0]).getByText('john@test.com')).toBeVisible();
    expect(within(cards[0]).getByText('(123)-555-0101')).toBeVisible();
    expect(within(cards[0]).getByText('(555)-010-2')).toBeVisible();
    expect(within(cards[0]).getByText('1.234.567.890')).toBeVisible();

    expect(within(cards[1]).getByText('Test Store 2')).toBeVisible();
    expect(within(cards[1]).getByText('Jane Smith')).toBeVisible();
    expect(
      within(cards[1]).getByText('456 Oak Ave, Another City, Another Town')
    ).toBeVisible();
    expect(within(cards[1]).getByText('jane@test.com')).toBeVisible();
    expect(within(cards[1]).getByText('(555)-020-2')).toBeVisible();

    expect(within(cards[2]).getByText('Test Store 3')).toBeVisible();
    expect(within(cards[2]).getByText('Bob Johnson')).toBeVisible();
    expect(
      within(cards[2]).getByText('789 Pine Rd, Third City, Third Town')
    ).toBeVisible();
    expect(within(cards[2]).getByText('bob@test.com')).toBeVisible();
    expect(within(cards[2]).getByText('(555)-030-3')).toBeVisible();
  });

  it('displays empty state when no customers found', async () => {
    // Mock empty response
    axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));

    renderCustomersPage();
    const emptyTitle = await screen.findByText(
      textConstants.customerPage.EMPTY_TITLE
    );
    const emptyDescription = screen.getByText(
      textConstants.customerPage.EMPTY_DESCRIPTION
    );
    expect(emptyTitle).toBeVisible();
    expect(emptyDescription).toBeVisible();
  });

  it('displays loading spinner while fetching customers', async () => {
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers, 20, 0));
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers, 20, 10));

    renderCustomersPage();

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
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    expect(screen.getByText(textConstants.customerPage.TITLE)).toBeVisible();
    expect(
      screen.getByText(textConstants.customerPage.DESCRIPTION)
    ).toBeVisible();
  });

  it('renders top action buttons correctly', async () => {
    axiosMock
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    const addCustomerButton = screen.getByRole('link', {
      name: textConstants.addCustomer.ADD_CUSTOMER,
    });
    const filtersButton = screen.getByRole('button', {
      name: /Filtros de busqueda/,
    });
    const resetFiltersButton = screen.getByRole('button', {
      name: /Limpiar filtros/,
    });

    expect(addCustomerButton).toBeVisible();
    expect(filtersButton).toBeVisible();
    expect(resetFiltersButton).toBeVisible();
  });

  it('navigates to add customer page when add customer button is clicked', async () => {
    axiosMock
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    const addCustomerButton = screen.getByRole('link', {
      name: textConstants.addCustomer.ADD_CUSTOMER,
    });
    await user.click(addCustomerButton);

    expect(screen.getByTestId('add-customer-page')).toBeVisible();
  });

  it('opens filter modal when filters button is clicked', async () => {
    axiosMock
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

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
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers, 10));
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers.slice(0, 5), 5));
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    // Open filter modal
    const filtersButton = screen.getByRole('button', {
      name: textConstants.misc.FILTERS,
    });
    await user.click(filtersButton);

    // Apply filters through modal
    const searchInput = screen.getByLabelText('Buscar cliente');
    const sortSelect = screen.getByLabelText('Ordernar la lista por');
    const directionSelect = screen.getByLabelText('Dirección de ordenamiento');

    await user.clear(searchInput);
    await user.type(searchInput, 'test search');
    await user.selectOptions(sortSelect, 'name');
    await user.selectOptions(directionSelect, 'desc');

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    await user.click(applyButton);

    expect(screen.getAllByRole('article')).toHaveLength(5);

    // Reset filters
    const resetFiltersButton = screen.getByRole('button', {
      name: textConstants.misc.RESET_FILTERS,
    });
    await user.click(resetFiltersButton);
    expect(screen.getAllByRole('article')).toHaveLength(10);
  });

  it('handles customer deletion correctly', async () => {
    const mockDeleteResponse = { success: true };
    axiosMock
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));
    axiosMock.onDelete('/customers/1').reply(200, mockDeleteResponse);

    renderCustomersPage();

    // Wait for customers to load
    let cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Find and click delete button for first customer
    const firstCard = screen.getAllByRole('article')[0];
    const deleteButton = within(firstCard).getByRole('button', {
      name: 'Eliminar cliente',
    });
    await user.click(deleteButton);

    // Confirm deletion in modal
    const confirmButton = screen.getByRole('button', {
      name: textConstants.misc.YES,
    });
    await user.click(confirmButton);

    // Wait for customers to load
    cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(9);
  });

  it('navigates to customer detail page when customer card is clicked', async () => {
    axiosMock
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    // Wait for customers to load
    await screen.findAllByRole('article');

    // Click on first customer card header (which should be a link)
    const firstCard = screen.getAllByRole('article')[0];
    const customerLink = within(firstCard).getByRole('link', {
      name: 'Test Store 1',
    });
    await user.click(customerLink);

    // Verify navigation to customer detail page
    expect(screen.getByTestId('dummy-customer-page')).toBeVisible();
  });

  it('handles infinite scroll pagination correctly', async () => {
    // Mock first page
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers.slice(0, 10), 20, 0));
    // Mock second page
    axiosMock
      .onGet('/customers')
      .replyOnce(200, mockPaginatedResponse(mockCustomers, 20, 10));

    renderCustomersPage();

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
      .onGet('/customers')
      .reply(200, mockPaginatedResponse(mockCustomers, 10));

    renderCustomersPage();

    await screen.findAllByRole('article');
    const pageContainer = await screen.findByTestId('page-container');

    // Scroll multiple times quickly
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });

    // Should only have one API call since there are only 10 customers
    expect(axiosMock.history.get).toHaveLength(1);
  });

  it('handles API errors gracefully', async () => {
    axiosMock
      .onGet('/customers')
      .reply(500, { message: 'Internal Server Error' });

    renderCustomersPage();

    // Should not crash and should show empty state
    const emptyTitle = await screen.findByText(
      textConstants.customerPage.EMPTY_TITLE
    );
    expect(emptyTitle).toBeVisible();
  });
});
