import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testRender, screen, fireEvent } from '@/test/test-utils';
import Calendar from './Calendar';
import styles from './Calendar.module.sass';

// Mock the date picker components
vi.mock('@wojtekmaj/react-daterange-picker', () => ({
  default: vi.fn(({ onChange, value, className, maxDate, ...props }) => (
    <div
      data-testid="date-range-picker"
      className={className}
      data-max-date={maxDate?.toISOString()}
      {...props}
    >
      <input
        data-testid="range-picker-input"
        onChange={(e) => onChange(e.target.value)}
        value={value ? JSON.stringify(value) : ''}
      />
    </div>
  )),
}));

vi.mock('react-date-picker', () => ({
  default: vi.fn(({ onChange, value, className, maxDate, ...props }) => (
    <div
      data-testid="date-picker"
      className={className}
      data-max-date={maxDate?.toISOString()}
      {...props}
    >
      <input
        data-testid="single-picker-input"
        onChange={(e) => onChange(e.target.value)}
        value={value ? JSON.stringify(value) : ''}
      />
    </div>
  )),
}));

describe('Calendar Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Range Picker Mode (default)', () => {
    it('renders DateRangePicker when isRange is true', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={true}
        />
      );

      expect(screen.getByTestId('date-range-picker')).toBeVisible();
      expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
    });

    it('renders DateRangePicker by default when isRange is not specified', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
        />
      );

      expect(screen.getByTestId('date-range-picker')).toBeVisible();
      expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes to range picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={true}
        />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      expect(rangePicker).toHaveClass(styles.dateRangePicker);
    });

    it('forwards maxDate prop to range picker', () => {
      const maxDate = new Date('2024-12-31');
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={true}
          maxDate={maxDate}
        />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      expect(rangePicker).toHaveAttribute('data-max-date', maxDate.toISOString());
    });

    it('forwards additional props to range picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={true}
          data-testid="custom-range-picker"
          aria-label="Select date range"
        />
      );

      const rangePicker = screen.getByTestId('custom-range-picker');
      expect(rangePicker).toHaveAttribute('aria-label', 'Select date range');
    });
  });

  describe('Single Date Picker Mode', () => {
    it('renders DatePicker when isRange is false', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={false}
        />
      );

      expect(screen.getByTestId('date-picker')).toBeVisible();
      expect(screen.queryByTestId('date-range-picker')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes to single date picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={false}
        />
      );

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveClass(styles.dateRangePicker);
    });

    it('forwards maxDate prop to single date picker', () => {
      const maxDate = new Date('2024-12-31');
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={false}
          maxDate={maxDate}
        />
      );

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute('data-max-date', maxDate.toISOString());
    });

    it('forwards additional props to single date picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={false}
          data-testid="custom-date-picker"
          aria-label="Select date"
        />
      );

      const datePicker = screen.getByTestId('custom-date-picker');
      expect(datePicker).toHaveAttribute('aria-label', 'Select date');
    });
  });

  describe('Value Handling', () => {
    it('passes undefined value correctly', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
        />
      );

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue('');
    });

    it('passes single date value correctly', () => {
      const date = new Date('2024-01-15');
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={date}
          isRange={false}
        />
      );

      const input = screen.getByTestId('single-picker-input');
      expect(input).toHaveValue(JSON.stringify(date));
    });

    it('passes date range value correctly', () => {
      const dateRange = [new Date('2024-01-01'), new Date('2024-01-31')] as [Date, Date];
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={dateRange}
          isRange={true}
        />
      );

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue(JSON.stringify(dateRange));
    });
  });

  describe('Change Handling', () => {
    it('calls onChange when range picker value changes', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={true}
        />
      );

      const input = screen.getByTestId('range-picker-input');
      fireEvent.change(input, { target: { value: '2024-01-15' } });

      expect(mockOnChange).toHaveBeenCalledWith('2024-01-15');
    });

    it('calls onChange when single date picker value changes', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          isRange={false}
        />
      );

      const input = screen.getByTestId('single-picker-input');
      fireEvent.change(input, { target: { value: '2024-01-15' } });

      expect(mockOnChange).toHaveBeenCalledWith('2024-01-15');
    });
  });

  describe('CSS Classes', () => {
    it('applies Calendar wrapper class', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
        />
      );

      // The Calendar component wraps the date picker in a div with the Calendar class
      const calendarWrapper = screen.getByTestId('date-range-picker').parentElement;
      expect(calendarWrapper).toHaveClass(styles.Calendar);
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-calendar';
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          className={customClass}
        />
      );

      // The custom className is passed to the date picker components
      const datePicker = screen.getByTestId('date-range-picker');
      expect(datePicker).toHaveClass(customClass);
    });
  });

  describe('Edge Cases', () => {
    it('handles null value gracefully', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null as any}
        />
      );

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue('');
    });

    it('handles empty array value for range picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={[] as any}
          isRange={true}
        />
      );

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue('[]');
    });

    it('handles invalid date values gracefully', () => {
      const invalidDate = new Date('invalid-date');
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={invalidDate}
          isRange={false}
        />
      );

      const input = screen.getByTestId('single-picker-input');
      expect(input).toHaveValue(JSON.stringify(invalidDate));
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility attributes from props', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={undefined}
          aria-label="Select date range"
        />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      expect(rangePicker).toHaveAttribute('aria-label', 'Select date range');
    });
  });
});
