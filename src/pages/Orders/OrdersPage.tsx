import React, { useEffect, useState } from 'react';
import { RiFilterLine, RiFilterOffLine } from 'react-icons/ri';
import { MdPlaylistAdd } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import OrderCard from '@/components/Molecules/OrderCard';
import TopActions from '@/components/Organisms/TopActions';
import OrderFilterModal from '@/components/Organisms/OrderFilterModal';
import { textConstants } from '@/lib/appConstants';
import LoadingSpinner from '@/components/Atoms/LoadingSpinner';
import Loading from '@/components/Atoms/Loading';
import useLoading from '@/hooks/useLoading';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import styles from './OrdersPage.module.sass';

const OrdersPage: React.FC = () => {
  const { loading: globalLoading, fetching } = useLoading();

  const { orders, total, skip, fetchOrders, deleteOrder, resetOrders } =
    useOrders();

  const { products, fetchProducts } = useProducts();

  const paginationLimit = 10;
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    resetOrders();
    const ordersParams: any = {
      sortBy: 'orderDate:desc',
      limit: paginationLimit,
      skip: 0,
    };

    if (dateRange[0] && dateRange[1]) {
      ordersParams.initDate = dateRange[0]?.toISOString();
      ordersParams.endDate = dateRange[1]?.toISOString();
    }

    fetchOrders(ordersParams);
  }, [paginationLimit, resetOrders, fetchOrders, dateRange]);

  useEffect(() => {
    // Fetch products for OrderCard
    fetchProducts({
      limit: 100,
    });
  }, [fetchProducts]);

  const onScrollContent = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.offsetHeight + target.scrollTop >= target.scrollHeight - 200) {
      if (!fetching && orders.length < total) {
        const ordersParams: any = {
          sortBy: 'orderDate:desc',
          limit: paginationLimit,
          skip: skip + paginationLimit,
        };

        if (dateRange[0] && dateRange[1]) {
          ordersParams.initDate = dateRange[0]?.toISOString();
          ordersParams.endDate = dateRange[1]?.toISOString();
        }

        fetchOrders(ordersParams);
      }
    }
  };

  const resetFilters = () => {
    setDateRange([null, null]);
  };

  const applyFilters = (q: {
    dateRange?: [Date | null, Date | null] | null;
  }) => {
    setDateRange(q.dateRange || [null, null]);
    setShowFiltersModal(false);
  };

  return (
    <>
      <OrderFilterModal
        showModal={showFiltersModal}
        applyFilter={applyFilters}
        closeModal={() => setShowFiltersModal(false)}
        parentDateRange={dateRange}
      />

      <PageContainer onScroll={onScrollContent}>
        <Loading visible={globalLoading} />
        <Card
          className={styles.orderCard}
          title={textConstants.orderPage.TITLE}
          description={textConstants.orderPage.DESCRIPTION}
        />
        {orders?.map(order => (
          <OrderCard
            className={styles.orderCard}
            order={order}
            navigate
            key={order._id}
            products={products}
            deleteOrder={deleteOrder}
          />
        ))}
        {orders?.length === 0 && !globalLoading && (
          <Card
            className={styles.orderCard}
            title={textConstants.orderPage.EMPTY_TITLE}
            description={textConstants.orderPage.EMPTY_DESCRIPTION}
          />
        )}
        {fetching && (
          <div className="loadingContainer">
            <LoadingSpinner size="large" color="primary" />
          </div>
        )}

        <TopActions
          buttons={[
            {
              text: textConstants.addOrder.ADD_ORDER,
              icon: <MdPlaylistAdd />,
              href: '/orders/new',
            },
            {
              text: textConstants.misc.FILTERS,
              icon: <RiFilterLine />,
              onClick: () => setShowFiltersModal(true),
            },
            {
              text: textConstants.misc.RESET_FILTERS,
              icon: <RiFilterOffLine />,
              onClick: resetFilters,
            },
          ]}
        />
      </PageContainer>
    </>
  );
};

export default OrdersPage;
