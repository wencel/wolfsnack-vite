import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback } from 'react';
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  resetCurrentProduct,
} from '@/store/slices/productsSlice';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { products, currentProduct, total, skip, error } = useAppSelector(
    state => state.products
  );

  const fetchProductsAction = useCallback(
    (params: {
      limit: number;
      textQuery?: string;
      sortBy?: string;
      skip?: number;
    }) => dispatch(fetchProducts(params)),
    [dispatch]
  );

  const fetchProductAction = useCallback(
    (productId: string) => dispatch(fetchProduct(productId)),
    [dispatch]
  );

  const createProductAction = useCallback(
    (params: {
      productData: {
        name: string;
        presentation?: string;
        weight?: number;
        stock?: number;
        basePrice?: number;
        sellingPrice?: number;
      };
      navigate?: (path: string) => void;
    }) => dispatch(createProduct(params)),
    [dispatch]
  );

  const updateProductAction = useCallback(
    (params: {
      id: string;
      productData: Partial<{
        name: string;
        presentation?: string;
        weight?: number;
        stock?: number;
        basePrice?: number;
        sellingPrice?: number;
      }>;
      navigate?: (path: string) => void;
    }) => dispatch(updateProduct(params)),
    [dispatch]
  );

  const deleteProductAction = useCallback(
    (productId: string) => dispatch(deleteProduct(productId)),
    [dispatch]
  );

  const resetProductsAction = useCallback(
    () => dispatch(resetProducts()),
    [dispatch]
  );

  const resetCurrentProductAction = useCallback(
    () => dispatch(resetCurrentProduct()),
    [dispatch]
  );

  return {
    // State
    products,
    currentProduct,
    total,
    skip,
    error,

    // Actions
    fetchProducts: fetchProductsAction,
    fetchProduct: fetchProductAction,
    createProduct: createProductAction,
    updateProduct: updateProductAction,
    deleteProduct: deleteProductAction,
    resetProducts: resetProductsAction,
    resetCurrentProduct: resetCurrentProductAction,

    // Helpers
    hasProducts: Boolean(products && products.length > 0),
    hasMoreProducts: Boolean(products && products.length < total),
  };
};

export default useProducts;
