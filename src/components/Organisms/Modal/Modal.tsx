import React, { type ReactNode } from 'react';
import classnames from 'classnames';
import styles from './Modal.module.sass';

export interface ModalProps {
  children?: ReactNode;
  show?: boolean;
  backgroundOnClick?: () => void;
  'aria-label'?: string;
}

const Modal: React.FC<ModalProps> = ({ children, show, backgroundOnClick, 'aria-label': ariaLabel }) => {
  const classes = classnames({
    [styles.Modal]: true,
    [styles.visible]: show,
  });
  return (
    <div 
      className={classes}
      role="dialog"
      aria-modal="true"
      aria-hidden={!show}
      aria-label={ariaLabel}
    >
      <div onClick={backgroundOnClick} className={styles.background} data-testid="modal-background" />
      {children}
    </div>
  );
};

export default Modal;
