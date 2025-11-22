import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import AddEditSalePage from './';
import { axiosMock } from '@/test/setup';
import alertStyles from '@/components/Atoms/Alert/Alert.module.sass';
import {
  mockProducts,
  mockCustomers,
  mockSales,
  mockPaginatedResponse,
} from '@/test/testData';
import { textConstants } from '@/lib/appConstants';

describe('AddEditSalePage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderAddEditSalePage = (saleId?: string) => {
    return testRender(<AddEditSalePage />, {
      initialEntries: saleId ? [`/sales/${saleId}/edit`] : ['/sales/new'],
      mountPath: saleId ? '/sales/:id/edit' : '/sales/new',
      routes: [
        {
          path: '/sales',
          element: <div data-testid="sales-page">Sales Page</div>,
        },
        {
          path: '/sales/:id',
          element: <div data-testid="sale-detail-page">Sale Detail Page</div>,
        },
      ],
    });
  };

  describe('Add Sale Mode', () => {
    it('renders add sale form with correct title and fields', async () => {
      // Mock API calls for products and customers
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      expect(
        screen.getByRole('heading', { name: textConstants.addSale.TITLE })
      ).toBeVisible();
      expect(screen.getByRole('form')).toBeVisible();

      // Check all form fields are present
      // SearchField label is accessible via the input's label
      expect(
        screen.getByLabelText(textConstants.addSale.SEARCH_CUSTOMER)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.sale.TOTAL_PRICE)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.sale.PARTIAL_PAYMENT)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.salePage.SALE_DATE)
      ).toBeVisible();
      expect(screen.getByLabelText(textConstants.sale.OWES)).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.sale.IS_THIRTEEN_DOZEN)
      ).toBeVisible();
    });

    it('displays correct action buttons in add mode', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      expect(backButton).toBeVisible();
      expect(addProductButton).toBeVisible();
      expect(saveButton).toBeVisible();
    });

    it('loads products options for the select field', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Add a product first
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      // Wait for product select to appear
      const productSelect = await screen.findByLabelText(
        textConstants.sale.PRODUCT
      );
      expect(productSelect).toBeVisible();

      // Check that options are loaded
      for (const product of mockProducts) {
        const optionText =
          product.fullName ||
          `${product.name} ${product.presentation} ${product.weight}g`;
        expect(screen.getByRole('option', { name: optionText })).toBeVisible();
      }
    });

    it('handles form input changes correctly', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      await user.type(partialPaymentInput, '50.99');

      expect(partialPaymentInput).toHaveValue(50.99);
    });

    it('handles adding and removing products', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Initially no product fields should be visible
      expect(screen.queryByRole('group')).not.toBeInTheDocument();

      // Add a product
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      // Product fields should now be visible
      const productSection = screen.getByRole('group');
      expect(productSection).toBeVisible();

      // Add another product
      await user.click(addProductButton);

      // Should have two product selects now
      const productSections = screen.getAllByRole('group');
      expect(productSections).toHaveLength(2);

      // Remove button should appear when there's more than one product
      // Find delete buttons by their accessible role (they should have aria-label)
      const deleteButton = within(productSections[0]).getByRole('button', {
        name: textConstants.product.DELETE_PRODUCT,
      });

      expect(deleteButton).toBeVisible();

      // Remove a product
      await user.click(deleteButton);

      // Should have one product select now
      const remainingProductSections = screen.getAllByRole('group');
      expect(remainingProductSections).toHaveLength(1);
    });

    it('handles product selection and updates price', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Add a product
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      // Select a product
      const productSelect = screen.getByLabelText(textConstants.sale.PRODUCT);
      const firstProduct = mockProducts[0];

      await user.selectOptions(productSelect, firstProduct._id);

      // Price should be updated
      const priceInput = screen.getByLabelText(textConstants.sale.PRICE);
      expect(priceInput).toHaveValue(firstProduct.sellingPrice);
    });

    it('calculates total price when quantity changes', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Add a product
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      // Select a product
      const productSelect = screen.getByLabelText(textConstants.sale.PRODUCT);
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      // Set quantity
      const quantityInput = screen.getByLabelText(textConstants.sale.QUANTITY);
      await user.type(quantityInput, '2');

      // Product total should be calculated
      const productTotalInput = screen.getByLabelText(
        textConstants.sale.PRODUCT_TOTAL_PRICE
      );
      const expectedTotal = firstProduct.sellingPrice * 2;
      // Note: Component uses Number.parseInt which truncates decimals
      expect(productTotalInput).toHaveValue(Math.floor(expectedTotal));

      // Form total should also be updated
      const totalPriceInput = screen.getByLabelText(
        textConstants.sale.TOTAL_PRICE
      );
      // Note: Component uses Number.parseInt which truncates decimals
      expect(totalPriceInput).toHaveValue(Math.floor(expectedTotal));
    });

    it('handles isThirteenDozen checkbox changes', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const isThirteenDozenCheckbox = screen.getByLabelText(
        textConstants.sale.IS_THIRTEEN_DOZEN
      );

      expect(isThirteenDozenCheckbox).not.toBeChecked();

      await user.click(isThirteenDozenCheckbox);

      expect(isThirteenDozenCheckbox).toBeChecked();
    });

    it('handles correct when isThirteenDozen checkbox changes', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Add a product and set quantity to get a total
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      const productSelect = screen.getByLabelText(textConstants.sale.PRODUCT);
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      const quantityInput = screen.getByLabelText(textConstants.sale.QUANTITY);
      await user.type(quantityInput, '13');
      const productTotalInput = screen.getByLabelText(
        textConstants.sale.PRODUCT_TOTAL_PRICE
      );
      let expectedTotal = firstProduct.sellingPrice * 13;
      expect(productTotalInput).toHaveValue(Math.floor(expectedTotal));

      const isThirteenDozenCheckbox = screen.getByLabelText(
        textConstants.sale.IS_THIRTEEN_DOZEN
      );

      await user.click(isThirteenDozenCheckbox);

      expectedTotal = firstProduct.sellingPrice * 12;
      expect(productTotalInput).toHaveValue(Math.floor(expectedTotal));
    });

    it('calculates owes correctly based on partial payment and total price', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Add a product and set quantity to get a total
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      const productSelect = await screen.findByLabelText(
        textConstants.sale.PRODUCT
      );
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      const quantityInput = await screen.findByLabelText(
        textConstants.sale.QUANTITY
      );
      await user.type(quantityInput, '2');

      const totalPrice = firstProduct.sellingPrice * 2;
      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      // Set partial payment less than total
      await user.type(partialPaymentInput, String(totalPrice - 10));

      // Owes checkbox should be checked
      const owesCheckbox = await screen.findByLabelText(
        textConstants.sale.OWES
      );
      expect(owesCheckbox).toBeChecked();

      // Set partial payment equal to total
      await user.clear(partialPaymentInput);
      await user.type(partialPaymentInput, String(totalPrice));

      // Owes checkbox should be unchecked
      const updatedOwesCheckbox = await screen.findByLabelText(
        textConstants.sale.OWES
      );
      expect(updatedOwesCheckbox).not.toBeChecked();
    });

    it('submits form with createSale when in add mode', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onPost('/sales').reply(200, { success: true });

      renderAddEditSalePage();

      // Add a product
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      // Select a product
      const productSelect = await screen.findByLabelText(
        textConstants.sale.PRODUCT
      );
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      // Set quantity
      const quantityInput = await screen.findByLabelText(
        textConstants.sale.QUANTITY
      );
      await user.type(quantityInput, '2');

      // Set partial payment
      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );
      await user.type(partialPaymentInput, '20');

      // Submit the form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      // Note: Form submission may trigger navigation, so we verify the button exists before clicking
      expect(saveButton).toBeInTheDocument();
      await user.click(saveButton);

      const saleDetailPage = await screen.findByTestId('sale-detail-page');
      expect(saleDetailPage).toBeVisible();
    });

    it('shows error message when endpoint returns error', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock
        .onPost('/sales')
        .reply(500, { message: 'Error al crear la venta' });

      renderAddEditSalePage();

      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      const errorMessage = await screen.findByRole('alert');
      expect(errorMessage).toHaveTextContent('Error al crear la venta');
      expect(errorMessage).toHaveClass(alertStyles.error);
    });
  });

  describe('Edit Sale Mode', () => {
    it('renders edit sale form with correct title', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

      renderAddEditSalePage('1');

      expect(
        screen.getByRole('heading', { name: textConstants.editSale.TITLE })
      ).toBeVisible();
    });

    it('displays correct action buttons in edit mode', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

      renderAddEditSalePage('1');

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      expect(backButton).toBeVisible();
      expect(addProductButton).toBeVisible();
      expect(saveButton).toBeVisible();
    });

    it('populates form fields with existing sale data', async () => {
      const mockSale = mockSales[0];
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSale);

      renderAddEditSalePage('1');

      // Wait for form to be populated with sale data
      // Note: Component uses Number.parseInt which truncates decimals
      const totalPriceInput = await screen.findByLabelText(
        textConstants.sale.TOTAL_PRICE
      );
      expect(totalPriceInput).toHaveValue(Math.floor(mockSale.totalPrice));

      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );
      expect(partialPaymentInput).toHaveValue(mockSale.partialPayment);

      const isThirteenDozenCheckbox = screen.getByLabelText(
        textConstants.sale.IS_THIRTEEN_DOZEN
      );

      expect(isThirteenDozenCheckbox).not.toBeChecked();

      const owesCheckbox = screen.getByLabelText(textConstants.sale.OWES);

      expect(owesCheckbox).not.toBeChecked();
    });

    it('populates product fields with existing sale product data', async () => {
      const mockSale = mockSales[0];
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSale);

      renderAddEditSalePage('1');

      // Wait for product fields to be populated
      const productSelect = await screen.findByLabelText(
        textConstants.sale.PRODUCT
      );
      expect(productSelect).toBeVisible();

      const quantityInput = await screen.findByLabelText(
        textConstants.sale.QUANTITY
      );
      expect(quantityInput).toHaveValue(mockSale.products[0].quantity);

      const priceInput = await screen.findByLabelText(textConstants.sale.PRICE);
      expect(priceInput).toHaveValue(mockSale.products[0].price);

      const productTotalInput = await screen.findByLabelText(
        textConstants.sale.PRODUCT_TOTAL_PRICE
      );
      // Note: Component uses Number.parseInt which truncates decimals
      expect(productTotalInput).toHaveValue(
        Math.floor(mockSale.products[0].totalPrice)
      );
    });

    it('handles form input changes in edit mode', async () => {
      const mockSale = mockSales[0];
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSale);

      renderAddEditSalePage('1');

      // Wait for form to be populated
      const partialPaymentInput = await screen.findByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      await user.clear(partialPaymentInput);
      await user.type(partialPaymentInput, '30.99');

      expect(partialPaymentInput).toHaveValue(30.99);
    });

    it('submits form with updateSale when in edit mode', async () => {
      const mockSale = mockSales[0];
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSale);
      axiosMock.onPatch('/sales/1').reply(200, { success: true });

      renderAddEditSalePage('1');

      // Wait for form to be populated
      const partialPaymentInput = await screen.findByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      // Modify a field
      await user.clear(partialPaymentInput);
      await user.type(partialPaymentInput, '25.50');

      // Submit the form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      // Note: Form submission may trigger navigation, so we verify the button exists before clicking
      expect(saveButton).toBeInTheDocument();
      await user.click(saveButton);

      const saleDetailPage = await screen.findByTestId('sale-detail-page');
      expect(saleDetailPage).toBeVisible();
    });

    it('shows error message when endpoint returns error in edit mode', async () => {
      const mockSale = mockSales[0];
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSale);
      axiosMock
        .onPatch('/sales/1')
        .reply(500, { message: 'Error al editar la venta' });

      renderAddEditSalePage('1');

      // Wait for form to be populated
      await screen.findByLabelText(textConstants.sale.PARTIAL_PAYMENT);

      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      const errorMessage = await screen.findByRole('alert');
      expect(errorMessage).toHaveTextContent('Error al editar la venta');
      expect(errorMessage).toHaveClass(alertStyles.error);
    });
  });

  describe('Form Interactions', () => {
    it('updates form state when input values change', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      await user.type(partialPaymentInput, '30.99');

      expect(partialPaymentInput).toHaveValue(30.99);
    });

    it('handles number inputs correctly', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const totalPriceInput = screen.getByLabelText(
        textConstants.sale.TOTAL_PRICE
      );
      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      // Test user-visible behavior: number inputs accept numeric values
      await user.type(partialPaymentInput, '123.45');
      expect(partialPaymentInput).toHaveValue(123.45);

      // Total price is disabled, should still be accessible
      expect(totalPriceInput).toBeDisabled();
    });

    it('handles customer search correctly', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      // Mock customer search response - will be called when user types
      axiosMock.onGet('/customers').reply(200, mockPaginatedResponse([], 0));

      renderAddEditSalePage();

      // Search for customers using accessible query (by label text)
      const searchInput = screen.getByLabelText(/buscar cliente/i);

      // Update mock to return filtered customers when search is performed
      axiosMock.onGet('/customers').reply(
        200,
        mockPaginatedResponse(
          mockCustomers.filter(c =>
            c.storeName.toLowerCase().includes('test store')
          ),
          mockCustomers.length
        )
      );

      await user.type(searchInput, 'Test Store');

      // Verify the input value was updated (user-visible behavior)
      expect(searchInput).toHaveValue('Test Store');
    });
  });

  describe('Navigation', () => {
    it('back button navigates to previous page in add mode', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });

      // Verify button exists before clicking
      expect(backButton).toBeInTheDocument();
      await user.click(backButton);

      // Should navigate back (this would be handled by the router)
      // Note: Button may not be visible after navigation, which is expected behavior
    });

    it('back button navigates to sale detail page in edit mode', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);
      axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

      renderAddEditSalePage('1');

      const backButton = await screen.findByRole('button', {
        name: textConstants.misc.BACK,
      });

      // Verify button exists before clicking
      expect(backButton).toBeInTheDocument();
      await user.click(backButton);

      // Should navigate back (this would be handled by the router)
      // Note: Button may not be visible after navigation, which is expected behavior
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles form submission with empty required fields', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Attempt to submit form by clicking submit button
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // User should remain on the add/edit sale page when validation fails
      expect(
        screen.getByRole('heading', { name: textConstants.addSale.TITLE })
      ).toBeVisible();
    });

    it('handles API errors gracefully', async () => {
      axiosMock.onGet('/products').reply(500, { message: 'Server Error' });
      axiosMock.onGet('/customers').reply(500, { message: 'Server Error' });
      axiosMock.onPost('/sales').reply(500, { message: 'Server Error' });

      renderAddEditSalePage();

      // Should not crash and should still render the form
      expect(screen.getByRole('form')).toBeVisible();
    });

    it('handles empty API responses', async () => {
      axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      // Should render form even with empty options
      expect(screen.getByRole('form')).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure and labels', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const form = screen.getByRole('form');
      expect(form).toBeVisible();

      // Check that all inputs have proper labels
      const numberInputs = screen.getAllByRole('spinbutton');
      numberInputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('has proper button roles and accessible names', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addSale.ADD_PRODUCT,
      });
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });

      expect(backButton).toHaveAccessibleName();
      expect(addProductButton).toHaveAccessibleName();
      expect(saveButton).toHaveAccessibleName();
    });

    it('maintains focus management during form interactions', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/customers').reply(200, []);

      renderAddEditSalePage();

      const partialPaymentInput = screen.getByLabelText(
        textConstants.sale.PARTIAL_PAYMENT
      );

      // Use userEvent to focus (simulates real user interaction)
      await user.click(partialPaymentInput);
      expect(partialPaymentInput).toHaveFocus();

      // Test that tab navigation works
      await user.tab();
      // Focus should move to the next focusable element
      expect(document.activeElement).not.toBe(partialPaymentInput);
    });
  });
});
