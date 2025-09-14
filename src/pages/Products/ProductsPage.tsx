import React, { useEffect, useState } from 'react';
import { RiFilterLine, RiFilterOffLine } from 'react-icons/ri';
import { MdPlaylistAdd } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import ProductCard from '@/components/Molecules/ProductCard';
import TopActions from '@/components/Organisms/TopActions';
import ProductFilterModal from '@/components/Organisms/ProductFilterModal';
import { textConstants } from '@/lib/appConstants';
import LoadingSpinner from '@/components/Atoms/LoadingSpinner';
import useLoading from '@/hooks/useLoading';
import useProducts from '@/hooks/useProducts';

const ProductsPage: React.FC = () => {
  const { loading: globalLoading, fetching } = useLoading();

  const {
    products,
    total,
    skip,
    fetchProducts,
    deleteProduct,
    resetProducts,
  } = useProducts();

  const paginationLimit = 10;
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [direction, setDirection] = useState('asc');

  useEffect(() => {
    resetProducts();
    fetchProducts({
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
    resetProducts,
    fetchProducts,
  ]);

  const onScrollContent = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.offsetHeight + target.scrollTop >= target.scrollHeight - 200) {
      if (!fetching && products.length < total) {
        fetchProducts({
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
    setSortBy('name');
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
      <ProductFilterModal
        showModal={showFiltersModal}
        applyFilter={applyFilters}
        closeModal={() => setShowFiltersModal(false)}
        parentSearchTerm={textQuery}
        parentSortBy={sortBy}
        parentDirection={direction}
      />

      <PageContainer onScroll={onScrollContent}>
        <Card
          title={textConstants.productPage.TITLE}
          description={textConstants.productPage.DESCRIPTION}
        ></Card>
        {products?.map(product => (
          <ProductCard
            product={product}
            navigate
            key={product._id}
            deleteProduct={deleteProduct}
          />
        ))}
        {products?.length === 0 && !globalLoading && (
          <Card
            title={textConstants.productPage.EMPTY_TITLE}
            description={textConstants.productPage.EMPTY_DESCRIPTION}
          />
        )}
        {fetching && (
          <div className="loadingContainer">
            <LoadingSpinner size='large' color='primary' />
          </div>
        )}

        <TopActions
          buttons={[
            {
              text: textConstants.addProduct.ADD_PRODUCT,
              icon: <MdPlaylistAdd />,
              href: '/products/new',
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

export default ProductsPage;
