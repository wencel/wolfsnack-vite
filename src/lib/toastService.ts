import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-center' as const,
  style: {
    background: '#363636',
    color: '#fff',
    fontSize: '14px',
    padding: '12px 16px',
    borderRadius: '8px',
  },
};

// Success toast configuration
const successToastConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#10b981', // Green color
  },
  icon: '✅',
};

// Error toast configuration
const errorToastConfig = {
  ...toastConfig,
  style: {
    ...toastConfig.style,
    background: '#ef4444', // Red color
  },
  icon: '❌',
};

// Extract error message from Axios error
export const extractErrorMessage = (error: AxiosError): string => {
  console.log(error);
  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return error.response.data.message as string;
  }

  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'error' in error.response.data
  ) {
    return error.response.data.error as string;
  }

  // Handle different HTTP status codes
  switch (error.response?.status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in again.';
    case 403:
      return "Access forbidden. You don't have permission.";
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. This resource already exists.';
    case 422:
      return 'Validation error. Please check your input.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

// Show error toast
export const showErrorToast = (error: AxiosError | string): void => {
  const message =
    typeof error === 'string' ? error : extractErrorMessage(error);
  toast.error(message, errorToastConfig);
};

// Show success toast
export const showSuccessToast = (message: string): void => {
  toast.success(message, successToastConfig);
};

// Show info toast
export const showInfoToast = (message: string): void => {
  toast(message, toastConfig);
};

// Toast service for API responses
export const apiToast = {
  // Show error for failed request (automatic from interceptor)
  error: (error: AxiosError | string): void => {
    showErrorToast(error);
  },

  // Show success toast (manual from components/thunks)
  success: (message: string): void => {
    showSuccessToast(message);
  },

  // Show info toast (manual from components/thunks)
  info: (message: string): void => {
    showInfoToast(message);
  },
};

export default apiToast;
