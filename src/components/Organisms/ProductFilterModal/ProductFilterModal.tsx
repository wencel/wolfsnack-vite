import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { textConstants } from '@/lib/appConstants';
import Card from '@/components/Atoms/Card';
import Form from '@/components/Atoms/Form';
import Modal from '@/components/Organisms/Modal';
import Input from '@/components/Atoms/Input';
import styles from './ProductFilterModal.module.sass';

export interface ProductFilterModalProps {
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

const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
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
            applyFilter({ searchTerm, sortBy, direction });
          }}
          buttonProps={{ buttonText: textConstants.misc.APPLY }}
          secondButtonProps={{
            buttonText: textConstants.misc.CANCEL,
            onClick: closeModal,
          }}
        >
          <Input
            type='text'
            className={styles.input}
            id='product-filter-text'
            label={
              <div className={styles.label}>
                <FiSearch />
                {textConstants.productPage.SEARCH_PRODUCT}
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
            type='select'
            className={styles.input}
            id='product-filter-sortby'
            label={textConstants.misc.ORDER_BY}
            value={sortBy}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >
            ) => setSortBy(e.target.value)}
            options={[
              { label: textConstants.product.NAME, value: 'name' },
              {
                label: textConstants.product.PRESENTATION,
                value: 'presentation',
              },
              { label: textConstants.product.WEIGHT, value: 'weight' },
              { label: textConstants.product.BASE_PRICE, value: 'price' },
              {
                label: textConstants.product.SELLING_PRICE,
                value: 'sellingPrice',
              },
              { label: textConstants.product.STOCK, value: 'stock' },
            ]}
            ref={undefined}
          />
          <Input
            type='select'
            className={styles.input}
            id='product-filter-direction'
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
            ref={undefined}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default ProductFilterModal;
