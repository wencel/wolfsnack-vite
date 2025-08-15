import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Label from './Label';
import styles from './Label.module.sass';

describe('Label Component', () => {
  it('renders label with children', () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
  });

  it('applies default Label class', () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(styles.Label);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-label-class';
    render(<Label className={customClass}>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(customClass);
    expect(label).toHaveClass(styles.Label);
  });

  it('handles empty children gracefully', () => {
    render(<Label></Label>);

    const label = screen.getByRole('label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass(styles.Label);
  });

  it('handles null children gracefully', () => {
    render(<Label>{null}</Label>);

    const label = screen.getByRole('label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass(styles.Label);
  });

  it('handles undefined children gracefully', () => {
    render(<Label>{undefined}</Label>);

    const label = screen.getByRole('label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass(styles.Label);
  });

  it('handles undefined className gracefully', () => {
    render(<Label className={undefined}>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(styles.Label);
    expect(label).not.toHaveClass('undefined');
  });

  it('renders with complex children content', () => {
    render(
      <Label>
        <span>Complex</span> <strong>Content</strong>
      </Label>
    );

    const label = screen.getByText('Complex');
    expect(label).toBeVisible();
    expect(label.closest('label')).toHaveClass(styles.Label);
    expect(screen.getByText('Content')).toBeVisible();
  });

  it('applies multiple custom classes', () => {
    const customClasses = 'custom-class another-class';
    render(<Label className={customClasses}>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('another-class');
    expect(label).toHaveClass(styles.Label);
  });
});
