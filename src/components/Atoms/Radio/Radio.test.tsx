import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import Radio from './Radio';
import styles from './Radio.module.sass';

describe('Radio Component', () => {
  it('renders radio input with label', () => {
    render(<Radio label='Test Radio' />);

    const radio = screen.getByRole('radio', { name: /test radio/i });
    expect(radio).toBeVisible();
    expect(screen.getByText('Test Radio')).toBeVisible();
  });

  it('renders radio input without label', () => {
    render(<Radio />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeVisible();
    expect(radio).not.toHaveAttribute('aria-label');
  });

  it('applies custom className', () => {
    const customClass = 'custom-radio-class';
    render(<Radio className={customClass} label='Test Radio' />);

    const label = screen.getByText('Test Radio').closest('label');
    expect(label).toHaveClass(customClass);
    expect(label).toHaveClass(styles.Radio);
  });

  it('applies theme classes correctly', () => {
    const { rerender } = render(<Radio theme='path' label='Path Theme' />);

    let label = screen.getByText('Path Theme').closest('label');
    expect(label).toHaveClass(styles.path);

    rerender(<Radio theme='bounce' label='Bounce Theme' />);
    label = screen.getByText('Bounce Theme').closest('label');
    expect(label).toHaveClass(styles.bounce);
  });

  it('uses default theme when none provided', () => {
    render(<Radio label='Default Theme' />);

    const label = screen.getByText('Default Theme').closest('label');
    expect(label).toHaveClass(styles.path);
  });

  it('handles checked state', () => {
    render(<Radio label='Test Radio' />);

    const radio = screen.getByRole('radio', { name: /test radio/i });
    expect(radio).not.toBeChecked();

    fireEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it('handles disabled state', () => {
    render(<Radio label='Disabled Radio' disabled />);

    const radio = screen.getByRole('radio', { name: /disabled radio/i });
    expect(radio).toBeDisabled();
  });

  it('calls onChange handler when clicked', () => {
    const handleChange = vi.fn();
    render(<Radio label='Test Radio' onChange={handleChange} />);

    const radio = screen.getByRole('radio', { name: /test radio/i });
    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders SVG icon', () => {
    render(<Radio label='Test Radio' />);

    const svg = screen.getByTestId('radio-icon');
    expect(svg).toBeVisible();
    expect(svg).toHaveAttribute('viewBox', '0 0 21 21');
  });

  it('has correct DOM structure', () => {
    render(<Radio label='Test Radio' />);

    const label = screen.getByText('Test Radio').closest('label');
    const radio = screen.getByRole('radio', { name: /test radio/i });
    const labelText = screen.getByText('Test Radio');

    expect(label).toBeVisible();
    expect(radio).toBeVisible();
    expect(labelText).toBeVisible();
    expect(labelText).toHaveTextContent('Test Radio');

    // Test that the label contains the expected elements without querySelector
    expect(label).toContainElement(radio);
    expect(label).toContainElement(labelText);
  });

  it('handles controlled checked state', () => {
    const { rerender } = render(
      <Radio label='Controlled Radio' checked={false} />
    );

    let radio = screen.getByRole('radio', { name: /controlled radio/i });
    expect(radio).not.toBeChecked();

    rerender(<Radio label='Controlled Radio' checked={true} />);
    radio = screen.getByRole('radio', { name: /controlled radio/i });
    expect(radio).toBeChecked();
  });

  it('applies all HTML input attributes', () => {
    render(
      <Radio
        label='Test Radio'
        name='test-radio'
        value='test-value'
        required
        aria-describedby='description'
      />
    );

    const radio = screen.getByRole('radio', { name: /test radio/i });
    expect(radio).toHaveAttribute('name', 'test-radio');
    expect(radio).toHaveAttribute('value', 'test-value');
    expect(radio).toBeRequired();
    expect(radio).toHaveAttribute('aria-describedby', 'description');
  });

  it('handles undefined className gracefully', () => {
    render(<Radio className={undefined} label='Test Radio' />);

    const label = screen.getByText('Test Radio').closest('label');
    expect(label).toHaveClass(styles.Radio);
  });

  it('handles falsy className values', () => {
    render(<Radio className='' label='Test Radio' />);

    const label = screen.getByText('Test Radio').closest('label');
    expect(label).toHaveClass(styles.Radio);
  });

  it('handles multiple radio buttons in a group', () => {
    render(
      <div>
        <Radio name='group' value='option1' label='Option 1' />
        <Radio name='group' value='option2' label='Option 2' />
        <Radio name='group' value='option3' label='Option 3' />
      </div>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);

    // All should have the same name for grouping
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'group');
    });
  });

  it('maintains radio button behavior', () => {
    render(
      <div>
        <Radio name='group' value='option1' label='Option 1' />
        <Radio name='group' value='option2' label='Option 2' />
      </div>
    );

    const radio1 = screen.getByRole('radio', { name: /option 1/i });
    const radio2 = screen.getByRole('radio', { name: /option 2/i });

    // Click first radio
    fireEvent.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    // Click second radio
    fireEvent.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });
});
