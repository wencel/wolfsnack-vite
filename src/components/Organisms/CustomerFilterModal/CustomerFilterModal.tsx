import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { textConstants } from '@/lib/appConstants';
import Card from '@/components/Atoms/Card';
import Form from '@/components/Atoms/Form';
import Input from '@/components/Atoms/Input';
import Modal from '@/components/Organisms/Modal';
import styles from './CustomerFilterModal.module.sass';

export interface CustomerFilterModalProps {
  closeModal: () => void;
  applyFilter: (filter: {
    searchTerm: string;
    sortBy: string;
    direction: string;
  }) => void;
  showModal: boolean;
  parentSearchTerm: string;
  parentSortBy: string;
  parentDirection: string;
}

const CustomerFilterModal: React.FC<CustomerFilterModalProps> = ({
  closeModal,
  applyFilter,
  showModal,
  parentSearchTerm,
  parentSortBy,
  parentDirection,
}) => {
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm);
  const [sortBy, setSortBy] = useState(parentSortBy);
  const [direction, setDirection] = useState(parentDirection);
  useEffect(() => {
    if (showModal) {
      setSearchTerm(parentSearchTerm);
      setSortBy(parentSortBy);
      setDirection(parentDirection);
    }
  }, [showModal, parentSearchTerm, parentSortBy, parentDirection]);
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
            applyFilter({ searchTerm, sortBy, direction });
          }}
          buttonProps={{ buttonText: textConstants.misc.APPLY }}
          secondButtonProps={{
            buttonText: textConstants.misc.CANCEL,
            onClick: closeModal,
          }}
        >
          <Input
            type="text"
            id="customer-filter-text"
            label={
              <div className={styles.label}>
                <FiSearch />
                {textConstants.customerPage.SEARCH_CUSTOMER}
              </div>
            }
            value={searchTerm}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >
            ) => setSearchTerm(e.target.value)}
            options={[]}
            ref={undefined}
          />
          <Input
            type="select"
            id="customer-filter-sortby"
            label={textConstants.misc.ORDER_BY}
            value={sortBy}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >
            ) => setSortBy(e.target.value)}
            options={[
              { label: textConstants.customer.STORE_NAME, value: 'storeName' },
              { label: textConstants.customer.NAME, value: 'name' },
              { label: textConstants.customer.ADDRESS, value: 'address' },
              { label: textConstants.customer.TOWN, value: 'town' },
              { label: textConstants.customer.LOCALITY, value: 'locality' },
            ]}
            defaultValue={'storeName'}
            ref={undefined}
          />
          <Input
            type="select"
            id="customer-filter-direction"
            label={textConstants.misc.DIRECTION}
            value={direction}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >
            ) => setDirection(e.target.value)}
            options={[
              { label: textConstants.misc.ASCENDING, value: 'asc' },
              { label: textConstants.misc.DESCENDING, value: 'desc' },
            ]}
            defaultValue={'asc'}
            ref={undefined}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default CustomerFilterModal;
