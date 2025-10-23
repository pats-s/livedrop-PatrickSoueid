import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { classifyIntent, extractOrderId, INTENTS } from './intent-classifier.js';
import registry from './function-registry.js';
import { validateCitations, loadKnowledgeBase } from './citation-validator.js';
import { trackChat } from './metrics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configurations
let config = null;
let knowledgeBase = null;

/**
 * Call LLM generate endpoint
 */
async function callLLM(prompt, maxTokens = 150) {
  const llmUrl = process.env.LLM_API_URL;
  
  if (!llmUrl) {
    console.warn('[LLM] LLM_API_URL not configured');
    throw new Error('LLM service not configured');
  }
  
  try {
    console.log(`[LLM] Calling ${llmUrl}/generate`);
    
    const response = await fetch(`${llmUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        max_tokens: maxTokens
      }),
      timeout: 10000
    });
    
    if (!response.ok) {
      throw new Error(`LLM returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[LLM] Generated ${data.response_length || 0} chars`);
    
    return data.text;
  } catch (error) {
    console.error('[LLM] Error:', error.message);
    throw error;
  }
}

function loadConfig() {
  if (config) return config;

  const configPath = path.join(__dirname, '..', '..', '..', '..', 'docs', 'prompts.yaml');
  const data = fs.readFileSync(configPath, 'utf8');
  config = yaml.load(data);
  
  console.log('[Assistant Engine] Configuration loaded');
  return config;
}

function getKnowledgeBase() {
  if (knowledgeBase) return knowledgeBase;
  knowledgeBase = loadKnowledgeBase();
  return knowledgeBase;
}

function findRelevantPolicies(query, limit = 3) {
  const kb = getKnowledgeBase();
  const queryLower = query.toLowerCase();
  
  const scored = kb.map(policy => {
    let score = 0;
    
    const words = queryLower.split(/\s+/);
    words.forEach(word => {
      if (word.length < 3) return;
      
      if (policy.question.toLowerCase().includes(word)) score += 2;
      if (policy.answer.toLowerCase().includes(word)) score += 1;
      if (policy.category.toLowerCase().includes(word)) score += 3;
    });
    
    return { policy, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.policy);
}

/**
 * Main entry point - handle user query
 */
export async function handleQuery(userMessage, context = {}) {
  const startTime = Date.now();
  
  console.log(`\n[Assistant] Processing: "${userMessage}"`);
  
  const cfg = loadConfig();
  const intent = classifyIntent(userMessage);
  console.log(`[Assistant] Intent: ${intent}`);
  
  let response = null;
  let functionsCalled = [];
  let citations = [];
  
  switch (intent) {
    case INTENTS.POLICY_QUESTION:
      response = await handlePolicyQuestion(userMessage, cfg);
      citations = response.citations || [];
      break;
      
    case INTENTS.ORDER_STATUS:
      response = await handleOrderStatus(userMessage, cfg);
      functionsCalled = response.functionsCalled || [];
      break;
      
    case INTENTS.PRODUCT_SEARCH:
      response = await handleProductSearch(userMessage, cfg);
      functionsCalled = response.functionsCalled || [];
      break;
      
    case INTENTS.COMPLAINT:
      response = await handleComplaint(userMessage, cfg);
      break;
      
    case INTENTS.CHITCHAT:
      response = await handleChitchat(userMessage, cfg);
      break;
      
    case INTENTS.OFF_TOPIC:
      response = await handleOffTopic(userMessage, cfg);
      break;
      
    case INTENTS.VIOLATION:
      response = handleViolation(userMessage, cfg);
      break;
      
    default:
      response = { text: "I'm here to help with your Shoplite questions!" };
  }
  
  const duration = Date.now() - startTime;
  console.log(`[Assistant] Response generated in ${duration}ms\n`);
  
  // Track metrics
  trackChat(intent, duration, citations);
  
  return {
    text: response.text,
    intent,
    citations,
    functionsCalled,
    timestamp: new Date().toISOString(),
    responseTime: duration
  };
}

// Handler functions
async function handlePolicyQuestion(message, cfg) {
  const policies = findRelevantPolicies(message);
  
  if (policies.length === 0) {
    return {
      text: "I don't have specific information on that. Let me connect you with our team for details.",
      citations: []
    };
  }
  
  const policyContext = policies.map(p => 
    `[${p.id}] ${p.answer}`
  ).join('\n\n');
  
  const prompt = `You are ${cfg.assistant.name}, ${cfg.assistant.role}.

User asked: "${message}"

Relevant policies:
${policyContext}

Instructions:
- Respond in 2-3 sentences maximum
- Answer the user's question directly
- Cite policies using [PolicyID] format
- Stop after answering the question
- Do not continue the conversation

Your Response:`;
  
  try {
    const llmResponse = await callLLM(prompt, 200);
    
    let cleanedResponse = llmResponse;
    
    const stopPatterns = [
      '\n\nUser',
      '\nUser:',
      '\n\nAssistant',
      '\nAssistant:',
      '\n\nQ:',
      '\nQ:'
    ];
    
    for (const pattern of stopPatterns) {
      const index = cleanedResponse.indexOf(pattern);
      if (index !== -1) {
        cleanedResponse = cleanedResponse.substring(0, index).trim();
      }
    }
    
    const validation = validateCitations(cleanedResponse);
    
    if (!validation.isValid) {
      console.warn('[Assistant] Invalid citations:', validation.invalidCitations);
    }
    
    return {
      text: cleanedResponse,
      citations: validation.validCitations
    };
  } catch (error) {
    return {
      text: `Based on our policies: ${policies[0].answer} [${policies[0].id}]`,
      citations: [policies[0].id]
    };
  }
}

async function handleOrderStatus(message, cfg) {
  const orderId = extractOrderId(message);
  
  if (!orderId) {
    return {
      text: "I'd be happy to check your order! Could you provide your order number? It looks like ORD-20251019-ABC123.",
      functionsCalled: []
    };
  }
  
  const result = await registry.execute('getOrderStatus', { orderId });
  
  if (!result.success) {
    return {
      text: `I couldn't find order ${orderId}. Please double-check the order number or contact support.`,
      functionsCalled: ['getOrderStatus']
    };
  }
  
  const order = result.data;
  
  const prompt = `You are ${cfg.assistant.name}, ${cfg.assistant.role}.

User asked about their order: "${message}"

Order details:
- Order ID: ${order.orderId}
- Status: ${order.status}
- Carrier: ${order.carrier}
- Tracking: ${order.trackingNumber}
- Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}
- Total: $${order.total}

Provide a friendly update about the order. Be reassuring and helpful. Keep it to 2-3 sentences.

Response:`;

  try {
    const llmResponse = await callLLM(prompt, 120);
    
    return {
      text: llmResponse,
      functionsCalled: ['getOrderStatus']
    };
  } catch (error) {
    const statusMsg = order.status === 'DELIVERED' 
      ? 'has been delivered!'
      : order.status === 'SHIPPED'
      ? `is on its way with ${order.carrier}. Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}.`
      : 'is being processed and will ship soon.';
    
    return {
      text: `Your order ${order.orderId} ${statusMsg}`,
      functionsCalled: ['getOrderStatus']
    };
  }
}

