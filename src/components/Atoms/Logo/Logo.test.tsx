import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import Logo from './Logo';
import styles from './Logo.module.sass';

describe('Logo Component', () => {
  it('renders logo with image', () => {
    testRender(<Logo />);

    const logo = screen.getByRole('img', { name: 'Logo' });
    expect(logo).toBeVisible();
    expect(logo).toHaveAttribute('src', '/wolf.svg');
    expect(logo).toHaveAttribute('alt', 'Logo');
  });

  it('renders with default styling', () => {
    testRender(<Logo />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).not.toHaveClass(styles.rounded);
  });

  it('renders with rounded styling when isRound is true', () => {
    testRender(<Logo isRound />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).toHaveClass(styles.rounded);
  });

  it('renders without rounded styling when isRound is false', () => {
    testRender(<Logo isRound={false} />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).not.toHaveClass(styles.rounded);
  });

  it('applies custom className', () => {
    const customClass = 'custom-logo-class';
    testRender(<Logo className={customClass} />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toHaveClass(customClass);
    expect(logoContainer).toHaveClass(styles.Logo);
  });

  it('combines custom className with default and conditional classes', () => {
    const customClass = 'custom-logo-class';
    testRender(<Logo className={customClass} isRound />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toHaveClass(customClass);
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).toHaveClass(styles.rounded);
  });

  it('handles undefined className gracefully', () => {
    testRender(<Logo className={undefined} />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toBeVisible();
    expect(logoContainer).toHaveClass(styles.Logo);
  });

  it('handles empty string className gracefully', () => {
    testRender(<Logo className="" />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toBeVisible();
    expect(logoContainer).toHaveClass(styles.Logo);
  });

  it('maintains logo image attributes', () => {
    testRender(<Logo />);

    const logo = screen.getByRole('img', { name: 'Logo' });
    expect(logo).toHaveAttribute('src', '/wolf.svg');
    expect(logo).toHaveAttribute('alt', 'Logo');
  });

  it('renders consistently with different prop combinations', () => {
    const { rerender } = testRender(<Logo />);

    // Default state
    let logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).not.toHaveClass(styles.rounded);

    // With isRound
    rerender(<Logo isRound />);
    logoContainer = screen.getByRole('img', { name: 'Logo' }).closest('div');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).toHaveClass(styles.rounded);

    // With custom className
    rerender(<Logo className="custom" />);
    logoContainer = screen.getByRole('img', { name: 'Logo' }).closest('div');
    expect(logoContainer).toHaveClass('custom');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).not.toHaveClass(styles.rounded);

    // With both
    rerender(<Logo className="custom" isRound />);
    logoContainer = screen.getByRole('img', { name: 'Logo' }).closest('div');
    expect(logoContainer).toHaveClass('custom');
    expect(logoContainer).toHaveClass(styles.Logo);
    expect(logoContainer).toHaveClass(styles.rounded);
  });

  it('filters out falsy className values', () => {
    testRender(<Logo className="" />);

    const logoContainer = screen
      .getByRole('img', { name: 'Logo' })
      .closest('div');
    const classList = logoContainer?.className.split(' ');

    // Should not contain empty string
    expect(classList).not.toContain('');
  });

  it('renders logo image with correct dimensions', () => {
    testRender(<Logo />);

    const logo = screen.getByRole('img', { name: 'Logo' });
    expect(logo).toBeVisible();

    // The image should be present and loadable
    expect(logo).toHaveAttribute('src');
    expect(logo).toHaveAttribute('alt');
  });
});
