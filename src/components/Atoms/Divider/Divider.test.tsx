import { describe, it, expect } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import Divider from './Divider';
import styles from './Divider.module.sass';

describe('Divider Component', () => {
  it('renders divider element', () => {
    testRender(<Divider />);

    const divider = screen.getByTestId('divider');
    expect(divider).toBeVisible();
  });

  it('applies correct CSS class', () => {
    testRender(<Divider />);

    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass(styles.Divider);
  });

  it('has correct DOM structure', () => {
    testRender(<Divider />);

    const divider = screen.getByTestId('divider');
    expect(divider.tagName).toBe('DIV');
  });

  it('renders without children', () => {
    testRender(<Divider />);

    const divider = screen.getByTestId('divider');
    expect(divider).toBeEmptyDOMElement();
  });

  it('can be rendered multiple times', () => {
    testRender(
      <div>
        <Divider />
        <Divider />
        <Divider />
      </div>
    );

    const dividers = screen.getAllByTestId('divider');
    expect(dividers).toHaveLength(3);
  });

  it('has correct accessibility attributes', () => {
    testRender(<Divider />);

    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveAttribute('aria-hidden', 'true');
  });
});
