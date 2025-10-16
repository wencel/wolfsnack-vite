import { describe, it, expect, afterEach } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import ProductPage from './';
import { axiosMock } from '@/test/setup';
import { mockProducts } from '@/test/testData';
import { textConstants } from '@/lib/appConstants';

describe('ProductPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderProductPage = (productId: string = '1') => {
    return testRender(<ProductPage />, {
      initialEntries: [`/products/${productId}`],
      mountPath: '/products/:id',
      routes: [
        {
          path: '/products',
          element: <div data-testid="products-page">Products Page</div>,
        },
        {
          path: '/products/new',
          element: <div data-testid="add-product-page">Add Product Page</div>,
        },
      ],
    });
  };

  describe('Component rendering with valid product ID', () => {
    it('renders page container and top actions when product ID is provided', () => {
      // Mock the product fetch API call
      axiosMock.onGet('/products/1').reply(200, mockProducts[0]);

      renderProductPage('1');

      expect(screen.getByTestId('page-container')).toBeVisible();
      expect(
        screen.getByRole('link', { name: textConstants.misc.BACK })
      ).toBeVisible();
      expect(
        screen.getByRole('link', { name: textConstants.addProduct.ADD_PRODUCT })
      ).toBeVisible();
    });

    it('displays product card when product data is loaded', async () => {
      const mockProduct = mockProducts[0];
      // Mock the product fetch API call
      axiosMock.onGet('/products/1').reply(200, mockProduct);

      renderProductPage('1');

      // Wait for product data to load
      const productCard = await screen.findByRole('article');

      // Assert product card is rendered and contains expected data
      expect(productCard).toBeVisible();
      expect(productCard.textContent).toContain(mockProduct.name);
      expect(productCard.textContent).toContain(mockProduct.presentation);
      expect(productCard.textContent).toContain(`${mockProduct.weight} g`);
      expect(productCard.textContent).toContain(
        `$${mockProduct.basePrice.toFixed(2).replace('.', ',')}`
      );
      expect(productCard.textContent).toContain(
        `$${mockProduct.sellingPrice.toFixed(2).replace('.', ',')}`
      );
      expect(productCard.textContent).toContain(`${mockProduct.stock}`);
    });

    it('displays product card with different product data', async () => {
      const mockProduct = mockProducts[1];
      // Mock the product fetch API call
      axiosMock.onGet('/products/2').reply(200, mockProduct);

      renderProductPage('2');

      // Wait for product data to load
      const productCard = await screen.findByRole('article');

      // Assert product card is rendered and contains expected data
      expect(productCard).toBeVisible();
      expect(productCard.textContent).toContain(mockProduct.name);
      expect(productCard.textContent).toContain(mockProduct.presentation);
      expect(productCard.textContent).toContain(`${mockProduct.weight} g`);
      expect(productCard.textContent).toContain(
        `$${mockProduct.basePrice.toFixed(2).replace('.', ',')}`
      );
      expect(productCard.textContent).toContain(
        `$${mockProduct.sellingPrice.toFixed(2).replace('.', ',')}`
      );
      expect(productCard.textContent).toContain(`${mockProduct.stock}`);
    });
  });

  describe('Error state when no product ID is provided', () => {
    it('displays error message when no product ID is provided', () => {
      testRender(<ProductPage />, {
        initialEntries: ['/products/'],
        mountPath: '/products/',
      });

      expect(screen.getByText('Error')).toBeVisible();
      expect(screen.getByText(textConstants.misc.NO_PRODUCT_ID)).toBeVisible();
    });
  });

  describe('Product not found state', () => {
    it('displays not found message when product is not found and not loading', async () => {
      // Mock API call that returns 404 or empty response
      axiosMock
        .onGet('/products/999')
        .reply(404, { message: 'Product not found' });

      renderProductPage('999');

      // Wait for the API call to complete and show not found message
      await screen.findByText(textConstants.misc.PRODUCT_NOT_FOUND);
      expect(
        screen.getByText(textConstants.misc.PRODUCT_NOT_FOUND_DESCRIPTION)
      ).toBeVisible();
    });
  });

  describe('Loading state and data fetching behavior', () => {
    it('shows loading state while fetching product data', async () => {
      // Mock a delayed API response
      axiosMock
        .onGet('/products/999')
        .reply(
          () =>
            new Promise(resolve =>
              setTimeout(() => resolve([200, mockProducts[0]]), 100)
            )
        );

      renderProductPage('999');

      // Should show loading spinner
      const loadingSpinner = screen.getByRole('status');
      expect(loadingSpinner).toBeVisible();

      // Wait for loading to complete
      await waitForElementToBeRemoved(loadingSpinner);

      // Should show product card after loading
      const productCard = await screen.findByRole('article');
      expect(productCard).toBeVisible();
      expect(productCard.textContent).toContain(mockProducts[0].name);
    });
  });

  describe('Navigation buttons functionality', () => {
    it('back button navigates to products page', async () => {
      // Mock the product fetch API call
      axiosMock.onGet('/products/1').reply(200, mockProducts[0]);

      renderProductPage('1');

      const backButton = screen.getByRole('link', {
        name: textConstants.misc.BACK,
      });
      await user.click(backButton);

      expect(screen.getByTestId('products-page')).toBeVisible();
    });

    it('add product button navigates to add product page', async () => {
      // Mock the product fetch API call
      axiosMock.onGet('/products/1').reply(200, mockProducts[0]);

      renderProductPage('1');

      const addProductButton = screen.getByRole('link', {
        name: textConstants.addProduct.ADD_PRODUCT,
      });
      await user.click(addProductButton);

      expect(screen.getByTestId('add-product-page')).toBeVisible();
    });
  });
});
