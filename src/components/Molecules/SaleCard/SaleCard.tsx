import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import moment from '@/lib/momentConfig';
import { NumericFormat } from 'react-number-format';
import { FaDog } from 'react-icons/fa';
import { MdPlusOne, MdPerson } from 'react-icons/md';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BiCalendarAlt } from 'react-icons/bi';
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { textConstants } from '@/lib/appConstants';
import { calculateTotalPriceProduct } from '@/lib/utils';
import Button from '@/components/Atoms/Button/Button';
import Card from '@/components/Atoms/Card';
import Divider from '@/components/Atoms/Divider';
import NavigationCardHeader from '@/components/Atoms/NavigationCardHeader';
import WarningModal from '@/components/Organisms/WarningModal';
import type { Sale, SaleProduct } from '@/lib/data';
import styles from './SaleCard.module.sass';

interface SaleCardProps {
  className?: string;
  sale: Sale;
  navigate?: boolean;
  deleteSale?: (id: string) => void;
}

const SaleCard: React.FC<SaleCardProps> = ({
  sale,
  className,
  navigate,
  deleteSale,
}) => {
  const cardClasses = classnames({
    [styles.SaleCard]: true,
    [className || '']: !!className,
  });
  const [showModal, setShowModal] = useState(false);
  const saleDate = moment(sale?.saleDate).locale('es').format('Do MMMM YYYY');
  const requestDeleteSale = () => {
    if (deleteSale) deleteSale(sale._id);
    setShowModal(false);
  };
  const showDeleteSaleModal = () => {
    setShowModal(true);
  };
  const hideDeleteSaleModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <WarningModal
        closeModal={hideDeleteSaleModal}
        showModal={showModal}
        title={textConstants.salePage.DELETE_CONFIRMATION_TITLE}
        description={
          <>
            {textConstants.salePage.DELETE_CONFIRMATION}{' '}
            <b>
              <i>
                <NumericFormat
                  value={sale.saleId}
                  displayType={'text'}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="#"
                  readOnly
                />
              </i>
            </b>{' '}
            del{' '}
            <b>
              <i>{saleDate}</i>
            </b>
            ?
          </>
        }
        showCancelButton
        cancelAction={hideDeleteSaleModal}
        cancelText={textConstants.misc.NO}
        confirmationAction={requestDeleteSale}
        confirmationText={textConstants.misc.YES}
      />
      <Card
        className={cardClasses}
        title={
          navigate ? (
            <NavigationCardHeader
              header={
                <>
                  {textConstants.salePage.SALE}{' '}
                  <NumericFormat
                    value={sale.saleId}
                    displayType={'text'}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="#"
                    readOnly
                  />
                </>
              }
              href={`/sales/${sale._id}`}
            />
          ) : (
            <>
              {textConstants.salePage.SALE}{' '}
              <NumericFormat
                value={sale.saleId}
                displayType={'text'}
                thousandSeparator="."
                decimalSeparator=","
                readOnly
              />
            </>
          )
        }
        role="article"
      >
        <div className={styles.date}>
          <BiCalendarAlt className={styles.icon} />
          {saleDate}
        </div>
        <div className={styles.products}>
          <MdPerson className={styles.icon} />
          {sale.customer?.storeName}{' '}
          {sale.customer?.name ? `(${sale.customer?.name})` : ''}
        </div>
        <Divider />
        {sale?.products?.map(p => {
          return (
            <div key={p.product._id}>
              <div className={styles.products}>
                <FaDog className={styles.icon} />
                {`${p.product.name} ${p.product.presentation}`}
                &nbsp;
                <NumericFormat
                  value={p.product.weight}
                  displayType={'text'}
                  suffix="g"
                  thousandSeparator="."
                  decimalSeparator=","
                  readOnly
                />
                &nbsp;
                <span className={styles.span}>
                  ({`${p.quantity} ${textConstants.misc.UNITS}`})
                </span>
              </div>
              {!navigate && (
                <>
                  <div className={styles.totalPrice}>
                    <AiOutlineDollarCircle className={styles.icon} />
                    <span className={styles.span}>
                      {textConstants.sale.PRODUCT_TOTAL_PRICE}&nbsp;
                    </span>
                    <NumericFormat
                      value={calculateTotalPriceProduct(
                        p.price || 0,
                        p.quantity,
                        sale.isThirteenDozen
                      )}
                      displayType={'text'}
                      prefix="$"
                      thousandSeparator="."
                      decimalSeparator=","
                      readOnly
                      decimalScale={2}
                    />
                  </div>
                  <Divider />
                </>
              )}
            </div>
          );
        })}
        {sale.isThirteenDozen && (
          <div className={styles.products}>
            <MdPlusOne className={styles.icon} />
            {textConstants.sale.IS_THIRTEEN_DOZEN}
          </div>
        )}
        <div className={styles.totalPrice}>
          <AiOutlineDollarCircle className={styles.icon} />
          <span className={styles.span}>
            {textConstants.sale.PARTIAL_PAYMENT}&nbsp;
          </span>
          <NumericFormat
            value={sale.partialPayment}
            displayType={'text'}
            prefix="$"
            thousandSeparator="."
            decimalSeparator=","
            readOnly
            decimalScale={2}
          />
        </div>
        <div className={styles.totalPrice}>
          <AiOutlineDollarCircle className={styles.icon} />
          <span className={styles.span}>
            {textConstants.sale.REMAINING_PAYMENT}&nbsp;
          </span>
          <NumericFormat
            value={sale.totalPrice - sale.partialPayment}
            displayType={'text'}
            prefix="$"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            readOnly
          />
        </div>
        <Divider />
        <div className={styles.totalPrice}>
          <AiOutlineDollarCircle className={styles.icon} />
          <span className={styles.span}>
            {textConstants.sale.TOTAL_PRICE}&nbsp;
          </span>
          <NumericFormat
            value={sale.totalPrice}
            displayType={'text'}
            prefix="$"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            readOnly
          />
        </div>
        <div className={styles.buttonContainer}>
          <Link to={`/sales/${sale._id}/edit`}>
            <Button
              theme="RoundWithLabel"
              tooltip={textConstants.sale.EDIT_SALE}
            >
              <RiEditLine />
            </Button>
          </Link>
          <Button
            theme="RoundWithLabel"
            onClick={showDeleteSaleModal}
            tooltip={textConstants.sale.DELETE_SALE}
          >
            <RiDeleteBinLine />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SaleCard;
