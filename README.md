# livedrop-PatrickSoueid

Graph link: https://excalidraw.com/#json=I6iOp3UiX07o0ujFuqVHM,A1U5ZnniPbZRk17vu6hjfg

## 1. Database Design

- **User tables**: Containing id, email for notifications and personal information.  
- **Stores**: To separate the sellers from the user; also has email to send notifications and other store info.  
- **Follows**: Represents the follow/unfollow relationship and can be sharded to handle users with millions of followers.  
- **Products table**: Holds information about the products (price, store…).  
- **Drops table**: A drop is a limited time offer with start date and end date. The `stock_available` ensures no overselling (atomic SQL updates).  
- **Orders table**: Tracks orders by users, total price, status, and store id.  
- **Order_items table**: Stores each product in the order.  
- **Idempotency_keys**: Prevents duplicate orders; stores each order id. A cron job clears it depending on retry policy.  

## 2. System Design

- The client first talks with a single API gateway. I chose GraphQL because one requirement was that the API should be suitable for different clients (web, mobile).  
- After authentication, the client can access the core services.  
- All core services communicate with the database for CRUD operations, and a Redis cache sits between them for fast retrievals of frequently accessed views.  
- Core services respond back to the client through the API.  
- Services communicate with each other using RPC.  
- When a payment is done or when there is a drop change in a store that the user follows, a notification is sent to the user.  
- For the catalog service (where users browse products), product images are saved in blob storage. If not available in the CDN, the CDN fetches them from blob storage.  
- Database operations use atomic queries (check & update in the same query with automatic table locking).  
- The `follows` table is sharded by user to handle queries for users with many followers efficiently.  
- Cursor-based pagination is used for the catalog service.  
