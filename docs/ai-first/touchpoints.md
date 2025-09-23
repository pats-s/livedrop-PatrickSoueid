
# AI Touchpoints Specifications

## Support Chatbot Assistant

### Problem statement
ShopLite currently handles around 3,000 support tickets daily, with average response times of 1-2 hours during business hours and 12+ hours on weekends. And Most queries are repetitive like order status, return policies, shipping questions with the suport chatbot, this could be instantly resolved. waiting all this time for a question creates customer frustration, and also it prevents human agents from focusing on complex issues requiring empathy and problem-solving skills.

### Happy path
1. User clicks "Chat Support" button on any page
2. Bot greets user and asks how it can help
3. User types question: "How do I return an item?"
4. System retrieves relevant policy from FAQ markdown
5. Bot responds with clear return process and asks if user needs specific order help
6. User provides order number (optional)
7. System calls order-status API to get order details
8. Bot provides personalized return instructions with shipping label link
9. User confirms issue resolved or requests human escalation
10. Chat ends with satisfaction survey prompt

### Grounding & guardrails
- **Source of truth**: policies files, order-status API, product catalog database
- **Retrieval scope**: Only official ShopLite policies, order data for authenticated users, general product info
- **Max context**: 300 tokens per conversation turn to stay within latency budget
- **Refuse outside scope**: when the user starts asking about product recommendations, price negotiations

### Human-in-the-loop
- **Escalation triggers**: escalaton to human support will be trigered when a user explicitly requests human, bot confidence <70%, payment/refund disputes.
- **UI surface**: "Speak with human agent" button will always be visible.
- **Reviewer and SLA**: Agents will be available during business hours, 30-second pickup target and overnight escalations queued for morning

### Latency budget
- User message processing: 200ms (intent classification + retrieval)
- API calls (order lookup): 300ms max
- LLM generation: 600ms target
- Response rendering: 100ms
- **Total: 1200ms p95 target**
- **Cache strategy**: FAQ responses cached for 24h, common questions pre-computed

### Error & fallback behavior
- API timeout: AI response will be: "Let me get a human agent to help with your order"
- LLM failure: Pre-written responses for top 10 question types
- Confidence <50%: "I want to make sure I give you accurate info, will connect you with an agent"

### PII handling
- **What leaves the app**: Anonymized conversation logs, no order details sent to LLM
- **Redaction rules**: Automatically detect and mask credit card, SSN, phone numbers before logging
- **Logging policy**: Conversations stored 30 days for training

### Success metrics
- **Product metrics**: Support ticket reduction rate = (Baseline tickets(before AI) - Current tickets) / Baseline tickets × 100; Resolution rate = Resolved chats / Total chats × 100
- **Business metric**: Support cost savings = (Baseline FTE(how many human we needed without the AI) × hourly rate × human time saved) - AI operational costs

### Feasibility note
The ShopLite Support Chatbot is feasible since data sources (FAQ files, order-status API, product catalog DB) are available and can be used with a RAG pipeline to ground the LLM’s responses in official policies. APIs handle authenticated order lookups, and PII redaction ensures compliance. The next prototype step is to implement a RAG flow that retrieves FAQ snippets + order data, then test resolution accuracy and latency in live support scenarios.


## Smart Search Typeahead

### Problem statement
Most Shoplite search features has a 40% abandonment rate, with users leaving after unsuccessful queries rather than browsing categories. The existing text-matching search misses product variations, synonyms, and user intent for example users searching "wireless headphones" miss "bluetooth earbuds" and vice versa. This poor search experience leads to lost conversions.

### Happy path
1. User clicks in search box on homepage or nav bar
2. User types "wire" and then the system immediately suggests relevant completions
3. After 3 characters, AI will generate contextual suggestions: wireless headphones, wireless chargers
4. Suggestions will update in real-time as user continues typing "wireless"
5. The system will show 5 smart suggestions based on popularity, inventory, and user behavior
6. User clicks "wireless headphones" suggestion
7. Search executes with optimized query, showing relevant results
8. User finds desired product and adds to cart
9. Conversion tracked back to typeahead assist
10. System learns from successful path for future suggestions

### Grounding & guardrails
- **Source of truth**: Product catalog with names, descriptions, categories, search terms
- **Retrieval scope**: Only active products with inventory >0, the sustem will not show discontinued items
- **Max context**: 150 tokens (current query + top product matches)
- **Refuse outside scope**: No suggestions for restricted items, no competitor products, no non-product queries

### Human-in-the-loop
- **Escalation triggers**: there is no need for a human escalation here, users naturally fall back to standard search
- **UI surface**: Standard search results page if typeahead suggestions don't match intent
- **Reviewer and SLA**: Product team reviews suggestion quality weekly, there is no need for real-time human involvement

### Latency budget
- Query processing: 50ms ( intent detection)
- Product retrieval: 100ms (database query with indexes)
- LLM suggestion generation: 120ms
- Response formatting: 30ms
- **Total: 300ms p95 target**
- **Cache strategy**: Popular queries cached for 1 day

### Error & fallback behavior
- Database timeout: Show cached popular suggestions for query prefix
- LLM failure: Fall back to standard autocomplete from product names
- No results: Suggest broader category terms or popular products
- Service degradation: Disable typeahead, use standard search input only

### PII handling
- **What leaves the app**: Search query strings only, no user identification
- **Redaction rules**: Filter out potential PII accidentally typed in search (phone numbers, emails)
- **Logging policy**: Query patterns aggregated for product discovery insights, individual searches not stored

### Success metrics
- **Product metrics**: Search completion rate = Completed searches / Started searches × 100; Suggestion click-through rate = Clicked suggestions / Shown suggestions × 100
- **Business metric**: Search-driven revenue = Revenue from search-originated sessions × (Improved conversion rate - Baseline rate)

### Feasibility note
Product catalog has structured data with names, descriptions, and categories for all 10k SKUs. Search analytics provide baseline query patterns and success rates. Next prototype step: Implement simple embedding-based similarity matching for product names, test suggestion relevance with 100 common search prefixes, measure actual latency against 300ms target using cached product embeddings.

