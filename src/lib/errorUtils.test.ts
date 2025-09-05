import { describe, it, expect } from 'vitest';
import type { AxiosError } from 'axios';
import { extractErrorMessage } from './errorUtils';

// Mock AxiosError for testing
const createMockAxiosError = (
  status?: number,
  data?: unknown,
  message?: string
): AxiosError => ({
  isAxiosError: true,
  response: {
    status: status ?? 500,
    data,
    statusText: 'Error',
    headers: {},
    config: {} as never,
  },
  message: message ?? 'Axios error',
  name: 'AxiosError',
  config: {} as never,
  code: 'ERROR',
  toJSON: () => ({}),
});

describe('errorUtils', () => {
  describe('extractErrorMessage', () => {
    it('should extract message from AxiosError with message property', () => {
      const error = createMockAxiosError(400, { message: 'Custom error message' });
      const result = extractErrorMessage(error);
      expect(result).toBe('Custom error message');
    });

    it('should extract message from AxiosError with error property', () => {
      const error = createMockAxiosError(400, { error: 'Validation failed' });
      const result = extractErrorMessage(error);
      expect(result).toBe('Validation failed');
    });

    it('should extract message from AxiosError with string data', () => {
      const error = createMockAxiosError(400, 'String error message');
      const result = extractErrorMessage(error);
      expect(result).toBe('String error message');
    });

    it('should return Spanish message for 400 status', () => {
      const error = createMockAxiosError(400);
      const result = extractErrorMessage(error);
      expect(result).toBe('Solicitud incorrecta. Por favor, verifica tu información.');
    });

    it('should return Spanish message for 401 status', () => {
      const error = createMockAxiosError(401);
      const result = extractErrorMessage(error);
      expect(result).toBe('No autorizado. Por favor, inicia sesión nuevamente.');
    });

    it('should return Spanish message for 403 status', () => {
      const error = createMockAxiosError(403);
      const result = extractErrorMessage(error);
      expect(result).toBe('Acceso prohibido. No tienes permiso.');
    });

    it('should return Spanish message for 404 status', () => {
      const error = createMockAxiosError(404);
      const result = extractErrorMessage(error);
      expect(result).toBe('Recurso no encontrado.');
    });

    it('should return Spanish message for 409 status', () => {
      const error = createMockAxiosError(409);
      const result = extractErrorMessage(error);
      expect(result).toBe('Conflicto. Este recurso ya existe.');
    });

    it('should return Spanish message for 422 status', () => {
      const error = createMockAxiosError(422);
      const result = extractErrorMessage(error);
      expect(result).toBe('Error de validación. Por favor, verifica tu información.');
    });

    it('should return Spanish message for 500 status', () => {
      const error = createMockAxiosError(500);
      const result = extractErrorMessage(error);
      expect(result).toBe('Error del servidor. Por favor, intenta nuevamente más tarde.');
    });

    it('should return Spanish message for 502 status', () => {
      const error = createMockAxiosError(502);
      const result = extractErrorMessage(error);
      expect(result).toBe('Puerta de enlace incorrecta. Por favor, intenta nuevamente más tarde.');
    });

    it('should return Spanish message for 503 status', () => {
      const error = createMockAxiosError(503);
      const result = extractErrorMessage(error);
      expect(result).toBe('Servicio no disponible. Por favor, intenta nuevamente más tarde.');
    });

    it('should return error message for unknown status when available', () => {
      const error = createMockAxiosError(999, null, 'Custom error message');
      const result = extractErrorMessage(error);
      expect(result).toBe('Custom error message');
    });

    it('should return default Spanish message for unknown status when no message', () => {
      const error: AxiosError = {
        isAxiosError: true,
        response: {
          status: 999,
          data: null,
          statusText: 'Error',
          headers: {},
          config: {} as never,
        },
        message: '',
        name: 'AxiosError',
        config: {} as never,
        code: 'ERROR',
        toJSON: () => ({}),
      };
      const result = extractErrorMessage(error);
      expect(result).toBe('Ocurrió un error inesperado.');
    });

    it('should return status-based message for 500 status', () => {
      const error = createMockAxiosError(500, null, 'Server timeout');
      const result = extractErrorMessage(error);
      expect(result).toBe('Error del servidor. Por favor, intenta nuevamente más tarde.');
    });

    it('should handle standard Error objects', () => {
      const error = new Error('Standard error message');
      const result = extractErrorMessage(error);
      expect(result).toBe('Standard error message');
    });

    it('should handle string errors', () => {
      const error = 'String error';
      const result = extractErrorMessage(error);
      expect(result).toBe('String error');
    });

    it('should handle unknown error types', () => {
      const error = { custom: 'error' };
      const result = extractErrorMessage(error);
      expect(result).toBe('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    });

    it('should handle null errors', () => {
      const error = null;
      const result = extractErrorMessage(error);
      expect(result).toBe('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    });

    it('should handle undefined errors', () => {
      const error = undefined;
      const result = extractErrorMessage(error);
      expect(result).toBe('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    });

    it('should handle AxiosError with no response', () => {
      const error: AxiosError = {
        isAxiosError: true,
        message: 'Network error',
        name: 'AxiosError',
        config: {} as never,
        code: 'NETWORK_ERROR',
        toJSON: () => ({}),
      };
      const result = extractErrorMessage(error);
      expect(result).toBe('Network error');
    });

    it('should handle AxiosError with empty response data', () => {
      const error = createMockAxiosError(500, {});
      const result = extractErrorMessage(error);
      expect(result).toBe('Error del servidor. Por favor, intenta nuevamente más tarde.');
    });

    it('should handle AxiosError with null response data', () => {
      const error = createMockAxiosError(500, null);
      const result = extractErrorMessage(error);
      expect(result).toBe('Error del servidor. Por favor, intenta nuevamente más tarde.');
    });
  });
});
