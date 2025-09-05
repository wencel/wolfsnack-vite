import { describe, it, expect, afterEach } from 'vitest';
import { screen, within, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import CustomerPage from './';
import { axiosMock } from '@/test/setup';
import { mockCustomers, createCustomerWithMissingFields, createCustomerWithPartialFields } from '@/test/testData';
import { textConstants } from '@/lib/appConstants';

describe('CustomerPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderCustomerPage = (customerId: string = '1') => {
    return testRender(<CustomerPage />, {
      initialEntries: [`/customers/${customerId}`],
      mountPath: '/customers/:id',
      routes: [
        { path: '/customers', element: <div data-testid="customers-page">Customers Page</div> },
        { path: '/customers/new', element: <div data-testid="add-customer-page">Add Customer Page</div> }
      ]
    });
  };

  describe('Component rendering with valid customer ID', () => {
    it('renders page container and top actions when customer ID is provided', () => {
      // Mock the customer fetch API call
      axiosMock.onGet('/customers/1').reply(200, mockCustomers[0]);

      renderCustomerPage('1');

      expect(screen.getByTestId('page-container')).toBeVisible();
      expect(screen.getByRole('link', { name: textConstants.misc.BACK })).toBeVisible();
      expect(screen.getByRole('link', { name: textConstants.addCustomer.ADD_CUSTOMER })).toBeVisible();
    });

    it('displays customer card when customer data is loaded', async () => {
      const mockCustomer = mockCustomers[0];
      // Mock the customer fetch API call
      axiosMock.onGet('/customers/1').reply(200, mockCustomer);

      renderCustomerPage('1');

      // Wait for customer data to load
      const customerCard = await screen.findByRole('article');
      
      // Assert all required fields are present
      expect(within(customerCard).getByText(mockCustomer.storeName)).toBeVisible();
      expect(within(customerCard).getByText(mockCustomer.name!)).toBeVisible();
      // Address is displayed as concatenated string with locality and town
      expect(within(customerCard).getByText(/123 Main St.*Test City.*Test Town/)).toBeVisible();
      // Phone number is formatted
      expect(within(customerCard).getByText('(123)-555-0101')).toBeVisible();
      
      // Assert optional fields are present when provided
      expect(within(customerCard).getByText(mockCustomer.email!)).toBeVisible();
      expect(within(customerCard).getByText('(555)-010-2')).toBeVisible(); // Formatted secondary phone
      // Locality and town are displayed as part of the address string
      expect(within(customerCard).getByText('1.234.567.890')).toBeVisible(); // Formatted ID number
    });

    it('displays customer card with missing optional fields', async () => {
      const customerWithMissingFields = createCustomerWithMissingFields();
      // Mock the customer fetch API call
      axiosMock.onGet('/customers/1').reply(200, customerWithMissingFields);

      renderCustomerPage('1');

      // Wait for customer data to load
      const customerCard = await screen.findByRole('article');
      
      // Assert required fields are present
      expect(within(customerCard).getByText(customerWithMissingFields.storeName)).toBeVisible();
      expect(within(customerCard).getByText(customerWithMissingFields.name!)).toBeVisible();
      // Address is displayed as just the address when locality/town are missing
      expect(within(customerCard).getByText(customerWithMissingFields.address)).toBeVisible();
      // Phone number is formatted
      expect(within(customerCard).getByText('(123)-555-0101')).toBeVisible();
      
      // Assert optional fields are not displayed when missing
      expect(within(customerCard).queryByText('john@test.com')).not.toBeInTheDocument();
      expect(within(customerCard).queryByText('(555)-010-2')).not.toBeInTheDocument();
      expect(within(customerCard).queryByText('Test City')).not.toBeInTheDocument();
      expect(within(customerCard).queryByText('Test Town')).not.toBeInTheDocument();
      expect(within(customerCard).queryByText('1.234.567.890')).not.toBeInTheDocument();
    });

    it('displays customer card with only some optional fields', async () => {
      const customerWithPartialFields = createCustomerWithPartialFields();
      // Mock the customer fetch API call
      axiosMock.onGet('/customers/1').reply(200, customerWithPartialFields);

      renderCustomerPage('1');

      // Wait for customer data to load
      const customerCard = await screen.findByRole('article');
      
      // Assert required fields are present
      expect(within(customerCard).getByText(customerWithPartialFields.storeName)).toBeVisible();
      expect(within(customerCard).getByText(customerWithPartialFields.name!)).toBeVisible();
      // Address is displayed as concatenated string with locality when town is missing
      expect(within(customerCard).getByText(/123 Main St.*Test City/)).toBeVisible();
      // Phone number is formatted
      expect(within(customerCard).getByText('(123)-555-0101')).toBeVisible();
      
      // Assert present optional fields are displayed
      expect(within(customerCard).getByText(customerWithPartialFields.email!)).toBeVisible();
      // Locality is displayed as part of the address string
      
      // Assert missing optional fields are not displayed
      expect(within(customerCard).queryByText('(555)-010-2')).not.toBeInTheDocument();
      expect(within(customerCard).queryByText('Test Town')).not.toBeInTheDocument();
      expect(within(customerCard).queryByText('1.234.567.890')).not.toBeInTheDocument();
    });
  });

  describe('Error state when no customer ID is provided', () => {
    it('displays error message when no customer ID is provided', () => {
      testRender(<CustomerPage />, {
        initialEntries: ['/customers/'],
        mountPath: '/customers/',
      });

      expect(screen.getByText('Error')).toBeVisible();
      expect(screen.getByText(textConstants.misc.NO_CUSTOMER_ID)).toBeVisible();
    });
  });

  describe('Customer not found state', () => {
    it('displays not found message when customer is not found and not loading', async () => {
      // Mock API call that returns 404 or empty response
      axiosMock.onGet('/customers/999').reply(404, { message: 'Customer not found' });

      renderCustomerPage('999');

      // Wait for the API call to complete and show not found message
      await screen.findByText(textConstants.misc.CUSTOMER_NOT_FOUND);
      expect(screen.getByText(textConstants.misc.CUSTOMER_NOT_FOUND_DESCRIPTION)).toBeVisible();
    });
  });

  describe('Loading state and data fetching behavior', () => {
    it('shows loading state while fetching customer data', async () => {
      // Mock a delayed API response
      axiosMock.onGet('/customers/999').reply(() => new Promise(resolve => 
        setTimeout(() => resolve([200, mockCustomers[0]]), 100)
      ));

      renderCustomerPage('999');

      // Should show loading spinner
      const loadingSpinner = screen.getByRole('status');
      expect(loadingSpinner).toBeVisible();
    
      
      // Wait for loading to complete
      await waitForElementToBeRemoved(loadingSpinner);

      // Should show customer card after loading
      const customerCard = await screen.findByRole('article');
      expect(within(customerCard).getByText(mockCustomers[0].storeName)).toBeVisible();
    });
  });

  describe('Navigation buttons functionality', () => {
    it('back button navigates to customers page', async () => {
      // Mock the customer fetch API call
      axiosMock.onGet('/customers/1').reply(200, mockCustomers[0]);

      renderCustomerPage('1');

      const backButton = screen.getByRole('link', { name: textConstants.misc.BACK });
      await user.click(backButton);

      expect(screen.getByTestId('customers-page')).toBeVisible();
    });

    it('add customer button navigates to add customer page', async () => {
      // Mock the customer fetch API call
      axiosMock.onGet('/customers/1').reply(200, mockCustomers[0]);

      renderCustomerPage('1');

      const addCustomerButton = screen.getByRole('link', { name: textConstants.addCustomer.ADD_CUSTOMER });
      await user.click(addCustomerButton);

      expect(screen.getByTestId('add-customer-page')).toBeVisible();
    });
  });
});
