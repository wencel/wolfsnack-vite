import React from 'react';
import { textConstants } from '@/lib/appConstants';
import Card from '@/components/Atoms/Card';
import Calendar from '@/components/Atoms/Calendar';
import Form from '@/components/Atoms/Form';
import Label from '@/components/Atoms/Label';
import Modal from '@/components/Organisms/Modal';
import styles from './OrderFilterModal.module.sass';

// Type definitions for react-datepicker
type DateValue = Date | null;
type DateRangeValue = [Date | null, Date | null];

export interface OrderFilterModalProps {
  closeModal: () => void;
  applyFilter: (filter: { dateRange: DateRangeValue | null }) => void;
  showModal: boolean;
  parentDateRange: DateRangeValue | null;
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
