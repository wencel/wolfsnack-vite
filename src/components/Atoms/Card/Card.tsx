import React from 'react';
import styles from './Card.module.sass';
import Divider from '@/components/Atoms/Divider';
import classnames from 'classnames';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  className,
  title,
  description,
  children,
}) => {
  const cardClass = classnames({
    [styles.Card]: true,
    [className as string]: !!className,
  });
  return (
    <div className={cardClass}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      {children ? <Divider /> : ''}
      {children}
    </div>
  );
};

export default Card;
