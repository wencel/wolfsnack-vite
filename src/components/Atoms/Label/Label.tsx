import React from 'react';
import classnames from 'classnames';
import styles from './Label.module.sass';

interface LabelProps {
  children?: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

const Label: React.FC<LabelProps> = ({ children, className, htmlFor }) => {
  const labelClasses = classnames({
    [className as string]: !!className,
    [styles.Label]: true,
  });
  return (
    <label className={labelClasses} role="label" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
