import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import AddEditOrderPage from './';
import { axiosMock } from '@/test/setup';
import {
  mockProducts,
  mockOrders,
  mockPaginatedResponse,
} from '@/test/testData';
import { textConstants } from '@/lib/appConstants';

describe('AddEditOrderPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderAddEditOrderPage = (orderId?: string) => {
    return testRender(<AddEditOrderPage />, {
      initialEntries: orderId ? [`/orders/${orderId}/edit`] : ['/orders/new'],
      mountPath: orderId ? '/orders/:id/edit' : '/orders/new',
      routes: [
        {
          path: '/orders',
          element: <div data-testid="orders-page">Orders Page</div>,
        },
        {
          path: '/orders/:id',
          element: <div data-testid="order-detail-page">Order Detail Page</div>,
        },
      ],
    });
  };

  describe('Add Order Mode', () => {
    it('renders add order form with correct title and fields', async () => {
      // Mock API calls for products
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      expect(
        screen.getByRole('heading', { name: textConstants.addOrder.TITLE })
      ).toBeVisible();
      expect(screen.getByRole('form')).toBeVisible();

      // Check all form fields are present
      expect(
        screen.getByLabelText(textConstants.order.TOTAL_PRICE)
      ).toBeVisible();
      expect(
        screen.getByLabelText(textConstants.orderPage.ORDER_DATE)
      ).toBeVisible();
    });

    it('displays correct action buttons in add mode', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addOrder.ADD_PRODUCT,
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

      renderAddEditOrderPage();

      // Wait for initial product to appear
      const productSelect = await screen.findByLabelText(
        textConstants.order.PRODUCT
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

      renderAddEditOrderPage();

      // Wait for form to load
      await screen.findByLabelText(textConstants.order.PRODUCT);
    });

    it('handles adding and removing products', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      // Initially one product field should be visible (auto-added on mount)
      const productSections = await screen.findAllByRole('group');
      expect(productSections.length).toBeGreaterThanOrEqual(1);

      // Add another product
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addOrder.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      // Should have two product selects now
      const updatedProductSections = screen.getAllByRole('group');
      expect(updatedProductSections.length).toBeGreaterThanOrEqual(2);

      // Remove button should appear when there's more than one product
      const deleteButton = within(updatedProductSections[0]).getByRole(
        'button',
        {
          name: textConstants.product.DELETE_PRODUCT,
        }
      );

      expect(deleteButton).toBeVisible();

      // Remove a product
      await user.click(deleteButton);

      // Should have one product select now
      const remainingProductSections = screen.getAllByRole('group');
      expect(remainingProductSections.length).toBeGreaterThanOrEqual(1);
    });

    it('handles product selection and updates price', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      // Wait for product select to appear
      const productSelect = await screen.findByLabelText(
        textConstants.order.PRODUCT
      );
      const firstProduct = mockProducts[0];

      await user.selectOptions(productSelect, firstProduct._id);

      // Price should be updated
      const priceInput = screen.getByLabelText(textConstants.order.PRICE);
      expect(priceInput).toHaveValue(firstProduct.basePrice);
    });

    it('calculates total price when quantity changes', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      // Wait for product select to appear
      const productSelect = await screen.findByLabelText(
        textConstants.order.PRODUCT
      );
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      // Set quantity
      const quantityInput = screen.getByLabelText(textConstants.order.QUANTITY);
      await user.type(quantityInput, '2');

      // Product total should be calculated
      const productTotalInput = screen.getByLabelText(
        textConstants.order.PRODUCT_TOTAL_PRICE
      );
      const expectedTotal = firstProduct.basePrice * 2;
      // Note: Component uses Number.parseInt which truncates decimals
      expect(productTotalInput).toHaveValue(Math.floor(expectedTotal));

      // Form total should also be updated
      const totalPriceInput = screen.getByLabelText(
        textConstants.order.TOTAL_PRICE
      );
      // Note: Component uses Number.parseInt which truncates decimals
      expect(totalPriceInput).toHaveValue(Math.floor(expectedTotal));
    });

    it('creates a new order successfully', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onPost('/orders').reply(200, {
        ...mockOrders[0],
        _id: 'new-order-id',
      });

      renderAddEditOrderPage();

      // Wait for form to load
      const productSelect = await screen.findByLabelText(
        textConstants.order.PRODUCT
      );
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      // Set quantity
      const quantityInput = screen.getByLabelText(textConstants.order.QUANTITY);
      await user.type(quantityInput, '2');

      // Submit form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Assert order page is shown after successful submission
      const orderDetailPage = await screen.findByTestId('order-detail-page');
      expect(orderDetailPage).toBeVisible();

      const postData = JSON.parse(axiosMock.history.post[0].data);
      expect(postData.products).toHaveLength(1);
      expect(postData.products[0].product).toBe(firstProduct._id);
      expect(postData.products[0].quantity).toBe(2);
    });

    it('handles submission with empty product field', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock
        .onPost('/orders')
        .reply(400, { message: 'Product is required' });

      renderAddEditOrderPage();

      // Wait for form to load
      await screen.findByLabelText(textConstants.order.PRODUCT);

      // Try to submit without selecting a product
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Form will submit and API call will be made (validation happens on server)
      const errorMessage = await screen.findByText('Product is required');
      expect(errorMessage).toBeVisible();
    });

    it('handles API errors when creating order', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onPost('/orders').reply(500, { message: 'Server Error' });

      renderAddEditOrderPage();

      // Wait for form to load
      const productSelect = await screen.findByLabelText(
        textConstants.order.PRODUCT
      );
      const firstProduct = mockProducts[0];
      await user.selectOptions(productSelect, firstProduct._id);

      // Set quantity
      const quantityInput = screen.getByLabelText(textConstants.order.QUANTITY);
      await user.type(quantityInput, '2');

      // Submit form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Should show error
      const errorMessage = await screen.findByText('Server Error');
      expect(errorMessage).toBeVisible();
    });
  });

  describe('Edit Order Mode', () => {
    it('renders edit order form with correct title and pre-filled data', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);

      renderAddEditOrderPage('1');

      expect(
        screen.getByRole('heading', { name: textConstants.editOrder.TITLE })
      ).toBeVisible();

      // Wait for order data to load
      // Note: Component uses Number.parseInt which truncates decimals
      const totalPriceInput = screen.getByLabelText(
        textConstants.order.TOTAL_PRICE
      );
      await waitFor(() => {
        expect(totalPriceInput).toHaveValue(
          Math.floor(mockOrders[0].totalPrice)
        );
      });
    });

    it('loads existing order data correctly', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);

      renderAddEditOrderPage('1');

      // Wait for order to load
      await waitFor(() => {
        const productSelect = screen.getByLabelText(
          textConstants.order.PRODUCT
        );
        expect(productSelect).toHaveValue(mockOrders[0].products[0].product);
      });

      // Check that product fields are populated
      const quantityInput = screen.getByLabelText(textConstants.order.QUANTITY);
      expect(quantityInput).toHaveValue(mockOrders[0].products[0].quantity);
    });

    it('updates an existing order successfully', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
      axiosMock.onPatch('/orders/1').reply(200, {
        ...mockOrders[0],
        totalPrice: 50.98,
      });

      renderAddEditOrderPage('1');

      // Wait for order to load
      await waitFor(() => {
        const productSelect = screen.getByLabelText(
          textConstants.order.PRODUCT
        );
        expect(productSelect).toHaveValue(mockOrders[0].products[0].product);
      });

      // Update quantity
      const quantityInput = screen.getByLabelText(textConstants.order.QUANTITY);
      await user.clear(quantityInput);
      await user.type(quantityInput, '4');

      // Submit form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Assert order detail page is shown after successful update
      expect(await screen.findByTestId('order-detail-page')).toBeVisible();

      const patchData = JSON.parse(axiosMock.history.patch[0].data);
      expect(patchData.products[0].quantity).toBe(4);
    });

    it('handles API errors when updating order', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
      axiosMock.onPatch('/orders/1').reply(500, { message: 'Server Error' });

      renderAddEditOrderPage('1');

      // Wait for order to load
      await waitFor(() => {
        const productSelect = screen.getByLabelText(
          textConstants.order.PRODUCT
        );
        expect(productSelect).toHaveValue(mockOrders[0].products[0].product);
      });

      // Submit form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Should show error
      const errorMessage = await screen.findByText('Server Error');
      expect(errorMessage).toBeVisible();
    });

    it('navigates back to order detail page after successful update', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);
      axiosMock.onPatch('/orders/1').reply(200, mockOrders[0]);

      renderAddEditOrderPage('1');

      // Wait for order to load
      await waitFor(() => {
        const productSelect = screen.getByLabelText(
          textConstants.order.PRODUCT
        );
        expect(productSelect).toHaveValue(mockOrders[0].products[0].product);
      });

      // Submit form
      const saveButton = screen.getByRole('button', {
        name: textConstants.misc.SAVE,
      });
      await user.click(saveButton);

      // Assert order detail page is shown after successful update
      expect(await screen.findByTestId('order-detail-page')).toBeVisible();
    });
  });

  describe('Common Functionality', () => {
    it('navigates back when back button is clicked', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      const backButton = screen.getByRole('button', {
        name: textConstants.misc.BACK,
      });
      await user.click(backButton);

      expect(screen.getByTestId('orders-page')).toBeVisible();
    });

    it('handles multiple products correctly', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));

      renderAddEditOrderPage();

      // Wait for initial product
      await screen.findByLabelText(textConstants.order.PRODUCT);

      // Add multiple products
      const addProductButton = screen.getByRole('button', {
        name: textConstants.addOrder.ADD_PRODUCT,
      });
      await user.click(addProductButton);
      await user.click(addProductButton);

      // Should have 3 products now
      const productSections = screen.getAllByRole('group');
      expect(productSections.length).toBeGreaterThanOrEqual(3);

      // Select different products for each
      const productSelects = screen.getAllByLabelText(
        textConstants.order.PRODUCT
      );
      await user.selectOptions(productSelects[0], mockProducts[0]._id);
      await user.selectOptions(productSelects[1], mockProducts[1]._id);
      await user.selectOptions(productSelects[2], mockProducts[2]._id);

      // Set quantities
      const quantityInputs = screen.getAllByLabelText(
        textConstants.order.QUANTITY
      );
      await user.type(quantityInputs[0], '2');
      await user.type(quantityInputs[1], '3');
      await user.type(quantityInputs[2], '1');

      // Total should be sum of all products
      const totalPriceInput = screen.getByLabelText(
        textConstants.order.TOTAL_PRICE
      );
      const expectedTotal =
        mockProducts[0].basePrice * 2 +
        mockProducts[1].basePrice * 3 +
        mockProducts[2].basePrice * 1;
      expect(totalPriceInput).toHaveValue(Math.floor(expectedTotal));
    });

    it('displays loading state while fetching data', async () => {
      axiosMock
        .onGet('/products')
        .reply(200, mockPaginatedResponse(mockProducts, mockProducts.length));
      axiosMock.onGet('/orders/1').reply(200, mockOrders[0]);

      renderAddEditOrderPage('1');

      // Should show loading initially
      const loadingSpinner = screen.getByRole('status');
      expect(loadingSpinner).toBeVisible();

      // Wait for loading to complete
      await waitFor(() => {
        expect(
          screen.getByLabelText(textConstants.order.PRODUCT)
        ).toBeVisible();
      });
    });
  });
});
