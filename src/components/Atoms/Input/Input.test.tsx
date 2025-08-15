import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import Input from './Input';
import styles from './Input.module.sass';

describe('Input Component', () => {
  it('renders text input by default', () => {
    render(<Input label='Test Input' />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    expect(input).toBeVisible();
    // The default type is undefined, which renders as text input
    expect(input).not.toHaveAttribute('type');
  });

  it('renders input with label', () => {
    render(<Input label='Test Input' />);

    expect(screen.getByText('Test Input')).toBeVisible();
    const input = screen.getByRole('textbox', { name: /test input/i });
    expect(input).toBeVisible();
  });

  it('renders input without label', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeVisible();
  });

  it('applies custom className', () => {
    const customClass = 'custom-input-class';
    render(<Input className={customClass} label='Test Input' />);

    const wrapper = screen
      .getByRole('textbox', { name: /test input/i })
      .closest('div');
    expect(wrapper).toHaveClass(customClass);
    expect(wrapper).toHaveClass(styles.Input);
  });

  it('generates unique id when none provided', () => {
    render(<Input label='Test Input' />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    const label = screen.getByText('Test Input');

    expect(input.id).toBeTruthy();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('uses provided id when available', () => {
    const customId = 'custom-input-id';
    render(<Input id={customId} label='Test Input' />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    const label = screen.getByText('Test Input');

    expect(input.id).toBe(customId);
    expect(label).toHaveAttribute('for', customId);
  });

  it('handles controlled value', () => {
    const { rerender } = render(
      <Input label='Controlled Input' value='initial value' />
    );

    let input = screen.getByRole('textbox', { name: /controlled input/i });
    expect(input).toHaveValue('initial value');

    rerender(<Input label='Controlled Input' value='updated value' />);
    input = screen.getByRole('textbox', { name: /controlled input/i });
    expect(input).toHaveValue('updated value');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(<Input label='Uncontrolled Input' defaultValue='default value' />);

    const input = screen.getByRole('textbox', { name: /uncontrolled input/i });
    expect(input).toHaveValue('default value');
  });

  it('calls onChange handler', () => {
    const handleChange = vi.fn();
    render(<Input label='Test Input' onChange={handleChange} />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    fireEvent.change(input, { target: { value: 'new value' } });

    // The onChange prop is passed through to the input element
    // The component handles both controlled and uncontrolled modes internally
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onFocus handler', () => {
    const handleFocus = vi.fn();
    render(<Input label='Test Input' onFocus={handleFocus} />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur handler', () => {
    const handleBlur = vi.fn();
    render(<Input label='Test Input' onBlur={handleBlur} />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('renders select input when type is select', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<Input type='select' options={options} label='Test Select' />);

    const select = screen.getByRole('combobox', { name: /test select/i });
    expect(select).toBeVisible();
    expect(select.tagName).toBe('SELECT');
  });

  it('renders textarea when type is textarea', () => {
    render(<Input type='textarea' label='Test Textarea' />);

    const textarea = screen.getByRole('textbox', { name: /test textarea/i });
    expect(textarea).toBeVisible();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders different input types', () => {
    const { rerender } = render(<Input type='email' label='Email Input' />);
    let input = screen.getByRole('textbox', { name: /email input/i });
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type='password' label='Password Input' />);
    input = screen.getByLabelText(/password input/i);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles select options with string values', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<Input type='select' options={options} label='Test Select' />);

    const select = screen.getByRole('combobox', { name: /test select/i });
    expect(select).toHaveValue('Option 1');

    const optionElements = select.querySelectorAll('option');
    expect(optionElements).toHaveLength(3);
    expect(optionElements[0]).toHaveValue('Option 1');
  });

  it('handles select options with object values', () => {
    const options = [
      { value: 'val1', label: 'Label 1' },
      { value: 'val2', label: 'Label 2' },
    ];
    render(<Input type='select' options={options} label='Test Select' />);

    const select = screen.getByRole('combobox', { name: /test select/i });
    expect(select).toHaveValue('val1');

    const optionElements = select.querySelectorAll('option');
    expect(optionElements).toHaveLength(2);
    expect(optionElements[0]).toHaveValue('val1');
    expect(optionElements[0]).toHaveTextContent('Label 1');
  });

  it('focuses input when label is clicked', () => {
    render(<Input label='Test Input' />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    const label = screen.getByText('Test Input');

    fireEvent.click(label);
    expect(input).toHaveFocus();
  });

  it('applies active label class when focused', () => {
    render(<Input label='Test Input' />);

    const input = screen.getByRole('textbox', { name: /test input/i });
    const label = screen.getByText('Test Input');

    fireEvent.focus(input);
    expect(label).toHaveClass(styles.active);
  });

  it('applies active label class when has value', () => {
    render(<Input label='Test Input' defaultValue='some value' />);

    const label = screen.getByText('Test Input');
    expect(label).toHaveClass(styles.active);
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} label='Test Input' />);

    expect(ref).toHaveBeenCalled();
  });

  it('handles empty string options in select', () => {
    const options = ['', 'Option 1', 'Option 2'];
    render(<Input type='select' options={options} label='Test Select' />);

    const select = screen.getByRole('combobox', { name: /test select/i });
    const optionElements = select.querySelectorAll('option');

    // Empty option should be disabled
    expect(optionElements[0]).toBeDisabled();
  });

  it('handles all HTML input attributes', () => {
    render(
      <Input
        label='Test Input'
        name='test-input'
        placeholder='Enter text'
        required
        maxLength={50}
        aria-describedby='description'
      />
    );

    const input = screen.getByRole('textbox', { name: /test input/i });
    expect(input).toHaveAttribute('name', 'test-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('aria-describedby', 'description');
  });
});
