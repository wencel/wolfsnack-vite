import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Input.module.sass';
import classnames from 'classnames';

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  options?: (string | Option)[];
  className?: string;
  label?: ReactNode;
  id?: string;
  type?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onFocus?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  required?: boolean;
  [key: string]: any; // Allow additional props
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      options = [],
      type,
      className,
      label,
      id,
      defaultValue,
      value: controlledValue,
      onChange: controlledOnChange,
      onFocus,
      onBlur,
      prefix,
      suffix,
      disabled,
      required,
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number>(
      defaultValue || ''
    );

    // Generate a unique ID if one isn't provided
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;

    // Use controlled value if provided, otherwise use internal state
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;
    const isControlled = controlledValue !== undefined;

    const onChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      // Always call the onChange prop if provided
      if (controlledOnChange) {
        controlledOnChange(e);
      }

      // Update internal state for uncontrolled inputs
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const actualRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;

    const inputClasses = classnames({
      [className as string]: !!className,
      [styles.Input]: true,
    });

    const labelClasses = classnames({
      [styles.active]: isFocused || value !== '' || type === 'select',
    });

    const handleFocus = (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setIsFocused(true);
      if (onFocus && 'accept' in e.target) {
        onFocus(e as React.FocusEvent<HTMLInputElement>);
      }
    };

    const handleBlur = (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setIsFocused(false);
      if (onBlur && 'accept' in e.target) {
        onBlur(e as React.FocusEvent<HTMLInputElement>);
      }
    };

    return (
      <div className={inputClasses}>
        {label ? (
          <label
            onClick={() => {
              if (actualRef.current) {
                actualRef.current.focus();
              }
            }}
            className={labelClasses}
            htmlFor={inputId}
          >
            {label}
          </label>
        ) : (
          ''
        )}
        {type === 'select' && (
          <select
            ref={actualRef as unknown as React.RefObject<HTMLSelectElement>}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            id={inputId}
            value={String(value)}
            disabled={disabled}
            required={required}
            {...restProps}
          >
            {options.map((option: string | Option) => (
              <option
                disabled={
                  option === '' ||
                  (typeof option === 'object' && option.value === '')
                }
                key={typeof option === 'string' ? option : option.value}
                value={typeof option === 'string' ? option : option.value}
              >
                {typeof option === 'string' ? option : option.label}
              </option>
            ))}
          </select>
        )}
        {type === 'textarea' && (
          <textarea
            ref={actualRef as unknown as React.RefObject<HTMLTextAreaElement>}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            id={inputId}
            value={String(value)}
            disabled={disabled}
            required={required}
            {...restProps}
          />
        )}
        {!['select', 'textarea'].includes(type || 'text') && (
          <input
            ref={actualRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            id={inputId}
            value={String(value)}
            type={type}
            disabled={disabled}
            required={required}
            {...restProps}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
