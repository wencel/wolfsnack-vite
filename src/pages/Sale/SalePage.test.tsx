import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import SalePage from './';
import { axiosMock } from '@/test/setup';
import { mockSales } from '../../test/testData';
import { textConstants } from '@/lib/appConstants';

describe('SalePage', () => {
  beforeEach(() => {
    // Mock window.history.back
    window.history.back = vi.fn();
  });

  afterEach(() => {
    axiosMock.reset();
    vi.clearAllMocks();
  });

  const renderSalePage = (saleId: string = '1') => {
    return testRender(<SalePage />, {
      initialEntries: [`/sales/${saleId}`],
      mountPath: '/sales/:id',
    });
  };

  it('fetches and displays sale details from API', async () => {
    // Mock the sale fetch API call
    axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

    renderSalePage('1');

    // Wait for loading to complete and sale to display
    const article = await screen.findByRole('article');

    // Verify sale details are rendered
    expect(
      screen.getByRole('heading', { level: 2, name: /^Venta 1/ })
    ).toBeVisible();
    expect(within(article).getByText(/Test Store 1/i)).toBeVisible();
    expect(within(article).getByText(/John Doe/)).toBeVisible();
  });

  it('displays loading spinner while fetching sale', async () => {
    // Mock a delayed response
    axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

    renderSalePage('1');

    // Should show loading initially
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeVisible();

    // Wait for loading to complete
    await screen.findByRole('heading', { level: 2, name: /Venta/ });
  });

  it('renders top action buttons correctly', async () => {
    axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

    renderSalePage('1');

    await screen.findByRole('heading', { level: 2, name: /Venta/ });

    const backButton = screen.getByRole('link', {
      name: textConstants.misc.BACK,
    });
    const addSaleButton = screen.getByRole('link', {
      name: textConstants.addSale.ADD_SALE,
    });

    expect(backButton).toBeVisible();
    expect(addSaleButton).toBeVisible();
    expect(backButton).toHaveAttribute('href', '/sales');
    expect(addSaleButton).toHaveAttribute('href', '/sales/new');
  });

  it('displays sale card with correct information', async () => {
    axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

    renderSalePage('1');

    const article = await screen.findByRole('article');

    // Check sale card content
    expect(
      screen.getByRole('heading', { level: 2, name: /Venta 1/ })
    ).toBeVisible();
    expect(within(article).getByText(/Test Store 1/)).toBeVisible();
    expect(within(article).getByText(/John Doe/)).toBeVisible();

    // Check product information
    expect(within(article).getByText(/Wolf Snack Mix/)).toBeVisible();
    expect(within(article).getByText(/Bolsa/)).toBeVisible();
    expect(within(article).getByText(/500g/)).toBeVisible();
    expect(within(article).getByText(/2 Unidades/)).toBeVisible();

    // Check pricing information
    expect(
      within(article).getByText(textConstants.sale.PRODUCT_TOTAL_PRICE)
    ).toBeVisible();
    expect(
      within(article).getByText(textConstants.sale.PARTIAL_PAYMENT)
    ).toBeVisible();
    expect(
      within(article).getByText(textConstants.sale.REMAINING_PAYMENT)
    ).toBeVisible();
    expect(
      within(article).getByText(textConstants.sale.TOTAL_PRICE)
    ).toBeVisible();
  });

  it('handles sale with thirteen dozen correctly', async () => {
    // Use the second sale which has isThirteenDozen: true
    axiosMock.onGet('/sales/2').reply(200, mockSales[1]);

    renderSalePage('2');

    await screen.findByRole('heading', { level: 2, name: /Venta/ });

    const article = screen.getByRole('article');

    // Check that thirteen dozen indicator is shown
    expect(
      within(article).getByText(textConstants.sale.IS_THIRTEEN_DOZEN)
    ).toBeVisible();
  });

  it('handles sale with partial payment correctly', async () => {
    // Use the second sale which has partialPayment > 0
    axiosMock.onGet('/sales/2').reply(200, mockSales[1]);

    renderSalePage('2');

    const article = await screen.findByRole('article');

    // Check partial payment and remaining payment
    expect(
      screen.getByRole('heading', { level: 2, name: /Venta 2/ })
    ).toBeVisible();
    expect(
      within(article).getByText(textConstants.sale.PARTIAL_PAYMENT)
    ).toBeVisible();
    expect(
      within(article).getByText(textConstants.sale.REMAINING_PAYMENT)
    ).toBeVisible();
    expect(within(article).getByText('$20')).toBeVisible(); // partialPayment
    expect(within(article).getByText('$19,98')).toBeVisible(); // remaining payment (39.98 - 20.00)
  });

  it('handles API errors gracefully', async () => {
    axiosMock
      .onGet('/sales/1')
      .reply(500, { message: 'Internal Server Error' });

    renderSalePage('1');

    // Should not crash and should show loading state
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeVisible();
  });

  it('displays sale with product information from API', async () => {
    // Sale data from API should already include populated product information
    axiosMock.onGet('/sales/1').reply(200, mockSales[0]);

    renderSalePage('1');

    const article = await screen.findByRole('article');

    // Should display product information from sale data
    expect(
      screen.getByRole('heading', { level: 2, name: /Venta 1/ })
    ).toBeVisible();
    expect(within(article).getByText(/Wolf Snack Mix/)).toBeVisible();
    expect(within(article).getByText(/Bolsa/)).toBeVisible();
  });

  it('handles delete sale functionality and navigates back', async () => {
    axiosMock.onGet('/sales/1').reply(200, mockSales[0]);
    axiosMock.onDelete('/sales/1').reply(200);

    renderSalePage('1');

    await screen.findByRole('heading', { level: 2, name: /Venta/ });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', {
      name: /eliminar venta/i,
    });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    // Verify window.history.back was called
    expect(window.history.back).toHaveBeenCalled();
  });

  it('displays sale even when sale has no products', async () => {
    const saleWithoutProducts = {
      ...mockSales[0],
      products: [],
    };

    axiosMock.onGet('/sales/1').reply(200, saleWithoutProducts);

    renderSalePage('1');

    // Should still display sale information even without products
    const heading = await screen.findByRole('heading', {
      level: 2,
      name: /Venta 1/,
    });
    expect(heading).toBeVisible();
  });
});
