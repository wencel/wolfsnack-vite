import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testRender, screen, fireEvent } from '@/test/test-utils';
import Calendar from './Calendar';
import styles from './Calendar.module.sass';

// Type definitions for react-datepicker (used in mock implementation)

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
  default: vi.fn(
    ({
      onChange,
      selected,
      startDate,
      endDate,
      selectsRange,
      className,
      maxDate,
      minDate,
      disabled,
      placeholderText,
      dateFormat,
      showPopperArrow,
      locale,
      onFocus,
      onBlur,
      ...props
    }) => {
      const getValue = () => {
        if (selectsRange) {
          return startDate && !isNaN(startDate.getTime())
            ? startDate.toISOString()
            : '';
        } else {
          return selected && !isNaN(selected.getTime())
            ? selected.toISOString()
            : '';
        }
      };

      return (
        <div
          data-testid={selectsRange ? 'date-range-picker' : 'date-picker'}
          className={className}
          data-max-date={maxDate?.toISOString()}
          data-min-date={minDate?.toISOString()}
          data-disabled={disabled}
          data-placeholder={placeholderText}
          data-start-date={startDate?.toISOString() || ''}
          data-end-date={endDate?.toISOString() || ''}
          aria-label={props['aria-label']}
          {...props}
        >
          <input
            data-testid={
              selectsRange ? 'range-picker-input' : 'single-picker-input'
            }
            onChange={e => {
              if (selectsRange) {
                // For range picker, simulate date range selection
                const dates = e.target.value
                  ? [new Date(e.target.value), new Date(e.target.value)]
                  : [null, null];
                onChange(dates);
              } else {
                // For single picker, simulate single date selection
                const date = e.target.value ? new Date(e.target.value) : null;
                onChange(date);
              }
            }}
            value={getValue()}
            placeholder={placeholderText}
            disabled={disabled}
          />
        </div>
      );
    }
  ),
  registerLocale: vi.fn(),
}));

