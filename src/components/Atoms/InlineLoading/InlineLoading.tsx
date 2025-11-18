import React from 'react';
import classnames from 'classnames';
import styles from './InlineLoading.module.sass';

interface InlineLoadingProps {
  className?: string;
  visible?: boolean;
  theme?: 'colored' | 'white';
}

const InlineLoading: React.FC<InlineLoadingProps> = ({
  className,
  theme = 'white',
}) => {
  const loadingClasses = classnames({
    [className as string]: !!className,
    [styles.loadingRipple]: true,
    [styles.colored]: theme === 'colored',
    [styles.white]: theme === 'white',
  });
  return (
    <div className={loadingClasses} data-testid="inline-loading">
      <div />
      <div />
    </div>
  );
};

export default InlineLoading;
