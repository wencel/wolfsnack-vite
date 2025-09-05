import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testRender } from '@/test/test-utils';
import TopActions from './';
import type { TopActionsProps, TopActionButton } from './TopActions';

describe('TopActions', () => {
  const mockOnClick = vi.fn();
  
  const defaultButtons: TopActionButton[] = [
    {
      text: 'Add Customer',
      onClick: mockOnClick,
    },
    {
      text: 'Settings',
      href: '/settings',
    },
  ];

  const defaultProps: TopActionsProps = {
    buttons: defaultButtons,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      testRender(<TopActions {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeVisible();
    });

    it('renders with custom className', () => {
      const customClass = 'custom-top-actions';
      testRender(<TopActions {...defaultProps} className={customClass} />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveClass(customClass);
    });

    it('renders with custom position', () => {
      testRender(<TopActions {...defaultProps} position="bottom" />);
      
      const navigation = screen.getByRole('navigation');
      // Check that the component has the TopActions class (CSS module will hash it)
      expect(navigation.className).toContain('TopActions');
    });

    it('renders without buttons when buttons prop is not provided', () => {
      testRender(<TopActions />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeVisible();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders without buttons when buttons array is empty', () => {
      testRender(<TopActions buttons={[]} />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeVisible();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('button rendering', () => {
    it('renders all provided buttons', () => {
      testRender(<TopActions {...defaultProps} />);
      
      // Use getByText since the button names are affected by tooltip wrapper
      expect(screen.getByText('Add Customer')).toBeVisible();
      expect(screen.getByText('Settings')).toBeVisible();
    });

    it('renders buttons with icons', () => {
      const buttonsWithIcons: TopActionButton[] = [
        {
          text: 'Save',
          icon: <span data-testid="save-icon">💾</span>,
          onClick: mockOnClick,
        },
      ];

      testRender(<TopActions buttons={buttonsWithIcons} />);
      
      expect(screen.getByText('Save')).toBeVisible();
      expect(screen.getByTestId('save-icon')).toBeVisible();
    });

    it('renders buttons with both text and icon', () => {
      const buttonsWithIcons: TopActionButton[] = [
        {
          text: 'Delete',
          icon: <span data-testid="delete-icon">🗑️</span>,
          onClick: mockOnClick,
        },
      ];

      testRender(<TopActions buttons={buttonsWithIcons} />);
      
      const buttonText = screen.getByText('Delete');
      expect(buttonText).toBeVisible();
      expect(screen.getByTestId('delete-icon')).toBeVisible();
      expect(buttonText).toHaveTextContent('Delete');
    });
  });

  describe('button functionality', () => {
    it('calls onClick when button is clicked', async () => {
      const user = userEvent.setup();
      testRender(<TopActions {...defaultProps} />);
      
      const addCustomerButton = screen.getByText('Add Customer');
      await user.click(addCustomerButton);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('renders link buttons when href is provided', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const settingsLink = screen.getByText('Settings');
      expect(settingsLink).toBeVisible();
      // Check that it's wrapped in a link element
      const linkElement = settingsLink.closest('a');
      expect(linkElement).toHaveAttribute('href', '/settings');
    });

    it('renders button elements when no href is provided', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const addCustomerText = screen.getByText('Add Customer');
      const buttonElement = addCustomerText.closest('button');
      expect(buttonElement).toBeVisible();
      expect(buttonElement?.tagName).toBe('BUTTON');
    });
  });

  describe('button styling and themes', () => {
    it('applies correct theme to buttons', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Check that the button has the BottomNavigation theme class (CSS module will hash it)
        expect(button.className).toContain('BottomNavigation');
      });
    });

    it('applies TopActions class to navigation wrapper', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation.className).toContain('TopActions');
    });

    it('applies item class to button wrappers', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // The item class is applied to the button wrapper div
        const wrapper = button.closest('div');
        expect(wrapper?.className).toContain('item');
      });
    });
  });

  describe('edge cases', () => {
    it('handles buttons with additional properties', () => {
      const buttonsWithExtraProps: TopActionButton[] = [
        {
          text: 'Custom Button',
          onClick: mockOnClick,
          disabled: true,
          'data-custom': 'value',
        } as TopActionButton,
      ];

      testRender(<TopActions buttons={buttonsWithExtraProps} />);
      
      const buttonText = screen.getByText('Custom Button');
      const buttonElement = buttonText.closest('button');
      expect(buttonElement).toBeVisible();
      expect(buttonElement).toHaveAttribute('data-custom', 'value');
      expect(buttonElement).toBeDisabled();
    });

    it('handles buttons with empty text', () => {
      const buttonsWithEmptyText: TopActionButton[] = [
        {
          text: '',
          onClick: mockOnClick,
        },
      ];

      testRender(<TopActions buttons={buttonsWithEmptyText} />);
      
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeVisible();
      expect(buttonElement).toHaveTextContent('');
    });

    it('handles buttons with only icons', () => {
      const buttonsWithOnlyIcons: TopActionButton[] = [
        {
          text: '',
          icon: <span data-testid="icon-only">🔍</span>,
          onClick: mockOnClick,
        },
      ];

      testRender(<TopActions buttons={buttonsWithOnlyIcons} />);
      
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeVisible();
      expect(screen.getByTestId('icon-only')).toBeVisible();
    });
  });

  describe('accessibility', () => {
    it('has proper navigation role', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeVisible();
    });

    it('renders buttons with accessible content', () => {
      testRender(<TopActions {...defaultProps} />);
      
      expect(screen.getByText('Add Customer')).toBeVisible();
      expect(screen.getByText('Settings')).toBeVisible();
    });

    it('maintains button accessibility when onClick is provided', () => {
      testRender(<TopActions {...defaultProps} />);
      
      const buttonText = screen.getByText('Add Customer');
      const buttonElement = buttonText.closest('button');
      expect(buttonElement).toBeVisible();
      expect(buttonElement).not.toBeDisabled();
    });
  });
});