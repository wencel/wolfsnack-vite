import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Input.module.sass';
import classnames from 'classnames';

interface Option {
  value: string;
  label: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number>(
      defaultValue || ''
    );

    // Use controlled value if provided, otherwise use internal state
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;
    const isControlled = controlledValue !== undefined;

    const onChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      if (isControlled && controlledOnChange) {
        controlledOnChange(e);
      } else {
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
      [styles.active]: isFocused || (value !== '' && value !== 0),
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
            htmlFor={id}
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
            id={id}
            value={String(value)}
          >
            {options.map(option => (
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
            id={id}
            value={String(value)}
          />
        )}
        {!['select', 'textarea'].includes(type || 'text') && (
          <input
            ref={actualRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            id={id}
            value={String(value)}
            type={type}
            {...restProps}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
