
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
  stockQty: number;
  description: string;
}

export interface OrderStatus {
  orderId: string;
  status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered';
  placedAt: string;
  estimatedDelivery?: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  placedAt: string;
}

let productsCache: Product[] | null = null;
const ordersCache = new Map<string, OrderStatus>();


export async function listProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;
  
  const response = await fetch('/mock-catalog.json');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  productsCache = await response.json();
  return productsCache as Product[];
}


export async function getProduct(id: string): Promise<Product | null> {
  const products = await listProducts();
  return products.find(p => p.id === id) || null;
}


export async function searchProducts(query: string): Promise<Product[]> {
  const products = await listProducts();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return products;
  
  return products.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}


export async function filterByTag(tag: string): Promise<Product[]> {
  const products = await listProducts();
  return products.filter(p => p.tags.includes(tag));
}


export async function getAllTags(): Promise<string[]> {
  const products = await listProducts();
  const tagSet = new Set<string>();
  products.forEach(p => p.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}


export function sortByPrice(products: Product[], direction: 'asc' | 'desc'): Product[] {
  return [...products].sort((a, b) => 
    direction === 'asc' ? a.price - b.price : b.price - a.price
  );
}


export async function getRelatedProducts(productId: string, limit: number = 3): Promise<Product[]> {
  const product = await getProduct(productId);
  if (!product) return [];
  
  const products = await listProducts();
  
  const scored = products
    .filter(p => p.id !== productId)
    .map(p => ({
      product: p,
      score: p.tags.filter(tag => product.tags.includes(tag)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
  
  return scored;
}


export async function placeOrder(items: CartItem[]): Promise<Order> {
  const orderId = generateOrderId();
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal; // No tax for now
  const placedAt = new Date().toISOString();
  
  const status: OrderStatus = {
    orderId,
    status: 'Placed',
    placedAt,
    estimatedDelivery: getEstimatedDelivery(5),
  };
  
  ordersCache.set(orderId, status);
  
  setTimeout(() => updateOrderStatus(orderId), 5000);
  
  return {
    orderId,
    items,
    subtotal,
    total,
    placedAt,
  };
}


export async function getOrderStatus(orderId: string): Promise<OrderStatus | null> {
  if (ordersCache.has(orderId)) {
    return ordersCache.get(orderId)!;
  }
  
  if (isValidOrderId(orderId)) {
    const mockStatus = generateMockOrderStatus(orderId);
    ordersCache.set(orderId, mockStatus);
    return mockStatus;
  }
  
  return null;
}


function isValidOrderId(id: string): boolean {
  return /^[A-Z0-9]{10,}$/.test(id);
}


function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'ORD';
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}


function getEstimatedDelivery(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}


function generateMockOrderStatus(orderId: string): OrderStatus {
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const statuses: OrderStatus['status'][] = ['Placed', 'Packed', 'Shipped', 'Delivered'];
  const statusIndex = hash % statuses.length;
  const status = statuses[statusIndex];
  
  const daysAgo = (hash % 10) + 1;
  const placedDate = new Date();
  placedDate.setDate(placedDate.getDate() - daysAgo);
  
  const baseStatus: OrderStatus = {
    orderId,
    status,
    placedAt: placedDate.toISOString(),
  };
  
  if (status === 'Shipped' || status === 'Delivered') {
    baseStatus.carrier = hash % 2 === 0 ? 'UPS' : 'FedEx';
    baseStatus.trackingNumber = `1Z${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    baseStatus.estimatedDelivery = status === 'Delivered' 
      ? placedDate.toISOString()
      : getEstimatedDelivery(2);
  } else {
    baseStatus.estimatedDelivery = getEstimatedDelivery(5);
  }
  
  return baseStatus;
}


function updateOrderStatus(orderId: string): void {
  const current = ordersCache.get(orderId);
  if (!current) return;
  
  const progression: Record<OrderStatus['status'], OrderStatus['status'] | null> = {
    'Placed': 'Packed',
    'Packed': 'Shipped',
    'Shipped': 'Delivered',
    'Delivered': null,
  };
  
  const nextStatus = progression[current.status];
  if (nextStatus) {
    const updated: OrderStatus = {
      ...current,
      status: nextStatus,
    };
    
    if (nextStatus === 'Shipped') {
      updated.carrier = 'UPS';
      updated.trackingNumber = `1Z${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      updated.estimatedDelivery = getEstimatedDelivery(2);
    }
    
    ordersCache.set(orderId, updated);
    
    if (nextStatus !== 'Delivered') {
      setTimeout(() => updateOrderStatus(orderId), 10000);
    }
  }
}