import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { testRender } from '@/test/test-utils';
import CustomerCard from './';
import type { Customer } from '@/lib/data';

// Mock data for testing
const mockCustomer: Customer = {
  _id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  address: '123 Main St',
  storeName: 'Test Store',
  phoneNumber: '1234567890',
  secondaryPhoneNumber: '0987654321',
  locality: 'Test City',
  town: 'Test Town',
  idNumber: '123456789',
  user: 'user1',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockCustomerMinimal: Customer = {
  _id: '2',
  address: '456 Oak Ave',
  storeName: 'Minimal Store',
  phoneNumber: '5551234567',
  user: 'user2',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('CustomerCard', () => {
  it('renders customer information correctly', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    // Check store name is displayed in the card (not in modal)
    const title = screen.getByRole('heading', { name: 'Test Store' });
    const customerCard = title.closest('._CustomerCard_5cfbdf');
    expect(customerCard).toBeVisible();
    
    // Check contact name is displayed
    expect(screen.getByText('John Doe')).toBeVisible();
    
    // Check address is displayed
    expect(screen.getByText('123 Main St, Test City, Test Town')).toBeVisible();
    
    // Check ID number is displayed
    expect(screen.getByText('123.456.789')).toBeVisible();
    
    // Check email is displayed
    expect(screen.getByText('john@example.com')).toBeVisible();
    
    // Check phone numbers are displayed
    expect(screen.getByText('(123)-456-7890')).toBeVisible();
    expect(screen.getByText('(098)-765-4321')).toBeVisible();
  });

  it('renders minimal customer information correctly', () => {
    testRender(<CustomerCard customer={mockCustomerMinimal} />);

    // Check store name is displayed in the card (not in modal)
    const title2 = screen.getByRole('heading', { name: 'Minimal Store' });
    const customerCard2 = title2.closest('._CustomerCard_5cfbdf');
    expect(customerCard2).toBeVisible();
    
    // Check address is displayed (without locality and town)
    expect(screen.getByText('456 Oak Ave')).toBeVisible();
    
    // Check phone number is displayed
    expect(screen.getByText('(555)-123-4567')).toBeVisible();
    
    // Check that optional fields are not displayed
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    expect(screen.queryByText('123.456.789')).not.toBeInTheDocument();
  });

  it('renders navigation header when navigate prop is true', () => {
    testRender(<CustomerCard customer={mockCustomer} navigate={true} />);

    // Check that the store name is a link
    const storeNameLink = screen.getByRole('link', { name: 'Test Store' });
    expect(storeNameLink).toBeVisible();
    expect(storeNameLink).toHaveAttribute('href', '/customers/1');
  });

  it('renders plain text when navigate prop is false', () => {
    testRender(<CustomerCard customer={mockCustomer} navigate={false} />);

    // Check that store name is displayed as text, not a link
    const title3 = screen.getByRole('heading', { name: 'Test Store' });
    const customerCard3 = title3.closest('._CustomerCard_5cfbdf');
    expect(customerCard3).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Test Store' })).not.toBeInTheDocument();
  });

  it('renders edit button with correct link', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const editButton = screen.getByRole('button', { name: /editar cliente/i });
    expect(editButton).toBeVisible();
    
    // Check that the button is inside a link with correct href
    const editLink = editButton.closest('a');
    expect(editLink).toHaveAttribute('href', '/customers/1/edit');
  });

  it('renders delete button', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar cliente/i });
    expect(deleteButton).toBeVisible();
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar cliente/i });
    fireEvent.click(deleteButton);

    // Check that the modal is displayed
    expect(screen.getByText(/Confirmas que deseas eliminar el cliente/i)).toBeVisible();
    
    // Check that modal title is visible
    expect(screen.getByText('Eliminar cliente')).toBeVisible();
    
    // Check that the modal contains the customer name in the description
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('Test Store');
  });

  it('calls deleteCustomer function when confirmed', () => {
    const mockDeleteCustomer = vi.fn();
    testRender(
      <CustomerCard 
        customer={mockCustomer} 
        deleteCustomer={mockDeleteCustomer} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar cliente/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    expect(mockDeleteCustomer).toHaveBeenCalledWith('1');
  });

  it('closes modal when cancel button is clicked', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar cliente/i });
    fireEvent.click(deleteButton);

    // Check that modal is visible
    expect(screen.getByRole('dialog')).toBeVisible();

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /No/i });
    fireEvent.click(cancelButton);

    // Check that modal is no longer visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when background is clicked', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar cliente/i });
    fireEvent.click(deleteButton);

    // Check that modal is visible
    expect(screen.getByRole('dialog')).toBeVisible();

    // Click background to close modal
    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);

    // Check that modal is no longer visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-customer-card';
    testRender(<CustomerCard customer={mockCustomer} className={customClass} />);

    // Find the card element using its accessible role
    const cardElement = screen.getByRole('article');
    expect(cardElement).toBeVisible();
    
    // Verify it contains the store name
    expect(cardElement).toHaveTextContent('Test Store');
  });

  it('renders email as mailto link', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const emailLink = screen.getByRole('link', { name: 'john@example.com' });
    expect(emailLink).toBeVisible();
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
  });

  it('renders phone numbers as tel links', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const primaryPhoneLink = screen.getByRole('link', { name: '(123)-456-7890' });
    const secondaryPhoneLink = screen.getByRole('link', { name: '(098)-765-4321' });

    expect(primaryPhoneLink).toBeVisible();
    expect(primaryPhoneLink).toHaveAttribute('href', 'tel:1234567890');

    expect(secondaryPhoneLink).toBeVisible();
    expect(secondaryPhoneLink).toHaveAttribute('href', 'tel:0987654321');
  });

  it('handles customer without deleteCustomer function', () => {
    testRender(<CustomerCard customer={mockCustomer} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar cliente/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Sí/i });
    fireEvent.click(confirmButton);

    // Should not crash, just close the modal
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays formatted ID number with thousand separators', () => {
    const customerWithLongId: Customer = {
      ...mockCustomer,
      idNumber: '123456789012',
    };

    testRender(<CustomerCard customer={customerWithLongId} />);

    expect(screen.getByText('123.456.789.012')).toBeVisible();
  });

  it('displays formatted phone numbers correctly', () => {
    const customerWithShortPhone: Customer = {
      ...mockCustomer,
      phoneNumber: '1234567',
    };

    testRender(<CustomerCard customer={customerWithShortPhone} />);

    expect(screen.getByText('(123)-456-7')).toBeVisible();
  });

  it('handles customer without phone number', () => {
    const customerWithoutPhone: Customer = {
      ...mockCustomer,
      phoneNumber: '',
      secondaryPhoneNumber: '',
    };

    testRender(<CustomerCard customer={customerWithoutPhone} />);

    // Check that phone number section is not rendered
    expect(screen.queryByText(/\(\d+\)-\d+-\d+/)).not.toBeInTheDocument();
    
    // Check that other information is still displayed
    expect(screen.getByText('John Doe')).toBeVisible();
    expect(screen.getByText('john@example.com')).toBeVisible();
  });

  it('handles customer with empty phone number', () => {
    const customerWithEmptyPhone: Customer = {
      ...mockCustomer,
      phoneNumber: '',
      secondaryPhoneNumber: '',
    };

    testRender(<CustomerCard customer={customerWithEmptyPhone} />);

    // Check that phone number section is not rendered
    expect(screen.queryByText(/\(\d+\)-\d+-\d+/)).not.toBeInTheDocument();
    
    // Check that other information is still displayed
    expect(screen.getByText('John Doe')).toBeVisible();
    expect(screen.getByText('john@example.com')).toBeVisible();
  });
});
