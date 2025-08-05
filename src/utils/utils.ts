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
