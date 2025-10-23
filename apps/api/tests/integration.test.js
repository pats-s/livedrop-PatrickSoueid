import request from 'supertest';

const API_URL = 'http://localhost:3000';

describe('Integration Tests - End-to-End Workflows', () => {
  
  test('Workflow 1: Complete Shopping Journey', async () => {
    // 1. Browse products
    const productsRes = await request(API_URL)
      .get('/api/products?limit=5')
      .expect(200);
    
    expect(productsRes.body.products.length).toBeGreaterThan(0);
    const product = productsRes.body.products[0];

    // 2. Get customer
    const customerRes = await request(API_URL)
      .get('/api/customers?email=demo@example.com')
      .expect(200);
    
    expect(customerRes.body).toHaveProperty('email');
    const customer = customerRes.body;

    // 3. Create order
    const orderRes = await request(API_URL)
      .post('/api/orders')
      .send({
        customerId: customer._id,
        customerEmail: customer.email,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1
        }],
        total: product.price
      })
      .expect(201);
    
    expect(orderRes.body.order).toHaveProperty('orderId');
    
    // 4. Track order
    const orderId = orderRes.body.order.orderId;
    const trackRes = await request(API_URL)
      .get(`/api/orders/${orderId}`)
      .expect(200);
    
    expect(trackRes.body.orderId).toBe(orderId);
  });

  test('Workflow 2: Customer Support Interaction', async () => {
    // 1. Ask about return policy
    const policyRes = await request(API_URL)
      .post('/api/assistant/chat')
      .send({ message: "What's your return policy?" })
      .expect(200);
    
    expect(policyRes.body.intent).toBe('policy_question');
    expect(policyRes.body.citations.length).toBeGreaterThan(0);

    // 2. Search for products
    const searchRes = await request(API_URL)
      .post('/api/assistant/chat')
      .send({ message: "Do you have wireless headphones?" })
      .expect(200);
    
    expect(searchRes.body.intent).toBe('product_search');
    expect(searchRes.body.functionsCalled).toContain('searchProducts');

    // 3. Check order status
    const statusRes = await request(API_URL)
      .post('/api/assistant/chat')
      .send({ message: "Where is order ORD-20251019-001?" })
      .expect(200);
    
    expect(statusRes.body.intent).toBe('order_status');
  });

  test('Workflow 3: Admin Monitoring', async () => {
    // 1. Get business metrics
    const metricsRes = await request(API_URL)
      .get('/api/admin/metrics?range=7d')
      .expect(200);
    
    expect(metricsRes.body).toHaveProperty('totalRevenue');
    expect(metricsRes.body).toHaveProperty('totalOrders');
    expect(metricsRes.body).toHaveProperty('totalCustomers');

    // 2. Check assistant analytics
    expect(metricsRes.body).toHaveProperty('intentDistribution');
    expect(metricsRes.body).toHaveProperty('avgResponseTime');

    // 3. Verify system performance
    expect(metricsRes.body).toHaveProperty('apiLatency');
    expect(metricsRes.body).toHaveProperty('activeSSEConnections');
    expect(typeof metricsRes.body.activeSSEConnections).toBe('number');
  });
});