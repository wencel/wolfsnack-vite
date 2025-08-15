import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { extractErrorMessage } from './errorUtils';

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

// Show error toast
export const showErrorToast = (error: AxiosError | string): void => {
  const message = extractErrorMessage(error);
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
