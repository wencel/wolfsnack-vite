import React, { useEffect, useState } from 'react';
import { RiFilterLine, RiFilterOffLine } from 'react-icons/ri';
import { MdPersonAdd } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import CustomerCard from '@/components/Molecules/CustomerCard';
import TopActions from '@/components/Organisms/TopActions';
import CustomerFilterModal from '@/components/Organisms/CustomerFilterModal';
import { textConstants } from '@/lib/appConstants';
import LoadingSpinner from '@/components/Atoms/LoadingSpinner';
import useLoading from '@/hooks/useLoading';
import useCustomers from '@/hooks/useCustomers';
import styles from './CustomersPage.module.sass';

const CustomersPage: React.FC = () => {
  const { loading: globalLoading, fetching } = useLoading();
  const {
    customers,
    total,
    skip,
    fetchCustomers,
    deleteCustomer,
    resetCustomers,
  } = useCustomers();

  const paginationLimit = 10;
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [sortBy, setSortBy] = useState('storeName');
  const [direction, setDirection] = useState('asc');

  useEffect(() => {
    resetCustomers();
    fetchCustomers({
      limit: paginationLimit,
      textQuery,
      sortBy: `${sortBy}:${direction}`,
    });
  }, [
    resetCustomers,
    fetchCustomers,
    paginationLimit,
    textQuery,
    sortBy,
    direction,
  ]);

  useEffect(() => {
    resetCustomers();
    fetchCustomers({
      textQuery,
      sortBy: `${sortBy}:${direction}`,
      limit: paginationLimit,
      skip: 0,
    });
  }, [
    textQuery,
    sortBy,
    direction,
    paginationLimit,
    resetCustomers,
    fetchCustomers,
  ]);

  const onScrollContent = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.offsetHeight + target.scrollTop >= target.scrollHeight - 200) {
      if (!fetching && customers.length < total) {
        fetchCustomers({
          textQuery,
          sortBy: `${sortBy}:${direction}`,
          limit: paginationLimit,
          skip: skip + paginationLimit,
        });
      }
    }
  };

  const resetFilters = () => {
    setTextQuery('');
    setSortBy('storeName');
    setDirection('asc');
  };

  const applyFilters = (q: {
    searchTerm: string;
    sortBy: string;
    direction: string;
  }) => {
    setTextQuery(q.searchTerm);
    setSortBy(q.sortBy);
    setDirection(q.direction);
    setShowFiltersModal(false);
  };

  return (
    <>
      <CustomerFilterModal
        showModal={showFiltersModal}
        applyFilter={applyFilters}
        closeModal={() => setShowFiltersModal(false)}
        parentSearchTerm={textQuery}
        parentSortBy={sortBy}
        parentDirection={direction}
      />

      <PageContainer onScroll={onScrollContent}>
        <Card
          title={textConstants.customerPage.TITLE}
          description={textConstants.customerPage.DESCRIPTION}
        ></Card>
        {customers?.map(customer => (
          <CustomerCard
            customer={customer}
            navigate
            key={customer._id}
            deleteCustomer={deleteCustomer}
          />
        ))}
        {customers?.length === 0 && !globalLoading && (
          <Card
            title={textConstants.customerPage.EMPTY_TITLE}
            description={textConstants.customerPage.EMPTY_DESCRIPTION}
          />
        )}
        {fetching && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size='large' color='primary' />
          </div>
        )}

        <TopActions
          buttons={[
            {
              text: textConstants.addCustomer.ADD_CUSTOMER,
              icon: <MdPersonAdd />,
              href: '/customers/new',
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

export default CustomersPage;
