# Shoplite API

Backend API for the Shoplite e-commerce platform.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Real-time:** Server-Sent Events (SSE)
- **AI:** LLM integration via ngrok

## Setup

### 1. Install Dependencies
```bash
cd apps/api
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the following:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `LLM_API_URL` - Your ngrok URL from Week 3 Colab

### 3. Run the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Customers
- `GET /api/customers?email=user@example.com` - Find customer by email
- `GET /api/customers/:id` - Get customer by ID

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders?customerId=:id` - Get customer orders

### Analytics
- `GET /api/analytics/daily-revenue` - Daily revenue data

### Dashboard
- `GET /api/dashboard/business-metrics` - Business KPIs

### Real-time
- `GET /api/orders/:id/stream` - SSE stream for order updates

## Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API
curl http://localhost:3000/api/test
```

## Database Collections

- **customers** - Customer profiles
- **products** - Product catalog
- **orders** - Order history