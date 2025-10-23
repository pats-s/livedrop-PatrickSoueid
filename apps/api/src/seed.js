import { connectDB, getDB, closeDB } from './db.js';
import { customers, products } from './seedData.js';

// Helper function to generate order ID
function generateOrderId(index) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  return `ORD-${dateStr}-${String(index).padStart(3, '0')}`;
}

// Helper to get random item from array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to get random items
function randomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    await connectDB();
    const db = getDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('customers').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});
    console.log('✅ Existing data cleared\n');
    
    // Insert customers
    console.log('👥 Inserting customers...');
    const customersResult = await db.collection('customers').insertMany(customers);
    const customerIds = Object.values(customersResult.insertedIds);
    console.log(`✅ Inserted ${customerIds.length} customers`);
    console.log(`   Test user: demo@example.com (ID: ${customerIds[0]})\n`);
    
    // Insert products
    console.log('📦 Inserting products...');
    const productsResult = await db.collection('products').insertMany(products);
    const productIds = Object.values(productsResult.insertedIds);
    console.log(`✅ Inserted ${productIds.length} products\n`);
    
    // Generate orders
    console.log('📝 Generating orders...');
    const orders = [];
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const carriers = ['DHL Express', 'FedEx', 'Aramex', 'LibanPost'];
    
    // Create 18 orders (3 for demo user, rest distributed among other customers)
    for (let i = 0; i < 18; i++) {
      // First 3 orders belong to demo user
      const customerId = i < 3 ? customerIds[0] : randomItem(customerIds.slice(1));
      const customer = customers.find((c, idx) => 
        (i < 3 ? idx === 0 : customerIds[idx + 1] === customerId)
      );
      
      // Random 1-3 products per order
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderProducts = randomItems(products, numItems);
      
      const items = orderProducts.map((product, idx) => ({
        productId: productIds[products.indexOf(product)],
        name: product.name,
        price: product.price,
        quantity: Math.floor(Math.random() * 2) + 1
      }));
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Vary order dates over the past 2 months
      const daysAgo = Math.floor(Math.random() * 60);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      
      // Status based on order age
      let status;
      if (daysAgo < 2) status = 'PENDING';
      else if (daysAgo < 5) status = 'PROCESSING';
      else if (daysAgo < 10) status = 'SHIPPED';
      else status = 'DELIVERED';
      
      // Estimated delivery
      const estimatedDelivery = new Date(orderDate);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + (status === 'DELIVERED' ? daysAgo - 5 : 7));
      
      orders.push({
        orderId: generateOrderId(i + 1),
        customerId: customerId,
        customerEmail: customer.email,
        items: items,
        total: Math.round(total * 100) / 100,
        status: status,
        carrier: randomItem(carriers),
        trackingNumber: `${randomItem(carriers).split(' ')[0].toUpperCase()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedDelivery: estimatedDelivery,
        createdAt: orderDate,
        updatedAt: new Date()
      });
    }
    
    // Insert orders
    const ordersResult = await db.collection('orders').insertMany(orders);
    console.log(`✅ Inserted ${orders.length} orders`);
    
    // Show order status distribution
    const statusCount = {};
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    console.log('   Status distribution:', statusCount);
    
    // Show demo user's orders
    const demoOrders = orders.filter(o => o.customerEmail === 'demo@example.com');
    console.log(`\n   Demo user orders: ${demoOrders.length}`);
    demoOrders.forEach(order => {
      console.log(`      - ${order.orderId} (${order.status})`);
    });
    
    // Create indexes for better performance
    console.log('\n📊 Creating indexes...');
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ tags: 1 });
    await db.collection('orders').createIndex({ customerId: 1 });
    await db.collection('orders').createIndex({ customerEmail: 1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    console.log('✅ Indexes created\n');
    
    // Summary
    console.log('=' .repeat(50));
    console.log('🎉 Database seeding complete!\n');
    console.log('📊 Summary:');
    console.log(`   Customers: ${customerIds.length}`);
    console.log(`   Products: ${productIds.length}`);
    console.log(`   Orders: ${orders.length}`);
    console.log('\n⭐ Test user credentials:');
    console.log('   Email: demo@example.com');
    console.log(`   Customer ID: ${customerIds[0]}`);
    console.log(`   Orders: ${demoOrders.length}`);
    console.log('=' .repeat(50));
    console.log('\n👉 Next: Check MongoDB Atlas to see your data!\n');
    
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();