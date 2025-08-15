import React from 'react';
import classnames from 'classnames';
import styles from './SubCard.module.sass';

interface SubCardProps {
  children?: React.ReactNode;
  className?: string;
}

const SubCard: React.FC<SubCardProps> = ({ children, className }) => {
  const cardClass = classnames({
    [className as string]: !!className,
    [styles.SubCard]: true,
  });
  return <div className={cardClass}>{children}</div>;
};

export default SubCard;
