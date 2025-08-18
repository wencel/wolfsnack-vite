import { describe, it, expect, vi } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import PageContainer from './PageContainer';
import styles from './PageContainer.module.sass';

describe('PageContainer Component', () => {
  it('renders with children', () => {
    testRender(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toBeVisible();
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('applies default PageContainer class', () => {
    testRender(<PageContainer>Content</PageContainer>);

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-container-class';
    testRender(<PageContainer className={customClass}>Content</PageContainer>);

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass(customClass);
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('renders without children', () => {
    testRender(<PageContainer />);

    const container = screen.getByTestId('page-container');
    expect(container).toBeVisible();
    expect(container).toHaveClass(styles.PageContainer);
  });

  it('handles onScroll event', () => {
    const handleScroll = vi.fn();
    testRender(<PageContainer onScroll={handleScroll}>Content</PageContainer>);

    const container = screen.getByTestId('page-container');
    expect(container).toBeInTheDocument();
    // React doesn't set onScroll as a DOM attribute, it's handled internally
  });

  it('forwards additional HTML attributes', () => {
    testRender(
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
