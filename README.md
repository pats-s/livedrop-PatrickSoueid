# livedrop-PatrickSoueid

Graph link:https://excalidraw.com/#json=1th_mykh4zpAHSd7SaAJG,wdJ9CC_CvcJumZZ4Qj-a_g
1.	Database Design
•	User tables:
Containing id, email for notifications and personal information.
•	Stores:
To separate the sellers from the user also got email to send notifications and we can add some other info about the store
•	Follows:
Represent the follow/unfollow relationship and it can be sharded to handle uses with millions of followers.
•	Products table:
It holds information about the products. (price, store…)
•	Drops table:
A drop is a limited time offer so it got start date and end date.
The stock_available is to ensure no overselling will happen. We use atomic sql updates 
•	Orders table:
A table to keep track of the orders ordered by users, price of the total order, status of the order, and from which store. (store id)
•	Order_items table:
This table is for each product in the order.
•	Idempotency_keys:
This table in order not to create duplicate orders. It saves each order with an id. And there is a cron job to empty the table depending on how long retries could happen


2.	System Design
•	The clients first talks with a single api gateway. I chose the graphql because one of the requirements was that the api should be suitable for different clients (web, mobile)
•	After authentication the client can access the core services
•	All of the core services will communicate with the database for crud operations and also there is a redis (cache) between the core services and the database for fast retrievals of frequently accessed views.
•	The core services will get back to the client through the API.
•	The services can communicate within each other using RPC.
•	When a payment is done or when there is a drop change regarding a store that the user follows, a notification is sent to the user.
•	For the catalog service where the user can browse products, the images of the products are saved in a blob storage, when a client request an image, if the image is not available in the CDN, the CDN will get it from the blob storage.
•	For the database operations we will execute atomic queries, instead of checking for the available items and then updating the table, we check and update in the same query while the table get locked automatically.
•	The table of the follows is sharded by user so the queries for the user’s followers that has a lot of followers will be fast.
•	We can use cursor based pagination for the catalog service.
