import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import NavigationCardHeader from './NavigationCardHeader';
import styles from './NavigationCardHeader.module.sass';

describe('NavigationCardHeader Component', () => {
  it('renders with header text', () => {
    render(<NavigationCardHeader header='Test Header' href='/test' />);

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/test');
    expect(screen.getByText('Test Header')).toBeVisible();
  });

  it('applies default NavigationCardHeader class', () => {
    render(<NavigationCardHeader header='Test' href='/test' />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(styles.NavigationCardHeader);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-header-class';
    render(
      <NavigationCardHeader
        header='Test'
        href='/test'
        className={customClass}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass(customClass);
    expect(link).toHaveClass(styles.NavigationCardHeader);
  });

  it('renders without header prop', () => {
    render(<NavigationCardHeader href='/test' />);

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders with ReactNode header', () => {
    render(
      <NavigationCardHeader header={<span>Custom Header</span>} href='/test' />
    );

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    expect(screen.getByText('Custom Header')).toBeVisible();
  });
});
