### 3) Cost Model

## Assumptions
- Model: GPT-4o-mini at $0.15 / 1K prompt tokens, $0.60 / 1K completion tokens
- **Support Chatbot Assistant:**  
  - Avg tokens in: 150 Avg tokens out: 100  
  - Requests/day: 1,000  
  - Cache hit rate: 30% (so 70% billable requests)  
- **Smart Search Typeahead:**  
  - Avg tokens in: 50 Avg tokens out: 20  
  - Requests/day: 50,000  
  - Cache hit rate: 70% (so 30% billable requests)  

---

## Calculation

**Support Chatbot Assistant**  
Cost/action = (150/1000 × 0.15) + (100/1000 × 0.60)  
= 0.0225 + 0.06 = **$0.0825 ≈ $0.08**  

Daily cost = 0.0825 × 1000 × 0.7  
= **$57.75 ≈ $58/day**

---

**Smart Search Typeahead**  
Cost/action = (50/1000 × 0.15) + (20/1000 × 0.60)  
= 0.0075 + 0.012 = **$0.0195 ≈ $0.02**  

Daily cost = 0.0195 × 50,000 × 0.3  
= **$292.5 ≈ $293/day**

---

## Results
- **Support Chatbot Assistant:** Cost/action = ~$0.08, Daily ≈ $58  
- **Smart Search Typeahead:** Cost/action = ~$0.02, Daily ≈ $293  

---

## Cost levers if over budget
- **Support Chatbot Assistant:** I can reduce retrieval length (e.g., 150 → 100 tokens) or downgrade model on repeated questions all the time like routine FAQs.  
- **Smart Search Typeahead:** we should increase cache coverage for popular queries(depending on the shop products for example if the shop is about tech products popular queries could be iph for iphone, air for airpods...), and restrict LLM usage to long-tail queries only.
