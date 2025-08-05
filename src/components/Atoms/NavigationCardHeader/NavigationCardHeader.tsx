import React from 'react';
import { IoIosArrowDropright } from 'react-icons/io';
import { Link } from 'react-router-dom';
import styles from './NavigationCardHeader.module.sass';

interface NavigationCardHeaderProps {
  header?: string | React.ReactNode;
  href: string;
  className?: string;
}

const NavigationCardHeader: React.FC<NavigationCardHeaderProps> = ({
  header,
  href,
  className,
  ...restProps
}) => {
  return (
    <Link
      to={href}
      className={className || styles.NavigationCardHeader}
      {...restProps}
    >
      <div className={styles.title}>{header}</div>
      <div className={styles.icon}>
        <IoIosArrowDropright />
      </div>
    </Link>
  );
};

export default NavigationCardHeader;