async function handleProductSearch(message, cfg) {
  const result = await registry.execute('searchProducts', { query: message, limit: 5 });
  
  if (!result.success || !result.data.found) {
    return {
      text: "I couldn't find products matching that. Could you describe what you're looking for in more detail?",
      functionsCalled: ['searchProducts']
    };
  }
  
  const products = result.data.products;
  
  const productList = products.map(p => 
    `- ${p.name}: $${p.price} (${p.stock > 0 ? 'In stock' : 'Out of stock'})`
  ).join('\n');
  
  const prompt = `You are ${cfg.assistant.name}, ${cfg.assistant.role}.

User is looking for: "${message}"

I found these products:
${productList}

Present these products in a friendly way. Highlight 1-2 that seem most relevant. Keep it to 2-3 sentences.

Response:`;

  try {
    const llmResponse = await callLLM(prompt, 150);
    
    return {
      text: llmResponse,
      functionsCalled: ['searchProducts']
    };
  } catch (error) {
    return {
      text: `I found ${products.length} products: ${products.map(p => `${p.name} ($${p.price})`).join(', ')}. Would you like details on any of these?`,
      functionsCalled: ['searchProducts']
    };
  }
}

async function handleComplaint(message, cfg) {
  const prompt = `You are ${cfg.assistant.name}, ${cfg.assistant.role}.

Customer complaint: "${message}"

Respond with empathy and care. Show you understand their frustration. Apologize sincerely and offer to help resolve it. Keep it to 2-3 sentences.

Response:`;

  try {
    const llmResponse = await callLLM(prompt, 120);
    return { text: llmResponse };
  } catch (error) {
    return {
      text: "I'm so sorry to hear you're having this issue. I completely understand your frustration. Let me help resolve this right away - could you tell me more details so I can assist you?"
    };
  }
}

async function handleChitchat(message, cfg) {
  const prompt = `You are ${cfg.assistant.name}, ${cfg.assistant.role}.

User said: "${message}"

This is casual conversation. Respond warmly and briefly (1-2 sentences), then redirect to how you can help with Shoplite. Stay friendly but professional.

Response:`;

  try {
    const llmResponse = await callLLM(prompt, 80);
    return { text: llmResponse };
  } catch (error) {
    const msgLower = message.toLowerCase();
    
    if (msgLower.includes('hi') || msgLower.includes('hello')) {
      return { text: "Hi! I'm Alex from Shoplite support. How can I help you today?" };
    }
    if (msgLower.includes('thank')) {
      return { text: "You're very welcome! Is there anything else I can help you with?" };
    }
    return { text: "How can I assist you with your Shoplite order or questions today?" };
  }
}

async function handleOffTopic(message, cfg) {
  const prompt = `You are ${cfg.assistant.name}, ${cfg.assistant.role}.

User asked an off-topic question: "${message}"

Politely explain you're focused on Shoplite support. Redirect them to what you CAN help with. Be friendly but clear. Keep it to 1-2 sentences.

Response:`;

  try {
    const llmResponse = await callLLM(prompt, 80);
    return { text: llmResponse };
  } catch (error) {
    return {
      text: "I'm focused on helping with Shoplite-related questions like orders, products, shipping, and policies. Is there anything related to your Shoplite experience I can help you with?"
    };
  }
}

function handleViolation(message, cfg) {
  return {
    text: "I'm here to help with your Shoplite questions in a respectful manner. If you have a legitimate concern, I'm happy to assist."
  };
}

export default { handleQuery };