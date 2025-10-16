import { describe, it, expect, vi } from 'vitest';
import { testRender, screen, fireEvent } from '@/test/test-utils';
import Checkbox from './Checkbox';
import styles from './Checkbox.module.sass';

describe('Checkbox Component', () => {
  it('renders checkbox with label', () => {
    testRender(<Checkbox label="Test Checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toBeVisible();
    expect(screen.getByText('Test Checkbox')).toBeVisible();
  });

  it('renders checkbox without label', () => {
    testRender(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeVisible();
  });

  it('applies custom className', () => {
    const customClass = 'custom-checkbox-class';
    testRender(<Checkbox className={customClass} label="Test Checkbox" />);

    const label = screen.getByText('Test Checkbox').closest('label');
    expect(label).toHaveClass(customClass);
    expect(label).toHaveClass(styles.Checkbox);
  });

  it('applies theme classes correctly', () => {
    const { rerender } = testRender(
      <Checkbox theme="path" label="Path Theme" />
    );

    let label = screen.getByText('Path Theme').closest('label');
    expect(label).toHaveClass(styles.path);

    rerender(<Checkbox theme="bounce" label="Bounce Theme" />);
    label = screen.getByText('Bounce Theme').closest('label');
    expect(label).toHaveClass(styles.bounce);
  });

  it('uses default theme when none provided', () => {
    testRender(<Checkbox label="Default Theme" />);

    const label = screen.getByText('Default Theme').closest('label');
    expect(label).toHaveClass(styles.path);
  });

  it('generates unique id when none provided', () => {
    testRender(<Checkbox label="Test Checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    const label = screen.getByText('Test Checkbox').closest('label');

    expect(checkbox.id).toBeTruthy();
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('uses provided id when available', () => {
    const customId = 'custom-checkbox-id';
    testRender(<Checkbox id={customId} label="Test Checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    const label = screen.getByText('Test Checkbox').closest('label');

    expect(checkbox.id).toBe(customId);
    expect(label).toHaveAttribute('for', customId);
  });

  it('handles checked state', () => {
    testRender(<Checkbox label="Test Checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('handles disabled state', () => {
    testRender(<Checkbox label="Disabled Checkbox" disabled />);

    const checkbox = screen.getByRole('checkbox', {
      name: /disabled checkbox/i,
    });
    expect(checkbox).toBeDisabled();
  });

  it('calls onChange handler when clicked', () => {
    const handleChange = vi.fn();
    testRender(<Checkbox label="Test Checkbox" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders SVG icon', () => {
    testRender(<Checkbox label="Test Checkbox" />);

    const svg = screen.getByTestId('checkbox-icon');
    expect(svg).toBeVisible();
    expect(svg).toHaveAttribute('viewBox', '0 0 21 21');
  });

  it('has correct DOM structure', () => {
    testRender(<Checkbox label="Test Checkbox" />);

    const label = screen.getByText('Test Checkbox').closest('label');
    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    const svg = screen.getByTestId('checkbox-icon');
    const span = screen.getByTestId('checkbox-label');

    expect(label).toBeVisible();
    expect(checkbox).toBeVisible();
    expect(svg).toBeVisible();
    expect(span).toBeVisible();
    expect(span).toHaveTextContent('Test Checkbox');
  });

  it('handles controlled checked state', () => {
    const { rerender } = testRender(
      <Checkbox label="Controlled Checkbox" checked={false} />
    );

    let checkbox = screen.getByRole('checkbox', {
      name: /controlled checkbox/i,
    });
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox label="Controlled Checkbox" checked={true} />);
    checkbox = screen.getByRole('checkbox', { name: /controlled checkbox/i });
    expect(checkbox).toBeChecked();
  });

  it('applies all HTML input attributes', () => {
    testRender(
      <Checkbox
        label="Test Checkbox"
        name="test-checkbox"
        value="test-value"
        required
        aria-describedby="description"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /test checkbox/i });
    expect(checkbox).toHaveAttribute('name', 'test-checkbox');
    expect(checkbox).toHaveAttribute('value', 'test-value');
    expect(checkbox).toHaveAttribute('required');
    expect(checkbox).toHaveAttribute('aria-describedby', 'description');
  });

  it('handles undefined className gracefully', () => {
    testRender(<Checkbox className={undefined} label="Test Checkbox" />);

    const label = screen.getByText('Test Checkbox').closest('label');
    expect(label).toHaveClass(styles.Checkbox);
  });

  it('handles falsy className values', () => {
    testRender(<Checkbox className="" label="Test Checkbox" />);

    const label = screen.getByText('Test Checkbox').closest('label');
    expect(label).toHaveClass(styles.Checkbox);
  });
});
