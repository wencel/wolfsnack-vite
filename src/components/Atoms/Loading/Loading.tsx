import React from 'react';
import classnames from 'classnames';
import styles from './Loading.module.sass';
import InlineLoading from '@/components/Atoms/InlineLoading';

interface LoadingProps {
  className?: string;
  visible?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ className, visible = true }) => {
  const loadingClasses = classnames({
    [className as string]: !!className,
    [styles.Loading]: true,
    [styles.visible]: visible,
  });
  return (
    <div className={loadingClasses} role="status" aria-label="Loading overlay">
      <InlineLoading />
    </div>
  );
};

export default Loading;
