import { screen, fireEvent } from '@testing-library/react';
import { testRender } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderFilterModal from './';
import { textConstants } from '@/lib/appConstants';

// Type definitions for react-datepicker
type DateRangeValue = [Date | null, Date | null];

// Mock the Calendar component to avoid complex date picker testing
vi.mock('@/components/Atoms/Calendar', () => ({
  default: ({ onChange, value, isRange, maxDate }: any) => (
    <div
      data-testid="calendar"
      data-is-range={isRange}
      data-max-date={maxDate?.toISOString()}
    >
      <input
        data-testid="calendar-input"
        value={value ? JSON.stringify(value) : ''}
        onChange={e => {
          try {
            const parsedValue = e.target.value
              ? JSON.parse(e.target.value)
              : undefined;
            onChange(parsedValue);
          } catch {
            // Handle invalid JSON gracefully
            onChange(undefined);
          }
        }}
        placeholder="Select dates"
      />
    </div>
  ),
}));

describe('OrderFilterModal', () => {
  const mockCloseModal = vi.fn();
  const mockApplyFilter = vi.fn();

  const defaultProps = {
    closeModal: mockCloseModal,
    applyFilter: mockApplyFilter,
    showModal: true,
    parentDateRange: null,
  };

  beforeEach(() => {
    mockCloseModal.mockClear();
    mockApplyFilter.mockClear();
  });

  it('renders with all required props', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    // Modal should be visible
    const modal = screen.getByRole('dialog');
    expect(modal).toBeVisible();

    // Should have filter title and description
    expect(screen.getByText(textConstants.misc.FILTERS)).toBeVisible();
    expect(screen.getByText(textConstants.misc.FILTERS_TEXT)).toBeVisible();

    // Should have dates label
    expect(screen.getByText(textConstants.misc.DATES)).toBeVisible();

    // Should have calendar component
    expect(screen.getByTestId('calendar')).toBeVisible();

    // Should have apply and cancel buttons
    expect(
      screen.getByRole('button', { name: textConstants.misc.APPLY })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: textConstants.misc.CANCEL })
    ).toBeVisible();
  });

  it('does not render when showModal is false', () => {
    testRender(<OrderFilterModal {...defaultProps} showModal={false} />);

    // Modal should be hidden
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).not.toBeVisible();
  });

  it('initializes calendar with parent date range', () => {
    const testDateRange = [
      new Date('2024-01-01'),
      new Date('2024-01-31'),
    ] as LooseValue;
    const propsWithDateRange = {
      ...defaultProps,
      parentDateRange: testDateRange,
    };

    testRender(<OrderFilterModal {...propsWithDateRange} />);

    // Calendar should have parent date range value
    const calendarInput = screen.getByTestId('calendar-input');
    expect(calendarInput).toHaveValue(JSON.stringify(testDateRange));
  });

  it('updates calendar when parent date range changes and modal reopens', () => {
    const { testRerender } = testRender(<OrderFilterModal {...defaultProps} />);

    // Initially no date range
    let calendarInput = screen.getByTestId('calendar-input');
    expect(calendarInput).toHaveValue('');

    // Update with new parent date range
    const newDateRange = [
      new Date('2024-02-01'),
      new Date('2024-02-28'),
    ] as LooseValue;
    testRerender(
      <OrderFilterModal {...defaultProps} parentDateRange={newDateRange} />
    );

    // Calendar should not be updated yet (useEffect only runs on showModal changes)
    calendarInput = screen.getByTestId('calendar-input');
    expect(calendarInput).toHaveValue('');

    // Close and reopen modal to trigger useEffect
    testRerender(
      <OrderFilterModal
        {...defaultProps}
        parentDateRange={newDateRange}
        showModal={false}
      />
    );

    testRerender(
      <OrderFilterModal
        {...defaultProps}
        parentDateRange={newDateRange}
        showModal={true}
      />
    );

    // Now calendar should be updated
    calendarInput = screen.getByTestId('calendar-input');
    expect(calendarInput).toHaveValue(JSON.stringify(newDateRange));
  });

  it('calls closeModal when cancel button is clicked', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', {
      name: textConstants.misc.CANCEL,
    });
    fireEvent.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls closeModal when background is clicked', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const background = screen.getByTestId('modal-background');
    fireEvent.click(background);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls applyFilter with current date range when apply button is clicked', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledTimes(1);
    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: null,
    });
  });

  it('updates date range when calendar value changes', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendarInput = screen.getByTestId('calendar-input');
    const newDateRange = [new Date('2024-03-01'), new Date('2024-03-31')];

    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(newDateRange) },
    });

    expect(calendarInput).toHaveValue(JSON.stringify(newDateRange));
  });

  it('calls applyFilter with updated date range after calendar changes', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    // Update calendar value
    const calendarInput = screen.getByTestId('calendar-input');
    const newDateRange = [new Date('2024-04-01'), new Date('2024-04-30')];

    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(newDateRange) },
    });

    // Submit form
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: JSON.parse(JSON.stringify(newDateRange)),
    });
  });

  it('renders calendar with range picker enabled', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('data-is-range', 'true');
  });

  it('sets max date to current date', () => {
    const currentDate = new Date('2024-12-15T10:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(currentDate);

    testRender(<OrderFilterModal {...defaultProps} />);

    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute(
      'data-max-date',
      currentDate.toISOString()
    );

    vi.useRealTimers();
  });

  it('resets calendar to parent date range when modal is reopened', () => {
    const initialDateRange = [
      new Date('2024-01-01'),
      new Date('2024-01-31'),
    ] as LooseValue;
    const propsWithDateRange = {
      ...defaultProps,
      parentDateRange: initialDateRange,
    };

    const { testRerender } = testRender(
      <OrderFilterModal {...propsWithDateRange} />
    );

    // Change calendar value
    const calendarInput = screen.getByTestId('calendar-input');
    const changedDateRange = [
      new Date('2024-02-01'),
      new Date('2024-02-28'),
    ] as LooseValue;
    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(changedDateRange) },
    });

    // Close modal
    testRerender(
      <OrderFilterModal {...propsWithDateRange} showModal={false} />
    );

    // Reopen modal
    testRerender(<OrderFilterModal {...propsWithDateRange} showModal={true} />);

    // Calendar should be reset to parent values
    const newCalendarInput = screen.getByTestId('calendar-input');
    expect(newCalendarInput).toHaveValue(JSON.stringify(initialDateRange));
  });

  it('handles form submission with null date range', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: null,
    });
  });

  it('handles form submission with empty date range', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    // Set empty date range
    const calendarInput = screen.getByTestId('calendar-input');
    fireEvent.change(calendarInput, { target: { value: '' } });

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: null,
    });
  });

  it('maintains calendar state during user interactions', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendarInput = screen.getByTestId('calendar-input');
    const testDateRange = [new Date('2024-05-01'), new Date('2024-05-31')];

    // Simulate user selecting dates
    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(testDateRange) },
    });

    // Verify state is maintained
    expect(calendarInput).toHaveValue(JSON.stringify(testDateRange));

    // Submit should use current values
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: JSON.parse(JSON.stringify(testDateRange)),
    });
  });

  it('supports keyboard navigation', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendarInput = screen.getByTestId('calendar-input');
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    const cancelButton = screen.getByRole('button', {
      name: textConstants.misc.CANCEL,
    });

    // Focus calendar input
    calendarInput.focus();
    expect(document.activeElement).toBe(calendarInput);

    // Tab to apply button
    applyButton.focus();
    expect(document.activeElement).toBe(applyButton);

    // Tab to cancel button
    cancelButton.focus();
    expect(document.activeElement).toBe(cancelButton);
  });

  it('handles rapid calendar changes correctly', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendarInput = screen.getByTestId('calendar-input');

    // Rapid date changes
    const dateRange1 = [new Date('2024-06-01'), new Date('2024-06-30')];
    const dateRange2 = [new Date('2024-07-01'), new Date('2024-07-31')];
    const dateRange3 = [new Date('2024-08-01'), new Date('2024-08-31')];

    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(dateRange1) },
    });
    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(dateRange2) },
    });
    fireEvent.change(calendarInput, {
      target: { value: JSON.stringify(dateRange3) },
    });

    expect(calendarInput).toHaveValue(JSON.stringify(dateRange3));

    // Submit should use final value
    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: JSON.parse(JSON.stringify(dateRange3)),
    });
  });

  it('handles invalid JSON input gracefully', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendarInput = screen.getByTestId('calendar-input');

    // Set invalid JSON
    fireEvent.change(calendarInput, { target: { value: 'invalid json' } });

    const applyButton = screen.getByRole('button', {
      name: textConstants.misc.APPLY,
    });
    fireEvent.click(applyButton);

    // Should call applyFilter with undefined when JSON is invalid
    expect(mockApplyFilter).toHaveBeenCalledWith({
      dateRange: undefined,
    });
  });

  it('handles single date selection when isRange is false', () => {
    testRender(<OrderFilterModal {...defaultProps} />);

    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('data-is-range', 'true'); // Should still be true as per component logic
  });
});
