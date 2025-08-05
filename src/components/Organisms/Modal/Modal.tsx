import React, { type ReactNode } from 'react';
import classnames from 'classnames';
import styles from './Modal.module.sass';

export interface ModalProps {
  children?: ReactNode;
  show?: boolean;
  backgroundOnClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, show, backgroundOnClick }) => {
  const classes = classnames({
    [styles.Modal]: true,
    [styles.visible]: show,
  });
  return (
    <div className={classes}>
      <div onClick={backgroundOnClick} className={styles.background} />
      {children}
    </div>
  );
};

export default Modal;
