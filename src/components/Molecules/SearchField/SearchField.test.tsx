import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testRender } from '@/test/test-utils';
import SearchField from './';
import type { SearchItem } from './SearchField';

// Mock data for testing
const mockItems: SearchItem[] = [
  { value: 'item1', label: 'First Item' },
  { value: 'item2', label: 'Second Item' },
  { value: 'item3', label: 'Third Item' },
];

const mockCustomerItems: SearchItem[] = [
  { 
    value: { _id: '1', name: 'John Doe', storeName: 'Store ABC' } as any, 
    label: 'John Doe - Store ABC' 
  },
  { 
    value: { _id: '2', name: 'Jane Smith', storeName: 'Store XYZ' } as any, 
    label: 'Jane Smith - Store XYZ' 
  },
];

const mockOnSearch = vi.fn();
const mockOnSelect = vi.fn();

describe('SearchField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    testRender(<SearchField itemsList={[]} />);

    // Check that the search input is rendered
    const searchInput = screen.getByLabelText('Buscar');
    expect(searchInput).toBeVisible();
    expect(searchInput).toHaveValue('');
  });

  it('renders with custom label', () => {
    const customLabel = 'Custom Search Label';
    testRender(<SearchField itemsList={[]} label={customLabel} />);

    const searchInput = screen.getByLabelText(customLabel);
    expect(searchInput).toBeVisible();
  });

  it('calls onSearch when input value changes', async () => {
    testRender(
      <SearchField 
        itemsList={[]} 
        onSearch={mockOnSearch} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('shows cancel button when there is input value', () => {
    testRender(<SearchField itemsList={[]} />);

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Now we can use the accessible name
    const cancelButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
    expect(cancelButton).toBeVisible();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('shows cancel button when there are items in the list', () => {
    testRender(<SearchField itemsList={mockItems} />);

    // Check that a cancel button is present when there are items
    const cancelButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
    expect(cancelButton).toBeVisible();
  });

  it('shows cancel button when loading', () => {
    testRender(<SearchField itemsList={[]} isLoading={true} />);

    // Check that a cancel button is present when loading
    const cancelButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
    expect(cancelButton).toBeVisible();
  });

  it('hides cancel button when no input, no items, and not loading', () => {
    testRender(<SearchField itemsList={[]} isLoading={false} />);

    const cancelButton = screen.queryByRole('button');
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('clears input and calls onSelect when cancel button is clicked', () => {
    testRender(
      <SearchField 
        itemsList={[]} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const cancelButton = screen.getByRole('button', { name: 'Limpiar búsqueda' });
    fireEvent.click(cancelButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it('shows loading indicator when isLoading is true', () => {
    testRender(<SearchField itemsList={[]} isLoading={true} />);

    // The loading indicator should be visible
    expect(screen.getByTestId('inline-loading')).toBeVisible();
  });

  it('shows "no results" message when there is input but no items', () => {
    testRender(<SearchField itemsList={[]} />);

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(screen.getByText('No hay resultado de la busqueda')).toBeVisible();
  });

  it('shows items list when there are items and input value', () => {
    testRender(
      <SearchField 
        itemsList={mockItems} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Check that all items are displayed
    expect(screen.getByText('First Item')).toBeVisible();
    expect(screen.getByText('Second Item')).toBeVisible();
    expect(screen.getByText('Third Item')).toBeVisible();
  });

  it('calls onSelect when an item is clicked', () => {
    testRender(
      <SearchField 
        itemsList={mockItems} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const firstItem = screen.getByText('First Item');
    fireEvent.click(firstItem);

    expect(mockOnSelect).toHaveBeenCalledWith('item1');
  });

  it('clears input when an item is selected', () => {
    testRender(
      <SearchField 
        itemsList={mockItems} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const firstItem = screen.getByText('First Item');
    fireEvent.click(firstItem);

    expect(searchInput).toHaveValue('');
  });

  it('handles customer objects as item values', () => {
    testRender(
      <SearchField 
        itemsList={mockCustomerItems} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const firstItem = screen.getByText('John Doe - Store ABC');
    fireEvent.click(firstItem);

    expect(mockOnSelect).toHaveBeenCalledWith(mockCustomerItems[0].value);
  });

  it('handles null values in items list', () => {
    const itemsWithNull: SearchItem[] = [
      { value: null, label: 'Null Item' },
      { value: 'valid', label: 'Valid Item' },
    ];

    testRender(
      <SearchField 
        itemsList={itemsWithNull} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const nullItem = screen.getByText('Null Item');
    fireEvent.click(nullItem);

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it('handles number values in items list', () => {
    const itemsWithNumbers: SearchItem[] = [
      { value: 123, label: 'Number Item' },
      { value: 'text', label: 'Text Item' },
    ];

    testRender(
      <SearchField 
        itemsList={itemsWithNumbers} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const numberItem = screen.getByText('Number Item');
    fireEvent.click(numberItem);

    expect(mockOnSelect).toHaveBeenCalledWith(123);
  });

  it('shows value display when value prop is provided', () => {
    const testValue = 'selected-value';
    const testLabel = 'Selected Value Label';
    
    testRender(
      <SearchField 
        itemsList={[]} 
        value={testValue}
        valueLabel={testLabel}
      />
    );

    const valueInput = screen.getByLabelText(testLabel);
    expect(valueInput).toBeVisible();
    expect(valueInput).toHaveValue(testValue);
    expect(valueInput).toBeDisabled();
  });

  it('shows value display with customer object', () => {
    const customerValue = { _id: '1', name: 'John Doe', storeName: 'Store ABC' } as any;
    const testLabel = 'Selected Customer';
    
    testRender(
      <SearchField 
        itemsList={[]} 
        value={customerValue}
        valueLabel={testLabel}
      />
    );

    const valueInput = screen.getByLabelText(testLabel);
    expect(valueInput).toBeVisible();
    expect(valueInput).toHaveValue('[object Object]'); // Object.toString() result
    expect(valueInput).toBeDisabled();
  });

  it('shows value display with number value', () => {
    const numberValue = 42;
    const testLabel = 'Selected Number';
    
    testRender(
      <SearchField 
        itemsList={[]} 
        value={numberValue}
        valueLabel={testLabel}
      />
    );

    const valueInput = screen.getByLabelText(testLabel);
    expect(valueInput).toBeVisible();
    expect(valueInput).toHaveValue('42');
    expect(valueInput).toBeDisabled();
  });

  it('has cancel button for value display', () => {
    const testValue = 'selected-value';
    const testLabel = 'Selected Value Label';
    
    testRender(
      <SearchField 
        itemsList={[]} 
        value={testValue}
        valueLabel={testLabel}
        onSelect={mockOnSelect}
      />
    );

    // Only the value display cancel button should be present when there's no input/search activity
    const valueCancelButton = screen.getByRole('button', { name: 'Limpiar valor seleccionado' });
    expect(valueCancelButton).toBeVisible();
    
    // The search cancel button should not be present since there's no input value
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument();
  });

  it('calls onSelect with null when value display cancel button is clicked', () => {
    const testValue = 'selected-value';
    const testLabel = 'Selected Value Label';
    
    testRender(
      <SearchField 
        itemsList={[]} 
        value={testValue}
        valueLabel={testLabel}
        onSelect={mockOnSelect}
      />
    );

    // Click the value display cancel button specifically
    const valueCancelButton = screen.getByRole('button', { name: 'Limpiar valor seleccionado' });
    fireEvent.click(valueCancelButton);

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });



  it('calls onSearch for each input change', async () => {
    testRender(
      <SearchField 
        itemsList={[]} 
        onSearch={mockOnSearch} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 't' } });
    fireEvent.change(searchInput, { target: { value: 'te' } });
    fireEvent.change(searchInput, { target: { value: 'tes' } });
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Wait for the final call
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });

    // Should have been called for each change plus initial call (no debouncing)
    expect(mockOnSearch).toHaveBeenCalledTimes(5);
  });

  it('handles empty string input', async () => {
    testRender(
      <SearchField 
        itemsList={[]} 
        onSearch={mockOnSearch} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });

  it('handles special characters in search input', async () => {
    testRender(
      <SearchField 
        itemsList={[]} 
        onSearch={mockOnSearch} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    const specialValue = 'test@#$%^&*()';
    fireEvent.change(searchInput, { target: { value: specialValue } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(specialValue);
    });
  });

  it('handles very long search input', async () => {
    testRender(
      <SearchField 
        itemsList={[]} 
        onSearch={mockOnSearch} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    const longValue = 'a'.repeat(1000);
    fireEvent.change(searchInput, { target: { value: longValue } });

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith(longValue);
    });
  });

  it('clears input after item selection', () => {
    testRender(
      <SearchField 
        itemsList={mockItems} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const firstItem = screen.getByText('First Item');
    fireEvent.click(firstItem);

    // Input should be cleared after selection
    expect(searchInput).toHaveValue('');
  });

  it('handles multiple item selections sequentially', () => {
    testRender(
      <SearchField 
        itemsList={mockItems} 
        onSelect={mockOnSelect} 
      />
    );

    const searchInput = screen.getByLabelText('Buscar');
    
    // First selection
    fireEvent.change(searchInput, { target: { value: 'test' } });
    const firstItem = screen.getByText('First Item');
    fireEvent.click(firstItem);
    expect(mockOnSelect).toHaveBeenCalledWith('item1');
    
    // Second selection (input is cleared, so we need to type again)
    fireEvent.change(searchInput, { target: { value: 'test2' } });
    const secondItem = screen.getByText('Second Item');
    fireEvent.click(secondItem);
    expect(mockOnSelect).toHaveBeenCalledWith('item2');
  });
});
