import { describe, it, expect } from 'vitest';
import {
  idGenerator,
  calculateTotalPriceProduct,
  formatCurrency,
  formatDate,
} from './utils';

describe('utils', () => {
  describe('idGenerator', () => {
    it('should generate a string ID', () => {
      const id = idGenerator();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(9);
    });

    it('should generate different IDs on each call', () => {
      const id1 = idGenerator();
      const id2 = idGenerator();
      expect(id1).not.toBe(id2);
    });

    it('should generate alphanumeric IDs', () => {
      const id = idGenerator();
      expect(id).toMatch(/^[a-z0-9]{9}$/);
    });
  });

  describe('calculateTotalPriceProduct', () => {
    it('should calculate total price for regular quantity', () => {
      const result = calculateTotalPriceProduct(10, 5);
      expect(result).toBe(50);
    });

    it('should calculate total price for thirteen dozen', () => {
      const result = calculateTotalPriceProduct(10, 13, true);
      expect(result).toBe(120); // 13 - floor(13/13) = 13 - 1 = 12, so 10 * 12 = 120
    });

    it('should calculate total price for multiple thirteen dozens', () => {
      const result = calculateTotalPriceProduct(10, 26, true);
      expect(result).toBe(240); // 26 - floor(26/13) = 26 - 2 = 24, so 10 * 24 = 240
    });

    it('should handle zero quantity', () => {
      const result = calculateTotalPriceProduct(10, 0);
      expect(result).toBe(0);
    });

    it('should handle regular quantity', () => {
      const result = calculateTotalPriceProduct(10, 5);
      expect(result).toBe(50);
    });

    it('should handle decimal quantity', () => {
      const result = calculateTotalPriceProduct(10, 5.7);
      expect(result).toBe(50); // parseInt(5.7) = 5
    });

    it('should handle negative quantity', () => {
      const result = calculateTotalPriceProduct(10, -5);
      expect(result).toBe(-50);
    });
  });

  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/\$\s*1\.234,56/);
    });

    it('should format zero amount', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$\s*0,00/);
    });

    it('should format negative amounts', () => {
      const result = formatCurrency(-1234.56);
      expect(result).toMatch(/-\$\s*1\.234,56/);
    });

    it('should format large amounts', () => {
      const result = formatCurrency(1000000);
      expect(result).toMatch(/\$\s*1\.000\.000,00/);
    });

    it('should use Colombian locale with dollar symbol', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('$');
      expect(result).toMatch(/^\$\s*[\d.,]+$/);
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2023-12-25');
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    });

    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25');
      const result = formatDate(date);
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    });

    it('should use Colombian locale', () => {
      const result = formatDate('2023-12-25');
      // Colombian format is typically DD/MM/YYYY
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    });

    it('should handle different date formats', () => {
      const result1 = formatDate('2023-01-01');
      const result2 = formatDate('2023-12-31');
      expect(result1).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
      expect(result2).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
    });

    it('should handle invalid date gracefully', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });
});
