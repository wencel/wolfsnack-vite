// Utility functions for the application

export const idGenerator = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateTotalPriceProduct = (
  price: number,
  quantity: number,
  isThirteenDozen?: boolean
): number => {
  const q = parseInt(quantity.toString());
  if (q) {
    return price * (isThirteenDozen ? q - Math.floor(q / 13) : q);
  }
  return quantity;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('es-CO');
};

/**
 * Compares two objects and returns only the fields that have changed
 * @param original - The original object
 * @param updated - The updated object
 * @returns Object containing only the changed fields
 */
export const getChangedFields = <T extends Record<string, any>>(
  original: T,
  updated: T
): Partial<T> => {
  const changedFields: Partial<T> = {};
  
  for (const key in updated) {
    if (updated.hasOwnProperty(key)) {
      const originalValue = original[key];
      const updatedValue = updated[key];
      
      // Handle different data types and null/undefined cases
      if (originalValue !== updatedValue) {
        // Special handling for empty strings vs undefined
        if (originalValue === undefined && updatedValue === '') {
          continue; // Don't include empty strings as changes if original was undefined
        }
        if (originalValue === '' && updatedValue === undefined) {
          continue; // Don't include undefined as changes if original was empty string
        }
        
        changedFields[key] = updatedValue;
      }
    }
  }
  
  return changedFields;
};
