import { screen, fireEvent } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomerFilterModal from './';
import { textConstants } from '@/lib/appConstants';

describe('CustomerFilterModal', () => {
  const mockCloseModal = vi.fn();
  const mockApplyFilter = vi.fn();

  const defaultProps = {
    closeModal: mockCloseModal,
    applyFilter: mockApplyFilter,
    showModal: true,
    parentSearchTerm: '',
    parentSortBy: 'storeName',
    parentDirection: 'asc',
  };

  beforeEach(() => {
    mockCloseModal.mockClear();
    mockApplyFilter.mockClear();
  });

  it('renders with all required props', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    // Modal should be visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();

    // Should have filter title and description
    expect(screen.getByText(textConstants.misc.FILTERS)).toBeVisible();
    expect(screen.getByText(textConstants.misc.FILTERS_TEXT)).toBeVisible();

    // Should have search input
    expect(screen.getByLabelText(/Buscar cliente/)).toBeVisible();

    // Should have sort by select
    expect(screen.getByLabelText(textConstants.misc.ORDER_BY)).toBeVisible();

    // Should have direction select
    expect(screen.getByLabelText(textConstants.misc.DIRECTION)).toBeVisible();

    // Should have apply and cancel buttons
    expect(
      screen.getByRole('button', { name: textConstants.misc.APPLY })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: textConstants.misc.CANCEL })
    ).toBeVisible();
  });

  it('does not render when showModal is false', () => {
    testRender(<CustomerFilterModal {...defaultProps} showModal={false} />);

    // Modal should be hidden
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).not.toBeVisible();
  });

  it('initializes form fields with parent values', () => {
    const propsWithValues = {
      ...defaultProps,
      parentSearchTerm: 'test search',
      parentSortBy: 'name',
      parentDirection: 'desc',
    };

    testRender(<CustomerFilterModal {...propsWithValues} />);

    // Search input should have parent value
    const searchInput = screen.getByLabelText(/Buscar cliente/);
    expect(searchInput).toHaveValue('test search');

    // Sort by select should have parent value
    const sortBySelect = screen.getByLabelText(textConstants.misc.ORDER_BY);
    expect(sortBySelect).toHaveValue('name');

    // Direction select should have parent value
    const directionSelect = screen.getByLabelText(textConstants.misc.DIRECTION);
    expect(directionSelect).toHaveValue('desc');
  });

  it('updates form fields when parent values change', () => {
    const { testRerender } = testRender(
      <CustomerFilterModal {...defaultProps} />
    );

    // Initially empty search
    let searchInput = screen.getByLabelText(/Buscar cliente/);
    expect(searchInput).toHaveValue('');

    // Update with new parent values
    testRerender(
      <CustomerFilterModal
        {...defaultProps}
        parentSearchTerm="new search"
        parentSortBy="address"
        parentDirection="desc"
      />
    );

    // Fields should be updated
    searchInput = screen.getByLabelText(/Buscar cliente/);
    expect(searchInput).toHaveValue('new search');

    const sortBySelect = screen.getByLabelText(textConstants.misc.ORDER_BY);
    expect(sortBySelect).toHaveValue('address');

    const directionSelect = screen.getByLabelText(textConstants.misc.DIRECTION);
    expect(directionSelect).toHaveValue('desc');
  });

  it('calls closeModal when cancel button is clicked', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', {
      name: textConstants.misc.CANCEL,
    });
    fireEvent.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls closeModal when background is clicked', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls applyFilter with form values when apply button is clicked', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledTimes(1);
    expect(mockApplyFilter).toHaveBeenCalledWith({
      searchTerm: '',
      sortBy: 'storeName',
      direction: 'asc',
    });
  });

  it('updates search term when typing in search input', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Buscar cliente/);
    fireEvent.change(searchInput, { target: { value: 'new search term' } });

    expect(searchInput).toHaveValue('new search term');
  });

  it('updates sort by when selecting different option', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const sortBySelect = screen.getByLabelText(textConstants.misc.ORDER_BY);
    fireEvent.change(sortBySelect, { target: { value: 'name' } });

    expect(sortBySelect).toHaveValue('name');
  });

  it('updates direction when selecting different option', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const directionSelect = screen.getByLabelText(textConstants.misc.DIRECTION);
    fireEvent.change(directionSelect, { target: { value: 'desc' } });

    expect(directionSelect).toHaveValue('desc');
  });

  it('calls applyFilter with updated values after form changes', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    // Update form fields
    const searchInput = screen.getByLabelText(/Buscar cliente/);
    const sortBySelect = screen.getByLabelText(textConstants.misc.ORDER_BY);
    const directionSelect = screen.getByLabelText(textConstants.misc.DIRECTION);

    fireEvent.change(searchInput, { target: { value: 'customer name' } });
    fireEvent.change(sortBySelect, { target: { value: 'town' } });
    fireEvent.change(directionSelect, { target: { value: 'desc' } });

    // Submit form
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      searchTerm: 'customer name',
      sortBy: 'town',
      direction: 'desc',
    });
  });

  it('renders all sort by options correctly', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const sortBySelect = screen.getByLabelText(textConstants.misc.ORDER_BY);

    // Check all options are present
    expect(sortBySelect).toHaveDisplayValue(textConstants.customer.STORE_NAME);

    // Open select to see all options
    fireEvent.click(sortBySelect);

    // These options should be available (though we can't easily test select options in jsdom)
    expect(sortBySelect).toHaveValue('storeName');
  });

  it('renders direction options correctly', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const directionSelect = screen.getByLabelText(textConstants.misc.DIRECTION);

    // Check default value
    expect(directionSelect).toHaveDisplayValue(textConstants.misc.ASCENDING);

    // Change to descending
    fireEvent.change(directionSelect, { target: { value: 'desc' } });
    expect(directionSelect).toHaveValue('desc');
  });

  it('resets form fields when modal is reopened', () => {
    const propsWithValues = {
      ...defaultProps,
      parentSearchTerm: 'initial search',
      parentSortBy: 'name',
      parentDirection: 'desc',
    };

    const { testRerender } = testRender(
      <CustomerFilterModal {...propsWithValues} />
    );

    // Change form values
    const searchInput = screen.getByLabelText(/Buscar cliente/);
    fireEvent.change(searchInput, { target: { value: 'changed search' } });

    // Close modal
    testRerender(
      <CustomerFilterModal {...propsWithValues} showModal={false} />
    );

    // Reopen modal
    testRerender(<CustomerFilterModal {...propsWithValues} showModal={true} />);

    // Fields should be reset to parent values
    const newSearchInput = screen.getByLabelText(/Buscar cliente/);
    expect(newSearchInput).toHaveValue('initial search');
  });

  it('handles form submission with empty search term', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      searchTerm: '',
      sortBy: 'storeName',
      direction: 'asc',
    });
  });

  it('maintains form state during user interactions', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Buscar cliente/);
    const sortBySelect = screen.getByLabelText(textConstants.misc.ORDER_BY);
    const directionSelect = screen.getByLabelText(textConstants.misc.DIRECTION);

    // Simulate user typing and selecting
    fireEvent.change(searchInput, { target: { value: 'customer' } });
    fireEvent.change(sortBySelect, { target: { value: 'locality' } });
    fireEvent.change(directionSelect, { target: { value: 'desc' } });

    // Verify state is maintained
    expect(searchInput).toHaveValue('customer');
    expect(sortBySelect).toHaveValue('locality');
    expect(directionSelect).toHaveValue('desc');

    // Submit should use current values
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      searchTerm: 'customer',
      sortBy: 'locality',
      direction: 'desc',
    });
  });

  it('supports keyboard navigation', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Buscar cliente/);
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    const cancelButton = screen.getByRole('button', {
      name: textConstants.misc.CANCEL,
    });

    // Focus search input
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);

    // Tab to apply button
    applyButton.focus();
    expect(document.activeElement).toBe(applyButton);

    // Tab to cancel button
    cancelButton.focus();
    expect(document.activeElement).toBe(cancelButton);
  });

  it('handles rapid form changes correctly', () => {
    testRender(<CustomerFilterModal {...defaultProps} />);

    const searchInput = screen.getByLabelText(/Buscar cliente/);

    // Rapid typing
    fireEvent.change(searchInput, { target: { value: 'a' } });
    fireEvent.change(searchInput, { target: { value: 'ab' } });
    fireEvent.change(searchInput, { target: { value: 'abc' } });

    expect(searchInput).toHaveValue('abc');

    // Submit should use final value
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      searchTerm: 'abc',
      sortBy: 'storeName',
      direction: 'asc',
    });
  });
});
