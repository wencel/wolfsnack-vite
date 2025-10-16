import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Button from './';
import { textConstants } from '@/lib/appConstants';

import styles from './Button.module.sass';

// Mock Radix UI Tooltip components
vi.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-root">{children}</div>
  ),
  Trigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid="tooltip-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-portal">{children}</div>
  ),
  Content: ({
    children,
    className,
    sideOffset,
    side,
  }: {
    children: React.ReactNode;
    className: string;
    sideOffset: number;
    side: string;
  }) => (
    <div
      data-testid="tooltip-content"
      className={className}
      data-side-offset={sideOffset}
      data-side={side}
    >
      {children}
    </div>
  ),
  Arrow: ({ className }: { className: string }) => (
    <div data-testid="tooltip-arrow" className={className} />
  ),
}));

const renderButton = (props = {}) => {
  return render(
    <MemoryRouter>
      <Button {...props} />
    </MemoryRouter>
  );
};

describe('Button', () => {
  describe('Basic Button Rendering', () => {
    it('renders as a button element by default', () => {
      renderButton({ children: 'Click me' });

      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeVisible();
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders children content correctly', () => {
      renderButton({ children: 'Submit Form' });

      expect(screen.getByText('Submit Form')).toBeVisible();
    });

    it('applies custom className to wrapper', () => {
      renderButton({ className: 'custom-class', children: 'Button' });

      const wrapper = screen.getByRole('button').closest('div');
      expect(wrapper).toHaveClass('custom-class');
      expect(wrapper).toHaveClass(styles.Button);
    });

    it('applies theme classes correctly', () => {
      renderButton({ theme: 'Primary', children: 'Primary Button' });

      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles.Primary);
    });

    it('applies active state class when isActive is true', () => {
      renderButton({ isActive: true, children: 'Button' });

      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles.active);
    });
  });

  describe('Link Rendering', () => {
    it('renders as a Link when href is provided', () => {
      renderButton({ href: '/dashboard', children: 'Go to Dashboard' });

      const link = screen.getByRole('link', { name: 'Go to Dashboard' });
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('maintains button content when rendered as link', () => {
      renderButton({ href: '/profile', children: 'View Profile' });

      expect(screen.getByText('View Profile')).toBeVisible();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner and text when loading is true', () => {
      renderButton({ loading: true, children: 'Submit' });

      const spinner = screen.getByRole('status', { name: 'Loading' });
      expect(spinner).toBeVisible();
      expect(screen.getByText(textConstants.misc.SUBMITTING)).toBeVisible();
    });

    it('uses custom loading text when provided', () => {
      renderButton({
        loading: true,
        loadingText: 'Processing...',
        children: 'Submit',
      });

      expect(screen.getByText('Processing...')).toBeVisible();
      expect(
        screen.queryByText(textConstants.misc.SUBMITTING)
      ).not.toBeInTheDocument();
    });

    it('applies loading class when loading is true', () => {
      renderButton({ loading: true, children: 'Submit' });

      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles.loading);
    });

    it('disables button when loading is true', () => {
      renderButton({ loading: true, children: 'Submit' });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('applies loading class to link when loading is true', () => {
      renderButton({ href: '/submit', loading: true, children: 'Submit' });

      const link = screen.getByRole('link');
      expect(link).toHaveClass(styles.loading);
    });

    it('prevents link clicks when loading is true', () => {
      const handleClick = vi.fn();
      renderButton({
        href: '/submit',
        loading: true,
        onClick: handleClick,
        children: 'Submit',
      });

      const link = screen.getByRole('link');
      fireEvent.click(link);

      // Link should not call onClick when loading
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip when tooltip prop is provided', () => {
      renderButton({ tooltip: 'Help text', children: 'Help' });

      expect(screen.getByTestId('tooltip-root')).toBeVisible();
      expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
        'Help text'
      );
    });

    it('does not render tooltip when tooltip prop is not provided', () => {
      renderButton({ children: 'No Tooltip' });

      expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
    });

    it('removes title attribute when tooltip is provided to avoid duplication', () => {
      renderButton({
        tooltip: 'Help text',
        title: 'Original title',
        children: 'Button',
      });

      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('title');
    });

    it('keeps title attribute when no tooltip is provided', () => {
      renderButton({ title: 'Original title', children: 'Button' });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Original title');
    });

    it('removes title attribute from link when tooltip is provided', () => {
      renderButton({
        href: '/test',
        tooltip: 'Help text',
        title: 'Original title',
        children: 'Link Button',
      });

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('title');
    });

    it('keeps title attribute on link when no tooltip is provided', () => {
      renderButton({
        href: '/test',
        title: 'Original title',
        children: 'Link Button',
      });

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('title', 'Original title');
    });

    it('handles complex rest props with tooltip for button', () => {
      renderButton({
        tooltip: 'Help text',
        'data-testid': 'complex-tooltip-button',
        'aria-describedby': 'description',
        title: 'Should be removed',
        children: 'Complex Button',
      });

      const button = screen.getByTestId('complex-tooltip-button');
      expect(button).not.toHaveAttribute('title');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('handles complex rest props with tooltip for link', () => {
      renderButton({
        href: '/complex-tooltip-link',
        tooltip: 'Help text',
        'data-testid': 'complex-tooltip-link',
        'aria-describedby': 'link-description',
        title: 'Should be removed',
        children: 'Complex Link',
      });

      const link = screen.getByTestId('complex-tooltip-link');
      expect(link).not.toHaveAttribute('title');
      expect(link).toHaveAttribute('aria-describedby', 'link-description');
    });
  });

  describe('Accessibility', () => {
    it('provides correct aria-label for loading state', () => {
      renderButton({ loading: true, children: 'Submit' });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', textConstants.misc.LOADING);
    });

    it('provides correct aria-label for custom loading text', () => {
      renderButton({
        loading: true,
        loadingText: 'Processing...',
        children: 'Submit',
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Processing...');
    });

    it('provides correct aria-label for tooltip', () => {
      renderButton({ tooltip: 'Help information', children: 'Help' });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Help information');
    });

    it('provides correct aria-label for children content', () => {
      renderButton({ children: 'Click me' });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Click me');
    });

    it('provides fallback aria-label when no children or tooltip', () => {
      renderButton({});

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute(
        'aria-label',
        textConstants.misc.BUTTON_TEXT
      );
    });
  });

  describe('Event Handling', () => {
    it('calls onClick handler when button is clicked', () => {
      const handleClick = vi.fn();
      renderButton({ onClick: handleClick, children: 'Click me' });

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler when link is clicked', () => {
      const handleClick = vi.fn();
      renderButton({
        href: '/test',
        onClick: handleClick,
        children: 'Click me',
      });

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when button is disabled', () => {
      const handleClick = vi.fn();
      renderButton({
        onClick: handleClick,
        disabled: true,
        children: 'Click me',
      });

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when button is loading', () => {
      const handleClick = vi.fn();
      renderButton({
        onClick: handleClick,
        loading: true,
        children: 'Click me',
      });

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Props Forwarding', () => {
    it('forwards button-specific props to button element', () => {
      renderButton({
        type: 'submit',
        name: 'submit-btn',
        value: 'submit',
        children: 'Submit',
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submit-btn');
      expect(button).toHaveAttribute('value', 'submit');
    });

    it('forwards link-specific props to link element', () => {
      renderButton({
        href: '/test',
        target: '_blank',
        rel: 'noopener',
        children: 'External Link',
      });

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
    });

    it('forwards data attributes', () => {
      renderButton({
        'data-testid': 'custom-button',
        'data-custom': 'value',
        children: 'Button',
      });

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      renderButton({});

      const button = screen.getByRole('button');
      expect(button).toBeVisible();
      expect(button).toHaveAttribute(
        'aria-label',
        textConstants.misc.BUTTON_TEXT
      );
    });

    it('handles numeric children', () => {
      renderButton({ children: 42 });

      const button = screen.getByRole('button', { name: '42' });
      expect(button).toBeVisible();
    });

    it('handles boolean children', () => {
      renderButton({ children: true });

      const button = screen.getByRole('button', { name: 'true' });
      expect(button).toBeVisible();
    });

    it('handles undefined theme gracefully', () => {
      renderButton({ theme: undefined, children: 'Button' });

      const button = screen.getByRole('button');
      expect(button).toBeVisible();
    });

    it('handles empty string theme gracefully', () => {
      renderButton({ theme: '', children: 'Button' });

      const button = screen.getByRole('button');
      expect(button).toBeVisible();
    });

    it('handles disabled prop when not loading', () => {
      renderButton({ disabled: true, children: 'Disabled Button' });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('handles both disabled and loading props', () => {
      renderButton({ disabled: true, loading: true, children: 'Button' });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('handles complex rest props for button', () => {
      renderButton({
        'data-testid': 'complex-button',
        'aria-describedby': 'description',
        'aria-expanded': 'false',
        children: 'Complex Button',
      });

      const button = screen.getByTestId('complex-button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('handles complex rest props for link', () => {
      renderButton({
        href: '/complex-link',
        'data-testid': 'complex-link',
        'aria-describedby': 'link-description',
        'aria-expanded': 'true',
        children: 'Complex Link',
      });

      const link = screen.getByTestId('complex-link');
      expect(link).toHaveAttribute('aria-describedby', 'link-description');
      expect(link).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('LoadingSpinner Integration', () => {
    it('renders LoadingSpinner with correct props when loading', () => {
      renderButton({ loading: true, children: 'Submit' });

      const spinner = screen.getByRole('status', { name: 'Loading' });
      expect(spinner).toBeVisible();

      // Check that the loading text span has the correct class
      const loadingText = screen.getByText(textConstants.misc.SUBMITTING);
      expect(loadingText).toHaveClass(styles.loadingText);
    });
  });

  describe('Tooltip Integration', () => {
    it('renders tooltip with correct configuration', () => {
      renderButton({ tooltip: 'Help text', children: 'Help' });

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass(styles.tooltip);
      expect(tooltipContent).toHaveAttribute('data-side-offset', '5');
      expect(tooltipContent).toHaveAttribute('data-side', 'top');
    });

    it('renders tooltip arrow', () => {
      renderButton({ tooltip: 'Help text', children: 'Help' });

      expect(screen.getByTestId('tooltip-arrow')).toHaveClass(
        styles.tooltipArrow
      );
    });
  });
});
