import { ObjectId } from 'mongodb';
import { collections } from '../db.js';
import { trackConnection } from '../assistant/metrics.js';
console.log('[SSE] trackConnection imported:', typeof trackConnection);


// Track active SSE connections for monitoring
export const activeConnections = new Set();

/**
 * SSE endpoint for real-time order status updates
 * Automatically simulates status progression for testing
 */
export async function orderStatusStream(req, res) {
  const { id } = req.params;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.write(': connected\n\n');

  console.log(`[SSE] Client connected for order: ${id}`);
  activeConnections.add(res);
  trackConnection(1);

  let cleanedUp = false;  // ← ADD FLAG

  function cleanup() {
    if (cleanedUp) return;  // ← PREVENT DOUBLE CLEANUP
    cleanedUp = true;
    
    activeConnections.delete(res);
    trackConnection(-1);
    res.end();
    console.log(`[SSE] Connection closed for order: ${id}`);
  }

  try {
    let order;
    if (ObjectId.isValid(id)) {
      order = await collections.orders().findOne({ _id: new ObjectId(id) });
    }
    if (!order) {
      order = await collections.orders().findOne({ orderId: id });
    }

    if (!order) {
      sendSSE(res, 'error', { message: 'Order not found' });
      cleanup();
      return;
    }

    sendSSE(res, 'status', {
      orderId: order.orderId,
      status: order.status,
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      updatedAt: order.updatedAt
    });

    if (order.status === 'DELIVERED') {
      console.log(`[SSE] Order ${id} already delivered, closing connection`);
      sendSSE(res, 'complete', { message: 'Order delivered' });
      cleanup();
      return;
    }

    await simulateOrderProgress(res, order);
    cleanup();

  } catch (error) {
    console.error('[SSE] Error:', error);
    sendSSE(res, 'error', { message: 'Internal server error' });
    cleanup();
  }

  req.on('close', () => {
    console.log(`[SSE] Client disconnected for order: ${id}`);
    cleanup();
  });
}

/**
 * Simulate order status progression for testing
 * In production, this would be triggered by real fulfillment events
 */
async function simulateOrderProgress(res, order) {
  const statusFlow = {
    'PENDING': { next: 'PROCESSING', delay: 3000 },
    'PROCESSING': { next: 'SHIPPED', delay: 5000 },
    'SHIPPED': { next: 'DELIVERED', delay: 5000 }
  };

  let currentStatus = order.status;

  while (currentStatus !== 'DELIVERED') {
    const nextStep = statusFlow[currentStatus];
    
    if (!nextStep) {
      console.log(`[SSE] Unknown status: ${currentStatus}`);
      break;
    }

    // Wait before transitioning
    await sleep(nextStep.delay);

    // Update status in database
    currentStatus = nextStep.next;
    const updatedAt = new Date();

    await collections.orders().updateOne(
      { _id: order._id },
      { 
        $set: { 
          status: currentStatus,
          updatedAt: updatedAt
        } 
      }
    );

    console.log(`[SSE] Order ${order.orderId} → ${currentStatus}`);

    // Send update to client
    sendSSE(res, 'status', {
      orderId: order.orderId,
      status: currentStatus,
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      updatedAt: updatedAt
    });

    // If delivered, send completion event
    if (currentStatus === 'DELIVERED') {
      console.log(`[SSE] Order ${order.orderId} delivered, closing stream`);
      sendSSE(res, 'complete', { 
        message: 'Order has been delivered',
        orderId: order.orderId
      });
      break;
    }
  }
}

/**
 * Send SSE message to client
 */
function sendSSE(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Promise-based sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get count of active SSE connections (for monitoring)
 */
export function getActiveConnectionCount() {
  return activeConnections.size;
}