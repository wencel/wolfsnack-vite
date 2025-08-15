import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Loading from './Loading';
import styles from './Loading.module.sass';

describe('Loading Component', () => {
  it('renders loading overlay when visible', () => {
    render(<Loading visible={true} />);

    const loadingOverlay = screen.getByRole('status');
    expect(loadingOverlay).toBeVisible();
  });

  it('renders loading overlay when visible prop is not provided', () => {
    render(<Loading />);

    const loadingOverlay = screen.getByRole('status');
    expect(loadingOverlay).toBeVisible();
  });

  it('hides loading overlay when visible is false', () => {
    render(<Loading visible={false} />);

    const loadingOverlay = screen.queryByRole('status');
    expect(loadingOverlay).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-loading-class';
    render(<Loading className={customClass} />);

    const loadingOverlay = screen.getByRole('status');
    expect(loadingOverlay).toHaveClass(customClass);
    expect(loadingOverlay).toHaveClass(styles.Loading);
    expect(loadingOverlay).toHaveClass(styles.visible);
  });
});
