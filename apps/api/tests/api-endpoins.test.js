import request from 'supertest';
import express from 'express';

// Mock app setup
const app = express();
app.use(express.json());

describe('API Endpoints', () => {
  
  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request('http://localhost:3000')
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('Products API', () => {
    test('GET /api/products should return products', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/products')
        .expect(200);
      
      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    test('GET /api/products with search should filter', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/products?search=headphones')
        .expect(200);
      
      expect(response.body).toHaveProperty('products');
    });
  });

  describe('Customers API', () => {
    test('GET /api/customers with email should return customer', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/customers?email=demo@example.com')
        .expect(200);
      
      expect(response.body).toHaveProperty('email');
    });
  });

  describe('Orders API', () => {
  test('POST /api/orders should create order', async () => {
    // First get a real customer
    const customerRes = await request('http://localhost:3000')
      .get('/api/customers?email=demo@example.com')
      .expect(200);
    
    const customer = customerRes.body;

    // Get a real product
    const productsRes = await request('http://localhost:3000')
      .get('/api/products?limit=1')
      .expect(200);
    
    const product = productsRes.body.products[0];

    // Create order with real data
    const orderData = {
      customerId: customer._id,
      customerEmail: customer.email,
      items: [{
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      }],
      total: product.price
    };

    const response = await request('http://localhost:3000')
      .post('/api/orders')
      .send(orderData)
      .expect(201);
    
    expect(response.body).toHaveProperty('order');
    expect(response.body.order).toHaveProperty('orderId');
  });
});

  describe('Assistant API', () => {
    test('POST /api/assistant/chat should return response', async () => {
      const response = await request('http://localhost:3000')
        .post('/api/assistant/chat')
        .send({ message: 'Hello' })
        .expect(200);
      
      expect(response.body).toHaveProperty('text');
      expect(response.body).toHaveProperty('intent');
    });
  });

  describe('Admin API', () => {
    test('GET /api/admin/metrics should return metrics', async () => {
      const response = await request('http://localhost:3000')
        .get('/api/admin/metrics')
        .expect(200);
      
      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('totalCustomers');
    });
  });
});