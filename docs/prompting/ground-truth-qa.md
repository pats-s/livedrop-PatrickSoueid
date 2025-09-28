# Shoplite Ground Truth Q&A

## Simple Factual Questions (40% - 8 questions)

### Q01: How do I create a seller account on Shoplite?
**Expected retrieval context:** Document 8: Seller Account Setup and Management
**Authoritative answer:** To create a seller account, visit the Shoplite seller portal, provide business information including legal business name, tax identification numbers, and primary business address. Complete the verification process which typically takes 2-3 business days for domestic sellers and up to 7 business days for international applications.
**Required keywords in LLM response:** ["seller portal", "business information", "verification process", "2-3 business days"]
**Forbidden content:** ["instant approval", "no verification required", "personal accounts only"]

### Q02: How long do items stay in my Shoplite shopping cart?
**Expected retrieval context:** Document 2: Shoplite Shopping Cart Features
**Authoritative answer:** Items remain in the cart for 30 days for logged-in users, or until the browser session ends for guest users. The cart automatically saves quantity selections, product variations, and applicable promotional codes.
**Required keywords in LLM response:** ["30 days", "logged-in users", "browser session", "guest users"]
**Forbidden content:** ["permanent storage", "never expires", "unlimited time"]

### Q03: What payment methods does Shoplite accept?
**Expected retrieval context:** Document 3: Shoplite Payment Methods and Security
**Authoritative answer:** Shoplite accepts all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, digital wallets including PayPal, Apple Pay, Google Pay, Samsung Pay, and installment payment plans through Klarna and Affirm.
**Required keywords in LLM response:** ["credit cards", "PayPal", "Apple Pay", "Google Pay", "Klarna", "Affirm"]
**Forbidden content:** ["cash payments", "cryptocurrency", "bank transfers only"]

### Q04: How long is the standard return window for Shoplite purchases?
**Expected retrieval context:** Document 5: Return and Refund Policies
**Authoritative answer:** Most items can be returned within 30 days of delivery for a full refund, provided they remain in original condition. The return window extends to 60 days for Shoplite Premium members and during holiday seasons.
**Required keywords in LLM response:** ["30 days", "full refund", "original condition", "60 days", "Premium members"]
**Forbidden content:** ["90 days", "no time limit", "lifetime returns"]

### Q05: What verification is required during Shoplite user registration?
**Expected retrieval context:** Document 1: Shoplite User Registration Process
**Authoritative answer:** All new accounts must verify their email address within 24 hours of registration by clicking a verification link sent to their provided email. Users receive a welcome package with a $10 discount code after verification.
**Required keywords in LLM response:** ["email verification", "24 hours", "verification link", "$10 discount"]
**Forbidden content:** ["phone verification required", "instant access", "no verification needed"]

### Q06: How does Shoplite ensure payment security?
**Expected retrieval context:** Document 3: Shoplite Payment Methods and Security
**Authoritative answer:** Payment security is maintained through industry-standard SSL encryption and PCI DSS compliance. All credit card information is tokenized and never stored on Shoplite servers, with 3D Secure authentication for international transactions.
**Required keywords in LLM response:** ["SSL encryption", "PCI DSS compliance", "tokenized", "3D Secure"]
**Forbidden content:** ["credit cards stored", "no encryption", "unsecured payments"]

### Q07: What languages is Shoplite customer support available in?
**Expected retrieval context:** Document 10: Customer Support Procedures
**Authoritative answer:** Customer support is available in multiple languages including English, Spanish, French, German, and Japanese, operating 24/7 with average response times under 2 hours for urgent issues.
**Required keywords in LLM response:** ["English", "Spanish", "French", "German", "Japanese", "24/7"]
**Forbidden content:** ["English only", "business hours only", "limited language support"]

### Q08: Can sellers respond to customer reviews on Shoplite?
**Expected retrieval context:** Document 7: Product Reviews and Ratings
**Authoritative answer:** Sellers cannot alter or delete customer reviews, though they can respond to feedback professionally to address concerns or provide clarifications. Only verified purchasers can leave reviews.
**Required keywords in LLM response:** ["cannot alter", "cannot delete", "respond professionally", "verified purchasers"]
**Forbidden content:** ["sellers can edit reviews", "sellers can remove reviews", "anyone can review"]

