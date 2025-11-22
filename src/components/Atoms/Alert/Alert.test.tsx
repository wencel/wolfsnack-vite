import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import Alert from './Alert';
import styles from './Alert.module.sass';

describe('Alert Component', () => {
  it('renders alert with children', () => {
    testRender(<Alert>Error message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent('Error message');
  });

  it('applies error variant by default', () => {
    testRender(<Alert>Error message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain(styles.error);
  });

  it('applies custom variant', () => {
    testRender(<Alert variant="warning">Warning message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain(styles.warning);
  });

  it('applies custom className', () => {
    const customClass = 'custom-alert';
    testRender(<Alert className={customClass}>Message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass(customClass);
  });

  it('uses custom role when provided', () => {
    testRender(<Alert role="status">Info message</Alert>);

    const alert = screen.getByRole('status');
    expect(alert).toBeVisible();
  });

  it('applies aria-live attribute', () => {
    testRender(<Alert aria-live="polite">Message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('uses assertive aria-live by default', () => {
    testRender(<Alert>Message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders all variant types', () => {
    const variants: Array<'error' | 'warning' | 'info' | 'success'> = [
      'error',
      'warning',
      'info',
      'success',
    ];

    variants.forEach(variant => {
      const { unmount } = testRender(
        <Alert variant={variant}>{variant} message</Alert>
      );
      const alert = screen.getByRole('alert');
      expect(alert.className).toContain(styles[variant]);
      expect(alert).toHaveTextContent(`${variant} message`);
      unmount();
    });
  });

  it('handles complex children', () => {
    testRender(
      <Alert>
        <strong>Error:</strong> Something went wrong
      </Alert>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Error: Something went wrong');
    expect(alert.querySelector('strong')).toBeInTheDocument();
  });
});
