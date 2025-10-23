/**
 * Assistant API Routes
 */

import express from 'express';
import { handleQuery } from '../assistant/engine.js';

const router = express.Router();

/**
 * POST /api/assistant/chat
 * Main assistant endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required',
        example: { message: "What's your return policy?" }
      });
    }

    console.log(`[Assistant API] Received: "${message}"`);

    // Process query
    const result = await handleQuery(message, context);

    res.json(result);
  } catch (error) {
    console.error('[Assistant API] Error:', error);
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message
    });
  }
});

/**
 * GET /api/assistant/health
 * Check assistant status
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Shoplite Assistant',
    timestamp: new Date().toISOString()
  });
});

export default router;