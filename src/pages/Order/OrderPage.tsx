import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosArrowDropleft } from 'react-icons/io';
import { MdPlaylistAdd } from 'react-icons/md';
import PageContainer from '@/components/Atoms/PageContainer/PageContainer';
import Loading from '@/components/Atoms/Loading/Loading';
import TopActions from '@/components/Organisms/TopActions/TopActions';
import OrderCard from '@/components/Molecules/OrderCard/OrderCard';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useAppSelector } from '@/store/hooks';
import { textConstants } from '@/lib/appConstants';
import styles from './OrderPage.module.sass';
import Card from '@/components/Atoms/Card/Card';

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentOrder, fetchOrder, resetCurrentOrder, deleteOrder } =
    useOrders();
  const { products, fetchProducts } = useProducts();
  const { loading } = useAppSelector(state => state.loading);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }

    return () => {
      resetCurrentOrder();
    };
  }, [id, fetchOrder, resetCurrentOrder]);

  useEffect(() => {
    // Fetch products for OrderCard
    fetchProducts({
      limit: 100,
    });
  }, [fetchProducts]);

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    // Navigate back to orders list after deletion
    window.history.back();
  };

  return (
    <PageContainer>
      <Loading visible={loading} />
      <TopActions
        buttons={[
          {
            text: textConstants.misc.BACK,
            icon: <IoIosArrowDropleft />,
            href: '/orders',
          },
          {
            text: textConstants.addOrder.ADD_ORDER,
            icon: <MdPlaylistAdd />,
            href: '/orders/new',
          },
        ]}
      />
      {currentOrder && !loading && (
        <OrderCard
          className={styles.orderCard}
          order={currentOrder}
          navigate={false}
          deleteOrder={handleDeleteOrder}
          products={products}
        />
      )}
      {!currentOrder && !loading && (
        <Card
          title={textConstants.misc.ORDER_NOT_FOUND}
          description={textConstants.misc.ORDER_NOT_FOUND_DESCRIPTION}
        />
      )}
    </PageContainer>
  );
};

export default OrderPage;
