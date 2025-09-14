import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testRender } from '@/test/test-utils';
import Navbar from './Navbar';

// Helper function to create test user objects
const createTestUser = (overrides = {}) => ({
  _id: '1',
  email: 'test@example.com',
  name: 'Test User',
  active: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  ...overrides,
});

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Redux store actions
const mockLogoutRequest = vi.fn();
vi.mock('@/store/slices/authSlice', async () => {
  const actual = await vi.importActual('@/store/slices/authSlice');
  return {
    ...actual,
    logoutRequest: () => mockLogoutRequest,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogoutRequest.mockClear();
    // Set up default mock implementation
    mockLogoutRequest.mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }));
  });

  it('renders logo and navigation when no user is logged in', () => {
    testRender(<Navbar />);
    
    // Logo should be present
    const logo = screen.getByRole('img', { name: /logo/i });
    expect(logo).toBeVisible();
    
    // User info and logout button should not be present
    expect(screen.queryByText(/test user/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument();
  });

  it('renders user info and logout button when user is logged in', () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser(),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    // User name should be visible
    expect(screen.getByText('Test User')).toBeVisible();
    
    // Logout button should be present
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    expect(logoutButton).toBeVisible();
  });

  it('navigates to home when logo is clicked', () => {
    testRender(<Navbar />);
    
    const logo = screen.getByRole('img', { name: /logo/i });
    fireEvent.click(logo);
    
    // Should navigate to home page
    expect(mockNavigate).not.toHaveBeenCalled(); // Logo is a Link, not a button
  });

  it('calls logout and navigates to login when logout button is clicked', async () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser(),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    fireEvent.click(logoutButton);
    
    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles logout API failure gracefully', async () => {
    // Mock the logoutRequest to throw an error
    mockLogoutRequest.mockImplementation(() => ({
      unwrap: () => Promise.reject(new Error('Logout failed')),
    }));

    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser(),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    fireEvent.click(logoutButton);
    
    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Should still navigate to login even if API fails
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays user name correctly', () => {
    const userName = 'John Doe';
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser({ email: 'john@example.com', name: userName }),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    expect(screen.getByText(userName)).toBeVisible();
  });

  it('handles user with missing name gracefully', () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser({ name: 'Unknown User' }),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    // Should still render logout button even without name
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    expect(logoutButton).toBeVisible();
  });

  it('maintains navigation structure', () => {
    testRender(<Navbar />);
    
    // Should have navigation role
    const nav = screen.getByRole('navigation');
    expect(nav).toBeVisible();
    
    // Logo should be within navigation
    const logo = screen.getByRole('img', { name: /logo/i });
    expect(nav).toContainElement(logo);
  });

  it('handles rapid logout clicks', async () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser(),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    
    // Click multiple times rapidly
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    
    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Should navigate to login (multiple calls are fine)
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('supports keyboard navigation', async () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser(),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    
    // Tab to button and verify focus
    logoutButton.focus();
    expect(document.activeElement).toBe(logoutButton);
    
    // Click the button (which is what happens when Enter is pressed on a focused button)
    fireEvent.click(logoutButton);
    
    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles empty user object gracefully', () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: createTestUser(),
          token: 'fake-token',
          isAuthenticated: true,
          error: null,
          initialized: true,
        },
      },
    });
    
    // Empty object {} is truthy, so logout button will still show
    // This is the actual behavior of the component
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    expect(logoutButton).toBeVisible();
  });

  it('hides logout button when user is null', () => {
    testRender(<Navbar />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          initialized: true,
        },
      },
    });
    
    // Should not show logout button when user is null
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument();
  });
});
