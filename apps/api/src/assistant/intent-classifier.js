/**
 * Intent Classifier
 * Determines user intent from their message using keyword matching
 */

// Intent types
export const INTENTS = {
  POLICY_QUESTION: 'policy_question',
  ORDER_STATUS: 'order_status',
  PRODUCT_SEARCH: 'product_search',
  COMPLAINT: 'complaint',
  CHITCHAT: 'chitchat',
  OFF_TOPIC: 'off_topic',
  VIOLATION: 'violation'
};

// Keyword patterns for each intent
const INTENT_PATTERNS = {
  [INTENTS.POLICY_QUESTION]: {
    keywords: [
      'return', 'refund', 'exchange', 'policy', 'ship', 'shipping', 'deliver',
      'warranty', 'guarantee', 'payment', 'pay', 'credit card', 'account',
      'password', 'reset', 'sign up', 'register', 'privacy', 'secure',
      'promo', 'discount', 'coupon', 'contact', 'support', 'help'
    ],
    weight: 1.0
  },

  [INTENTS.ORDER_STATUS]: {
    keywords: [
      'order', 'track', 'tracking', 'where', 'shipped', 'delivery',
      'package', 'arrive', 'status', 'when will', 'eta', 'estimated'
    ],
    // Patterns that indicate order status (contains order number format)
    patterns: [
      /ord[er]*[-\s]*\d+/i,           // "order 123", "ORD-123"
      /#\d{3,}/,                       // "#12345"
      /order\s*number/i                // "order number"
    ],
    weight: 1.5  // Higher weight - strong signal
  },

  [INTENTS.PRODUCT_SEARCH]: {
    keywords: [
      'looking for', 'find', 'search', 'show me', 'do you have', 'available',
      'stock', 'buy', 'purchase', 'product', 'item', 'price', 'cost',
      'sell', 'offer', 'selection', 'recommend'
    ],
    weight: 1.0
  },

  [INTENTS.COMPLAINT]: {
    keywords: [
      'damage', 'damaged', 'broken', 'defect', 'wrong', 'incorrect',
      'disappointed', 'terrible', 'horrible', 'worst', 'awful', 'bad',
      'issue', 'problem', 'complaint', 'unhappy', 'angry', 'upset',
      'never', 'again', 'refund now', 'unacceptable', 'ridiculous'
    ],
    weight: 1.3  // Elevated - important to handle properly
  },

  [INTENTS.CHITCHAT]: {
    keywords: [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
      'thanks', 'thank you', 'appreciate', 'awesome', 'great', 'perfect',
      'how are you', 'what\'s up', 'bye', 'goodbye', 'see you'
    ],
    // Exact matches for common greetings
    exact_matches: [
      'hi', 'hello', 'hey', 'thanks', 'thank you', 'bye', 'goodbye'
    ],
    weight: 0.8  // Lower weight - less critical
  },

  [INTENTS.OFF_TOPIC]: {
    keywords: [
      'weather', 'forecast', 'temperature', 'rain', 'snow',
      'news', 'politics', 'election', 'president',
      'sport', 'game', 'score', 'team',
      'joke', 'funny', 'laugh',
      'movie', 'music', 'song',
      'recipe', 'cook', 'restaurant'
    ],
    weight: 1.2
  },

  [INTENTS.VIOLATION]: {
    // Profanity and abusive language patterns
    patterns: [
      /\b(fuck|shit|damn|bitch|ass|hell)\b/i,
      /\b(stupid|idiot|moron|dumb)\b/i,
      /\b(hate|kill|die)\b/i
    ],
    // Context matters - some words are okay in context
    safe_contexts: [
      'damaged', 'heck', 'what the heck'
    ],
    weight: 2.0  // Highest weight - must catch violations
  }
};

/**
 * Classify user intent from message
 * @param {string} message - User's message
 * @returns {string} - Intent type from INTENTS enum
 */
