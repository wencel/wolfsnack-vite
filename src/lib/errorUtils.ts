import type { AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from an AxiosError
 * @param error - The Axios error object
 * @returns A string error message
 */
const getErrorMessage = (error: AxiosError): string => {
  // Check if error response has a message property
  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return error.response.data.message as string;
  }

  // Check if error response has an error property
  if (
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'error' in error.response.data
  ) {
    return error.response.data.error as string;
  }

  // Check if error response data is a string
  if (error.response?.data && typeof error.response.data === 'string') {
    return error.response.data;
  }

  // Handle different HTTP status codes with Spanish messages
  switch (error.response?.status) {
    case 400:
      return 'Solicitud incorrecta. Por favor, verifica tu información.';
    case 401:
      return 'No autorizado. Por favor, inicia sesión nuevamente.';
    case 403:
      return 'Acceso prohibido. No tienes permiso.';
    case 404:
      return 'Recurso no encontrado.';
    case 409:
      return 'Conflicto. Este recurso ya existe.';
    case 422:
      return 'Error de validación. Por favor, verifica tu información.';
    case 500:
      return 'Error del servidor. Por favor, intenta nuevamente más tarde.';
    case 502:
      return 'Puerta de enlace incorrecta. Por favor, intenta nuevamente más tarde.';
    case 503:
      return 'Servicio no disponible. Por favor, intenta nuevamente más tarde.';
    default:
      return error.message || 'Ocurrió un error inesperado.';
  }
};

/**
 * Type guard to check if an error is an AxiosError
 * @param error - The error to check
 * @returns True if the error is an AxiosError
 */
const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

/**
 * Safely extracts error message from any error type
 * @param error - The error (could be any type)
 * @returns A string error message
 */
export const extractErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return getErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
};