## Complex Multi-Document Questions (60% - 12 questions)

### Q09: What are Shoplite's return policies and how do I track my order status?
**Expected retrieval context:** Document 5: Return and Refund Policies + Document 4: Order Tracking and Delivery
**Authoritative answer:** Items can be returned within 30 days of delivery (60 days for Premium members) in original condition. Order tracking is available through your account dashboard with real-time updates from order confirmation through delivery. Customers receive SMS and email notifications at major milestones.
**Required keywords in LLM response:** ["30 days", "60 days Premium", "account dashboard", "real-time updates", "SMS notifications"]
**Forbidden content:** ["no tracking available", "no returns accepted", "lifetime returns"]

### Q10: How do I register as a seller and what payment methods will my customers be able to use?
**Expected retrieval context:** Document 8: Seller Account Setup and Management + Document 3: Shoplite Payment Methods and Security
**Authoritative answer:** Create a seller account through the seller portal with business information and tax ID, completing verification in 2-3 business days. Your customers can pay using credit cards, PayPal, Apple Pay, Google Pay, and installment plans through Klarna and Affirm.
**Required keywords in LLM response:** ["seller portal", "business information", "2-3 business days", "credit cards", "PayPal", "installment plans"]
**Forbidden content:** ["instant seller approval", "cash payments accepted", "limited payment options"]

### Q11: What security measures protect both my account registration and payment information?
**Expected retrieval context:** Document 1: Shoplite User Registration Process + Document 3: Shoplite Payment Methods and Security
**Authoritative answer:** Account security includes email verification within 24 hours, optional two-factor authentication, and social login options. Payment security uses SSL encryption, PCI DSS compliance, tokenized credit card storage, and 3D Secure authentication for international transactions.
**Required keywords in LLM response:** ["email verification", "two-factor authentication", "SSL encryption", "tokenized storage", "3D Secure"]
**Forbidden content:** ["no security measures", "passwords stored plainly", "unsecured registration"]

### Q12: How do customer reviews work and what support options are available if I have issues?
**Expected retrieval context:** Document 7: Product Reviews and Ratings + Document 10: Customer Support Procedures
**Authoritative answer:** Only verified purchasers can leave five-star reviews with photos/videos. Sellers can respond but cannot alter reviews. Support is available 24/7 through live chat, phone, email, and self-service Help Center with response times under 2 hours for urgent issues.
**Required keywords in LLM response:** ["verified purchasers", "five-star reviews", "cannot alter", "24/7 support", "live chat", "2 hours"]
**Forbidden content:** ["anyone can review", "sellers control reviews", "limited support hours"]

### Q13: What mobile app features are available and how do they integrate with the web shopping cart?
**Expected retrieval context:** Document 9: Mobile App Features + Document 2: Shoplite Shopping Cart Features
**Authoritative answer:** The mobile app includes barcode scanning, camera search, location-based deals, and biometric authentication. Shopping cart synchronization ensures seamless transitions between mobile and desktop - items added on mobile appear on desktop and vice versa, with 30-day storage for logged-in users.
**Required keywords in LLM response:** ["barcode scanning", "camera search", "cart synchronization", "mobile and desktop", "30-day storage"]
**Forbidden content:** ["no mobile features", "separate mobile cart", "no synchronization"]

### Q14: How do I search for products and what happens if I need to return an item I found?
**Expected retrieval context:** Document 6: Product Search and Filtering + Document 5: Return and Refund Policies
**Authoritative answer:** Use natural language queries, image searches, or detailed filters by price, seller, brand, and category. Sort by relevance, price, or ratings. Returns are accepted within 30 days in original condition, with free return shipping for defective items and prepaid labels available through your account dashboard.
**Required keywords in LLM response:** ["natural language", "image searches", "detailed filters", "30 days", "original condition", "prepaid labels"]
**Forbidden content:** ["basic search only", "no return options", "paid returns always"]

