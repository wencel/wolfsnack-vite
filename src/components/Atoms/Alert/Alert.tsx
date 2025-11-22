import React from 'react';
import classnames from 'classnames';
import styles from './Alert.module.sass';

export type AlertVariant = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  role?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'error',
  className,
  role = 'alert',
  'aria-live': ariaLive = 'assertive',
}) => {
  const alertClasses = classnames({
    [styles.Alert]: true,
    [styles[variant]]: true,
    [className as string]: !!className,
  });

  return (
    <div className={alertClasses} role={role} aria-live={ariaLive}>
      {children}
    </div>
  );
};

export default Alert;