export function classifyIntent(message) {
  if (!message || typeof message !== 'string') {
    return INTENTS.CHITCHAT;  // Default fallback
  }

  const normalizedMessage = message.toLowerCase().trim();

  // Quick check for empty or very short messages
  if (normalizedMessage.length === 0) {
    return INTENTS.CHITCHAT;
  }

  // Check for exact matches first (greetings)
  const exactMatches = INTENT_PATTERNS[INTENTS.CHITCHAT].exact_matches;
  if (exactMatches.includes(normalizedMessage)) {
    return INTENTS.CHITCHAT;
  }

  // Score each intent
  const scores = {};
  
  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    scores[intent] = 0;

    // Check keywords
    if (config.keywords) {
      for (const keyword of config.keywords) {
        if (normalizedMessage.includes(keyword)) {
          scores[intent] += config.weight;
        }
      }
    }

    // Check regex patterns
    if (config.patterns) {
      for (const pattern of config.patterns) {
        if (pattern.test(normalizedMessage)) {
          scores[intent] += config.weight * 2;  // Patterns are stronger signals
        }
      }
    }
  }

  // Log scores for debugging
  console.log('[Intent Classifier] Scores:', scores);

  // Find intent with highest score
  let maxScore = 0;
  let detectedIntent = INTENTS.CHITCHAT;  // Default

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent;
    }
  }

  // If no strong signal detected (very low score), default to policy_question
  // This is safer than chitchat for customer support
  if (maxScore < 0.5 && normalizedMessage.length > 10) {
    detectedIntent = INTENTS.POLICY_QUESTION;
  }

  console.log(`[Intent Classifier] Message: "${message}"`);
  console.log(`[Intent Classifier] Detected: ${detectedIntent} (score: ${maxScore})`);

  return detectedIntent;
}

/**
 * Get confidence level for classification
 * @param {string} message - User's message
 * @returns {object} - { intent, confidence }
 */
export function classifyWithConfidence(message) {
  const intent = classifyIntent(message);
  
  // Calculate confidence based on keyword matches
  const normalizedMessage = message.toLowerCase().trim();
  const config = INTENT_PATTERNS[intent];
  
  let matches = 0;
  let total = config.keywords?.length || 1;

  if (config.keywords) {
    matches = config.keywords.filter(kw => normalizedMessage.includes(kw)).length;
  }

  if (config.patterns) {
    const patternMatches = config.patterns.filter(p => p.test(normalizedMessage)).length;
    matches += patternMatches * 2;
    total += config.patterns.length * 2;
  }

  const confidence = Math.min((matches / total) * 100, 95);  // Cap at 95%

  return {
    intent,
    confidence: Math.round(confidence)
  };
}

/**
 * Extract order ID from message if present
 * @param {string} message - User's message
 * @returns {string|null} - Order ID or null
 */
export function extractOrderId(message) {
  if (!message) return null;

  // Patterns for order IDs
  const patterns = [
    /ORD[-\s]*(\d{8}[-\s]*[A-Z0-9]{6})/i,   // ORD-20251019-ABC123
    /order[-\s]*#?(\d{3,})/i,                 // order #12345
    /#(\d{3,})/                               // #12345
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      // Clean up the matched order ID
      return match[0].replace(/\s/g, '').toUpperCase();
    }
  }

  return null;
}

/**
 * Get examples for each intent (for testing/documentation)
 * @returns {object} - Examples by intent
 */
export function getIntentExamples() {
  return {
    [INTENTS.POLICY_QUESTION]: [
      "What's your return policy?",
      "Do you ship internationally?",
      "How do I reset my password?",
      "What payment methods do you accept?"
    ],
    [INTENTS.ORDER_STATUS]: [
      "Where is my order #12345?",
      "Can you track my package?",
      "Order ORD-20251019-ABC123 status",
      "When will my order arrive?"
    ],
    [INTENTS.PRODUCT_SEARCH]: [
      "Do you have wireless headphones?",
      "Looking for yoga mats under $40",
      "Show me your coffee makers",
      "What's the price of the Instant Pot?"
    ],
    [INTENTS.COMPLAINT]: [
      "My package arrived damaged!",
      "This product is terrible",
      "Very disappointed with the quality",
      "Wrong item was delivered"
    ],
    [INTENTS.CHITCHAT]: [
      "Hi there!",
      "Good morning",
      "Thank you so much!",
      "You're awesome!"
    ],
    [INTENTS.OFF_TOPIC]: [
      "What's the weather today?",
      "Who won the game last night?",
      "Tell me a joke",
      "What's for dinner?"
    ],
    [INTENTS.VIOLATION]: [
      "You're useless!",
      "This is bullshit",
      "Worst service ever, idiots"
    ]
  };
}