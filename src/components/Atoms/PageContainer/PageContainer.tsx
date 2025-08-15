import React from 'react';
import classnames from 'classnames';
import styles from './PageContainer.module.sass';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  onScroll,
  ...restProps
}) => {
  const containerClasses = classnames({
    [className as string]: !!className,
    [styles.PageContainer]: true,
  });
  return (
    <div
      className={containerClasses}
      onScroll={onScroll}
      data-testid='page-container'
      {...restProps}
    >
      {children}
    </div>
  );
};

export default PageContainer;
