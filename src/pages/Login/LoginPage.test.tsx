import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  render as rtlRender,
  screen,
  mockAxios,
  resetAxiosMocks,
  createTestStore,
} from '@/test/test-utils';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { textConstants } from '@/lib/appConstants';
import ToastProvider from '@/components/Providers/ToastProvider';

describe('Login Page with Full Redux Integration', () => {
  let axiosMock: ReturnType<typeof mockAxios>;

  const renderWithProviders = () => {
    return rtlRender(<LoginPage />);
  };

  const renderWithRouting = (initialRoute = '/login') => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
              <Route path='/login' element={<LoginPage />} />
              <Route
                path='/customers'
                element={<div>Customers Page Content</div>}
              />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    axiosMock = mockAxios();
  });

  afterEach(() => {
    resetAxiosMocks();
  });

  it('renders login form with all required fields', () => {
    renderWithProviders();

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
    renderWithProviders();

    expect(screen.getByText(textConstants.login.TITLE)).toBeVisible();
    expect(screen.getByText(textConstants.login.DESCRIPTION)).toBeVisible();
  });

  it('allows user to enter email and password', async () => {
    const user = userEvent.setup();
    renderWithProviders();

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
    renderWithProviders();

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

    renderWithProviders();

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

    renderWithRouting('/login');

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
