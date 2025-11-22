import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testRender, screen, fireEvent } from '@/test/test-utils';
import Form from './Form';
import styles from './Form.module.sass';

// Mock the hooks
vi.mock('@/hooks/useLoading', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/useError', () => ({
  useError: vi.fn(),
}));

// Import the mocked hooks
import useLoading from '@/hooks/useLoading';
import { useError } from '@/hooks/useError';

// Type the mocked hooks
const mockUseLoading = useLoading as ReturnType<typeof vi.fn>;
const mockUseError = useError as ReturnType<typeof vi.fn>;

describe('Form Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Default mock implementations
    mockUseLoading.mockReturnValue({
      loading: false,
      submitting: false,
      fetching: false,
      isLoading: false,
      isSubmitting: false,
      isFetching: false,
    });

    mockUseError.mockReturnValue({
      submitError: null,
      generalError: null,
    });
  });

  it('renders form with children', () => {
    testRender(
      <Form>
        <input type="text" placeholder="Test input" />
        <label>Test label</label>
      </Form>
    );

    const form = screen.getByRole('form');
    expect(form).toBeVisible();
    expect(screen.getByPlaceholderText('Test input')).toBeVisible();
    expect(screen.getByText('Test label')).toBeVisible();
  });

  it('applies custom className', () => {
    const customClass = 'custom-form-class';
    testRender(<Form className={customClass} />);

    const form = screen.getByRole('form');
    expect(form).toHaveClass(customClass);
    expect(form).toHaveClass(styles.Form);
  });

  it('applies default Form class when no custom className', () => {
    testRender(<Form />);

    const form = screen.getByRole('form');
    expect(form).toHaveClass(styles.Form);
    expect(form).not.toHaveClass('undefined');
  });

  it('handles undefined className gracefully', () => {
    testRender(<Form className={undefined} />);

    const form = screen.getByRole('form');
    expect(form).toHaveClass(styles.Form);
  });

  it('handles falsy className values', () => {
    testRender(<Form className="" />);

    const form = screen.getByRole('form');
    expect(form).toHaveClass(styles.Form);
  });

  it('always renders submit button with default text when no buttonProps provided', () => {
    testRender(<Form />);

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    expect(submitButton).toBeVisible();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('renders primary button with custom text when buttonProps provided', () => {
    const buttonProps = {
      buttonText: 'Submit Form',
      className: 'primary-btn',
    };

    testRender(<Form buttonProps={buttonProps} />);

    const submitButton = screen.getByRole('button', { name: /submit form/i });
    expect(submitButton).toBeVisible();
    expect(submitButton).toHaveAttribute('type', 'submit');

    // The className goes to the wrapper div, not the button itself
    const buttonWrapper = submitButton.closest('div');
    expect(buttonWrapper).toHaveClass('primary-btn');
  });

  it('renders secondary button when secondButtonProps provided', () => {
    const secondButtonProps = {
      buttonText: 'Cancel',
      className: 'secondary-btn',
    };

    testRender(<Form secondButtonProps={secondButtonProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeVisible();
    expect(cancelButton).toHaveAttribute('type', 'button');

    // The className goes to the wrapper div, not the button itself
    const buttonWrapper = cancelButton.closest('div');
    expect(buttonWrapper).toHaveClass('secondary-btn');
  });

  it('renders both buttons when both button props provided', () => {
    const buttonProps = { buttonText: 'Submit' };
    const secondButtonProps = { buttonText: 'Cancel' };

    testRender(
      <Form buttonProps={buttonProps} secondButtonProps={secondButtonProps} />
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  it('displays submit error when present', () => {
    const errorMessage = 'Form submission failed';
    mockUseError.mockReturnValue({
      submitError: errorMessage,
      generalError: null,
    });

    testRender(<Form />);

    const errorElement = screen.getByRole('alert');
    expect(errorElement).toBeVisible();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  it('does not display error message when no submit error', () => {
    mockUseError.mockReturnValue({
      submitError: null,
      generalError: null,
    });

    testRender(<Form />);

    expect(
      screen.queryByText(/form submission failed/i)
    ).not.toBeInTheDocument();
  });

  it('applies loading text when isSubmitting and submittingText provided', () => {
    mockUseLoading.mockReturnValue({
      loading: false,
      submitting: true,
      fetching: false,
      isLoading: false,
      isSubmitting: true,
      isFetching: false,
    });

    const buttonProps = { buttonText: 'Submit' };
    const submittingText = 'Submitting...';
    testRender(
      <Form buttonProps={buttonProps} submittingText={submittingText} />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    // The loadingText prop is passed to the Button component, which handles it internally
    expect(submitButton).toBeVisible();
    const spinner = screen.getByRole('status');
    expect(spinner).toBeVisible();
    expect(screen.getByText('Submitting...')).toBeVisible();
  });

  it('uses default submitting text when isSubmitting and no submittingText provided', () => {
    mockUseLoading.mockReturnValue({
      loading: false,
      submitting: true,
      fetching: false,
      isLoading: false,
      isSubmitting: true,
      isFetching: false,
    });

    testRender(<Form />);

    const submitButton = screen.getByRole('button', { name: /enviando/i });
    expect(submitButton).toBeVisible();
    expect(submitButton).toHaveAttribute('aria-label', 'Enviando...');
    const spinner = screen.getByRole('status');
    expect(spinner).toBeVisible();
    expect(screen.getByText('Enviando...')).toBeVisible();
  });

  it('does not apply loading text when not submitting', () => {
    mockUseLoading.mockReturnValue({
      loading: false,
      submitting: false,
      fetching: false,
      isLoading: false,
      isSubmitting: false,
      isFetching: false,
    });

    const buttonProps = { buttonText: 'Submit' };
    const submittingText = 'Submitting...';
    testRender(
      <Form buttonProps={buttonProps} submittingText={submittingText} />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeVisible();
    const spinner = screen.queryByRole('status');
    expect(spinner).not.toBeInTheDocument();
    expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
  });

  it('calls onClick handler for secondary button', () => {
    const handleClick = vi.fn();
    const secondButtonProps = {
      buttonText: 'Cancel',
      onClick: handleClick,
    };

    testRender(<Form secondButtonProps={secondButtonProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('passes through form attributes', () => {
    testRender(
      <Form
        action="/submit"
        method="post"
        data-testid="test-form"
        aria-label="Test form"
      />
    );

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('action', '/submit');
    expect(form).toHaveAttribute('method', 'post');
    expect(form).toHaveAttribute('data-testid', 'test-form');
    expect(form).toHaveAttribute('aria-label', 'Test form');
  });

  it('omits buttonText from button props when passing to Button component and disables button', () => {
    const buttonProps = {
      buttonText: 'Submit',
      className: 'test-class',
      disabled: true,
    };

    testRender(<Form buttonProps={buttonProps} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    // The className goes to the wrapper div, not the button itself
    const buttonWrapper = submitButton.closest('div');
    expect(buttonWrapper).toHaveClass('test-class');
  });

  it('handles complex button props correctly', () => {
    const buttonProps = {
      buttonText: 'Submit',
      className: 'primary-btn',
      disabled: false,
      'data-testid': 'submit-btn',
    };

    testRender(<Form buttonProps={buttonProps} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveAttribute('data-testid', 'submit-btn');

    // The className goes to the wrapper div, not the button itself
    const buttonWrapper = submitButton.closest('div');
    expect(buttonWrapper).toHaveClass('primary-btn');
  });

  it('renders form with buttons container when no buttons', () => {
    testRender(<Form />);

    const form = screen.getByRole('form');
    // The buttons container is always rendered, even when empty
    expect(form).toBeVisible();
    // Should always have submit button
    expect(screen.getByRole('button', { name: /enviar/i })).toBeVisible();
  });

  it('handles empty children gracefully', () => {
    testRender(<Form />);

    const form = screen.getByRole('form');
    expect(form).toBeVisible();
    // The form always renders buttons container, error message only when submitError exists
    expect(form.children).toHaveLength(1);
  });

  it('handles null children gracefully', () => {
    testRender(<Form>{null}</Form>);

    const form = screen.getByRole('form');
    expect(form).toBeVisible();
  });

  it('handles undefined children gracefully', () => {
    testRender(<Form>{undefined}</Form>);

    const form = screen.getByRole('form');
    expect(form).toBeVisible();
  });
});
