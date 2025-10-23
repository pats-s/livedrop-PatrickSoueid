import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let client = null;

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.log('⚠️  MONGODB_URI not defined - database features will be unavailable');
      return null;
    }

    console.log('📦 Connecting to MongoDB Atlas...');
    
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    
    db = client.db('shoplite');
    
    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log(`📊 Database: ${db.databaseName}`);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database');
    return null;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Please set up MongoDB Atlas.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Collections helper functions
export function getCollection(collectionName) {
  return getDB().collection(collectionName);
}

export const collections = {
  customers: () => getCollection('customers'),
  products: () => getCollection('products'),
  orders: () => getCollection('orders'),
};