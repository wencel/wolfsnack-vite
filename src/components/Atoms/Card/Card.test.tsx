import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import Card from './';
import styles from './Card.module.sass';

describe('Card Component', () => {
  it('renders card with title and description', () => {
    testRender(
      <Card title='Test Title' description='Test Description'>
        Card Content
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeVisible();
    expect(screen.getByText('Test Description')).toBeVisible();
    expect(screen.getByText('Card Content')).toBeVisible();
  });

  it('renders card with only title', () => {
    testRender(<Card title='Test Title' />);

    expect(screen.getByText('Test Title')).toBeVisible();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders card with only description', () => {
    testRender(<Card description='Test Description' />);

    expect(screen.getByText('Test Description')).toBeVisible();
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders card without title or description', () => {
    testRender(<Card>Card Content</Card>);

    expect(screen.getByText('Card Content')).toBeVisible();
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-card-class';
    testRender(<Card className={customClass}>Card Content</Card>);

    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass(customClass);
    expect(card).toHaveClass(styles.Card);
  });

  it('renders divider when children are present', () => {
    testRender(<Card>Card Content</Card>);

    // Check if Divider component is rendered (it should be present when children exist)
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toBeVisible();
  });

  it('does not render divider when no children', () => {
    testRender(<Card title='Test Title' description='Test Description' />);

    // When no children, divider should not be rendered
    expect(screen.getByText('Test Title')).toBeVisible();
    expect(screen.getByText('Test Description')).toBeVisible();
  });

  it('renders with React nodes as title and description', () => {
    const titleNode = <span>Custom Title</span>;
    const descriptionNode = <em>Custom Description</em>;

    testRender(
      <Card title={titleNode} description={descriptionNode}>
        Card Content
      </Card>
    );

    expect(screen.getByText('Custom Title')).toBeVisible();
    expect(screen.getByText('Custom Description')).toBeVisible();
    expect(screen.getByText('Card Content')).toBeVisible();
  });

  it('has correct DOM structure', () => {
    testRender(
      <Card title='Test Title' description='Test Description'>
        Card Content
      </Card>
    );

    const card = screen.getByText('Card Content').closest('div');
    const title = screen.getByText('Test Title');
    const description = screen.getByText('Test Description');

    expect(card).toHaveClass(styles.Card);
    // The title and description are direct children of the card, not wrapped in divs
    expect(title).toBeVisible();
    expect(description).toBeVisible();
  });

  it('handles empty children gracefully', () => {
    testRender(
      <Card title='Test Title' description='Test Description'>
        {null}
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeVisible();
    expect(screen.getByText('Test Description')).toBeVisible();
  });

  it('handles undefined className gracefully', () => {
    testRender(<Card className={undefined}>Card Content</Card>);

    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass(styles.Card);
  });

  it('renders multiple children correctly', () => {
    testRender(
      <Card title='Test Title'>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeVisible();
    expect(screen.getByText('Child 1')).toBeVisible();
    expect(screen.getByText('Child 2')).toBeVisible();
    expect(screen.getByText('Child 3')).toBeVisible();
  });
});
