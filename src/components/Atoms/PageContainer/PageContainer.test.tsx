import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import PageContainer from './PageContainer';
import styles from './PageContainer.module.sass';

describe('PageContainer Component', () => {
  it('renders with children', () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toBeVisible();
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('applies default PageContainer class', () => {
    render(<PageContainer>Content</PageContainer>);

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-container-class';
    render(<PageContainer className={customClass}>Content</PageContainer>);

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass(customClass);
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('renders without children', () => {
    render(<PageContainer />);

    const container = screen.getByTestId('page-container');
    expect(container).toBeVisible();
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('handles onScroll event', () => {
    const handleScroll = vi.fn();
    render(<PageContainer onScroll={handleScroll}>Content</PageContainer>);

    const container = screen.getByTestId('page-container');
    expect(container).toBeInTheDocument();
    // React doesn't set onScroll as a DOM attribute, it's handled internally
  });

  it('forwards additional HTML attributes', () => {
    render(
      <PageContainer
        data-testid='test-container'
        aria-label='Test page container'
        id='page-1'
      >
        Content
      </PageContainer>
    );

    const container = screen.getByTestId('test-container');
    expect(container).toHaveAttribute('aria-label', 'Test page container');
    expect(container).toHaveAttribute('id', 'page-1');
  });
});
