import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback, useEffect } from 'react';
import { fetchProductTypes } from '@/store/slices/productTypesSlice';

export const useProductTypes = () => {
  const dispatch = useAppDispatch();
  const { productTypes, loading, error } = useAppSelector(
    state => state.productTypes
  );

  const fetchProductTypesAction = useCallback(
    () => dispatch(fetchProductTypes()),
    [dispatch]
  );

  // Auto-fetch product types on mount
  useEffect(() => {
    if (productTypes.length === 0 && !loading) {
      fetchProductTypesAction();
    }
  }, [fetchProductTypesAction, productTypes.length, loading]);

  return {
    productTypes,
    loading,
    error,
    fetchProductTypes: fetchProductTypesAction,
  };
};

export default useProductTypes;