### Q15: What delivery options are available and what should I do if there are delivery problems?
**Expected retrieval context:** Document 4: Order Tracking and Delivery + Document 10: Customer Support Procedures
**Authoritative answer:** Delivery options include economy (5-7 days), standard (3-5 days), expedited (1-2 days), and same-day in metro areas. If delivery issues occur, Shoplite's resolution team works with carriers and provides full refunds for lost shipments. Contact 24/7 support for assistance.
**Required keywords in LLM response:** ["economy shipping", "standard shipping", "same-day delivery", "resolution team", "full refunds", "24/7 support"]
**Forbidden content:** ["single delivery option", "no delivery guarantee", "no problem resolution"]

### Q16: How do I become a seller and what tools will I have access to for managing reviews and customer communication?
**Expected retrieval context:** Document 8: Seller Account Setup and Management + Document 7: Product Reviews and Ratings + Document 10: Customer Support Procedures
**Authoritative answer:** Complete seller verification with business information (2-3 days processing), then access the Seller Dashboard with inventory management, order processing, and analytics. You can respond to customer reviews professionally but cannot alter them. Use mobile app for on-the-go order notifications and customer message responses.
**Required keywords in LLM response:** ["seller verification", "Seller Dashboard", "inventory management", "respond to reviews", "cannot alter", "mobile app"]
**Forbidden content:** ["instant seller access", "full review control", "desktop only management"]

### Q17: What security features protect my mobile app usage and how does payment processing work on mobile?
**Expected retrieval context:** Document 9: Mobile App Features + Document 3: Shoplite Payment Methods and Security
**Authoritative answer:** Mobile security includes biometric authentication (fingerprint/face recognition), secure payment processing, and automatic logout. Mobile payments integrate with device wallets (Apple Pay, Google Pay) and support all standard payment methods with SSL encryption and tokenized storage.
**Required keywords in LLM response:** ["biometric authentication", "secure payment processing", "device wallets", "SSL encryption", "tokenized storage"]
**Forbidden content:** ["no mobile security", "unsecured mobile payments", "limited payment options"]

### Q18: How do I register an account, verify it, and start shopping with the mobile app?
**Expected retrieval context:** Document 1: Shoplite User Registration Process + Document 9: Mobile App Features + Document 2: Shoplite Shopping Cart Features
**Authoritative answer:** Register at shoplite.com/register or through the mobile app with email and password, verify within 24 hours to receive a $10 discount. The mobile app offers personalized recommendations, barcode scanning, and synchronized shopping cart that preserves items for 30 days across devices.
**Required keywords in LLM response:** ["email verification", "24 hours", "$10 discount", "personalized recommendations", "synchronized cart", "30 days"]
**Forbidden content:** ["no verification needed", "app-only registration", "separate mobile account"]

### Q19: What search and filtering options are available, and how do customer reviews help with product selection?
**Expected retrieval context:** Document 6: Product Search and Filtering + Document 7: Product Reviews and Ratings
**Authoritative answer:** Search supports natural language, model numbers, and image uploads with filters for price, seller ratings, shipping speed, and category-specific options. Customer reviews include five-star ratings, photos/videos, and category-specific ratings for quality, value, shipping, and seller communication from verified purchasers only.
**Required keywords in LLM response:** ["natural language", "image uploads", "seller ratings", "five-star ratings", "photos/videos", "verified purchasers"]
**Forbidden content:** ["basic search only", "unverified reviews", "no visual content"]

### Q20: How do checkout and payment work, and what support is available if I have payment or order issues?
**Expected retrieval context:** Document 2: Shoplite Shopping Cart Features + Document 3: Shoplite Payment Methods and Security + Document 10: Customer Support Procedures
**Authoritative answer:** Checkout includes address selection, payment method choice (credit cards, PayPal, digital wallets, installments), and order review with promotional codes. Payments use SSL encryption and tokenization. Support is available 24/7 via live chat, phone, and email with under 2-hour response times for urgent payment issues.
**Required keywords in LLM response:** ["address selection", "payment method choice", "promotional codes", "SSL encryption", "24/7 support", "2-hour response"]
**Forbidden content:** ["limited payment options", "unsecured checkout", "business hours support only"]
