import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock environment variables
vi.mock('import.meta.env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3001/api',
  },
}));

// Mock the store
const mockStore = {
  getState: vi.fn(),
};

vi.mock('@/store', () => ({
  store: mockStore,
}));

// Mock localStorage and sessionStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.getState.mockReturnValue({
      auth: { token: null },
    });
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should have correct base URL from environment', () => {
      expect(import.meta.env.VITE_API_URL).toBe('http://localhost:3001/api');
    });
  });

  describe('API Structure', () => {
    it('should have auth endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.auth).toBeDefined();
      expect(typeof api.auth.login).toBe('function');
      expect(typeof api.auth.checkAuth).toBe('function');
      expect(typeof api.auth.logout).toBe('function');
    });

    it('should have user endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.users).toBeDefined();
      expect(typeof api.users.getProfile).toBe('function');
      expect(typeof api.users.updateProfile).toBe('function');
    });

    it('should have customer endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.customers).toBeDefined();
      expect(typeof api.customers.getAll).toBe('function');
      expect(typeof api.customers.getById).toBe('function');
      expect(typeof api.customers.create).toBe('function');
      expect(typeof api.customers.update).toBe('function');
      expect(typeof api.customers.delete).toBe('function');
    });

    it('should have product endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.products).toBeDefined();
      expect(typeof api.products.getAll).toBe('function');
      expect(typeof api.products.getById).toBe('function');
      expect(typeof api.products.create).toBe('function');
      expect(typeof api.products.update).toBe('function');
      expect(typeof api.products.delete).toBe('function');
    });

    it('should have order endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.orders).toBeDefined();
      expect(typeof api.orders.getAll).toBe('function');
      expect(typeof api.orders.getById).toBe('function');
      expect(typeof api.orders.create).toBe('function');
      expect(typeof api.orders.update).toBe('function');
      expect(typeof api.orders.delete).toBe('function');
    });

    it('should have sale endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.sales).toBeDefined();
      expect(typeof api.sales.getAll).toBe('function');
      expect(typeof api.sales.getById).toBe('function');
      expect(typeof api.sales.create).toBe('function');
      expect(typeof api.sales.update).toBe('function');
      expect(typeof api.sales.delete).toBe('function');
    });

    it('should have utility endpoints defined', async () => {
      const { api } = await import('./apiClient');

      expect(api.utils).toBeDefined();
      expect(typeof api.utils.getLocalities).toBe('function');
      expect(typeof api.utils.getPresentations).toBe('function');
      expect(typeof api.utils.getProductTypes).toBe('function');
    });
  });

  describe('API Method Signatures', () => {
    it('should have correct auth method signatures', async () => {
      const { api } = await import('./apiClient');

      expect(() => {
        api.auth.login({ email: 'test@example.com', password: 'password' });
        api.auth.checkAuth();
        api.auth.logout();
      }).not.toThrow();
    });

    it('should have correct user method signatures', async () => {
      const { api } = await import('./apiClient');

      expect(() => {
        api.users.getProfile();
        api.users.updateProfile({ name: 'John Doe' });
      }).not.toThrow();
    });

    it('should have correct customer method signatures', async () => {
      const { api } = await import('./apiClient');

      const customerData = {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        storeName: "John's Store",
        phoneNumber: '+1234567890',
        user: 'user123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => {
        api.customers.getAll({ page: 1, limit: 10 });
        api.customers.getById('customer123');
        api.customers.create(customerData);
        api.customers.update('customer123', { name: 'Jane Doe' });
        api.customers.delete('customer123');
      }).not.toThrow();
    });

    it('should have correct product method signatures', async () => {
      const { api } = await import('./apiClient');

      const productData = {
        name: 'Test Product',
        presentation: 'Bolsa',
        weight: 500,
        basePrice: 99.99,
        sellingPrice: 119.99,
        stock: 100,
        user: 'user123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => {
        api.products.getAll({ page: 1, limit: 10 });
        api.products.getById('product123');
        api.products.create(productData);
        api.products.update('product123', { sellingPrice: 89.99 });
        api.products.delete('product123');
      }).not.toThrow();
    });

    it('should have correct order method signatures', async () => {
      const { api } = await import('./apiClient');

      const orderData = {
        orderId: 123,
        orderDate: new Date().toISOString(),
        totalPrice: 199.98,
        products: [
          {
            product: 'product123',
            quantity: 2,
            price: 99.99,
            totalPrice: 199.98,
          },
        ],
        user: 'user123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => {
        api.orders.getAll({ page: 1, limit: 10 });
        api.orders.getById('order123');
        api.orders.create(orderData);
        api.orders.update('order123', { totalPrice: 189.98 });
        api.orders.delete('order123');
      }).not.toThrow();
    });

    it('should have correct sale method signatures', async () => {
      const { api } = await import('./apiClient');

      const saleData = {
        saleId: 123,
        saleDate: new Date().toISOString(),
        customer: 'customer123',
        isThirteenDozen: false,
        owes: false,
        partialPayment: 0,
        totalPrice: 99.99,
        products: [
          {
            product: 'product123',
            quantity: 1,
            price: 99.99,
            totalPrice: 99.99,
          },
        ],
        user: 'user123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => {
        api.sales.getAll({ page: 1, limit: 10 });
        api.sales.getById('sale123');
        api.sales.create(saleData);
        api.sales.update('sale123', { totalPrice: 89.99 });
        api.sales.delete('sale123');
      }).not.toThrow();
    });

    it('should have correct utility method signatures', async () => {
      const { api } = await import('./apiClient');

      expect(() => {
        api.utils.getLocalities();
        api.utils.getPresentations();
        api.utils.getProductTypes();
      }).not.toThrow();
    });
  });

  describe('Default Export', () => {
    it('should export apiClient as default', async () => {
      const apiClient = await import('./apiClient');
      expect(apiClient.default).toBeDefined();
      expect(typeof apiClient.default).toBe('function');
    });
  });
});
