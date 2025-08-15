import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import SubCard from './SubCard';
import styles from './SubCard.module.sass';

describe('SubCard Component', () => {
  it('renders with children', () => {
    render(
      <SubCard>
        <div>Test Content</div>
      </SubCard>
    );

    const card = screen.getByRole('generic');
    expect(card).toBeVisible();
    expect(card).toHaveClass(styles.SubCard);
  });

  it('applies default SubCard class', () => {
    render(<SubCard>Content</SubCard>);

    const card = screen.getByRole('generic');
    expect(card).toHaveClass(styles.SubCard);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-card-class';
    render(<SubCard className={customClass}>Content</SubCard>);

    const card = screen.getByRole('generic');
    expect(card).toHaveClass(customClass);
    expect(card).toHaveClass(styles.SubCard);
  });

  it('handles undefined className gracefully', () => {
    render(<SubCard className={undefined}>Content</SubCard>);

    const card = screen.getByRole('generic');
    expect(card).toHaveClass(styles.SubCard);
    expect(card).not.toHaveClass('undefined');
  });

  it('renders without children', () => {
    render(<SubCard />);

    const card = screen.getByRole('generic');
    expect(card).toBeVisible();
    expect(card).toHaveClass(styles.SubCard);
  });

  it('renders with complex children content', () => {
    render(
      <SubCard>
        <h3>Card Title</h3>
        <p>Card description</p>
        <button>Action Button</button>
      </SubCard>
    );

    const card = screen.getByRole('generic');
    expect(card).toBeVisible();
    expect(card).toHaveClass(styles.SubCard);
    expect(screen.getByText('Card Title')).toBeVisible();
    expect(screen.getByText('Card description')).toBeVisible();
    expect(screen.getByText('Action Button')).toBeVisible();
  });

  it('has correct DOM structure', () => {
    render(<SubCard>Content</SubCard>);

    const card = screen.getByRole('generic');
    expect(card.tagName).toBe('DIV');
    expect(card).toBeInTheDocument();
  });

  it('applies multiple custom classes', () => {
    const customClasses = 'card-component--primary__wrapper';
    render(<SubCard className={customClasses}>Content</SubCard>);

    const card = screen.getByRole('generic');
    expect(card).toHaveClass(customClasses);
    expect(card).toHaveClass(styles.SubCard);
  });
});
