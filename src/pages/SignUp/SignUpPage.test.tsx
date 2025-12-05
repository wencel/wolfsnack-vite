import { describe, it, expect, afterEach } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import { axiosMock } from '@/test/setup';
import userEvent from '@testing-library/user-event';
import SignUpPage from '.';
import { textConstants } from '@/lib/appConstants';

describe('SignUp Page with Full Redux Integration', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  it('renders signup form with all required fields', () => {
    testRender(<SignUpPage />);

    const nameInput = screen.getByLabelText(textConstants.signup.NAME_LABEL);
    const emailInput = screen.getByLabelText(textConstants.signup.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.signup.PASSWORD_LABEL
    );
    const confirmPasswordInput = screen.getByLabelText(
      textConstants.signup.CONFIRM_PASSWORD_LABEL
    );
    const submitButton = screen.getByRole('button', {
      name: textConstants.signup.BUTTON_TEXT,
    });

    expect(nameInput).toBeVisible();
    expect(emailInput).toBeVisible();
    expect(passwordInput).toBeVisible();
    expect(confirmPasswordInput).toBeVisible();
    expect(submitButton).toBeVisible();
  });

  it('displays page title correctly', () => {
    testRender(<SignUpPage />);

    expect(screen.getByText(textConstants.signup.TITLE)).toBeVisible();
    expect(screen.getByText(textConstants.signup.DESCRIPTION)).toBeVisible();
  });

  it('allows user to enter name, email, password and confirm password', async () => {
    const user = userEvent.setup();
    testRender(<SignUpPage />);

    const nameInput = screen.getByLabelText(textConstants.signup.NAME_LABEL);
    const emailInput = screen.getByLabelText(textConstants.signup.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.signup.PASSWORD_LABEL
    );
    const confirmPasswordInput = screen.getByLabelText(
      textConstants.signup.CONFIRM_PASSWORD_LABEL
    );

    expect(nameInput).toBeVisible();
    expect(emailInput).toBeVisible();
    expect(passwordInput).toBeVisible();
    expect(confirmPasswordInput).toBeVisible();

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('displays error message when signup fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Recurso no encontrado.';

    // Mock signup to fail with 404 status
    axiosMock.onPost('/users/signup').reply(404, {});

    testRender(<SignUpPage />);

    // User fills in the form
    const nameInput = screen.getByLabelText(textConstants.signup.NAME_LABEL);
    const emailInput = screen.getByLabelText(textConstants.signup.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.signup.PASSWORD_LABEL
    );
    const confirmPasswordInput = screen.getByLabelText(
      textConstants.signup.CONFIRM_PASSWORD_LABEL
    );

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    // User submits the form
    const submitButton = screen.getByRole('button', {
      name: textConstants.signup.BUTTON_TEXT,
    });
    await user.click(submitButton);

    // Verify the error message appears in the form
    await expect(screen.findByText(errorMessage)).resolves.toBeVisible();
  });

  it('navigates to login page after successful signup', async () => {
    const user = userEvent.setup();

    // Mock successful signup response
    axiosMock.onPost('/users/signup').reply(200, {
      _id: '1',
      email: 'test@example.com',
      name: 'Test User',
      active: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });

    testRender(<SignUpPage />, {
      initialEntries: ['/signup'],
      mountPath: '/signup',
      routes: [
        {
          path: '/login',
          element: <div>Login Page Content</div>,
        },
      ],
    });

    // Verify we start on the signup page
    expect(screen.getByText(textConstants.signup.TITLE)).toBeVisible();

    // User fills in the form
    const nameInput = screen.getByLabelText(textConstants.signup.NAME_LABEL);
    const emailInput = screen.getByLabelText(textConstants.signup.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.signup.PASSWORD_LABEL
    );
    const confirmPasswordInput = screen.getByLabelText(
      textConstants.signup.CONFIRM_PASSWORD_LABEL
    );

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    // User submits the form
    const submitButton = screen.getByRole('button', {
      name: textConstants.signup.BUTTON_TEXT,
    });
    await user.click(submitButton);

    // Wait for navigation to login page and verify the content appears
    await expect(
      screen.findByText('Login Page Content')
    ).resolves.toBeVisible();

    // Verify we're no longer on the signup page
    expect(
      screen.queryByText(textConstants.signup.TITLE)
    ).not.toBeInTheDocument();
  });
});
