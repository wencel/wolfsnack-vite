import React, { useEffect, useState } from 'react';
import { RiFilterLine, RiFilterOffLine } from 'react-icons/ri';
import { MdPlaylistAdd } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import SaleCard from '@/components/Molecules/SaleCard';
import TopActions from '@/components/Organisms/TopActions';
import SaleFilterModal from '@/components/Organisms/SaleFilterModal';
import { textConstants } from '@/lib/appConstants';
import LoadingSpinner from '@/components/Atoms/LoadingSpinner';
import Loading from '@/components/Atoms/Loading';
import useLoading from '@/hooks/useLoading';
import { useSales } from '@/hooks/useSales';
import useCustomers from '@/hooks/useCustomers';
import type { Customer } from '@/lib/data';
import styles from './SalesPage.module.sass';

const SalesPage: React.FC = () => {
  const { loading: globalLoading, fetching } = useLoading();

  const { sales, total, skip, fetchSales, deleteSale, resetSales } = useSales();

  const { customers, fetchCustomers } = useCustomers();

  const paginationLimit = 10;
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [sortBy, setSortBy] = useState('saleDate');
  const [direction, setDirection] = useState('desc');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [owes, setOwes] = useState<boolean | null>(null);
  const [isThirteenDozen, setIsThirteenDozen] = useState<boolean | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    resetSales();
    const salesParams: any = {
      sortBy: `${sortBy}:${direction}`,
      limit: paginationLimit,
      skip: 0,
    };

    if (dateRange[0] && dateRange[1]) {
      salesParams.initDate = dateRange[0]?.toISOString();
      salesParams.endDate = dateRange[1]?.toISOString();
    }
    if (typeof owes === 'boolean') {
      salesParams.owes = owes;
    }
    if (typeof isThirteenDozen === 'boolean') {
      salesParams.isThirteenDozen = isThirteenDozen;
    }
    if (customer) {
      salesParams.customer = customer._id;
    }
    if (textQuery) {
      salesParams.textQuery = textQuery;
    }

    fetchSales(salesParams);
  }, [
    textQuery,
    sortBy,
    direction,
    paginationLimit,
    resetSales,
    fetchSales,
    dateRange,
    owes,
    isThirteenDozen,
    customer,
  ]);

  const onScrollContent = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.offsetHeight + target.scrollTop >= target.scrollHeight - 200) {
      if (!fetching && sales.length < total) {
        const salesParams: any = {
          sortBy: `${sortBy}:${direction}`,
          limit: paginationLimit,
          skip: skip + paginationLimit,
        };

        if (dateRange[0] && dateRange[1]) {
          salesParams.initDate = dateRange[0]?.toISOString();
          salesParams.endDate = dateRange[1]?.toISOString();
        }
        if (typeof owes === 'boolean') {
          salesParams.owes = owes;
        }
        if (typeof isThirteenDozen === 'boolean') {
          salesParams.isThirteenDozen = isThirteenDozen;
        }
        if (customer) {
          salesParams.customer = customer._id;
        }
        if (textQuery) {
          salesParams.textQuery = textQuery;
        }

        fetchSales(salesParams);
      }
    }
  };

  const resetFilters = () => {
    setTextQuery('');
    setSortBy('saleDate');
    setDirection('desc');
    setDateRange([null, null]);
    setOwes(null);
    setIsThirteenDozen(null);
    setCustomer(null);
  };

  const applyFilters = (q: {
    dateRange?: [Date | null, Date | null] | null;
    owes?: boolean | null;
    isThirteenDozen?: boolean | null;
    customer?: Customer;
  }) => {
    setDateRange(q.dateRange || [null, null]);
    setOwes(q.owes ?? null);
    setIsThirteenDozen(q.isThirteenDozen ?? null);
    setCustomer(q.customer ?? null);
    setShowFiltersModal(false);
  };

  const handleFetchCustomers = (search: string) => {
    fetchCustomers({
      textQuery: search,
      limit: 10,
      skip: 0,
    });
  };

  return (
    <>
      <SaleFilterModal
        showModal={showFiltersModal}
        applyFilter={applyFilters}
        closeModal={() => setShowFiltersModal(false)}
        parentDateRange={dateRange}
        parentOwes={owes}
        parentIsThirteenDozen={isThirteenDozen}
        parentCustomer={customer || undefined}
        fetchCustomers={handleFetchCustomers}
        customers={{
          data: customers,
          loading: false,
        }}
      />

      <PageContainer onScroll={onScrollContent}>
        <Loading visible={globalLoading} />
        <Card
          className={styles.saleCard}
          title={textConstants.salePage.TITLE}
          description={textConstants.salePage.DESCRIPTION}
        />
        {sales?.map(sale => (
          <SaleCard
            className={styles.saleCard}
            sale={sale}
            navigate
            key={sale._id}
            deleteSale={deleteSale}
          />
        ))}
        {sales?.length === 0 && !globalLoading && (
          <Card
            className={styles.saleCard}
            title={textConstants.salePage.EMPTY_TITLE}
            description={textConstants.salePage.EMPTY_DESCRIPTION}
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
              text: textConstants.addSale.ADD_SALE,
              icon: <MdPlaylistAdd />,
              href: '/sales/new',
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

export default SalesPage;
