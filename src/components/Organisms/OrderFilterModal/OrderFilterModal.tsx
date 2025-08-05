import React from 'react';
import type { LooseValue } from 'node_modules/react-date-picker/dist/esm/shared/types';
import { textConstants } from '@/lib/appConstants';
import Card from '@/components/Atoms/Card';
import Calendar from '@/components/Atoms/Calendar';
import Form from '@/components/Atoms/Form';
import Label from '@/components/Atoms/Label';
import Modal from '@/components/Organisms/Modal';
import styles from './OrderFilterModal.module.sass';

export interface OrderFilterModalProps {
  closeModal: () => void;
  applyFilter: (filter: { dateRange: LooseValue }) => void;
  showModal: boolean;
  parentDateRange: LooseValue;
}

const OrderFilterModal: React.FC<OrderFilterModalProps> = ({
  closeModal,
  applyFilter,
  showModal,
  parentDateRange,
}) => {
  const [dateRange, setDateRange] = React.useState(parentDateRange);
  React.useEffect(() => {
    if (showModal) {
      setDateRange(parentDateRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);
  return (
    <Modal show={showModal} backgroundOnClick={closeModal}>
      <Card
        title={textConstants.misc.FILTERS}
        description={textConstants.misc.FILTERS_TEXT}
        className={styles.fullWidth}
      >
        <Form
          className={styles.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            applyFilter({ dateRange });
          }}
          buttonProps={{ buttonText: textConstants.misc.APPLY }}
          secondButtonProps={{
            buttonText: textConstants.misc.CANCEL,
            onClick: closeModal,
          }}
        >
          <Label className={styles.label}>{textConstants.misc.DATES}</Label>
          <Calendar
            onChange={setDateRange as (value: LooseValue | undefined) => void}
            value={dateRange}
            isRange={true}
            maxDate={new Date()}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default OrderFilterModal;
