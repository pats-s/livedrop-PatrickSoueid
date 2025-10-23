// Seed data for Shoplite e-commerce platform

export const customers = [
  {
    name: "Demo User",
    email: "demo@example.com", // ⭐ TEST USER - Document this in README
    phone: "+961 70 123 456",
    address: {
      street: "123 Hamra Street",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1103"
    },
    createdAt: new Date("2025-01-15T10:00:00Z")
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+961 71 234 567",
    address: {
      street: "456 Gemmayzeh Avenue",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1104"
    },
    createdAt: new Date("2025-02-20T14:30:00Z")
  },
  {
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+961 76 345 678",
    address: {
      street: "789 Verdun Street",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1105"
    },
    createdAt: new Date("2025-03-10T09:15:00Z")
  },
  {
    name: "Emma Martinez",
    email: "emma.martinez@email.com",
    phone: "+961 70 456 789",
    address: {
      street: "321 Achrafieh Road",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1106"
    },
    createdAt: new Date("2025-03-25T16:45:00Z")
  },
  {
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+961 71 567 890",
    address: {
      street: "654 Raouche Boulevard",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1107"
    },
    createdAt: new Date("2025-04-05T11:20:00Z")
  },
  {
    name: "Olivia Brown",
    email: "olivia.brown@email.com",
    phone: "+961 76 678 901",
    address: {
      street: "987 Mar Mikhael Street",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1108"
    },
    createdAt: new Date("2025-05-12T13:00:00Z")
  },
  {
    name: "William Taylor",
    email: "william.taylor@email.com",
    phone: "+961 70 789 012",
    address: {
      street: "147 Manara Promenade",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1109"
    },
    createdAt: new Date("2025-06-08T10:30:00Z")
  },
  {
    name: "Sophia Anderson",
    email: "sophia.anderson@email.com",
    phone: "+961 71 890 123",
    address: {
      street: "258 Downtown Street",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1110"
    },
    createdAt: new Date("2025-07-14T15:45:00Z")
  },
  {
    name: "Liam Thomas",
    email: "liam.thomas@email.com",
    phone: "+961 76 901 234",
    address: {
      street: "369 Badaro Avenue",
      city: "Beirut",
      country: "Lebanon",
      postalCode: "1111"
    },
    createdAt: new Date("2025-08-20T12:15:00Z")
  },
  {
    name: "Isabella Garcia",
    email: "isabella.garcia@email.com",
    phone: "+961 70 012 345",
    address: {
      street: "741 Jounieh Highway",
      city: "Jounieh",
      country: "Lebanon",
      postalCode: "2001"
    },
    createdAt: new Date("2025-09-05T09:00:00Z")
  },
  {
    name: "Noah Rodriguez",
    email: "noah.rodriguez@email.com",
    phone: "+961 71 123 456",
    address: {
      street: "852 Tripoli Street",
      city: "Tripoli",
      country: "Lebanon",
      postalCode: "3001"
    },
    createdAt: new Date("2025-09-18T14:20:00Z")
  },
  {
    name: "Ava Martinez",
    email: "ava.martinez@email.com",
    phone: "+961 76 234 567",
    address: {
      street: "963 Sidon Road",
      city: "Sidon",
      country: "Lebanon",
      postalCode: "4001"
    },
    createdAt: new Date("2025-10-01T11:40:00Z")
  }
];

