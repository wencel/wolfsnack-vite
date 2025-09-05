import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import LoadingSpinner from './';
import styles from './LoadingSpinner.module.sass';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    testRender(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeVisible();
    expect(spinner).toHaveClass(styles.spinner);
    expect(spinner).toHaveClass(styles.medium);
    expect(spinner).toHaveClass(styles.white);
  });

  it('renders with custom size', () => {
    testRender(<LoadingSpinner size='large' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.large);
    expect(spinner).not.toHaveClass(styles.medium);
    expect(spinner).not.toHaveClass(styles.small);
  });

  it('renders with custom color', () => {
    testRender(<LoadingSpinner color='primary' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.primary);
    expect(spinner).not.toHaveClass(styles.white);
    expect(spinner).not.toHaveClass(styles.secondary);
  });

  it('applies custom className', () => {
    const customClass = 'custom-spinner-class';
    testRender(<LoadingSpinner className={customClass} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(customClass);
    expect(spinner).toHaveClass(styles.spinner);
  });

  it('renders with all custom props', () => {
    testRender(
      <LoadingSpinner size='small' color='secondary' className='test-class' />
    );

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.small);
    expect(spinner).toHaveClass(styles.secondary);
    expect(spinner).toHaveClass('test-class');
    expect(spinner).toHaveClass(styles.spinner);
  });

  it('handles undefined className gracefully', () => {
    testRender(<LoadingSpinner className={undefined} />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.spinner);
    expect(spinner).toHaveClass(styles.medium);
    expect(spinner).toHaveClass(styles.white);
  });

  it('has correct accessibility attributes', () => {
    testRender(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders spinner inner element', () => {
    testRender(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner.children).toHaveLength(1);
    expect(spinner.firstElementChild).toHaveClass(styles.spinnerInner);
  });

  it('applies all size variants correctly', () => {
    const { rerender } = testRender(<LoadingSpinner size='small' />);

    let spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.small);

    rerender(<LoadingSpinner size='medium' />);
    spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.medium);

    rerender(<LoadingSpinner size='large' />);
    spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.large);
  });

  it('applies all color variants correctly', () => {
    const { rerender } = testRender(<LoadingSpinner color='white' />);

    let spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.white);

    rerender(<LoadingSpinner color='primary' />);
    spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.primary);

    rerender(<LoadingSpinner color='secondary' />);
    spinner = screen.getByRole('status');
    expect(spinner).toHaveClass(styles.secondary);
  });
});
