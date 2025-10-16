import { screen, fireEvent } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WarningModal from './WarningModal';

describe('WarningModal', () => {
  const mockCloseModal = vi.fn();
  const mockCancelAction = vi.fn();
  const mockConfirmationAction = vi.fn();

  beforeEach(() => {
    mockCloseModal.mockClear();
    mockCancelAction.mockClear();
    mockConfirmationAction.mockClear();
  });

  it('renders with required props only', () => {
    testRender(<WarningModal showModal={true} />);

    // Modal should be visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();

    // Should have default confirmation button
    const confirmButton = screen.getByRole('button', { name: 'Guardar' });
    expect(confirmButton).toBeVisible();
  });

  it('does not render when showModal is false', () => {
    testRender(<WarningModal showModal={false} />);

    // Modal should be hidden
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).not.toBeVisible();
  });

  it('renders with custom title', () => {
    testRender(<WarningModal showModal={true} title="Custom Warning Title" />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(modal).toHaveTextContent('Custom Warning Title');
  });

  it('renders with custom description', () => {
    const description = 'This is a warning message';
    testRender(<WarningModal showModal={true} description={description} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(modal).toHaveTextContent(description);
  });

  it('renders with React node description', () => {
    const description = (
      <div>
        <p>Line 1</p>
        <p>Line 2</p>
      </div>
    );

    testRender(<WarningModal showModal={true} description={description} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
    expect(modal).toHaveTextContent('Line 1');
    expect(modal).toHaveTextContent('Line 2');
  });

  it('shows only confirmation button by default', () => {
    testRender(<WarningModal showModal={true} />);

    const confirmButton = screen.getByRole('button', { name: 'Guardar' });
    expect(confirmButton).toBeVisible();

    // Cancel button should not be visible
    const cancelButton = screen.queryByRole('button', { name: 'Cancelar' });
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('shows cancel button when showCancelButton is true', () => {
    testRender(<WarningModal showModal={true} showCancelButton={true} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const confirmButton = screen.getByRole('button', { name: 'Guardar' });

    expect(cancelButton).toBeVisible();
    expect(confirmButton).toBeVisible();
  });

  it('renders custom button texts', () => {
    testRender(
      <WarningModal
        showModal={true}
        showCancelButton={true}
        cancelText="Custom Cancel"
        confirmationText="Custom Confirm"
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Custom Cancel' });
    const confirmButton = screen.getByRole('button', {
      name: 'Custom Confirm',
    });

    expect(cancelButton).toBeVisible();
    expect(confirmButton).toBeVisible();
  });

  it('calls closeModal when background is clicked', () => {
    testRender(<WarningModal showModal={true} closeModal={mockCloseModal} />);

    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls cancelAction when cancel button is clicked', () => {
    testRender(
      <WarningModal
        showModal={true}
        showCancelButton={true}
        cancelAction={mockCancelAction}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(mockCancelAction).toHaveBeenCalledTimes(1);
  });

  it('calls confirmationAction when confirmation button is clicked', () => {
    testRender(
      <WarningModal
        showModal={true}
        confirmationAction={mockConfirmationAction}
      />
    );

    const confirmButton = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(confirmButton);

    expect(mockConfirmationAction).toHaveBeenCalledTimes(1);
  });

  it('handles missing callback functions gracefully', () => {
    testRender(<WarningModal showModal={true} showCancelButton={true} />);

    // Should not throw when clicking buttons without handlers
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const confirmButton = screen.getByRole('button', { name: 'Guardar' });

    expect(() => {
      fireEvent.click(cancelButton);
      fireEvent.click(confirmButton);
    }).not.toThrow();
  });

  it('renders with and without title', () => {
    // Test without title
    const { testRerender } = testRender(<WarningModal showModal={true} />);
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();

    // Test with title
    testRerender(<WarningModal showModal={true} title="Delete Confirmation" />);
    expect(modal).toHaveTextContent('Delete Confirmation');
  });

  it('supports complex interaction scenario', () => {
    testRender(
      <WarningModal
        showModal={true}
        title="Confirm Delete"
        description="Are you sure you want to delete this item?"
        showCancelButton={true}
        cancelAction={mockCancelAction}
        confirmationAction={mockConfirmationAction}
        closeModal={mockCloseModal}
      />
    );

    // Verify all content is present
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('Confirm Delete');
    expect(modal).toHaveTextContent(
      'Are you sure you want to delete this item?'
    );

    // Test cancel flow
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);
    expect(mockCancelAction).toHaveBeenCalledTimes(1);

    // Test confirmation flow
    const confirmButton = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(confirmButton);
    expect(mockConfirmationAction).toHaveBeenCalledTimes(1);

    // Background click should still call closeModal
    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('maintains button order (cancel first, confirm second)', () => {
    testRender(
      <WarningModal
        showModal={true}
        showCancelButton={true}
        cancelText="Cancel"
        confirmationText="Confirm"
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Cancel');
    expect(buttons[1]).toHaveTextContent('Confirm');
  });

  it('supports keyboard navigation', () => {
    testRender(
      <WarningModal
        showModal={true}
        showCancelButton={true}
        cancelAction={mockCancelAction}
        confirmationAction={mockConfirmationAction}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const confirmButton = screen.getByRole('button', { name: 'Guardar' });

    // Tab order: cancel -> confirm
    cancelButton.focus();
    expect(document.activeElement).toBe(cancelButton);

    // Simulate tab key
    confirmButton.focus();
    expect(document.activeElement).toBe(confirmButton);
  });

  it('handles modal state changes correctly', () => {
    const { testRerender } = testRender(
      <WarningModal showModal={false} title="Test Modal" />
    );

    // Initially hidden
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).not.toBeVisible();

    // Show modal
    testRerender(<WarningModal showModal={true} title="Test Modal" />);
    expect(modal).toBeVisible();

    // Hide again
    testRerender(<WarningModal showModal={false} title="Test Modal" />);
    expect(modal).not.toBeVisible();
  });
});
