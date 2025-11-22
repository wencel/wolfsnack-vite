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
  return (
    <fieldset className={cardClass} role="group">
      {children}
    </fieldset>
  );
};

export default SubCard;
