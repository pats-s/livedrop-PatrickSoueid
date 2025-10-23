import express from 'express';
import { getDB } from '../db.js';  // ← Fixed: getDB (capital B)
import { getMetrics } from '../assistant/metrics.js';

const router = express.Router();

router.get('/metrics', async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    
    const now = new Date();
    let startDate = new Date(0);
    
    if (range === '24h') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    const db = getDB();
    
    // Business metrics
    const orders = await db.collection('orders')
      .find({ createdAt: { $gte: startDate } })
      .toArray();
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const totalCustomers = await db.collection('customers').countDocuments();
    
    // Assistant metrics
    const assistantMetrics = getMetrics();
    
    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      ...assistantMetrics
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.get('/metrics/stream', (req, res) => {
  const { range = '7d' } = req.query;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.write(': connected\n\n');
  console.log('[Admin SSE] Client connected');

  // Send metrics every 2 seconds
  const sendMetrics = async () => {
    try {
      const now = new Date();
      let startDate = new Date(0);
      
      if (range === '24h') {
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (range === '7d') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (range === '30d') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      const db = getDB();
      const orders = await db.collection('orders')
        .find({ createdAt: { $gte: startDate } })
        .toArray();
      
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const totalCustomers = await db.collection('customers').countDocuments();
      const assistantMetrics = getMetrics();
      
      const data = {
        totalRevenue,
        totalOrders,
        totalCustomers,
        avgOrderValue,
        ...assistantMetrics
      };

      res.write(`event: metrics\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('[Admin SSE] Error:', error);
    }
  };

  // Send immediately
  sendMetrics();

  // Then send every 2 seconds
  const interval = setInterval(sendMetrics, 2000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(interval);
    console.log('[Admin SSE] Client disconnected');
  });
});

export default router;