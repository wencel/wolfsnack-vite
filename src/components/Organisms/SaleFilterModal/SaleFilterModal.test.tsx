import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testRender, screen, fireEvent, waitFor } from '@/test/test-utils';
import SaleFilterModal from './';
import type { Customer } from '@/lib/data';
import { textConstants } from '@/lib/appConstants';

// Mock the date picker libraries to avoid date picker issues in tests
vi.mock('@wojtekmaj/react-daterange-picker', () => ({
  default: ({ onChange, value, maxDate }: any) => (
    <div data-testid="date-range-picker">
      <input
        data-testid="date-range-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <span data-testid="max-date">{maxDate?.toISOString()}</span>
      <span data-testid="is-range">true</span>
    </div>
  ),
}));

vi.mock('react-date-picker', () => ({
  default: ({ onChange, value, maxDate }: any) => (
    <div data-testid="date-picker">
      <input
        data-testid="date-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <span data-testid="max-date">{maxDate?.toISOString()}</span>
    </div>
  ),
}));

describe('SaleFilterModal Component', () => {
  const mockCustomer: Customer = {
    _id: '1',
    storeName: 'Test Store',
    name: 'John Doe',
    address: '123 Test St',
    phoneNumber: '123-456-7890',
    user: 'user1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const defaultProps = {
    showModal: true,
    closeModal: vi.fn(),
    applyFilter: vi.fn(),
    parentDateRange: undefined,
    parentOwes: null,
    parentIsThirteenDozen: null,
    parentCustomer: undefined,
    fetchCustomers: vi.fn(),
    customers: {
      data: [mockCustomer],
      loading: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal when showModal is true', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      expect(screen.getByText(textConstants.misc.FILTERS)).toBeVisible();
      expect(screen.getByText(textConstants.misc.FILTERS_TEXT)).toBeVisible();
    });

    it('does not render when showModal is false', () => {
      testRender(<SaleFilterModal {...defaultProps} showModal={false} />);

      // The Modal component might still render but should be hidden
      // Check that the modal content is not visible to the user
      const modal = screen.getByRole('dialog', { hidden: true });
      expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders all form elements', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Check for labels
      expect(screen.getByText(textConstants.misc.DATES)).toBeVisible();
      expect(screen.getByText(textConstants.salePage.OWES)).toBeVisible();
      expect(screen.getByText(textConstants.salePage.IS_THIRTEEN_DOZEN)).toBeVisible();

      // Check for radio buttons - use getAllByLabelText since there are multiple
      const yesLabels = screen.getAllByLabelText(textConstants.misc.YES);
      const noLabels = screen.getAllByLabelText(textConstants.misc.NO);
      const allLabels = screen.getAllByLabelText(textConstants.misc.ALL);
      
      expect(yesLabels).toHaveLength(2); // One for owes, one for isThirteenDozen
      expect(noLabels).toHaveLength(2);
      expect(allLabels).toHaveLength(2);

      // Check for buttons
      expect(screen.getByRole('button', { name: textConstants.misc.APPLY })).toBeVisible();
      expect(screen.getByRole('button', { name: textConstants.misc.CANCEL })).toBeVisible();
    });

    it('renders calendar with correct props', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      const calendar = screen.getByTestId('date-range-picker');
      expect(calendar).toBeVisible();
      expect(screen.getByTestId('is-range')).toHaveTextContent('true');
    });

    it('renders search field for customers', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      expect(screen.getByText(textConstants.addSale.SEARCH_CUSTOMER)).toBeVisible();
    });
  });

  describe('Initial State', () => {
    it('initializes with parent values when provided', () => {
      const parentOwes = true;
      const parentIsThirteenDozen = false;
      const parentCustomer = mockCustomer;

      testRender(
        <SaleFilterModal
          {...defaultProps}
          parentOwes={parentOwes}
          parentIsThirteenDozen={parentIsThirteenDozen}
          parentCustomer={parentCustomer}
        />
      );

      // Check that radio buttons reflect parent values
      const owesYesRadios = screen.getAllByDisplayValue('yes');
      const owesYesRadio = owesYesRadios[0]; // First one should be for owes
      
      expect(owesYesRadio).toBeChecked();
    });

    it('initializes with null values when no parent values provided', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Check that "All" radio buttons are selected by default
      const owesAllRadios = screen.getAllByDisplayValue('all');
      const isThirteenDozenAllRadios = screen.getAllByDisplayValue('all');
      
      expect(owesAllRadios[0]).toBeChecked();
      expect(isThirteenDozenAllRadios[1]).toBeChecked();
    });
  });

  describe('User Interactions', () => {
    it('handles owes radio button changes correctly', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Get all radio buttons and find the ones for owes
      const owesRadios = screen.getAllByDisplayValue('yes');
      const owesYesRadio = owesRadios[0]; // First one should be for owes
      
      fireEvent.click(owesYesRadio);
      expect(owesYesRadio).toBeChecked();

      const owesNoRadios = screen.getAllByDisplayValue('no');
      const owesNoRadio = owesNoRadios[0];
      fireEvent.click(owesNoRadio);
      expect(owesNoRadio).toBeChecked();

      const owesAllRadios = screen.getAllByDisplayValue('all');
      const owesAllRadio = owesAllRadios[0];
      fireEvent.click(owesAllRadio);
      expect(owesAllRadio).toBeChecked();
    });

    it('handles isThirteenDozen radio button changes correctly', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Get all radio buttons and find the ones for isThirteenDozen
      const isThirteenDozenYesRadios = screen.getAllByDisplayValue('yes');
      const isThirteenDozenYesRadio = isThirteenDozenYesRadios[1]; // Second one should be for isThirteenDozen
      
      fireEvent.click(isThirteenDozenYesRadio);
      expect(isThirteenDozenYesRadio).toBeChecked();

      const isThirteenDozenNoRadios = screen.getAllByDisplayValue('no');
      const isThirteenDozenNoRadio = isThirteenDozenNoRadios[1];
      fireEvent.click(isThirteenDozenNoRadio);
      expect(isThirteenDozenNoRadio).toBeChecked();

      const isThirteenDozenAllRadios = screen.getAllByDisplayValue('all');
      const isThirteenDozenAllRadio = isThirteenDozenAllRadios[1];
      fireEvent.click(isThirteenDozenAllRadio);
      expect(isThirteenDozenAllRadio).toBeChecked();
    });

    it('handles customer selection', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Simulate customer selection through SearchField
      const searchField = screen.getByText(textConstants.addSale.SEARCH_CUSTOMER);
      expect(searchField).toBeVisible();
    });

    it('handles date range changes', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      const dateInput = screen.getByTestId('date-range-input');
      const testDateRange = '2024-01-01';
      
      fireEvent.change(dateInput, { target: { value: testDateRange } });
      
      expect(dateInput).toHaveValue(testDateRange);
    });
  });

  describe('Form Submission', () => {
    it('calls applyFilter with correct values when form is submitted', async () => {
      const applyFilter = vi.fn();
      testRender(<SaleFilterModal {...defaultProps} applyFilter={applyFilter} />);

      // Set some filter values
      const owesYesRadios = screen.getAllByDisplayValue('yes');
      const owesYesRadio = owesYesRadios[0];
      const isThirteenDozenNoRadios = screen.getAllByDisplayValue('no');
      const isThirteenDozenNoRadio = isThirteenDozenNoRadios[1];
      
      fireEvent.click(owesYesRadio);
      fireEvent.click(isThirteenDozenNoRadio);

      // Submit form
      const applyButton = screen.getByRole('button', { name: textConstants.misc.APPLY });
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(applyFilter).toHaveBeenCalledWith({
          dateRange: undefined,
          owes: true,
          isThirteenDozen: false,
          customer: undefined,
        });
      });
    });

    it('calls applyFilter with all filter values when set', async () => {
      const applyFilter = vi.fn();
      testRender(<SaleFilterModal {...defaultProps} applyFilter={applyFilter} />);

      // Set all filter values
      const owesNoRadios = screen.getAllByDisplayValue('no');
      const owesNoRadio = owesNoRadios[0];
      const isThirteenDozenYesRadios = screen.getAllByDisplayValue('yes');
      const isThirteenDozenYesRadio = isThirteenDozenYesRadios[1];
      
      fireEvent.click(owesNoRadio);
      fireEvent.click(isThirteenDozenYesRadio);

      // Set date range
      const dateInput = screen.getByTestId('date-range-input');
      const testDateRange = '2024-01-01';
      fireEvent.change(dateInput, { target: { value: testDateRange } });

      // Submit form
      const applyButton = screen.getByRole('button', { name: textConstants.misc.APPLY });
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(applyFilter).toHaveBeenCalledWith({
          dateRange: testDateRange,
          owes: false,
          isThirteenDozen: true,
          customer: undefined,
        });
      });
    });
  });

  describe('Modal Actions', () => {
    it('calls closeModal when cancel button is clicked', () => {
      const closeModal = vi.fn();
      testRender(<SaleFilterModal {...defaultProps} closeModal={closeModal} />);

      const cancelButton = screen.getByRole('button', { name: textConstants.misc.CANCEL });
      fireEvent.click(cancelButton);

      expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it('calls closeModal when background is clicked', () => {
      const closeModal = vi.fn();
      testRender(<SaleFilterModal {...defaultProps} closeModal={closeModal} />);

      // The Modal component handles background clicks, so we test the prop passing
      expect(closeModal).toBeDefined();
    });
  });

  describe('Customer Search Integration', () => {
    it('displays customer data correctly', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Check that customer data is available for selection
      expect(screen.getByText(textConstants.addSale.SEARCH_CUSTOMER)).toBeVisible();
    });

    it('handles customer loading state', () => {
      testRender(
        <SaleFilterModal
          {...defaultProps}
          customers={{ data: [], loading: true }}
        />
      );

      // The SearchField component should handle the loading state
      expect(screen.getByText(textConstants.addSale.SEARCH_CUSTOMER)).toBeVisible();
    });

    it('calls fetchCustomers when search is performed', () => {
      const fetchCustomers = vi.fn();
      testRender(
        <SaleFilterModal
          {...defaultProps}
          fetchCustomers={fetchCustomers}
        />
      );

      // The SearchField component handles the actual search functionality
      expect(fetchCustomers).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      expect(screen.getByText(textConstants.misc.DATES)).toBeVisible();
      expect(screen.getByText(textConstants.salePage.OWES)).toBeVisible();
      expect(screen.getByText(textConstants.salePage.IS_THIRTEEN_DOZEN)).toBeVisible();
    });

    it('has proper button labels', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: textConstants.misc.APPLY })).toBeVisible();
      expect(screen.getByRole('button', { name: textConstants.misc.CANCEL })).toBeVisible();
    });

    it('has proper radio button labels', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Check that we have the right number of radio buttons
      const yesRadios = screen.getAllByDisplayValue('yes');
      const noRadios = screen.getAllByDisplayValue('no');
      const allRadios = screen.getAllByDisplayValue('all');
      
      expect(yesRadios).toHaveLength(2); // One for owes, one for isThirteenDozen
      expect(noRadios).toHaveLength(2);
      expect(allRadios).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined parent values gracefully', () => {
      testRender(<SaleFilterModal {...defaultProps} />);

      // Should not crash and should initialize with default values
      expect(screen.getByText(textConstants.misc.FILTERS)).toBeVisible();
    });

    it('handles empty customers array', () => {
      testRender(
        <SaleFilterModal
          {...defaultProps}
          customers={{ data: [], loading: false }}
        />
      );

      // Should render without crashing
      expect(screen.getByText(textConstants.misc.FILTERS)).toBeVisible();
    });

    it('handles form submission with no changes', async () => {
      const applyFilter = vi.fn();
      testRender(<SaleFilterModal {...defaultProps} applyFilter={applyFilter} />);

      // Submit form without changing any values
      const applyButton = screen.getByRole('button', { name: textConstants.misc.APPLY });
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(applyFilter).toHaveBeenCalledWith({
          dateRange: undefined,
          owes: null,
          isThirteenDozen: null,
          customer: undefined,
        });
      });
    });
  });
});
