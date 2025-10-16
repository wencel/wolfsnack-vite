import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '@/lib/data';
import { api } from '@/lib/apiClient';
import type { AxiosError } from 'axios';
import { apiToast } from '@/lib/toastService';
import {
  setLoading,
  setSubmitting,
  setFetching,
} from '@/store/slices/loadingSlice';
import { setSubmitError, clearSubmitError } from '@/store/slices/errorSlice';
import { textConstants } from '@/lib/appConstants';
import { extractErrorMessage } from '@/lib/errorUtils';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  total: number;
  skip: number;
  error: string | null;
}

interface FetchProductsParams {
  limit: number;
  textQuery?: string;
  sortBy?: string;
  skip?: number;
  [key: string]: unknown; // To match ApiParams
}

interface CreateProductData {
  name: string;
  presentation?: string;
  weight?: number;
  stock?: number;
  basePrice?: number;
  sellingPrice?: number;
}

interface CreateProductThunkArg {
  productData: CreateProductData;
  navigate?: (path: string) => void;
}

interface UpdateProductThunkArg {
  id: string;
  productData: Partial<CreateProductData>;
  navigate?: (path: string) => void;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  total: 0,
  skip: 0,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: FetchProductsParams, { dispatch, rejectWithValue }) => {
    try {
      // Use 'loading' for initial load (skip=0), 'fetching' for pagination (skip>0)
      const isInitialLoad = !params.skip || params.skip === 0;
      if (isInitialLoad) {
        dispatch(setLoading(true));
      } else {
        dispatch(setFetching(true));
      }
      const response = await api.products.getAll(params);
      return response.data; // PaginatedResponse<Product>
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(extractErrorMessage(axiosError));
    } finally {
      dispatch(setLoading(false));
      dispatch(setFetching(false));
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await api.products.getById(productId);
      return response.data; // Product
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(extractErrorMessage(axiosError));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (
    { productData, navigate }: CreateProductThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.products.create(
        productData as Omit<Product, '_id'>
      );

      // Show success toast
      apiToast.success(textConstants.addProduct.ADD_PRODUCT_SUCCESS);

      // Navigate to the created product page
      if (navigate) {
        navigate(`/products/${response.data._id}`);
      }

      return response.data; // Product
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);

      // Set error in Redux state for form to display
      dispatch(setSubmitError(errorMessage));

      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (
    { id, productData, navigate }: UpdateProductThunkArg,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setSubmitting(true));
      dispatch(clearSubmitError()); // Clear any previous submit errors

      const response = await api.products.update(id, productData);

      // Show success toast
      apiToast.success(textConstants.editProduct.EDIT_PRODUCT_SUCCESS);

      // Navigate to the updated product page
      if (navigate) {
        navigate(`/products/${id}`);
      }

      return response.data; // Product
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);

      // Set error in Redux state for form to display
      dispatch(setSubmitError(errorMessage));

      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSubmitting(true));
      await api.products.delete(productId);
      apiToast.success(textConstants.productPage.DELETE_SUCCESS);
      return productId;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(extractErrorMessage(axiosError));
    } finally {
      dispatch(setSubmitting(false));
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetProducts: state => {
      state.products = [];
      state.total = 0;
      state.skip = 0;
      state.error = null;
    },
    resetCurrentProduct: state => {
      state.currentProduct = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data: products, total, skip } = action.payload; // Destructure data
        if (skip === 0) {
          state.products = products;
        } else {
          state.products = [...state.products, ...products];
        }
        state.total = total;
        state.skip = skip;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.currentProduct = null;
        state.error = action.payload as string;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload); // Add to beginning of list
        state.total += 1;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        // Update in products list
        const index = state.products.findIndex(
          p => p._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        // Update current product if it's the same one
        if (state.currentProduct?._id === updatedProduct._id) {
          state.currentProduct = updatedProduct;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          product => product._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetProducts, resetCurrentProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
