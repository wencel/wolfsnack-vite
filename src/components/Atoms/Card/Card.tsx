import React from 'react';
import styles from './Card.module.sass';
import Divider from '@/components/Atoms/Divider';
import classnames from 'classnames';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  role?: string;
  'data-testid'?: string;
}

const Card: React.FC<CardProps> = ({
  className,
  title,
  description,
  children,
  role,
}) => {
  const cardClass = classnames({
    [styles.Card]: true,
    [className as string]: !!className,
  });
  return (
    <div className={cardClass} role={role}>
      <div className={styles.title} role="heading" aria-level={2}>{title}</div>
      <div className={styles.description}>{description}</div>
      {children ? <Divider /> : ''}
      {children}
    </div>
  );
};

export default Card;
