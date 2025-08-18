import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import Label from './Label';
import styles from './Label.module.sass';

describe('Label Component', () => {
  it('renders label with children', () => {
    testRender(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
  });

  it('applies default Label class', () => {
    testRender(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(styles.Label);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-label-class';
    testRender(<Label className={customClass}>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(customClass);
    expect(label).toHaveClass(styles.Label);
  });

  it('handles empty children gracefully', () => {
    testRender(<Label></Label>);

    const label = screen.getByRole('label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass(styles.Label);
  });

  it('handles null children gracefully', () => {
    testRender(<Label>{null}</Label>);

    const label = screen.getByRole('label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass(styles.Label);
  });

  it('handles undefined children gracefully', () => {
    testRender(<Label>{undefined}</Label>);

    const label = screen.getByRole('label');
    expect(label).toBeVisible();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass(styles.Label);
  });

  it('handles undefined className gracefully', () => {
    testRender(<Label className={undefined}>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(styles.Label);
    expect(label).not.toHaveClass('undefined');
  });

  it('renders with complex children content', () => {
    testRender(
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
    testRender(<Label className={customClasses}>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('another-class');
    expect(label).toHaveClass(styles.Label);
  });
});
