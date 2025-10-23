import express from 'express';
import { collections } from '../db.js';

const router = express.Router();

// GET /api/analytics/daily-revenue?from=2025-10-01&to=2025-10-19
// Calculate daily revenue using MongoDB aggregation (NO JavaScript loops!)
router.get('/daily-revenue', async (req, res) => {
  try {
    const { from, to } = req.query;

    // Default to last 30 days if no date range provided
    const endDate = to ? new Date(to) : new Date();
    const startDate = from ? new Date(from) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Set time to start/end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // MongoDB Aggregation Pipeline
    const pipeline = [
      // Match orders in date range
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      // Group by date and calculate metrics
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      },
      // Rename _id to date
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: { $round: ['$revenue', 2] },
          orderCount: 1,
          averageOrderValue: { $round: ['$averageOrderValue', 2] }
        }
      },
      // Sort by date
      {
        $sort: { date: 1 }
      }
    ];

    const dailyRevenue = await collections.orders()
      .aggregate(pipeline)
      .toArray();

    // Calculate totals
    const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = dailyRevenue.reduce((sum, day) => sum + day.orderCount, 0);

    res.json({
      dailyRevenue,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
        dateRange: {
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0]
        }
      }
    });
  } catch (error) {
    console.error('Error calculating daily revenue:', error);
    res.status(500).json({ error: 'Failed to calculate daily revenue' });
  }
});

export default router;