describe('Calendar Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Range Picker Mode (default)', () => {
    it('renders DateRangePicker when isRange is true', () => {
      testRender(
        <Calendar onChange={mockOnChange} value={null} isRange={true} />
      );

      expect(screen.getByTestId('date-range-picker')).toBeVisible();
      expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
    });

    it('renders DateRangePicker by default when isRange is not specified', () => {
      testRender(<Calendar onChange={mockOnChange} value={null} />);

      expect(screen.getByTestId('date-range-picker')).toBeVisible();
      expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes to range picker', () => {
      testRender(
        <Calendar onChange={mockOnChange} value={null} isRange={true} />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      expect(rangePicker).toHaveClass(styles.datePicker);
    });

    it('forwards maxDate prop to range picker', () => {
      const maxDate = new Date('2024-12-31');
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null}
          isRange={true}
          maxDate={maxDate}
        />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      expect(rangePicker).toHaveAttribute(
        'data-max-date',
        maxDate.toISOString()
      );
    });

    it('forwards additional props to range picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null}
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
        <Calendar onChange={mockOnChange} value={null} isRange={false} />
      );

      expect(screen.getByTestId('date-picker')).toBeVisible();
      expect(screen.queryByTestId('date-range-picker')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes to single date picker', () => {
      testRender(
        <Calendar onChange={mockOnChange} value={null} isRange={false} />
      );

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveClass(styles.datePicker);
    });

    it('forwards maxDate prop to single date picker', () => {
      const maxDate = new Date('2024-12-31');
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null}
          isRange={false}
          maxDate={maxDate}
        />
      );

      const datePicker = screen.getByTestId('date-picker');
      expect(datePicker).toHaveAttribute(
        'data-max-date',
        maxDate.toISOString()
      );
    });

    it('forwards additional props to single date picker', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null}
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
    it('passes null value correctly', () => {
      testRender(<Calendar onChange={mockOnChange} value={null} />);

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue('');
    });

    it('passes single date value correctly', () => {
      const date = new Date('2024-01-15');
      testRender(
        <Calendar onChange={mockOnChange} value={date} isRange={false} />
      );

      const input = screen.getByTestId('single-picker-input');
      expect(input).toHaveValue('2024-01-15T00:00:00.000Z');
    });

    it('passes date range value correctly', () => {
      const dateRange = [new Date('2024-01-01'), new Date('2024-01-31')] as [
        Date,
        Date,
      ];
      testRender(
        <Calendar onChange={mockOnChange} value={dateRange} isRange={true} />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      const input = screen.getByTestId('range-picker-input');

      // Verify both dates are passed to the DatePicker component
      expect(rangePicker).toHaveAttribute(
        'data-start-date',
        '2024-01-01T00:00:00.000Z'
      );
      expect(rangePicker).toHaveAttribute(
        'data-end-date',
        '2024-01-31T00:00:00.000Z'
      );
      // The input shows the start date (this is how react-datepicker works)
      expect(input).toHaveValue('2024-01-01T00:00:00.000Z');
    });

    it('passes partial date range value correctly (only start date)', () => {
      const partialRange = [new Date('2024-01-01'), null] as [Date, null];
      testRender(
        <Calendar onChange={mockOnChange} value={partialRange} isRange={true} />
      );

      const rangePicker = screen.getByTestId('date-range-picker');
      const input = screen.getByTestId('range-picker-input');

      // Verify start date is passed but end date is null
      expect(rangePicker).toHaveAttribute(
        'data-start-date',
        '2024-01-01T00:00:00.000Z'
      );
      expect(rangePicker).toHaveAttribute('data-end-date', '');
      // The input shows the start date
      expect(input).toHaveValue('2024-01-01T00:00:00.000Z');
    });
  });

  describe('Change Handling', () => {
    it('calls onChange when range picker value changes', () => {
      testRender(
        <Calendar onChange={mockOnChange} value={null} isRange={true} />
      );

      const input = screen.getByTestId('range-picker-input');
      fireEvent.change(input, { target: { value: '2024-01-15' } });

      expect(mockOnChange).toHaveBeenCalledWith([
        new Date('2024-01-15'),
        new Date('2024-01-15'),
      ]);
    });

    it('calls onChange when single date picker value changes', () => {
      testRender(
        <Calendar onChange={mockOnChange} value={null} isRange={false} />
      );

      const input = screen.getByTestId('single-picker-input');
      fireEvent.change(input, { target: { value: '2024-01-15' } });

      expect(mockOnChange).toHaveBeenCalledWith(new Date('2024-01-15'));
    });
  });

  describe('CSS Classes', () => {
    it('applies Calendar wrapper class', () => {
      testRender(<Calendar onChange={mockOnChange} value={null} />);

      // The Calendar component wraps the date picker in a div with the Calendar class
      const calendarWrapper =
        screen.getByTestId('date-range-picker').parentElement;
      expect(calendarWrapper).toHaveClass(styles.Calendar);
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-calendar';
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null}
          className={customClass}
        />
      );

      // The custom className is applied to the Calendar wrapper div
      const calendarWrapper =
        screen.getByTestId('date-range-picker').parentElement;
      expect(calendarWrapper).toHaveClass(customClass);
    });
  });

  describe('Edge Cases', () => {
    it('handles null value gracefully', () => {
      testRender(<Calendar onChange={mockOnChange} value={null as any} />);

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue('');
    });

    it('handles empty array value for range picker', () => {
      testRender(
        <Calendar onChange={mockOnChange} value={[] as any} isRange={true} />
      );

      const input = screen.getByTestId('range-picker-input');
      expect(input).toHaveValue('');
    });

    it('handles invalid date values gracefully', () => {
      const invalidDate = new Date('invalid-date');
      testRender(
        <Calendar onChange={mockOnChange} value={invalidDate} isRange={false} />
      );

      const input = screen.getByTestId('single-picker-input');
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility attributes from props', () => {
      testRender(
        <Calendar
          onChange={mockOnChange}
          value={null}
          aria-label="Select date range"
        />
      );

      // The aria-label is applied to the Calendar wrapper div
      const calendarWrapper =
        screen.getByTestId('date-range-picker').parentElement;
      expect(calendarWrapper).toHaveAttribute(
        'aria-label',
        'Select date range'
      );
    });
  });
});
