import { describe, it, expect, afterEach } from 'vitest';
import { fireEvent, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import ProductsPage from './';
import { axiosMock } from '@/test/setup';
import { mockProducts, mockPaginatedResponse } from '../../test/testData';
import { textConstants } from '@/lib/appConstants';

describe('ProductsPage', () => {
  const user = userEvent.setup();

  afterEach(() => {
    axiosMock.reset();
  });

  const renderProductsPage = () => {
    return testRender(<ProductsPage />, {
      initialEntries: ['/products'],
      mountPath: '/products',
      routes: [
        { path: '/products/:id', element: <div data-testid="dummy-product-page">Product Detail Page</div> },
        { path: '/products/new', element: <div data-testid="add-product-page">Add Product Page</div> }
      ]
    });
  };

  it('fetches and displays products from API', async () => {
    // Mock the products.getAll API call
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    // Wait for products to load and display
    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);
    
    // Verify products are rendered with basic information
    expect(within(cards[0]).getByText(/Wolf Snack Mix/)).toBeVisible();
    expect(within(cards[0]).getByText(/Bolsa/)).toBeVisible();
    expect(within(cards[0]).getByText(/500 g/)).toBeVisible();
    expect(within(cards[0]).getByText(/45 Unidades/)).toBeVisible();
    expect(within(cards[0]).getByText(/Precio base/)).toBeVisible();
    expect(within(cards[0]).getByText(/Precio de venta/)).toBeVisible();
    
    expect(within(cards[1]).getByText(/Trail Mix Deluxe/)).toBeVisible();
    expect(within(cards[1]).getByText(/750 g/)).toBeVisible();
    expect(within(cards[1]).getByText(/32 Unidades/)).toBeVisible();

    expect(within(cards[2]).getByText(/Protein Bars/)).toBeVisible();
    expect(within(cards[2]).getByText(/60 g/)).toBeVisible();
    expect(within(cards[2]).getByText(/67 Unidades/)).toBeVisible();
  });

  it('displays empty state when no products found', async () => {
    // Mock empty response
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse([], 0));

    renderProductsPage();
    const emptyTitle = await screen.findByText(textConstants.productPage.EMPTY_TITLE);
    const emptyDescription = screen.getByText(textConstants.productPage.EMPTY_DESCRIPTION);
    expect(emptyTitle).toBeVisible();
    expect(emptyDescription).toBeVisible();
  });

  it('displays loading spinner while fetching products', async () => {
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts, 20, 0));
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts, 20, 10));
    
    renderProductsPage();

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
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    expect(screen.getByText(textConstants.productPage.TITLE)).toBeVisible();
    expect(screen.getByText(textConstants.productPage.DESCRIPTION)).toBeVisible();
  });

  it('renders top action buttons correctly', async () => {
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    const addProductButton = screen.getByRole('link', { name: textConstants.addProduct.ADD_PRODUCT });
    const filtersButton = screen.getByRole('button', { name: /Filtros de busqueda/ });
    const resetFiltersButton = screen.getByRole('button', { name: /Limpiar filtros/ });

    expect(addProductButton).toBeVisible();
    expect(filtersButton).toBeVisible();
    expect(resetFiltersButton).toBeVisible();
  });

  it('navigates to add product page when add product button is clicked', async () => {
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    const addProductButton = screen.getByRole('link', { name: textConstants.addProduct.ADD_PRODUCT });
    await user.click(addProductButton);

    expect(screen.getByTestId('add-product-page')).toBeVisible();
  });

  it('opens filter modal when filters button is clicked', async () => {
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    const filtersButton = screen.getByRole('button', { name: textConstants.misc.FILTERS });
    await user.click(filtersButton);

    // Check if filter modal is visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(within(modal).getByText(textConstants.misc.FILTERS)).toBeVisible();
  });

  it('applies filters from modal correctly and resets filters when reset filters button is clicked', async () => {
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts, 10));
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts.slice(0, 5), 5));
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    // Open filter modal
    const filtersButton = screen.getByRole('button', { name: textConstants.misc.FILTERS });
    await user.click(filtersButton);

    // Apply filters through modal
    const searchInput = screen.getByLabelText('Buscar producto');
    const sortSelect = screen.getByLabelText('Ordernar la lista por');
    const directionSelect = screen.getByLabelText('Dirección de ordenamiento');

    await user.clear(searchInput);
    await user.type(searchInput, 'test search');
    await user.selectOptions(sortSelect, 'name');
    await user.selectOptions(directionSelect, 'desc');

    const applyButton = screen.getByRole('button', { name: textConstants.misc.APPLY });
    await user.click(applyButton);

    expect(screen.getAllByRole('article')).toHaveLength(5);

    // Reset filters
    const resetFiltersButton = screen.getByRole('button', { name: textConstants.misc.RESET_FILTERS });
    await user.click(resetFiltersButton);
    expect(screen.getAllByRole('article')).toHaveLength(10);
  });

  it('handles product deletion correctly', async () => {
    const mockDeleteResponse = { success: true };
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));
    axiosMock.onDelete('/products/1').reply(200, mockDeleteResponse);

    renderProductsPage();

    // Wait for products to load
    let cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(10);

    // Find and click delete button for first product
    const firstCard = screen.getAllByRole('article')[0];
    const deleteButton = within(firstCard).getByRole('button', { name: 'Eliminar producto' });
    await user.click(deleteButton);

    // Confirm deletion in modal
    const confirmButton = screen.getByRole('button', { name: textConstants.misc.YES });
    await user.click(confirmButton);

    // Wait for products to load
    cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(9);
  });

  it('navigates to product detail page when product card is clicked', async () => {
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    // Wait for products to load
    await screen.findAllByRole('article');

    // Click on first product card header (which should be a link)
    const firstCard = screen.getAllByRole('article')[0];
    const productLink = within(firstCard).getByRole('link', { name: /Wolf Snack Mix/ });
    await user.click(productLink);

    // Verify navigation to product detail page
    expect(screen.getByTestId('dummy-product-page')).toBeVisible();
  });

  it('handles infinite scroll pagination correctly', async () => {
    // Mock first page
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts.slice(0, 10), 20, 0));
    // Mock second page
    axiosMock.onGet('/products').replyOnce(200, mockPaginatedResponse(mockProducts, 20, 10));

    renderProductsPage();

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
    axiosMock.onGet('/products').reply(200, mockPaginatedResponse(mockProducts, 10));

    renderProductsPage();

    await screen.findAllByRole('article');
    const pageContainer = await screen.findByTestId('page-container');

    // Scroll multiple times quickly
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });
    fireEvent.scroll(pageContainer, { target: { scrollTop: 1000 } });

    // Should only have one API call since there are only 10 products
    expect(axiosMock.history.get).toHaveLength(1);
  });

  it('handles API errors gracefully', async () => {
    axiosMock.onGet('/products').reply(500, { message: 'Internal Server Error' });

    renderProductsPage();

    // Should not crash and should show empty state
    const emptyTitle = await screen.findByText(textConstants.productPage.EMPTY_TITLE);
    expect(emptyTitle).toBeVisible();
  });
});
