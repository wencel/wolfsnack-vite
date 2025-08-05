import React from 'react';
import type { Ref } from 'react';
import classnames from 'classnames';
import styles from './PageContainer.module.sass';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  containerRef?: Ref<HTMLDivElement>;
  children?: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  containerRef,
  onScroll,
  ...restProps
}) => {
  const containerClasses = classnames({
    [className as string]: !!className,
    [styles.PageContainer]: true,
  });
  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onScroll={onScroll}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default PageContainer;