export const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling over-ear headphones with 30-hour battery life, superior sound quality, and comfortable design perfect for travel and daily use.",
    price: 89.99,
    category: "Electronics",
    tags: ["audio", "wireless", "bluetooth", "headphones"],
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 45,
    rating: 4.5,
    reviewCount: 128
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated 32oz water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design with wide mouth for easy cleaning.",
    price: 24.99,
    category: "Sports & Outdoors",
    tags: ["hydration", "insulated", "eco-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    stock: 120,
    rating: 4.7,
    reviewCount: 203
  },
  {
    name: "Yoga Mat with Carrying Strap",
    description: "Extra-thick 6mm yoga mat with non-slip texture. Eco-friendly TPE material, perfect for yoga, pilates, and floor exercises. Includes free carrying strap.",
    price: 34.99,
    category: "Sports & Outdoors",
    tags: ["yoga", "fitness", "exercise"],
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
    stock: 67,
    rating: 4.4,
    reviewCount: 89
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    description: "Professional gaming keyboard with customizable RGB lighting, mechanical blue switches, and programmable macro keys. Anti-ghosting technology for competitive gaming.",
    price: 79.99,
    category: "Electronics",
    tags: ["gaming", "keyboard", "rgb", "mechanical"],
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    stock: 32,
    rating: 4.6,
    reviewCount: 156
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable 100% organic cotton t-shirt. Classic fit, pre-shrunk fabric, available in multiple colors. Perfect for everyday wear.",
    price: 19.99,
    category: "Clothing",
    tags: ["apparel", "cotton", "casual", "organic"],
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    stock: 200,
    rating: 4.3,
    reviewCount: 312
  },
  {
    name: "Portable Phone Charger 20000mAh",
    description: "High-capacity power bank with dual USB ports and fast charging. LED display shows remaining battery. Charges most phones 4-5 times.",
    price: 39.99,
    category: "Electronics",
    tags: ["charging", "portable", "power-bank"],
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
    stock: 88,
    rating: 4.5,
    reviewCount: 178
  },
  {
    name: "Stainless Steel Cookware Set",
    description: "10-piece professional cookware set with glass lids. Oven-safe up to 500°F, dishwasher safe, and compatible with all cooktops including induction.",
    price: 149.99,
    category: "Home & Kitchen",
    tags: ["cookware", "kitchen", "stainless-steel"],
    imageUrl: "https://images.unsplash.com/photo-1584990347449-85e32a7c0cef",
    stock: 28,
    rating: 4.8,
    reviewCount: 94
  },
  {
    name: "LED Desk Lamp with USB Port",
    description: "Adjustable LED desk lamp with 5 brightness levels and 3 color modes. Built-in USB charging port. Eye-caring technology reduces eye strain.",
    price: 29.99,
    category: "Home & Kitchen",
    tags: ["lighting", "desk", "led", "office"],
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    stock: 75,
    rating: 4.4,
    reviewCount: 142
  },
  {
    name: "Running Shoes - Performance Series",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for neutral runners seeking comfort and speed.",
    price: 89.99,
    category: "Sports & Outdoors",
    tags: ["shoes", "running", "athletic"],
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 54,
    rating: 4.6,
    reviewCount: 221
  },
  {
    name: "Coffee Maker with Thermal Carafe",
    description: "12-cup programmable coffee maker with thermal carafe keeps coffee hot for hours. Auto-shutoff feature and pause-and-serve function.",
    price: 69.99,
    category: "Home & Kitchen",
    tags: ["coffee", "appliances", "kitchen"],
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
    stock: 41,
    rating: 4.5,
    reviewCount: 167
  },
  {
    name: "Backpack Laptop Bag 15.6 inch",
    description: "Water-resistant laptop backpack with multiple compartments, USB charging port, and anti-theft design. Perfect for work, school, or travel.",
    price: 44.99,
    category: "Bags & Luggage",
    tags: ["backpack", "laptop", "travel"],
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    stock: 92,
    rating: 4.7,
    reviewCount: 189
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless mouse with adjustable DPI up to 16000, programmable buttons, and RGB lighting. Long-lasting rechargeable battery.",
    price: 49.99,
    category: "Electronics",
    tags: ["gaming", "mouse", "wireless"],
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
    stock: 63,
    rating: 4.6,
    reviewCount: 134
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360° sound, 12-hour battery life, and built-in microphone. Perfect for outdoor adventures and parties.",
    price: 59.99,
    category: "Electronics",
    tags: ["audio", "bluetooth", "speaker", "waterproof"],
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    stock: 78,
    rating: 4.5,
    reviewCount: 156
  },
  {
    name: "Memory Foam Pillow Set (2-Pack)",
    description: "Hypoallergenic memory foam pillows with cooling gel technology. Adjustable loft, removable washable covers. Includes 2 standard-size pillows.",
    price: 54.99,
    category: "Home & Kitchen",
    tags: ["bedding", "pillows", "memory-foam"],
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
    stock: 47,
    rating: 4.7,
    reviewCount: 201
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitor, sleep tracking, GPS, and smartphone notifications. Water-resistant with 7-day battery life.",
    price: 129.99,
    category: "Electronics",
    tags: ["fitness", "smartwatch", "health"],
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
    stock: 36,
    rating: 4.4,
    reviewCount: 298
  },
  {
    name: "Non-Stick Frying Pan Set",
    description: "3-piece non-stick frying pan set (8\", 10\", 12\"). PFOA-free coating, heat-resistant handles, oven-safe up to 400°F. Dishwasher safe.",
    price: 39.99,
    category: "Home & Kitchen",
    tags: ["cookware", "pans", "non-stick"],
    imageUrl: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7",
    stock: 58,
    rating: 4.6,
    reviewCount: 143
  },
  {
    name: "Denim Jacket - Classic Fit",
    description: "Timeless denim jacket with button closure, chest pockets, and adjustable cuffs. Made from durable cotton denim. Available in multiple washes.",
    price: 64.99,
    category: "Clothing",
    tags: ["apparel", "jacket", "denim"],
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
    stock: 73,
    rating: 4.5,
    reviewCount: 167
  },
  {
    name: "Electric Kettle 1.7L",
    description: "Fast-boiling electric kettle with auto shut-off and boil-dry protection. Cordless design with 360° swivel base. Stainless steel interior.",
    price: 34.99,
    category: "Home & Kitchen",
    tags: ["kettle", "appliances", "kitchen"],
    imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
    stock: 65,
    rating: 4.6,
    reviewCount: 189
  },
  {
    name: "Resistance Bands Set",
    description: "Set of 5 resistance bands with different resistance levels, door anchor, handles, and ankle straps. Perfect for home workouts and physical therapy.",
    price: 24.99,
    category: "Sports & Outdoors",
    tags: ["fitness", "resistance-bands", "exercise"],
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc",
    stock: 110,
    rating: 4.7,
    reviewCount: 234
  },
  {
    name: "Sunglasses - Polarized UV Protection",
    description: "Stylish polarized sunglasses with 100% UV protection. Lightweight frame, scratch-resistant lenses. Includes protective case and cleaning cloth.",
    price: 39.99,
    category: "Accessories",
    tags: ["sunglasses", "eyewear", "polarized"],
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    stock: 95,
    rating: 4.5,
    reviewCount: 178
  },
  {
    name: "USB-C Hub 7-in-1",
    description: "Multiport USB-C adapter with HDMI, USB 3.0 ports, SD card reader, and power delivery. Compatible with MacBook, laptops, and tablets.",
    price: 44.99,
    category: "Electronics",
    tags: ["adapter", "usb-c", "hub"],
    imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f",
    stock: 82,
    rating: 4.4,
    reviewCount: 123
  },
  {
    name: "Canvas Tote Bag",
    description: "Durable canvas tote bag with reinforced handles and inner pocket. Eco-friendly reusable shopping bag. Perfect for groceries, books, or beach trips.",
    price: 14.99,
    category: "Bags & Luggage",
    tags: ["bag", "tote", "eco-friendly"],
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    stock: 150,
    rating: 4.6,
    reviewCount: 267
  },
  {
    name: "Scented Candle Gift Set",
    description: "Set of 6 premium scented candles with natural soy wax. Each candle burns for 25-30 hours. Gift-ready packaging with assorted relaxing scents.",
    price: 29.99,
    category: "Home & Kitchen",
    tags: ["candles", "home-decor", "gift"],
    imageUrl: "https://images.unsplash.com/photo-1602874801006-bf290d24a1ca",
    stock: 104,
    rating: 4.8,
    reviewCount: 312
  },
  {
    name: "Hiking Backpack 40L",
    description: "Spacious hiking backpack with ventilated back panel, multiple compartments, rain cover, and hydration system compatibility. Built for adventure.",
    price: 79.99,
    category: "Sports & Outdoors",
    tags: ["backpack", "hiking", "outdoor"],
    imageUrl: "https://images.unsplash.com/photo-1622260614927-d4e4d0c6c165",
    stock: 38,
    rating: 4.7,
    reviewCount: 145
  },
  {
    name: "Wireless Earbuds with Charging Case",
    description: "True wireless earbuds with active noise cancellation, touch controls, and 24-hour battery life with charging case. IPX5 water-resistant.",
    price: 69.99,
    category: "Electronics",
    tags: ["audio", "earbuds", "wireless", "noise-canceling"],
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    stock: 56,
    rating: 4.5,
    reviewCount: 287
  },
  {
    name: "Instant Pot 6 Quart",
    description: "7-in-1 programmable pressure cooker: pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer. Stainless steel pot.",
    price: 99.99,
    category: "Home & Kitchen",
    tags: ["appliances", "pressure-cooker", "kitchen"],
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833379",
    stock: 29,
    rating: 4.9,
    reviewCount: 412
  },
  {
    name: "Plant-Based Protein Powder",
    description: "Organic vegan protein powder with 20g protein per serving. Gluten-free, no artificial sweeteners. Vanilla flavor, 2lb container.",
    price: 34.99,
    category: "Health & Wellness",
    tags: ["protein", "vegan", "supplement"],
    imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f",
    stock: 87,
    rating: 4.4,
    reviewCount: 198
  },
  {
    name: "Mini Projector HD 1080P",
    description: "Portable mini projector with 1080P support, built-in speakers, and multiple connectivity options. Perfect for home entertainment and presentations.",
    price: 119.99,
    category: "Electronics",
    tags: ["projector", "entertainment", "portable"],
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26",
    stock: 22,
    rating: 4.3,
    reviewCount: 156
  },
  {
    name: "Leather Wallet - Minimalist Design",
    description: "Slim genuine leather wallet with RFID blocking technology. Holds 8-10 cards and cash. Elegant design that fits comfortably in any pocket.",
    price: 29.99,
    category: "Accessories",
    tags: ["wallet", "leather", "rfid"],
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    stock: 132,
    rating: 4.6,
    reviewCount: 224
  },
  {
    name: "Air Purifier with HEPA Filter",
    description: "HEPA air purifier removes 99.97% of allergens, dust, and odors. Covers rooms up to 400 sq ft. Quiet operation with 3 fan speeds and timer.",
    price: 139.99,
    category: "Home & Kitchen",
    tags: ["air-purifier", "hepa", "home"],
    imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd",
    stock: 31,
    rating: 4.7,
    reviewCount: 267
  }
];

// Helper function to generate order ID
function generateOrderId(index) {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  return `ORD-${dateStr}-${String(index).padStart(3, '0')}`;
}

// Orders will be generated dynamically in the seed script
// after we have customer and product IDs from the database