import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosArrowDropleft } from 'react-icons/io';
import { MdPersonAdd } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import CustomerCard from '@/components/Molecules/CustomerCard';
import TopActions from '@/components/Organisms/TopActions';
import { textConstants } from '@/lib/appConstants';
import useLoading from '@/hooks/useLoading';
import useCustomers from '@/hooks/useCustomers';
import styles from './CustomerPage.module.sass';

const CustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading } = useLoading();
  const { currentCustomer, fetchCustomer, resetCurrentCustomer } =
    useCustomers();

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }

    return () => {
      resetCurrentCustomer();
    };
  }, [id, fetchCustomer, resetCurrentCustomer]);

  if (!id) {
    return (
      <PageContainer>
        <Card title='Error' description={textConstants.misc.NO_CUSTOMER_ID} />
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
            href: '/customers',
          },
          {
            text: textConstants.addCustomer.ADD_CUSTOMER,
            icon: <MdPersonAdd />,
            href: '/customers/new',
          },
        ]}
      />

      {currentCustomer && (
        <CustomerCard
          className={styles.customerCard}
          customer={currentCustomer}
          navigate={false}
        />
      )}

      {!currentCustomer && !loading && (
        <Card
          title={textConstants.misc.CUSTOMER_NOT_FOUND}
          description={textConstants.misc.CUSTOMER_NOT_FOUND_DESCRIPTION}
        />
      )}
    </PageContainer>
  );
};

export default CustomerPage;
