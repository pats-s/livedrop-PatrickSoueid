import express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../db.js';

const router = express.Router();

// GET /api/products?search=wireless&category=Electronics&tag=audio&sort=price&order=asc&page=1&limit=20
// List products with filtering, search, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      tag = '',
      sort = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    // Build query filter
    const filter = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by tag
    if (tag) {
      filter.tags = tag;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortField = sort === 'price' ? 'price' : 
                      sort === 'name' ? 'name' : 
                      sort === 'rating' ? 'rating' : 
                      'createdAt';

    // Execute query
    const products = await collections.products()
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Get total count for pagination
    const total = await collections.products().countDocuments(filter);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: {
        search,
        category,
        tag,
        sort,
        order
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await collections.products().findOne({ 
      _id: new ObjectId(id) 
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products (Admin function - for adding new products)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      tags = [],
      imageUrl,
      stock = 0,
      rating = 0,
      reviewCount = 0
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'description', 'price', 'category']
      });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    // Create product
    const product = {
      name,
      description,
      price: parseFloat(price),
      category,
      tags,
      imageUrl: imageUrl || 'https://via.placeholder.com/400',
      stock: parseInt(stock),
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount),
      createdAt: new Date()
    };

    const result = await collections.products().insertOne(product);

    res.status(201).json({
      message: 'Product created successfully',
      productId: result.insertedId,
      product: { _id: result.insertedId, ...product }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default router;