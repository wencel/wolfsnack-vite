import { describe, it, expect, afterEach } from 'vitest';
import { testRender, screen } from '@/test/test-utils';
import { axiosMock } from '@/test/setup';
import userEvent from '@testing-library/user-event';
import ActivationPage from './';
import { textConstants } from '@/lib/appConstants';

describe('Activation Page with Full Redux Integration', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  it('renders activation form with all required elements', () => {
    testRender(<ActivationPage />, {
      initialEntries: ['/activate/test-token-123'],
      mountPath: '/activate/:token',
    });

    const title = screen.getByRole('heading', {
      name: textConstants.activation.TITLE,
    });
    const description = screen.getByText(textConstants.activation.DESCRIPTION);
    const activateButton = screen.getByRole('button', {
      name: textConstants.activation.BUTTON_TEXT,
    });

    expect(title).toBeVisible();
    expect(description).toBeVisible();
    expect(activateButton).toBeVisible();
  });

  it('displays page title correctly', () => {
    testRender(<ActivationPage />, {
      initialEntries: ['/activate/test-token-123'],
      mountPath: '/activate/:token',
    });

    expect(
      screen.getByRole('heading', { name: textConstants.activation.TITLE })
    ).toBeVisible();
    expect(
      screen.getByText(textConstants.activation.DESCRIPTION)
    ).toBeVisible();
  });

  it('allows user to click the activation button', async () => {
    const user = userEvent.setup();
    testRender(<ActivationPage />, {
      initialEntries: ['/activate/test-token-123'],
      mountPath: '/activate/:token',
    });

    const activateButton = screen.getByRole('button', {
      name: textConstants.activation.BUTTON_TEXT,
    });

    expect(activateButton).toBeVisible();
    expect(activateButton).not.toBeDisabled();

    await user.click(activateButton);
  });

  it('handles activation failure gracefully', async () => {
    const user = userEvent.setup();

    // Mock activation to fail with 404 status
    axiosMock.onPost('/users/activate/test-token-123').reply(404, {});

    testRender(<ActivationPage />, {
      initialEntries: ['/activate/test-token-123'],
      mountPath: '/activate/:token',
    });

    // User clicks the activation button
    const activateButton = screen.getByRole('button', {
      name: textConstants.activation.BUTTON_TEXT,
    });
    await user.click(activateButton);

    // Verify the page is still visible (doesn't crash)
    expect(
      screen.getByRole('heading', { name: textConstants.activation.TITLE })
    ).toBeVisible();
  });

  it('navigates to login page after successful activation', async () => {
    const user = userEvent.setup();

    // Mock successful activation response
    axiosMock.onPost('/users/activate/test-token-123').reply(200, {
      user: {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'fake-jwt-token',
    });

    testRender(<ActivationPage />, {
      initialEntries: ['/activate/test-token-123'],
      mountPath: '/activate/:token',
      routes: [
        {
          path: '/login',
          element: <div>Login Page Content</div>,
        },
      ],
    });

    // Verify we start on the activation page
    expect(
      screen.getByRole('heading', { name: textConstants.activation.TITLE })
    ).toBeVisible();

    // User clicks the activation button
    const activateButton = screen.getByRole('button', {
      name: textConstants.activation.BUTTON_TEXT,
    });
    await user.click(activateButton);

    // Wait for navigation to login page and verify the content appears
    await expect(
      screen.findByText('Login Page Content')
    ).resolves.toBeVisible();

    // Verify we're no longer on the activation page
    expect(
      screen.queryByRole('heading', { name: textConstants.activation.TITLE })
    ).not.toBeInTheDocument();
  });
});
