import React from 'react';
import styles from './Divider.module.sass';

const Divider: React.FC = () => {
  return (
    <div
      className={styles.Divider}
      role="separator"
      aria-hidden="true"
      data-testid="divider"
    />
  );
};

export default Divider;
