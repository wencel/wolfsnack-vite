import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { User, Customer, Product, Order, Sale } from '@/lib/data';
import { apiToast } from './toastService';
import { store } from '@/store';

// Extend the config type to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    operationName: string;
  };
}

// API interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface ApiParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  textQuery?: string;
  sortBy?: string;
  skip?: number;
  [key: string]: unknown;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get operation name from config
const getOperationName = (config: InternalAxiosRequestConfig): string => {
  const method = config.method?.toUpperCase() || 'GET';
  const url = config.url || '';
  return `${method} ${url}`;
};

// Helper function to get token (prefer Redux state, fallback to storage)
const getAuthToken = (): string | null => {
  // Try to get from Redux state first (faster)
  const state = store.getState();
  const cachedToken = state.auth.token;

  if (cachedToken) {
    return cachedToken;
  }

  // Fallback to storage (source of truth)
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    const token = getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Store operation name for response interceptor
    config.metadata = { operationName: getOperationName(config) };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors only
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return response as-is, loading states handled manually in thunks
    return response;
  },
  error => {
    // Show error toast for all failed requests
    apiToast.error(error);

    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      // Clear from storage (source of truth)
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      // You could dispatch a logout action here if needed
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: LoginCredentials) =>
      apiClient.post<LoginResponse>('/users/login', credentials),

    checkAuth: () => apiClient.get<User>('/users/me'), // Returns User object, not LoginResponse

    logout: () => apiClient.post('/users/logout'),
  },

  // User endpoints
  users: {
    getProfile: () => apiClient.get<User>('/users/profile'),
    updateProfile: (data: Partial<User>) =>
      apiClient.put<User>('/users/profile', data),
  },

  // Customer endpoints
  customers: {
    getAll: (params?: ApiParams) =>
      apiClient.get<PaginatedResponse<Customer>>('/customers', { params }),
    getById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
    create: (data: Omit<Customer, '_id'>) =>
      apiClient.post<Customer>('/customers', data),
    update: (id: string, data: Partial<Customer>) =>
      apiClient.put<Customer>(`/customers/${id}`, data),
    delete: (id: string) => apiClient.delete(`/customers/${id}`),
  },

  // Product endpoints
  products: {
    getAll: (params?: ApiParams) =>
      apiClient.get<PaginatedResponse<Product>>('/products', { params }),
    getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
    create: (data: Omit<Product, '_id'>) =>
      apiClient.post<Product>('/products', data),
    update: (id: string, data: Partial<Product>) =>
      apiClient.put<Product>(`/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/products/${id}`),
  },

  // Order endpoints
  orders: {
    getAll: (params?: ApiParams) =>
      apiClient.get<PaginatedResponse<Order>>('/orders', { params }),
    getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),
    create: (data: Omit<Order, '_id'>) =>
      apiClient.post<Order>('/orders', data),
    update: (id: string, data: Partial<Order>) =>
      apiClient.put<Order>(`/orders/${id}`, data),
    delete: (id: string) => apiClient.delete(`/orders/${id}`),
  },

  // Sale endpoints
  sales: {
    getAll: (params?: ApiParams) =>
      apiClient.get<PaginatedResponse<Sale>>('/sales', { params }),
    getById: (id: string) => apiClient.get<Sale>(`/sales/${id}`),
    create: (data: Omit<Sale, '_id'>) => apiClient.post<Sale>('/sales', data),
    update: (id: string, data: Partial<Sale>) =>
      apiClient.put<Sale>(`/sales/${id}`, data),
    delete: (id: string) => apiClient.delete(`/sales/${id}`),
  },

  // Utility endpoints
  utils: {
    getLocalities: () => apiClient.get<string[]>('/utils/localities'),
    getPresentations: () => apiClient.get<string[]>('/utils/presentations'),
    getProductTypes: () => apiClient.get<string[]>('/utils/productTypes'),
  },
};

export default apiClient;
