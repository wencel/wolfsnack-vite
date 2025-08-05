import React from 'react';
import type { ReactNode } from 'react';
import styles from './NavigationBar.module.sass';
import classnames from 'classnames';

export interface NavigationBarProps {
  children?: ReactNode;
  className?: string;
  position?: keyof typeof styles | 'bottom';
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  children,
  className,
}) => {
  const classNames = classnames({
    [className as string]: !!className,
    [styles.NavigationBar]: true,
  });
  return <nav className={classNames}>{children}</nav>;
};

export default NavigationBar;
