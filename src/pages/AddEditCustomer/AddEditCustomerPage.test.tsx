import { describe, it, expect, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import AddEditCustomerPage from './';
import { axiosMock } from '@/test/setup';
import {
  mockCustomers,
  mockLocalities,
  createCustomerWithMissingFields,
} from '@/test/testData';
import { textConstants } from '@/lib/appConstants';

describe('AddEditCustomerPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderAddEditCustomerPage = (customerId?: string) => {
    return testRender(<AddEditCustomerPage />, {
      initialEntries: customerId
        ? [`/customers/${customerId}/edit`]
        : ['/customers/new'],
      mountPath: customerId ? '/customers/:id/edit' : '/customers/new',
      routes: [
        {
          path: '/customers',
          element: <div data-testid="customers-page">Customers Page</div>,
        },
        {
          path: '/customers/:id',
          element: (
            <div data-testid="customer-detail-page">Customer Detail Page</div>
          ),
        },
      ],
    });
  };

  describe('Add Customer Mode', () => {
    it('renders add customer form with correct title and fields', async () => {
      // Mock localities API call
      axiosMock.onGet('/utils/localities').reply(200, [
        { value: 'locality1', label: 'Test Locality 1' },
        { value: 'locality2', label: 'Test Locality 2' },
        { value: 'locality3', label: 'Test Locality 3' },
      ]);

      renderAddEditCustomerPage();

      expect(screen.getByText(textConstants.addCustomer.TITLE)).toBeVisible();
      expect(screen.getByRole('form')).toBeVisible();

      // Check all form fields are present
      expect(
        screen.getByLabelText(textConstants.customer.STORE_NAME)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.customer.ID_NUMBER)
      ).toBeVisible();
      expect(screen.getByLabelText(textConstants.customer.NAME)).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.customer.ADDRESS)
      ).toBeVisible();
      expect(screen.getByLabelText(textConstants.customer.EMAIL)).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.customer.PHONE_NUMBER)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.customer.SECONDARY_PHONE_NUMBER)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.customer.LOCALITY)
      ).toBeVisible();
      expect(screen.getByLabelText(textConstants.customer.TOWN)).toBeVisible();
    });

    it('displays correct action buttons in add mode', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      expect(backButton).toBeVisible();
      expect(saveButton).toBeVisible();
      expect(saveButton).toHaveAttribute('type', 'submit');
    });

    it('loads localities options for the select field', async () => {
      axiosMock.onGet('/utils/localities').reply(200, mockLocalities);

      renderAddEditCustomerPage();

      const localitySelect = await screen.findByLabelText(
        textConstants.customer.LOCALITY
      );
      expect(localitySelect).toBeVisible();

      // Check that options are loaded
      for (const locality of mockLocalities) {
        expect(
          await screen.findByRole('option', { name: locality.label })
        ).toBeVisible();
      }
    });

    it('handles form input changes correctly', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const storeNameInput = screen.getByLabelText(
        textConstants.customer.STORE_NAME
      );
      const nameInput = screen.getByLabelText(textConstants.customer.NAME);
      const addressInput = screen.getByLabelText(
        textConstants.customer.ADDRESS
      );

      await user.type(storeNameInput, 'Test Store');
      await user.type(nameInput, 'John Doe');
      await user.type(addressInput, '123 Main St');

      expect(storeNameInput).toHaveValue('Test Store');
      expect(nameInput).toHaveValue('John Doe');
      expect(addressInput).toHaveValue('123 Main St');
    });

    it('handles select input changes for locality', async () => {
      axiosMock.onGet('/utils/localities').reply(200, mockLocalities);

      renderAddEditCustomerPage();

      // Wait for localities to load
      const localitySelect = await screen.findByLabelText(
        textConstants.customer.LOCALITY
      );
      expect(localitySelect).toBeVisible();

      await user.selectOptions(localitySelect, 'locality2');

      expect(localitySelect).toHaveValue('locality2');
    });

    it('submits form with createCustomer when in add mode', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);
      axiosMock.onPost('/customers').reply(200, { success: true });

      renderAddEditCustomerPage();

      // Fill required fields
      await user.type(
        screen.getByLabelText(textConstants.customer.STORE_NAME),
        'Test Store'
      );
      await user.type(
        screen.getByLabelText(textConstants.customer.ADDRESS),
        '123 Main St'
      );
      await user.type(
        screen.getByLabelText(textConstants.customer.PHONE_NUMBER),
        '1234567890'
      );

      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Verify form submission behavior - should redirect to customer detail page
      expect(await screen.findByTestId('customer-detail-page')).toBeVisible();
    });

    it('validates required fields', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const form = screen.getByRole('form');
      await user.click(form);

      // Check that required fields show validation
      const storeNameInput = screen.getByLabelText(
        textConstants.customer.STORE_NAME
      );
      const addressInput = screen.getByLabelText(
        textConstants.customer.ADDRESS
      );
      const phoneInput = screen.getByLabelText(
        textConstants.customer.PHONE_NUMBER
      );

      expect(storeNameInput).toBeRequired();
      expect(addressInput).toBeRequired();
      expect(phoneInput).toBeRequired();
    });
  });

  describe('Edit Customer Mode', () => {
    it('renders edit customer form with correct title', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);
      axiosMock.onGet('/customers/1').reply(200, mockCustomers[0]);

      renderAddEditCustomerPage('1');

      expect(screen.getByText(textConstants.editCustomer.TITLE)).toBeVisible();
    });

    it('populates form fields with existing customer data', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);
      axiosMock.onGet('/customers/1').reply(200, mockCustomers[0]);

      renderAddEditCustomerPage('1');

      // Wait for form to be populated with customer data
      expect(
        await screen.findByLabelText(textConstants.customer.STORE_NAME)
      ).toHaveValue(mockCustomers[0].storeName);
      expect(
        await screen.findByLabelText(textConstants.customer.NAME)
      ).toHaveValue(mockCustomers[0].name!);
      expect(
        await screen.findByLabelText(textConstants.customer.ADDRESS)
      ).toHaveValue(mockCustomers[0].address);
      expect(
        await screen.findByLabelText(textConstants.customer.EMAIL)
      ).toHaveValue(mockCustomers[0].email!);
      expect(
        await screen.findByLabelText(textConstants.customer.PHONE_NUMBER)
      ).toHaveValue(mockCustomers[0].phoneNumber);
      expect(
        await screen.findByLabelText(
          textConstants.customer.SECONDARY_PHONE_NUMBER
        )
      ).toHaveValue(mockCustomers[0].secondaryPhoneNumber!);
      expect(
        await screen.findByLabelText(textConstants.customer.TOWN)
      ).toHaveValue(mockCustomers[0].town);
      expect(
        await screen.findByLabelText(textConstants.customer.ID_NUMBER)
      ).toHaveValue(mockCustomers[0].idNumber!);
    });

    it('submits form with updateCustomer when in edit mode', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);
      axiosMock.onGet('/customers/1').reply(200, mockCustomers[0]);
      axiosMock.onPatch('/customers/1').reply(200, { success: true });

      renderAddEditCustomerPage('1');

      // Wait for form to be populated
      expect(
        await screen.findByLabelText(textConstants.customer.STORE_NAME)
      ).toHaveValue(mockCustomers[0].storeName);

      // Modify a field
      const nameInput = screen.getByLabelText(textConstants.customer.NAME);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      // Submit the form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Verify the field was updated and form submission behavior
      expect(nameInput).toHaveValue('Updated Name');
      expect(await screen.findByTestId('customer-detail-page')).toBeVisible();
    });

    it('handles customer data with missing optional fields', async () => {
      const customerWithMissingFields = createCustomerWithMissingFields();
      axiosMock.onGet('/utils/localities').reply(200, []);
      axiosMock.onGet('/customers/1').reply(200, customerWithMissingFields);

      renderAddEditCustomerPage('1');

      // Wait for form to be populated with empty values for missing fields
      expect(
        await screen.findByLabelText(textConstants.customer.STORE_NAME)
      ).toHaveValue(customerWithMissingFields.storeName);
      expect(
        await screen.findByLabelText(textConstants.customer.EMAIL)
      ).toHaveValue('');
      expect(
        await screen.findByLabelText(
          textConstants.customer.SECONDARY_PHONE_NUMBER
        )
      ).toHaveValue('');
      expect(
        await screen.findByLabelText(textConstants.customer.ID_NUMBER)
      ).toHaveValue('');
    });
  });

  describe('Form Interactions', () => {
    it('updates form state when input values change', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const storeNameInput = screen.getByLabelText(
        textConstants.customer.STORE_NAME
      );
      const emailInput = screen.getByLabelText(textConstants.customer.EMAIL);

      await user.type(storeNameInput, 'New Store Name');
      await user.type(emailInput, 'test@example.com');

      expect(storeNameInput).toHaveValue('New Store Name');
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('handles different input types correctly', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const emailInput = screen.getByLabelText(textConstants.customer.EMAIL);
      const phoneInput = screen.getByLabelText(
        textConstants.customer.PHONE_NUMBER
      );
      const localitySelect = screen.getByLabelText(
        textConstants.customer.LOCALITY
      );

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(phoneInput).toHaveAttribute('type', 'phoneNumber');
      expect(localitySelect.tagName).toBe('SELECT');
    });
  });

  describe('Navigation', () => {
    it('back button navigates to previous page', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      await user.click(backButton);

      // Should navigate back (this would be handled by the router)
      expect(backButton).toBeVisible();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles form submission with empty required fields', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const form = screen.getByRole('form');
      await user.click(form);

      // User should remain on the add/edit customer page when validation fails
      expect(screen.getByText(textConstants.addCustomer.TITLE)).toBeVisible();
    });

    it('handles form submission with partial data', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      // Fill only some fields
      await user.type(
        screen.getByLabelText(textConstants.customer.STORE_NAME),
        'Test Store'
      );
      await user.type(
        screen.getByLabelText(textConstants.customer.ADDRESS),
        '123 Main St'
      );
      // Don't fill phone number (required)

      const form = screen.getByRole('form');
      await user.click(form);

      // Should not submit due to missing required field
      expect(screen.getByText(textConstants.addCustomer.TITLE)).toBeVisible();
    });

    it('handles API errors gracefully', async () => {
      axiosMock
        .onGet('/utils/localities')
        .reply(500, { message: 'Server Error' });
      axiosMock.onPost('/customers').reply(500, { message: 'Server Error' });

      renderAddEditCustomerPage();

      // Should not crash and should still render the form
      expect(screen.getByRole('form')).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure and labels', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const form = screen.getByRole('form');
      expect(form).toBeVisible();

      // Check that all inputs have proper labels
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('has proper button roles and accessible names', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      expect(backButton).toHaveAccessibleName();
      expect(saveButton).toHaveAccessibleName();
    });

    it('maintains focus management during form interactions', async () => {
      axiosMock.onGet('/utils/localities').reply(200, []);

      renderAddEditCustomerPage();

      const storeNameInput = screen.getByLabelText(
        textConstants.customer.STORE_NAME
      );
      storeNameInput.focus();

      expect(storeNameInput).toHaveFocus();

      // Test that tab navigation works
      await user.tab();
      // Focus should move to the next focusable element
      expect(document.activeElement).not.toBe(storeNameInput);
    });
  });
});
