import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NumericFormat, PatternFormat } from 'react-number-format';
import {
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdCreditCard,
} from 'react-icons/md';
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { textConstants } from '@/lib/appConstants';
import classnames from 'classnames';
import Card from '@/components/Atoms/Card';
import NavigationCardHeader from '@/components/Atoms/NavigationCardHeader';
import Button from '@/components/Atoms/Button';
import WarningModal from '@/components/Organisms/WarningModal';
import type { Customer } from '@/lib/data';
import styles from './CustomerCard.module.sass';

interface CustomerCardProps {
  className?: string;
  customer: Customer;
  navigate?: boolean;
  deleteCustomer?: (id: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  className,
  navigate,
  deleteCustomer,
}) => {
  const cardClasses = classnames({
    [styles.CustomerCard]: true,
    [className || '']: !!className,
  });
  const [showModal, setShowModal] = useState(false);
  const requestDeleteCustomer = () => {
    if (deleteCustomer) deleteCustomer(customer._id);
    setShowModal(false);
  };
  const showDeleteCustomerModal = () => {
    setShowModal(true);
  };
  const hideDeleteCustomerModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <WarningModal
        closeModal={hideDeleteCustomerModal}
        showModal={showModal}
        title={textConstants.customerPage.DELETE_CONFIRMATION_TITLE}
        description={
          <>
            {textConstants.customerPage.DELETE_CONFIRMATION}{' '}
            <b>
              <i>{customer?.storeName}</i>
            </b>
            ?
          </>
        }
        showCancelButton
        cancelAction={hideDeleteCustomerModal}
        cancelText={textConstants.misc.NO}
        confirmationAction={requestDeleteCustomer}
        confirmationText={textConstants.misc.YES}
      />
      <Card
        className={cardClasses}
        role="article"
        title={
          navigate ? (
            <NavigationCardHeader
              header={customer.storeName}
              href={`/customers/${customer._id}`}
            />
          ) : (
            customer.storeName
          )
        }
        key={customer._id}
      >
        {customer.name ? (
          <div className={styles.name}>
            <MdPerson className={styles.icon} />
            {customer.name}
          </div>
        ) : (
          ''
        )}
        <div className={styles.address}>
          <MdLocationOn className={styles.icon} />
          {customer.address}
          {customer.locality ? `, ${customer.locality}` : ''}
          {customer.town ? `, ${customer.town}` : ''}
        </div>
        {customer.idNumber ? (
          <div className={styles.idNumber}>
            <MdCreditCard className={styles.icon} />
            <NumericFormat
              value={customer.idNumber}
              displayType={'text'}
              thousandSeparator='.'
              decimalSeparator=','
            />
          </div>
        ) : (
          ''
        )}
        {customer.email ? (
          <div className={styles.email}>
            <MdEmail className={styles.icon} />
            <a href={`mailto:${customer.email}`}>{customer.email}</a>
          </div>
        ) : (
          ''
        )}
        {customer.phoneNumber ? (
          <div className={styles.phoneNumber}>
            <MdPhone className={styles.icon} />
            <a href={`tel:${customer.phoneNumber}`}>
              <PatternFormat
                value={customer.phoneNumber}
                displayType={'text'}
                format='(###)-###-####'
              />
            </a>
          </div>
        ) : (
          ''
        )}
        {customer.secondaryPhoneNumber ? (
          <div className={styles.phoneNumber}>
            <MdPhone className={styles.icon} />
            <a href={`tel:${customer.secondaryPhoneNumber}`}>
              <PatternFormat
                value={customer.secondaryPhoneNumber}
                displayType={'text'}
                format='(###)-###-####'
              />
            </a>
          </div>
        ) : (
          ''
        )}
        <div className={styles.buttonContainer}>
          <Link to={`/customers/${customer._id}/edit`}>
            <Button
              theme='RoundWithLabel'
              tooltip={textConstants.customer.EDIT_CUSTOMER}
            >
              <RiEditLine />
            </Button>
          </Link>
          <Button
            theme='RoundWithLabel'
            onClick={showDeleteCustomerModal}
            tooltip={textConstants.customer.DELETE_CUSTOMER}
          >
            <RiDeleteBinLine />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerCard;
