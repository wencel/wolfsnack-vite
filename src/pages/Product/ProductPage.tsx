import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosArrowDropleft } from 'react-icons/io';
import { MdPlaylistAdd } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import ProductCard from '@/components/Molecules/ProductCard';
import TopActions from '@/components/Organisms/TopActions';
import LoadingSpinner from '@/components/Atoms/LoadingSpinner';
import { textConstants } from '@/lib/appConstants';
import useLoading from '@/hooks/useLoading';
import useProducts from '@/hooks/useProducts';
import styles from './ProductPage.module.sass';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading } = useLoading();
  const { currentProduct, fetchProduct, resetCurrentProduct } = useProducts();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }

    return () => {
      resetCurrentProduct();
    };
  }, [id, fetchProduct, resetCurrentProduct]);

  if (!id) {
    return (
      <PageContainer>
        <Card title="Error" description={textConstants.misc.NO_PRODUCT_ID} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopActions
        buttons={[
          {
            text: textConstants.misc.BACK,
            icon: <IoIosArrowDropleft />,
            href: '/products',
          },
          {
            text: textConstants.addProduct.ADD_PRODUCT,
            icon: <MdPlaylistAdd />,
            href: '/products/new',
          },
        ]}
      />

      {loading && (
        <div className="loadingContainer">
          <LoadingSpinner size="large" color="primary" />
        </div>
      )}

      {currentProduct && !loading && (
        <ProductCard
          className={styles.productCard}
          product={currentProduct}
          navigate={false}
        />
      )}

      {!currentProduct && !loading && (
        <Card
          title={textConstants.misc.PRODUCT_NOT_FOUND}
          description={textConstants.misc.PRODUCT_NOT_FOUND_DESCRIPTION}
        />
      )}
    </PageContainer>
  );
};

export default ProductPage;
