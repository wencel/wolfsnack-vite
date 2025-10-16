import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import SubCard from './';
import styles from './SubCard.module.sass';

describe('SubCard Component', () => {
  it('renders with children', () => {
    testRender(
      <SubCard>
        <div>Test Content</div>
      </SubCard>
    );

    expect(screen.getByText('Test Content')).toBeVisible();
  });

  it('applies default SubCard class', () => {
    testRender(<SubCard>Content</SubCard>);

    const subCard = screen.getByText('Content');
    expect(subCard).toBeVisible();
    expect(subCard).toHaveClass(styles.SubCard);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-card-class';
    testRender(<SubCard className={customClass}>Content</SubCard>);
    const subCard = screen.getByText('Content');

    expect(subCard).toBeVisible();
    expect(subCard).toHaveClass(customClass);
  });

  it('handles undefined className gracefully', () => {
    testRender(<SubCard className={undefined}>Content</SubCard>);

    const subCard = screen.getByText('Content');
    expect(subCard).toBeVisible();
    expect(subCard).toHaveClass(styles.SubCard);
  });

  it('renders with complex children content', () => {
    testRender(
      <SubCard>
        <h3>Card Title</h3>
        <p>Card description</p>
        <button>Action Button</button>
      </SubCard>
    );

    // Test that all content is visible
    expect(
      screen.getByRole('heading', { level: 3, name: 'Card Title' })
    ).toBeVisible();
    expect(screen.getByText('Card description')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeVisible();
  });

  it('applies multiple custom classes', () => {
    const customClasses = 'card-component--primary__wrapper';
    testRender(<SubCard className={customClasses}>Content</SubCard>);

    const subCard = screen.getByText('Content');
    expect(subCard).toBeVisible();
    expect(subCard).toHaveClass(customClasses);
    expect(subCard).toHaveClass(styles.SubCard);
  });
});
