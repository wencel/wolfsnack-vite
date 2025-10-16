import React from 'react';
import classnames from 'classnames';
import styles from './Checkbox.module.sass';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  theme?: string;
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  theme = 'path',
  label,
  id,
  ...restProps
}) => {
  const checkboxClasses = classnames({
    [className as string]: !!className,
    [styles.Checkbox]: true,
    [styles[theme as keyof typeof styles]]: !!theme,
  });
  const generatedId = React.useId();
  const inputId = id || `input-${generatedId}`;
  return (
    <label htmlFor={inputId} className={checkboxClasses}>
      <input id={inputId} type="checkbox" {...restProps} />
      <svg viewBox="0 0 21 21" data-testid="checkbox-icon">
        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
      </svg>
      <span data-testid="checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;
