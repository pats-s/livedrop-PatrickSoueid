

console.log('🔄 Starting server...');
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
// Import route modules
import customersRouter from './routes/customers.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import analyticsRouter from './routes/analytics.js';
import dashboardRouter from './routes/dashboard.js';
import { orderStatusStream } from './sse/order-status.js';
import assistantRouter from './routes/assistant.js';
import adminRoutes from './routes/admin.js';


console.log('✅ Imports loaded successfully');

// Load environment variables
dotenv.config();
console.log('✅ Environment variables loaded');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PUBLIC_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Shoplite API',
    version: '1.0.0'
  });
});

// Basic test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api/admin', adminRoutes);



app.get('/api/orders/:id/stream', orderStatusStream);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start server
async function startServer() {
  try {
    console.log('📡 Attempting to start server...');
    
    // Try to connect to MongoDB (optional for now)
    if (process.env.MONGODB_URI) {
      await connectDB();
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️  MongoDB not configured - running without database');
      console.log('   Add MONGODB_URI to .env to enable database');
    }
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('\n🚀 Shoplite API Server');
      console.log('='.repeat(50));
      console.log(`📡 Server running on: ${PUBLIC_URL}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
      console.log('='.repeat(50));
      console.log('\n📍 Available endpoints:');
      console.log(`   GET  /health          - Health check`);
      console.log(`   GET  /api/test        - Test endpoint`);
      console.log('\n✅ Server is ready!\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

console.log('🎬 Calling startServer()...');
startServer().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});