import { screen, fireEvent } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  const mockBackgroundOnClick = vi.fn();
  
  beforeEach(() => {
    mockBackgroundOnClick.mockClear();
  });

  it('renders with default props', () => {
    testRender(<Modal />);
    
    // When aria-hidden="true", we need to use hidden: true option
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).not.toBeVisible();
  });

  it('renders children when provided', () => {
    testRender(
      <Modal show={true}>
        <div>Modal content</div>
      </Modal>
    );
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveTextContent('Modal content');
  });

  it('applies correct aria-label when provided', () => {
    testRender(
      <Modal aria-label="Custom modal label">
        <div>Content</div>
      </Modal>
    );
    
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).toHaveAttribute('aria-label', 'Custom modal label');
  });

  it('renders without aria-label when not provided', () => {
    testRender(
      <Modal>
        <div>Content</div>
      </Modal>
    );
    
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).not.toHaveAttribute('aria-label');
  });

  it('calls backgroundOnClick when background is clicked', () => {
    testRender(
      <Modal backgroundOnClick={mockBackgroundOnClick}>
        <div>Modal content</div>
      </Modal>
    );
    
    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);
    
    expect(mockBackgroundOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call backgroundOnClick when content is clicked', () => {
    testRender(
      <Modal backgroundOnClick={mockBackgroundOnClick}>
        <div>Modal content</div>
      </Modal>
    );
    
    const content = screen.getByText('Modal content');
    fireEvent.click(content);
    
    expect(mockBackgroundOnClick).not.toHaveBeenCalled();
  });

  it('handles missing backgroundOnClick gracefully', () => {
    testRender(
      <Modal>
        <div>Modal content</div>
      </Modal>
    );
    
    const background = screen.getByTestId('modal-background');
    
    // Should not throw error when clicking background without handler
    expect(() => {
      fireEvent.click(background);
    }).not.toThrow();
  });

  it('has proper accessibility attributes for screen readers', () => {
    testRender(
      <Modal show={true} aria-label="Confirmation dialog">
        <div>Are you sure?</div>
      </Modal>
    );
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-hidden', 'false');
    expect(modal).toHaveAttribute('aria-label', 'Confirmation dialog');
  });

  it('handles complex children content', () => {
    testRender(
      <Modal show={true}>
        <div>
          <h2>Modal Title</h2>
          <p>Modal description</p>
          <button>Action</button>
        </div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Title')).toBeVisible();
    expect(screen.getByText('Modal description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Action' })).toBeVisible();
  });

  it('supports nested interactive elements', () => {
    testRender(
      <Modal show={true} backgroundOnClick={mockBackgroundOnClick}>
        <div>
          <button>Primary</button>
          <button>Secondary</button>
        </div>
      </Modal>
    );
    
    const primaryButton = screen.getByRole('button', { name: 'Primary' });
    const secondaryButton = screen.getByRole('button', { name: 'Secondary' });
    
    fireEvent.click(primaryButton);
    fireEvent.click(secondaryButton);
    
    // Clicking buttons should not trigger background click
    expect(mockBackgroundOnClick).not.toHaveBeenCalled();
  });

  it('handles rapid show/hide toggling', () => {
    const { testRerender } = testRender(
      <Modal show={false}>
        <div>Content</div>
      </Modal>
    );
    
    // Rapidly toggle visibility
    testRerender(<Modal show={true}><div>Content</div></Modal>);
    testRerender(<Modal show={false}><div>Content</div></Modal>);
    testRerender(<Modal show={true}><div>Content</div></Modal>);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();
  });

  it('handles multiple background clicks', () => {
    testRender(
      <Modal show={true} backgroundOnClick={mockBackgroundOnClick}>
        <div>Content</div>
      </Modal>
    );
    
    const background = screen.getByTestId('modal-background');
    
    // Click background multiple times
    fireEvent.click(background);
    fireEvent.click(background);
    fireEvent.click(background);
    
    expect(mockBackgroundOnClick).toHaveBeenCalledTimes(3);
  });

  it('preserves children when visibility changes', () => {
    const { testRerender } = testRender(
      <Modal show={false}>
        <div>Persistent content</div>
      </Modal>
    );
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).toHaveTextContent('Persistent content');
    expect(modal).not.toBeVisible();
    
    testRerender(
      <Modal show={true}>
        <div>Persistent content</div>
      </Modal>
    );
    
    expect(modal).toHaveTextContent('Persistent content');
    expect(modal).toBeVisible();
  });
});
