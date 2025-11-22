import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import classnames from 'classnames';

import styles from './Calendar.module.sass';

// Type definitions for react-datepicker
type DateValue = Date | null;
type DateRangeValue = [Date | null, Date | null];

interface CalendarProps {
  id?: string;
  onChange: (value: DateValue | DateRangeValue | null) => void;
  value: DateValue | DateRangeValue | null;
  isRange?: boolean;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  selectsRange?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  isClearable?: boolean;
}

registerLocale('es', es);

const Calendar: React.FC<CalendarProps> = ({
  onChange,
  value,
  isRange = true,
  maxDate,
  minDate,
  disabled = false,
  placeholder,
  label,
  className,
  isClearable = false,
  id,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerClassName = `${styles.Calendar} ${className || ''}`.trim();

  // Prepare values based on range mode
  const rangeValue = Array.isArray(value) ? value : [null, null];
  const [startDate, endDate] = rangeValue;
  const singleValue = Array.isArray(value) ? value[0] : value;

  // Check if there's a value to determine label state
  const hasValue = isRange
    ? startDate !== null || endDate !== null
    : singleValue !== null;

  // Handle change events
  const handleChange = (date: Date | null | [Date | null, Date | null]) => {
    onChange(date as DateValue | DateRangeValue | null);
  };

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Prepare props based on range mode
  const datePickerProps = isRange
    ? {
        selected: startDate,
        startDate,
        endDate,
        selectsRange: true as const,
        placeholderText: '', // Empty placeholder since we use label
      }
    : {
        selected: singleValue,
        placeholderText: '', // Empty placeholder since we use label
      };

  // Label classes
  const labelClasses = classnames({
    [styles.active]: isFocused || hasValue,
  });

  return (
    <div className={containerClassName} {...rest}>
      {label && (
        <label
          className={labelClasses}
          onClick={() => {
            // Focus the input when label is clicked
            const input = document.querySelector(
              `.${styles.datePicker} input`
            ) as HTMLInputElement;
            if (input) {
              input.focus();
            }
          }}
        >
          {label}
        </label>
      )}
      <DatePicker
        {...datePickerProps}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        locale="es"
        dateFormat="dd/MM/yyyy"
        maxDate={maxDate}
        minDate={minDate}
        disabled={disabled}
        className={styles.datePicker}
        showPopperArrow={false}
        isClearable={isClearable}
        id={id}
      />
    </div>
  );
};

export default Calendar;
