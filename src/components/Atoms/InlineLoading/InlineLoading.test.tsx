import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import InlineLoading from './InlineLoading';
import styles from './InlineLoading.module.sass';

describe('InlineLoading Component', () => {
  it('renders loading animation by default', () => {
    testRender(<InlineLoading />);

    const loadingContainer = screen.getByTestId('inline-loading');
    expect(loadingContainer).toBeVisible();
    expect(loadingContainer).toHaveClass(styles.loadingRipple);
  });

  it('applies custom className', () => {
    const customClass = 'custom-loading-class';
    testRender(<InlineLoading className={customClass} />);

    const loadingContainer = screen.getByTestId('inline-loading');
    expect(loadingContainer).toHaveClass(customClass);
    expect(loadingContainer).toHaveClass(styles.loadingRipple);
  });

  it('applies multiple custom classes', () => {
    const customClass1 = 'custom-class-1';
    const customClass2 = 'custom-class-2';
    testRender(<InlineLoading className={`${customClass1} ${customClass2}`} />);

    const loadingContainer = screen.getByTestId('inline-loading');
    expect(loadingContainer).toHaveClass(customClass1);
    expect(loadingContainer).toHaveClass(customClass2);
    expect(loadingContainer).toHaveClass(styles.loadingRipple);
  });
});
