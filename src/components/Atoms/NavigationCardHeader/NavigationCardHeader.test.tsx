import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import NavigationCardHeader from './NavigationCardHeader';
import styles from './NavigationCardHeader.module.sass';

describe('NavigationCardHeader Component', () => {
  it('renders with header text', () => {
    testRender(<NavigationCardHeader header="Test Header" href="/test" />);

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/test');
    expect(screen.getByText('Test Header')).toBeVisible();
  });

  it('applies default NavigationCardHeader class', () => {
    testRender(<NavigationCardHeader header="Test" href="/test" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(styles.NavigationCardHeader);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-header-class';
    testRender(
      <NavigationCardHeader
        header="Test"
        href="/test"
        className={customClass}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass(customClass);
    expect(link).toHaveClass(styles.NavigationCardHeader);
  });

  it('renders without header prop', () => {
    testRender(<NavigationCardHeader href="/test" />);

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders with ReactNode header', () => {
    testRender(
      <NavigationCardHeader header={<span>Custom Header</span>} href="/test" />
    );

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    expect(screen.getByText('Custom Header')).toBeVisible();
  });
});
