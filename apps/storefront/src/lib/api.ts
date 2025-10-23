export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Customers
export async function getCustomerByEmail(email: string) {
  const res = await fetch(`${API_URL}/customers?email=${email}`);
  if (!res.ok) throw new Error('Customer not found');
  return res.json();
}

// Products
export async function getProducts(params?: {
  search?: string;
  category?: string;
  tag?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.tag) query.set('tag', params.tag);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.order) query.set('order', params.order);
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  
  const res = await fetch(`${API_URL}/products?${query}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Alias functions for backward compatibility
export const listProducts = getProducts;
export const searchProducts = (query: string) => getProducts({ search: query });
export const filterByTag = (tag: string) => getProducts({ tag });
export const sortByPrice = (order: 'asc' | 'desc') => getProducts({ sort: 'price', order });

// Get all unique tags (client-side - fetch all products and extract tags)
export async function getAllTags(): Promise<string[]> {
  const response = await getProducts({ limit: 100 });
  const allTags = new Set<string>();
  response.products.forEach((p: Product) => {
    p.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags);
}

export async function getProductById(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

// Orders
export async function createOrder(data: {
  customerId: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

export async function getOrderById(id: string) {
  const res = await fetch(`${API_URL}/orders/${id}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function getCustomerOrders(email: string) {
  const res = await fetch(`${API_URL}/orders?customerEmail=${email}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

// Assistant
export async function chatWithAssistant(message: string) {
  const res = await fetch(`${API_URL}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Assistant error');
  return res.json();
}