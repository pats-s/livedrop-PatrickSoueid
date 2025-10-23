import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../db.js';

const router = express.Router();

// GET /api/customers?email=user@example.com
// Find customer by email (for user identification)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: 'Email parameter is required',
        example: '/api/customers?email=demo@example.com'
      });
    }

    const customer = await collections.customers().findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
        email: email
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// GET /api/customers/:id
// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid customer ID format' });
    }

    const customer = await collections.customers().findOne({ 
      _id: new ObjectId(id) 
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

export default router;