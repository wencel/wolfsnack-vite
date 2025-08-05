import React from 'react';
import { textConstants } from '@/lib/appConstants';
import Card from '@/components/Atoms/Card';
import Button from '@/components/Atoms/Button/Button';
import Modal from '@/components/Organisms/Modal';
import styles from './WarningModal.module.sass';

export interface WarningModalProps {
  closeModal?: () => void;
  showModal: boolean;
  title?: string;
  description?: React.ReactNode;
  showCancelButton?: boolean;
  cancelAction?: () => void;
  cancelText?: string;
  confirmationAction?: () => void;
  confirmationText?: string;
}

const WarningModal: React.FC<WarningModalProps> = ({
  closeModal = () => {},
  showModal,
  title,
  description,
  showCancelButton = false,
  cancelAction = () => {},
  cancelText = textConstants.misc.CANCEL,
  confirmationAction = () => {},
  confirmationText = textConstants.misc.SAVE,
}) => {
  return (
    <Modal show={showModal} backgroundOnClick={closeModal}>
      <Card
        title={title}
        description={description}
        className={styles.fullWidth}
      >
        <div className={styles.buttonContainer}>
          {showCancelButton && (
            <Button onClick={cancelAction}>{cancelText}</Button>
          )}
          <Button onClick={confirmationAction}>{confirmationText}</Button>
        </div>
      </Card>
    </Modal>
  );
};

export default WarningModal;
