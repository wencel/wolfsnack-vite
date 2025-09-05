import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { FaDog } from 'react-icons/fa';
import moment from '@/lib/momentConfig';
import { BiCalendarAlt } from 'react-icons/bi';
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import Card from '@/components/Atoms/Card';
import Divider from '@/components/Atoms/Divider';
import NavigationCardHeader from '@/components/Atoms/NavigationCardHeader';
import Button from '@/components/Atoms/Button/Button';
import WarningModal from '@/components/Organisms/WarningModal';
import { textConstants } from '@/lib/appConstants';
import classnames from 'classnames';
import styles from './OrderCard.module.sass';

export interface Product {
  _id: string;
  name: string;
  presentation?: string;
  weight?: number;
  basePrice?: number;
}

export interface OrderProduct {
  product: string;
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: number;
  orderDate: string;
  products: OrderProduct[];
  totalPrice: number;
}

interface OrderCardProps {
  className?: string;
  order: Order;
  navigate?: boolean;
  deleteOrder?: (id: string) => void;
  products: Product[];
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  className,
  navigate,
  deleteOrder,
  products,
}) => {
  const cardClasses = classnames({
    [styles.OrderCard]: true,
    [className || '']: !!className,
  });
  const [showModal, setShowModal] = useState(false);
  const orderDate = moment(order?.orderDate).format('Do MMMM  YYYY');
  const requestDeleteOrder = () => {
    if (deleteOrder) deleteOrder(order._id);
    setShowModal(false);
  };
  const showDeleteOrderModal = () => {
    setShowModal(true);
  };
  const hideDeleteOrderModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <WarningModal
        closeModal={hideDeleteOrderModal}
        showModal={showModal}
        title={textConstants.orderPage.DELETE_CONFIRMATION_TITLE}
        description={
          <>
            {textConstants.orderPage.DELETE_CONFIRMATION}{' '}
            <b>
              <i>
                <NumericFormat
                  value={order.orderId}
                  displayType={'text'}
                  thousandSeparator='.'
                  decimalSeparator=','
                  prefix='#'
                  readOnly
                />
              </i>
            </b>{' '}
            del{' '}
            <b>
              <i>{orderDate}</i>
            </b>
            ?
          </>
        }
        showCancelButton
        cancelAction={hideDeleteOrderModal}
        cancelText={textConstants.misc.NO}
        confirmationAction={requestDeleteOrder}
        confirmationText={textConstants.misc.YES}
      />
      <Card
        className={cardClasses}
        role="article"
        title={
          navigate ? (
            <NavigationCardHeader
              header={
                <>
                  {textConstants.orderPage.ORDER}{' '}
                  <NumericFormat
                    value={order.orderId}
                    displayType={'text'}
                    thousandSeparator='.'
                    decimalSeparator=','
                    prefix='#'
                    readOnly
                  />
                </>
              }
              href={`/orders/${order._id}`}
            />
          ) : (
            <>
              {textConstants.orderPage.ORDER}{' '}
              <NumericFormat
                value={order.orderId}
                displayType={'text'}
                thousandSeparator='.'
                decimalSeparator=','
                readOnly
              />
            </>
          )
        }
      >
        <div className={styles.date}>
          <BiCalendarAlt className={styles.icon} />
          {orderDate}
        </div>
        {order?.products?.map(p => {
          const product = products.find(prod => prod._id === p.product);
          return (
            <div key={p.product}>
              <div className={styles.products}>
                <FaDog className={styles.icon} />
                {`${product?.name} ${product?.presentation}`}
                &nbsp;
                <NumericFormat
                  value={product?.weight}
                  displayType={'text'}
                  suffix='g'
                  thousandSeparator='.'
                  decimalSeparator=','
                  readOnly
                />
                &nbsp;
                <span className={styles.spanl}>
                  ({`${p.quantity} ${textConstants.misc.UNITS}`})
                </span>
              </div>
              {!navigate && (
                <>
                  <div className={styles.totalPrice}>
                    <AiOutlineDollarCircle className={styles.icon} />
                    <span className={styles.spanl}>
                      {textConstants.order.PRODUCT_TOTAL_PRICE}&nbsp;
                    </span>
                    <NumericFormat
                      value={p.quantity * (product?.basePrice || 0)}
                      displayType={'text'}
                      prefix='$'
                      thousandSeparator='.'
                      decimalSeparator=','
                      readOnly
                    />
                  </div>
                  <Divider />
                </>
              )}
            </div>
          );
        })}
        <div className={styles.totalPrice}>
          <AiOutlineDollarCircle className={styles.icon} />
          <span className={styles.spanl}>
            {textConstants.order.TOTAL_PRICE}&nbsp;
          </span>
          <NumericFormat
            value={order.totalPrice}
            displayType={'text'}
            prefix='$'
            thousandSeparator='.'
            decimalSeparator=','
            readOnly
          />
        </div>
        <div className={styles.buttonContainer}>
          <Link to={`/orders/${order._id}`}>
            <Button
              theme='RoundWithLabel'
              tooltip={textConstants.order.EDIT_ORDER}
            >
              <RiEditLine />
            </Button>
          </Link>
          <Button
            theme='RoundWithLabel'
            onClick={showDeleteOrderModal}
            tooltip={textConstants.order.DELETE_ORDER}
          >
            <RiDeleteBinLine />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderCard;
