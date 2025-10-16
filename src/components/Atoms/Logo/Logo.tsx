import React from 'react';
import styles from './Logo.module.sass';
import classnames from 'classnames';

interface LogoProps {
  className?: string;
  isRound?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isRound }) => {
  const logoClasses = classnames({
    [className as string]: !!className,
    [styles.Logo]: true,
    [styles.rounded]: !!isRound,
  });

  return (
    <div className={logoClasses}>
      <img src="/wolf.svg" alt="Logo" />
    </div>
  );
};

export default Logo;
