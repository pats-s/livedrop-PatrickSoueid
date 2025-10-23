import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../db.js';

const router = express.Router();

// Helper function to generate order ID
function generateOrderId() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

// POST /api/orders
// Create new order
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      customerEmail,
      items = [],
      total
    } = req.body;

    // Validation
    if (!customerId || !customerEmail || items.length === 0 || !total) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['customerId', 'customerEmail', 'items', 'total']
      });
    }

    if (!ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID format' });
    }

    // Verify customer exists
    const customer = await collections.customers().findOne({
      _id: new ObjectId(customerId)
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          error: 'Invalid item format',
          required: ['productId', 'name', 'price', 'quantity']
        });
      }

      if (!ObjectId.isValid(item.productId)) {
        return res.status(400).json({ 
          error: 'Invalid product ID format',
          productId: item.productId 
        });
      }
    }

    // Create order
    const carriers = ['DHL Express', 'FedEx', 'Aramex', 'LibanPost'];
    const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
    
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const order = {
      orderId: generateOrderId(),
      customerId: new ObjectId(customerId),
      customerEmail: customerEmail.toLowerCase().trim(),
      items: items.map(item => ({
        productId: new ObjectId(item.productId),
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
      })),
      total: parseFloat(total),
      status: 'PENDING',
      carrier: randomCarrier,
      trackingNumber: `${randomCarrier.split(' ')[0].toUpperCase()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: estimatedDelivery,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collections.orders().insertOne(order);

    res.status(201).json({
      message: 'Order created successfully',
      order: { _id: result.insertedId, ...order }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/:id
// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by orderId (string) or _id (ObjectId)
    let order;
    
    if (ObjectId.isValid(id)) {
      order = await collections.orders().findOne({ _id: new ObjectId(id) });
    }
    
    if (!order) {
      order = await collections.orders().findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET /api/orders?customerId=xxx or ?customerEmail=xxx
// Get orders for a specific customer
router.get('/', async (req, res) => {
  try {
    const { customerId, customerEmail } = req.query;

    if (!customerId && !customerEmail) {
      return res.status(400).json({
        error: 'customerId or customerEmail parameter is required',
        examples: [
          '/api/orders?customerId=507f1f77bcf86cd799439011',
          '/api/orders?customerEmail=demo@example.com'
        ]
      });
    }

    let filter = {};

    if (customerId) {
      if (!ObjectId.isValid(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID format' });
      }
      filter.customerId = new ObjectId(customerId);
    } else if (customerEmail) {
      filter.customerEmail = customerEmail.toLowerCase().trim();
    }

    const orders = await collections.orders()
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;