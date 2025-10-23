import express from 'express';
import { collections } from '../db.js';

const router = express.Router();

// GET /api/dashboard/business-metrics
// Get key business metrics for dashboard
router.get('/business-metrics', async (req, res) => {
  try {
    // Use MongoDB aggregation for efficient calculations
    const orderStats = await collections.orders().aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]).toArray();

    const stats = orderStats[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0
    };

    // Get order status breakdown
    const statusBreakdown = await collections.orders().aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Get total customers and products
    const totalCustomers = await collections.customers().countDocuments();
    const totalProducts = await collections.products().countDocuments();

    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await collections.orders().countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      revenue: {
        total: Math.round(stats.totalRevenue * 100) / 100,
        averageOrderValue: Math.round(stats.averageOrderValue * 100) / 100
      },
      orders: {
        total: stats.totalOrders,
        recent: recentOrders,
        byStatus: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      customers: {
        total: totalCustomers
      },
      products: {
        total: totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    res.status(500).json({ error: 'Failed to fetch business metrics' });
  }
});

export default router;