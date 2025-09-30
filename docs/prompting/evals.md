# RAG System Evaluation

## Retrieval Quality Tests (10 tests)
| Test ID | Question | Expected Documents | Pass Criteria |
|---------|----------|-------------------|---------------|
| R01 | How do I create a seller account on Shoplite? | Document 8: Seller Account Setup and Management | Retrieved docs contain Document 8 |
| R02 | How long do items stay in my Shoplite shopping cart? | Document 2: Shoplite Shopping Cart Features | Retrieved docs contain Document 2 |
| R03 | What payment methods does Shoplite accept? | Document 3: Shoplite Payment Methods and Security | Retrieved docs contain Document 3 |
| R04 | How long is the standard return window for purchases? | Document 5: Return and Refund Policies | Retrieved docs contain Document 5 |
| R05 | What are Shoplite's return policies and how do I track my order? | Document 5: Return and Refund Policies + Document 4: Order Tracking and Delivery | Retrieved docs contain both Document 5 and Document 4 |
| R06 | How do customer reviews work on Shoplite? | Document 7: Product Reviews and Ratings | Retrieved docs contain Document 7 |
| R07 | What mobile app features are available? | Document 9: Mobile App Features | Retrieved docs contain Document 9 |
| R08 | How do I search for products on Shoplite? | Document 6: Product Search and Filtering | Retrieved docs contain Document 6 |
| R09 | What customer support options are available? | Document 10: Customer Support Procedures | Retrieved docs contain Document 10 |
| R10 | How do I register and what security measures protect my account? | Document 1: Shoplite User Registration Process + Document 3: Shoplite Payment Methods and Security | Retrieved docs contain both Document 1 and Document 3 |

## Response Quality Tests (15 tests)  
| Test ID | Question | Required Keywords | Forbidden Terms | Expected Behavior |
|---------|----------|-------------------|-----------------|-------------------|
| Q01 | How do I create a seller account on Shoplite? | ["seller portal", "business information", "verification process", "2-3 business days"] | ["instant approval", "no verification required", "personal accounts only"] | Direct answer with citation |
| Q02 | How long do items stay in my shopping cart? | ["30 days", "logged-in users", "browser session", "guest users"] | ["permanent storage", "never expires", "unlimited time"] | Direct answer with timeframe |
| Q03 | What payment methods does Shoplite accept? | ["credit cards", "PayPal", "Apple Pay", "Google Pay", "Klarna", "Affirm"] | ["cash payments", "cryptocurrency", "bank transfers only"] | Direct answer with payment list |
| Q04 | How long is the standard return window? | ["30 days", "full refund", "original condition", "60 days", "Premium members"] | ["90 days", "no time limit", "lifetime returns"] | Direct answer with policy details |
| Q05 | What are Shoplite's return policies and how do I track orders? | ["30 days", "60 days Premium", "account dashboard", "real-time updates", "SMS notifications"] | ["no tracking available", "no returns accepted", "lifetime returns"] | Multi-source synthesis |
| Q06 | How do customer reviews work and what support is available? | ["verified purchasers", "five-star reviews", "cannot alter", "24/7 support", "live chat", "2 hours"] | ["anyone can review", "sellers control reviews", "limited support hours"] | Multi-source synthesis |
| Q07 | What mobile app features are available and how does cart sync work? | ["barcode scanning", "camera search", "cart synchronization", "mobile and desktop", "30-day storage"] | ["no mobile features", "separate mobile cart", "no synchronization"] | Multi-source synthesis |
| Q08 | How do I search for products and what if I need to return something? | ["natural language", "image searches", "detailed filters", "30 days", "original condition", "prepaid labels"] | ["basic search only", "no return options", "paid returns always"] | Multi-source synthesis |
| Q09 | What delivery options are available and what about delivery problems? | ["economy shipping", "standard shipping", "same-day delivery", "resolution team", "full refunds", "24/7 support"] | ["single delivery option", "no delivery guarantee", "no problem resolution"] | Multi-source synthesis |
| Q10 | How does payment security work on Shoplite? | ["SSL encryption", "PCI DSS compliance", "tokenized", "3D Secure"] | ["credit cards stored", "no encryption", "unsecured payments"] | Direct answer with security details |
| Q11 | Can sellers respond to customer reviews? | ["cannot alter", "cannot delete", "respond professionally", "verified purchasers"] | ["sellers can edit reviews", "sellers can remove reviews", "anyone can review"] | Direct answer with policy clarification |
| Q12 | What languages is customer support available in? | ["English", "Spanish", "French", "German", "Japanese", "24/7"] | ["English only", "business hours only", "limited language support"] | Direct answer with language list |
| Q13 | What verification is required during registration? | ["email verification", "24 hours", "verification link", "$10 discount"] | ["phone verification required", "instant access", "no verification needed"] | Direct answer with process details |
| Q14 | How do I become a seller and manage customer communication? | ["seller verification", "Seller Dashboard", "inventory management", "respond to reviews", "cannot alter", "mobile app"] | ["instant seller access", "full review control", "desktop only management"] | Multi-source synthesis |
| Q15 | What security protects mobile payments and app usage? | ["biometric authentication", "secure payment processing", "device wallets", "SSL encryption", "tokenized storage"] | ["no mobile security", "unsecured mobile payments", "limited payment options"] | Multi-source synthesis |

## Edge Case Tests (5 tests)
| Test ID | Scenario | Expected Response Type |
|---------|----------|----------------------|
| E01 | Question about cryptocurrency payments: "Does Shoplite accept Bitcoin or other cryptocurrencies?" | Refusal with explanation and suggested contact for payment policy questions |
| E02 | Ambiguous question: "I'm having account issues, can you help?" | Clarification request asking for specific type of account issue |
| E03 | Question about real-time data: "What's the current inventory level for iPhone 15 Pro?" | Refusal explaining real-time data unavailable, suggest checking product page or seller |
| E04 | Question requiring account access: "Why was my recent order cancelled?" | Escalation to customer support with explanation about account-specific information |
| E05 | Question about policy not in documentation: "What's Shoplite's policy on AI-generated product descriptions?" | Refusal with explanation and suggestion to contact policy team for specific guidelines |

## Test Execution Guidelines

### Retrieval Quality Assessment
- **Pass Criteria**: System retrieves at least 1 expected document with similarity score > 0.7
- **Partial Pass**: System retrieves related documents that contain some relevant information
- **Fail**: System retrieves completely irrelevant documents or no documents

### Response Quality Assessment  
- **Pass Criteria**: Response contains ALL required keywords and NO forbidden terms
- **Partial Pass**: Response contains most required keywords (75%+) and no forbidden terms
- **Fail**: Response missing multiple required keywords OR contains forbidden terms

### Edge Case Assessment
- **Pass Criteria**: System responds with expected behavior type (refusal, clarification, escalation)
- **Partial Pass**: System responds appropriately but with suboptimal formatting
- **Fail**: System attempts to answer when it should refuse/clarify/escalate

### Overall System Performance Targets
- **Retrieval Quality**: 80% pass rate (8/10 tests)
- **Response Quality**: 85% pass rate (13/15 tests)  
- **Edge Cases**: 100% pass rate (5/5 tests)
- **Combined Target**: 85% overall pass rate (24/30 tests)