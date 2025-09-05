import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { ImListNumbered } from 'react-icons/im';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { NumericFormat } from 'react-number-format';
import { textConstants } from '@/lib/appConstants';
import classnames from 'classnames';
import Card from '@/components/Atoms/Card';
import NavigationCardHeader from '@/components/Atoms/NavigationCardHeader';
import Button from '@/components/Atoms/Button/Button';
import WarningModal from '@/components/Organisms/WarningModal';
import styles from './ProductCard.module.sass';

export interface Product {
  _id: string;
  name: string;
  presentation?: string;
  weight?: number;
  stock?: number;
  basePrice?: number;
  sellingPrice?: number;
}

interface ProductCardProps {
  className?: string;
  product: Product;
  navigate?: boolean;
  deleteProduct?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  navigate,
  deleteProduct,
}) => {
  const cardClasses = classnames({
    [styles.ProductCard]: true,
    [className || '']: !!className,
  });
  const [showModal, setShowModal] = useState(false);
  const requestDeleteProduct = () => {
    if (deleteProduct) deleteProduct(product._id);
    setShowModal(false);
  };
  const showDeleteProductModal = () => {
    setShowModal(true);
  };
  const hideDeleteProductModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <WarningModal
        closeModal={hideDeleteProductModal}
        showModal={showModal}
        title={textConstants.productPage.DELETE_CONFIRMATION_TITLE}
        description={
          <>
            {textConstants.productPage.DELETE_CONFIRMATION}{' '}
            <b>
              <i>{`${product?.name} ${product?.presentation} ${product?.weight} g`}</i>
            </b>
            ?
          </>
        }
        showCancelButton
        cancelAction={hideDeleteProductModal}
        cancelText={textConstants.misc.NO}
        confirmationAction={requestDeleteProduct}
        confirmationText={textConstants.misc.YES}
      />
      <Card
        className={cardClasses}
        title={
          navigate ? (
            <NavigationCardHeader
              header={
                <>
                  {product?.name} {product?.presentation}&nbsp;
                  <NumericFormat
                    value={product?.weight}
                    displayType={'text'}
                    suffix=' g'
                    thousandSeparator='.'
                    decimalSeparator=','
                  />
                </>
              }
              href={`/products/${product._id}`}
            />
          ) : (
            <>
              {product?.name} {product?.presentation}&nbsp;
              <NumericFormat
                value={product?.weight}
                displayType={'text'}
                suffix=' g'
                thousandSeparator='.'
                decimalSeparator=','
              />
            </>
          )
        }
        key={product._id}
        role="article"
      >
        <div className={styles.stock}>
          <ImListNumbered className={styles.icon} />
          {product.stock} {textConstants.misc.UNITS}&nbsp;
          <span>({textConstants.product.STOCK})</span>
        </div>
        <div className={styles.basePrice}>
          <AiOutlineDollarCircle className={styles.icon} />
          {textConstants.product.BASE_PRICE}&nbsp;
          <NumericFormat
            value={product?.basePrice}
            displayType={'text'}
            prefix='$'
            thousandSeparator='.'
            decimalSeparator=','
          />
        </div>
        <div className={styles.sellingPrice}>
          <AiOutlineDollarCircle className={styles.icon} />
          {textConstants.product.SELLING_PRICE}&nbsp;
          <NumericFormat
            value={product?.sellingPrice}
            displayType={'text'}
            prefix='$'
            thousandSeparator='.'
            decimalSeparator=','
          />
        </div>
        <div className={styles.buttonContainer}>
          <Link to={`/products/${product._id}`}>
            <Button
              theme='RoundWithLabel'
              tooltip={textConstants.product.EDIT_PRODUCT}
            >
              <RiEditLine />
            </Button>
          </Link>
          <Button
            theme='RoundWithLabel'
            onClick={showDeleteProductModal}
            tooltip={textConstants.product.DELETE_PRODUCT}
          >
            <RiDeleteBinLine />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
