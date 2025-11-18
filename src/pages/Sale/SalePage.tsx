import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosArrowDropleft } from 'react-icons/io';
import { MdPlaylistAdd } from 'react-icons/md';
import PageContainer from '@/components/Atoms/PageContainer/PageContainer';
import Loading from '@/components/Atoms/Loading/Loading';
import TopActions from '@/components/Organisms/TopActions/TopActions';
import SaleCard from '@/components/Molecules/SaleCard/SaleCard';
import { useSales } from '@/hooks/useSales';
import { useAppSelector } from '@/store/hooks';
import { textConstants } from '@/lib/appConstants';
import styles from './SalePage.module.sass';
import Card from '@/components/Atoms/Card/Card';

const SalePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentSale, fetchSale, resetCurrentSale, deleteSale } = useSales();
  const { loading } = useAppSelector(state => state.loading);

  useEffect(() => {
    if (id) {
      fetchSale(id);
    }

    return () => {
      resetCurrentSale();
    };
  }, [id, fetchSale, resetCurrentSale]);

  const handleDeleteSale = (saleId: string) => {
    deleteSale(saleId);
    // Navigate back to sales list after deletion
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
            href: '/sales',
          },
          {
            text: textConstants.addSale.ADD_SALE,
            icon: <MdPlaylistAdd />,
            href: '/sales/new',
          },
        ]}
      />
      {currentSale && !loading && (
        <SaleCard
          className={styles.saleCard}
          sale={currentSale}
          navigate={false}
          deleteSale={handleDeleteSale}
        />
      )}
      {!currentSale && !loading && (
        <Card
          title={textConstants.misc.SALE_NOT_FOUND}
          description={textConstants.misc.SALE_NOT_FOUND_DESCRIPTION}
        />
      )}
    </PageContainer>
  );
};

export default SalePage;
