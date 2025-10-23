/**
 * Function Registry
 * Centralized registry for all assistant functions
 * Provides function calling capabilities for the assistant
 */

import { ObjectId } from 'mongodb';
import { collections } from '../db.js';

/**
 * Function Registry Class
 * Manages registration and execution of assistant functions
 */
class FunctionRegistry {
  constructor() {
    this.functions = new Map();
    this.executionLog = [];  // Track function calls for monitoring
  }

  /**
   * Register a function
   * @param {object} functionDef - Function definition
   */
  register(functionDef) {
    const { name, description, parameters, execute } = functionDef;

    if (!name || !execute) {
      throw new Error('Function must have name and execute method');
    }

    this.functions.set(name, {
      name,
      description: description || '',
      parameters: parameters || {},
      execute
    });

    console.log(`[Function Registry] Registered: ${name}`);
  }

  /**
   * Execute a function by name
   * @param {string} functionName - Name of function to execute
   * @param {object} params - Parameters to pass to function
   * @returns {Promise<object>} - Function result
   */
  async execute(functionName, params = {}) {
    const func = this.functions.get(functionName);

    if (!func) {
      throw new Error(`Function "${functionName}" not found`);
    }

    console.log(`[Function Registry] Executing: ${functionName}`, params);

    const startTime = Date.now();
    
    try {
      // Validate parameters
      this.validateParameters(func.parameters, params);

      // Execute function
      const result = await func.execute(params);

      // Log execution
      const duration = Date.now() - startTime;
      this.logExecution(functionName, params, 'success', duration);

      console.log(`[Function Registry] Success: ${functionName} (${duration}ms)`);

      return {
        success: true,
        data: result,
        functionName
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logExecution(functionName, params, 'error', duration, error.message);

      console.error(`[Function Registry] Error: ${functionName}`, error);

      return {
        success: false,
        error: error.message,
        functionName
      };
    }
  }

  /**
   * Validate function parameters
   */
  validateParameters(schema, params) {
    for (const [paramName, paramDef] of Object.entries(schema)) {
      if (paramDef.required && !params[paramName]) {
        throw new Error(`Missing required parameter: ${paramName}`);
      }

      if (params[paramName] && paramDef.type) {
        const actualType = typeof params[paramName];
        if (actualType !== paramDef.type) {
          throw new Error(`Parameter ${paramName} must be ${paramDef.type}, got ${actualType}`);
        }
      }
    }
  }

  /**
   * Log function execution for monitoring
   */
  logExecution(functionName, params, status, duration, error = null) {
    this.executionLog.push({
      functionName,
      params,
      status,
      duration,
      error,
      timestamp: new Date()
    });

    // Keep only last 100 executions
    if (this.executionLog.length > 100) {
      this.executionLog.shift();
    }
  }

  /**
   * Get all registered functions (for LLM context)
   * @returns {array} - Array of function schemas
   */
  getAllSchemas() {
    return Array.from(this.functions.values()).map(func => ({
      name: func.name,
      description: func.description,
      parameters: func.parameters
    }));
  }

  /**
   * Get execution statistics
   */
  getStats() {
    const total = this.executionLog.length;
    const successful = this.executionLog.filter(log => log.status === 'success').length;
    const failed = total - successful;

    const avgDuration = total > 0
      ? this.executionLog.reduce((sum, log) => sum + log.duration, 0) / total
      : 0;

    const functionCounts = {};
    this.executionLog.forEach(log => {
      functionCounts[log.functionName] = (functionCounts[log.functionName] || 0) + 1;
    });

    return {
      total,
      successful,
      failed,
      avgDuration: Math.round(avgDuration),
      byFunction: functionCounts
    };
  }
}

// Create singleton instance
const registry = new FunctionRegistry();

// ============================================================
// FUNCTION DEFINITIONS
// ============================================================

/**
 * Function 1: Get Order Status
 * Retrieves order details from database
 */
registry.register({
  name: 'getOrderStatus',
  description: 'Get order status, tracking, and delivery information by order ID',
  parameters: {
    orderId: {
      type: 'string',
      required: true,
      description: 'Order ID (e.g., ORD-20251019-ABC123 or #12345)'
    }
  },
  execute: async ({ orderId }) => {
    // Try to find order by orderId or _id
    let order;

    // Try as orderId (string)
    order = await collections.orders().findOne({ orderId: orderId });

    // Try as _id (ObjectId) if valid
    if (!order && ObjectId.isValid(orderId)) {
      order = await collections.orders().findOne({ _id: new ObjectId(orderId) });
    }

    // Try without prefix if it has one (e.g., "ORD-" or "#")
    if (!order) {
      const cleanId = orderId.replace(/^(ORD-|#)/i, '');
      order = await collections.orders().findOne({ orderId: new RegExp(cleanId, 'i') });
    }

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Return relevant information
    return {
      orderId: order.orderId,
      status: order.status,
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
});

/**
 * Function 2: Search Products
 * Searches product catalog by query
 */
registry.register({
  name: 'searchProducts',
  description: 'Search products by name, description, category, or tags',
  parameters: {
    query: {
      type: 'string',
      required: true,
      description: 'Search query (e.g., "wireless headphones", "yoga mat")'
    },
    limit: {
      type: 'number',
      required: false,
      description: 'Maximum number of results (default: 5)'
    }
  },
  execute: async ({ query, limit = 5 }) => {
    // Build search filter
    const searchFilter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    // Search products
    const products = await collections.products()
      .find(searchFilter)
      .limit(Math.min(limit, 10))  // Cap at 10
      .toArray();

    if (products.length === 0) {
      return {
        found: false,
        message: `No products found matching "${query}"`,
        products: []
      };
    }

    // Return simplified product info
    return {
      found: true,
      count: products.length,
      products: products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description.substring(0, 150) + '...',  // Truncate
        price: p.price,
        category: p.category,
        stock: p.stock,
        rating: p.rating,
        imageUrl: p.imageUrl
      }))
    };
  }
});

/**
 * Function 3: Get Customer Orders
 * Retrieves all orders for a customer by email
 */
registry.register({
  name: 'getCustomerOrders',
  description: 'Get all orders for a customer by their email address',
  parameters: {
    email: {
      type: 'string',
      required: true,
      description: 'Customer email address'
    }
  },
  execute: async ({ email }) => {
    // Find all orders for customer
    const orders = await collections.orders()
      .find({ customerEmail: email.toLowerCase().trim() })
      .sort({ createdAt: -1 })  // Most recent first
      .toArray();

    if (orders.length === 0) {
      return {
        found: false,
        message: `No orders found for ${email}`,
        orders: []
      };
    }

    // Return order summaries
    return {
      found: true,
      count: orders.length,
      orders: orders.map(order => ({
        orderId: order.orderId,
        status: order.status,
        total: order.total,
        itemCount: order.items.length,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }))
    };
  }
});

// Export singleton instance
export default registry;

// Export for testing
export { FunctionRegistry };