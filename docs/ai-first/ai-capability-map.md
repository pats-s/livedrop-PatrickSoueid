# AI Capability Map

| Capability | Intent (user) | Inputs (this sprint) | Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback | Selected |
|---|---|---|---|---:|---:|---|:---:|
| Support Chatbot Assistant | Get help with orders, returns, shipping questions | FAQ/policies markdown, order-status API, product catalog | 3 | 1200 | $0.08 | Escalate to human support | ✓ |
| Product Q&A Chatbot | Ask specific questions about product features, compatibility, specs | Product descriptions, reviews, specs sheets, FAQ | 2 | 800 | $0.06 | Show product details page |  |
| Smart Search Typeahead | Find products faster with AI-powered suggestions | Product catalog, search history, user behavior data | 2 | 300 | $0.02 | Standard text search results | ✓ |
| Order Status Assistant | Natural language order tracking and updates | Order-status API, shipping data, user order history | 1 | 600 | $0.04 | Direct to order status page |  |

### Cost per Action Calculations

**Support Chatbot Assistant**  
(150/1000 * 0.15) + (100/1000 * 0.60) = 0.0225 + 0.06 = 0.0825
≈ **$0.08 per action**

---

**Smart Search Typeahead**  

(50/1000 * 0.15) + (20/1000 * 0.60) = 0.0075 + 0.012 = 0.0195 
 
≈ **$0.02 per action**



## Why these two

I selected the **Support Chatbot Assistant** and **Smart Search Typeahead** because they address different parts of the customer journey with complementary impact. The support chatbot reduces the support ticket volume while improving response times from hours to seconds. Smart search typeahead targets the discovery phase. Users currently abandon 40% of searches due to poor results, and AI-powered suggestions can surface relevant products faster, improving conversion rates. These touchpoints use different interaction patterns (conversational vs. predictive), leverage existing data sources, and present manageable integration risks compared to complex features requiring new data.
