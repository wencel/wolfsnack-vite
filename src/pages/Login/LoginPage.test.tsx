import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  testRender,
  screen,
  mockAxios,
  resetAxiosMocks,
} from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { textConstants } from '@/lib/appConstants';

describe('Login Page with Full Redux Integration', () => {
  let axiosMock: ReturnType<typeof mockAxios>;



  beforeEach(() => {
    axiosMock = mockAxios();
  });

  afterEach(() => {
    resetAxiosMocks();
  });

  it('renders login form with all required fields', () => {
    testRender(<LoginPage />);

    const emailInput = screen.getByLabelText(textConstants.login.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.login.PASSWORD_LABEL
    );
    const submitButton = screen.getByRole('button', {
      name: textConstants.login.BUTTON_TEXT,
    });
    const rememberMeCheckbox = screen.getByLabelText(
      textConstants.misc.REMEMBER_ME
    );

    expect(emailInput).toBeVisible();
    expect(passwordInput).toBeVisible();
    expect(submitButton).toBeVisible();
    expect(rememberMeCheckbox).toBeVisible();
  });

  it('displays page title correctly', () => {
    testRender(<LoginPage />);

    expect(screen.getByText(textConstants.login.TITLE)).toBeVisible();
    expect(screen.getByText(textConstants.login.DESCRIPTION)).toBeVisible();
  });

  it('allows user to enter email and password', async () => {
    const user = userEvent.setup();
    testRender(<LoginPage />);

    const emailInput = screen.getByLabelText(textConstants.login.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.login.PASSWORD_LABEL
    );
    expect(emailInput).toBeVisible();
    expect(passwordInput).toBeVisible();

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles remember me checkbox', async () => {
    const user = userEvent.setup();
    testRender(<LoginPage />);

    const rememberMeCheckbox = screen.getByLabelText(
      textConstants.misc.REMEMBER_ME
    );

    expect(rememberMeCheckbox).not.toBeChecked();

    await user.click(rememberMeCheckbox);

    expect(rememberMeCheckbox).toBeChecked();
  });

  it('displays error message when login fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';

    // Mock login to fail with proper AxiosError structure
    const mockError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {},
      },
    };
    axiosMock.post.mockRejectedValue(mockError);

    testRender(<LoginPage />);

    // User fills in the form
    const emailInput = screen.getByLabelText(textConstants.login.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.login.PASSWORD_LABEL
    );

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');

    // User submits the form
    const submitButton = screen.getByRole('button', {
      name: textConstants.login.BUTTON_TEXT,
    });
    await user.click(submitButton);

    // Verify the error message appears in the form
    await expect(screen.findByText(errorMessage)).resolves.toBeVisible();
  });

  it('navigates to customers page after successful login', async () => {
    const user = userEvent.setup();

    // Mock successful login response
    axiosMock.post.mockResolvedValue({
      data: {
        user: {
          _id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'fake-jwt-token',
      },
    });

    testRender(
      <LoginPage />,
      {
        initialEntries: ['/login'],
        mountPath: '/login',
        routes: [
          {
            path: '/customers',
            element: <div>Customers Page Content</div>
          }
        ]
      }
    );

    // Verify we start on the login page
    expect(screen.getByText(textConstants.login.TITLE)).toBeVisible();

    // User fills in the form
    const emailInput = screen.getByLabelText(textConstants.login.EMAIL_LABEL);
    const passwordInput = screen.getByLabelText(
      textConstants.login.PASSWORD_LABEL
    );

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // User submits the form
    const submitButton = screen.getByRole('button', {
      name: textConstants.login.BUTTON_TEXT,
    });
    await user.click(submitButton);

    // Wait for navigation to customers page and verify the content appears
    await expect(
      screen.findByText('Customers Page Content')
    ).resolves.toBeVisible();

    // Verify we're no longer on the login page
    expect(
      screen.queryByText(textConstants.login.TITLE)
    ).not.toBeInTheDocument();
  });
});
