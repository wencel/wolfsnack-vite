import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { textConstants } from '@/lib/appConstants';
import Card from '@/components/Atoms/Card';
import Calendar from '@/components/Atoms/Calendar';
import Form from '@/components/Atoms/Form';
import Label from '@/components/Atoms/Label';
import Radio from '@/components/Atoms/Radio';
import Modal from '@/components/Organisms/Modal';
import SearchField from '@/components/Molecules/SearchField/SearchField';
import styles from './SaleFilterModal.module.sass';
import type { LooseValue } from 'node_modules/react-date-picker/dist/esm/shared/types';
import type { Customer } from '@/lib/data';

interface SaleFilterModalProps {
  showModal: boolean;
  closeModal: () => void;
  applyFilter: (filter: {
    dateRange?: LooseValue;
    owes?: boolean | null;
    isThirteenDozen?: boolean | null;
    customer?: Customer;
  }) => void;
  parentDateRange?: LooseValue;
  parentOwes?: boolean | null;
  parentIsThirteenDozen?: boolean | null;
  parentCustomer?: Customer;
  fetchCustomers: (search: string) => void;
  customers: {
    data: Array<Customer>;
    loading: boolean;
  };
}

const SaleFilterModal: React.FC<SaleFilterModalProps> = ({
  closeModal,
  applyFilter,
  showModal,
  parentDateRange,
  parentOwes,
  parentIsThirteenDozen,
  parentCustomer,
  fetchCustomers,
  customers,
}) => {
  const [dateRange, setDateRange] = useState<LooseValue | undefined>(
    parentDateRange
  );
  const [owes, setOwes] = useState<boolean | null>(
    parentOwes as unknown as boolean | null
  );
  const [customer, setCustomer] = useState<Customer | undefined>(
    parentCustomer
  );
  const [isThirteenDozen, setIsThirteenDozen] = useState<boolean | null>(
    parentIsThirteenDozen as boolean | null
  );
  const updateOwes = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case 'yes':
        setOwes(true);
        break;
      case 'no':
        setOwes(false);
        break;
      case 'all':
        setOwes(null);
        break;
      default:
        setOwes(null);
    }
  };
  const updateIsThirteenDozen = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case 'yes':
        setIsThirteenDozen(true);
        break;
      case 'no':
        setIsThirteenDozen(false);
        break;
      case 'all':
        setIsThirteenDozen(null);
        break;
      default:
        setIsThirteenDozen(null);
    }
  };
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
            applyFilter({ dateRange, owes, isThirteenDozen, customer });
          }}
          buttonProps={{ buttonText: textConstants.misc.APPLY }}
          secondButtonProps={{
            buttonText: textConstants.misc.CANCEL,
            onClick: closeModal,
          }}
        >
          <Label className={styles.label}>{textConstants.misc.DATES}</Label>
          <Calendar
            onChange={setDateRange}
            value={dateRange}
            maxDate={new Date()}
            isRange={true}
          />
          <SearchField
            onSearch={fetchCustomers}
            isLoading={customers.loading}
            label={
              <div className={styles.labelSearch}>
                <FiSearch />
                {textConstants.addSale.SEARCH_CUSTOMER}
              </div>
            }
            value={customer?.storeName}
            valueLabel={textConstants.sale.CUSTOMER}
            onSelect={c => {
              setCustomer(c as Customer);
            }}
            itemsList={customers.data.map(customer => ({
              label: `${customer.storeName} (${customer.name})`,
              value: customer,
            }))}
          />
          <Label className={styles.label}>{textConstants.salePage.OWES}</Label>
          <div className={styles.radioContainer}>
            <Radio
              className={styles.radio}
              theme='Default'
              name='owes'
              value='yes'
              checked={owes === true}
              label={textConstants.misc.YES}
              onChange={updateOwes}
            />
            <Radio
              className={styles.radio}
              theme='Default'
              name='owes'
              value='no'
              checked={owes === false}
              label={textConstants.misc.NO}
              onChange={updateOwes}
            />
            <Radio
              className={styles.radio}
              theme='Default'
              name='owes'
              value='all'
              checked={owes === null}
              label={textConstants.misc.ALL}
              onChange={updateOwes}
            />
          </div>
          <Label className={styles.label}>
            {textConstants.salePage.IS_THIRTEEN_DOZEN}
          </Label>
          <div className={styles.radioContainer}>
            <Radio
              className={styles.radio}
              theme='Default'
              name='isThirteenDozen'
              value='yes'
              checked={isThirteenDozen === true}
              label={textConstants.misc.YES}
              onChange={updateIsThirteenDozen}
            />
            <Radio
              className={styles.radio}
              theme='Default'
              name='isThirteenDozen'
              value='no'
              checked={isThirteenDozen === false}
              label={textConstants.misc.NO}
              onChange={updateIsThirteenDozen}
            />
            <Radio
              className={styles.radio}
              theme='Default'
              name='isThirteenDozen'
              value='all'
              checked={isThirteenDozen === null}
              label={textConstants.misc.ALL}
              onChange={updateIsThirteenDozen}
            />
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default SaleFilterModal;
