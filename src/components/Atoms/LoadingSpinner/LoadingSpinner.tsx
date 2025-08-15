import React from 'react';
import styles from './LoadingSpinner.module.sass';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'primary' | 'secondary';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'white',
  className,
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[color],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClasses} role='status' aria-label='Loading'>
      <div className={styles.spinnerInner}></div>
    </div>
  );
};

export default LoadingSpinner;
