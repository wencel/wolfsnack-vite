import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import Button from './Button';
import styles from './Button.module.sass';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('renders button with icon', () => {
    const TestIcon = () => <span aria-hidden='true'>🚀</span>;
    render(
      <Button>
        <TestIcon />
      </Button>
    );

    expect(screen.getByText('🚀')).toBeVisible();
  });

  it('renders button with icon and tooltip', () => {
    const TestIcon = () => <span aria-hidden='true'>🚀</span>;
    render(
      <Button tooltip='Launch rocket'>
        <TestIcon />
      </Button>
    );

    expect(screen.getByText('🚀')).toBeVisible();
    // When tooltip is provided, title should not be set to avoid duplicate tooltips
    expect(screen.getByRole('button')).not.toHaveAttribute('title');
  });

  it('applies custom className to wrapper', () => {
    const customClass = 'custom-button-wrapper';
    render(<Button className={customClass}>Click me</Button>);

    const wrapper = screen.getByRole('button').closest('div');
    expect(wrapper).toHaveClass(customClass);
    expect(wrapper).toHaveClass(styles.Button);
  });

  it('applies theme classes to button', () => {
    render(<Button theme='Primary'>Primary Button</Button>);

    const button = screen.getByRole('button', { name: /primary button/i });
    expect(button).toHaveClass(styles.Primary);
  });

  it('applies active state', () => {
    render(<Button isActive>Active Button</Button>);

    const button = screen.getByRole('button', { name: /active button/i });
    expect(button).toHaveClass(styles.active);
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading Button</Button>);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeVisible();
  });

  it('shows loading text when provided', () => {
    render(
      <Button loading loadingText='Processing...'>
        Loading Button
      </Button>
    );

    expect(screen.getByText('Processing...')).toBeVisible();
  });

  it('disables button when loading', () => {
    render(<Button loading>Loading Button</Button>);

    const button = screen.getByRole('button', { name: /Cargando.../i });
    expect(button).toBeDisabled();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it('combines disabled and loading states', () => {
    render(
      <Button disabled loading>
        Button
      </Button>
    );

    const button = screen.getByRole('button', { name: /Cargando.../i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass(styles.loading);
  });

  it('renders as link when href is provided', () => {
    render(<Button href='/test'>Link Button</Button>);

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies link button themes', () => {
    render(
      <Button href='/test' theme='WolfGreen'>
        Link Button
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toHaveClass(styles.WolfGreen);
  });

  it('forwards additional props to button', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} data-testid='test-button'>
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards additional props to link', () => {
    render(
      <Button href='/test' data-testid='test-link'>
        Link
      </Button>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toBeInTheDocument();
  });

  it('shows tooltip on hover when tooltip prop is provided', () => {
    render(<Button tooltip='This is a tooltip'>Button</Button>);

    const button = screen.getByRole('button', { name: /this is a tooltip/i });
    // When tooltip is provided, title should not be set to avoid duplicate tooltips
    expect(button).not.toHaveAttribute('title');
  });

  it('allows title attribute when no tooltip is provided', () => {
    render(<Button title='Native title'>Button</Button>);

    const button = screen.getByRole('button', { name: /button/i });
    expect(button).toHaveAttribute('title', 'Native title');
  });

  it('sets aria-label to tooltip when tooltip is provided', () => {
    render(<Button tooltip='Accessible label'>Button</Button>);

    const button = screen.getByRole('button', { name: /accessible label/i });
    expect(button).toHaveAttribute('aria-label', 'Accessible label');
  });

  it('sets aria-label to loading state when loading', () => {
    render(
      <Button loading tooltip='Button tooltip'>
        Button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cargando...');
  });

  it('handles round button theme correctly', () => {
    render(
      <Button theme='RoundWithLabel' tooltip='Round button'>
        🔘
      </Button>
    );

    const button = screen.getByRole('button', { name: /round button/i });
    expect(button).toHaveClass(styles.RoundWithLabel);
  });

  it('handles outline button theme correctly', () => {
    render(
      <Button theme='Outline' tooltip='Outline button'>
        Outline
      </Button>
    );

    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toHaveClass(styles.Outline);
  });

  it('handles bottom navigation theme correctly', () => {
    render(
      <Button theme='BottomNavigation' tooltip='Nav button'>
        🏠
      </Button>
    );

    const button = screen.getByRole('button', { name: /nav button/i });
    expect(button).toHaveClass(styles.BottomNavigation);
  });
});
