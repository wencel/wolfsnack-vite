// Interfaces matching the API models
export interface Product {
  _id: string;
  name: string;
  presentation: string;
  weight: number;
  basePrice: number;
  sellingPrice: number;
  stock: number;
  user: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string; // Virtual field
}

export interface Customer {
  _id: string;
  name?: string;
  email?: string;
  address: string; // required
  storeName: string; // required
  phoneNumber: string; // required
  secondaryPhoneNumber?: string;
  locality?: string; // enum from localities, not required
  town?: string; // not required
  idNumber?: string; // string, not number
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  product: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderId: number;
  orderDate: string;
  totalPrice: number;
  products: OrderProduct[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleProduct {
  product: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Sale {
  _id: string;
  saleId: number;
  saleDate: string;
  customer: string;
  isThirteenDozen: boolean;
  owes: boolean;
  partialPayment: number;
  totalPrice: number;
  products: SaleProduct[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional in responses due to toJSON method
  activationToken?: string;
  active: boolean;
  tokens?: Array<{ token: string }>;
  avatar?: unknown; // Buffer in Node.js, but we don't need the exact type in frontend
  createdAt: string;
  updatedAt: string;
  // Virtual fields (populated when needed)
  customers?: Customer[];
  products?: Product[];
  orders?: Order[];
  sales?: Sale[];
}

// Mock data for development/testing
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Wolf Snack Mix',
    presentation: 'Bolsa',
    weight: 500,
    basePrice: 12.99,
    sellingPrice: 15.99,
    stock: 45,
    user: 'user1',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    fullName: 'Wolf Snack Mix Bolsa 500',
  },
  {
    _id: '2',
    name: 'Trail Mix Deluxe',
    presentation: 'Bolsa',
    weight: 750,
    basePrice: 15.99,
    sellingPrice: 19.99,
    stock: 32,
    user: 'user1',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
    fullName: 'Trail Mix Deluxe Bolsa 750',
  },
  {
    _id: '3',
    name: 'Protein Bars',
    presentation: 'Unidad',
    weight: 60,
    basePrice: 8.99,
    sellingPrice: 11.99,
    stock: 67,
    user: 'user1',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
    fullName: 'Protein Bars Unidad 60',
  },
];

const mockCustomers: Customer[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, City, State 12345',
    storeName: "John's Store",
    phoneNumber: '5551234567',
    secondaryPhoneNumber: '5559876543',
    locality: 'Downtown',
    town: 'City',
    idNumber: '123456789',
    user: 'user1',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, City, State 12345',
    storeName: "Jane's Market",
    phoneNumber: '5559876543',
    locality: 'Uptown',
    town: 'City',
    user: 'user1',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    address: '789 Pine Rd, City, State 12345',
    storeName: "Mike's Shop",
    phoneNumber: '5554567890',
    secondaryPhoneNumber: '5553210987',
    locality: 'Suburbs',
    town: 'City',
    user: 'user1',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
  },
];

const mockOrders: Order[] = [
  {
    _id: '1',
    orderId: 1,
    orderDate: '2024-01-15T00:00:00.000Z',
    totalPrice: 34.97,
    products: [
      { product: '1', price: 12.99, quantity: 2, totalPrice: 25.98 },
      { product: '3', price: 8.99, quantity: 1, totalPrice: 8.99 },
    ],
    user: 'user1',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    _id: '2',
    orderId: 2,
    orderDate: '2024-01-14T00:00:00.000Z',
    totalPrice: 15.99,
    products: [{ product: '2', price: 15.99, quantity: 1, totalPrice: 15.99 }],
    user: 'user1',
    createdAt: '2024-01-14T00:00:00.000Z',
    updatedAt: '2024-01-14T00:00:00.000Z',
  },
];

const mockSales: Sale[] = [
  {
    _id: '1',
    saleId: 1,
    saleDate: '2024-01-15T00:00:00.000Z',
    customer: '1',
    isThirteenDozen: false,
    owes: false,
    partialPayment: 0,
    totalPrice: 25.98,
    products: [{ product: '1', price: 12.99, quantity: 2, totalPrice: 25.98 }],
    user: 'user1',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    _id: '2',
    saleId: 2,
    saleDate: '2024-01-14T00:00:00.000Z',
    customer: '2',
    isThirteenDozen: true,
    owes: true,
    partialPayment: 10.0,
    totalPrice: 15.99,
    products: [{ product: '2', price: 15.99, quantity: 1, totalPrice: 15.99 }],
    user: 'user1',
    createdAt: '2024-01-14T00:00:00.000Z',
    updatedAt: '2024-01-14T00:00:00.000Z',
  },
];

// Server-side data fetching functions
export async function getProducts(): Promise<Product[]> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProducts;
}

export async function getSales(): Promise<Sale[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSales;
}

export async function getCustomers(): Promise<Customer[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCustomers;
}

export async function getOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockOrders;
}

export async function getProduct(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProducts.find(p => p._id === id) || null;
}

export async function getSale(id: string): Promise<Sale | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSales.find(s => s._id === id) || null;
}

export async function getCustomer(id: string): Promise<Customer | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCustomers.find(c => c._id === id) || null;
}

export async function getOrder(id: string): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockOrders.find(o => o._id === id) || null;
}

// Dashboard stats
export async function getDashboardStats() {
  const products = await getProducts();
  const sales = await getSales();
  const customers = await getCustomers();
  const orders = await getOrders();

  return {
    totalProducts: products.length,
    totalSales: sales.length,
    totalCustomers: customers.length,
    totalOrders: orders.length,
  };
}
