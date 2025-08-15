import React from 'react';
import classnames from 'classnames';
import styles from './InlineLoading.module.sass';

interface InlineLoadingProps {
  className?: string;
  visible?: boolean;
}

const InlineLoading: React.FC<InlineLoadingProps> = ({ className }) => {
  const loadingClasses = classnames({
    [className as string]: !!className,
    [styles.loadingRipple]: true,
  });
  return (
    <div className={loadingClasses} data-testid="inline-loading">
      <div />
      <div />
    </div>
  );
};

export default InlineLoading;
