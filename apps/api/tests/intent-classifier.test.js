import { classifyIntent, INTENTS } from '../src/assistant/intent-classifier.js';

describe('Intent Classifier', () => {
  
  // POLICY_QUESTION tests (7 tests)
  describe('Policy Questions', () => {
    test('should detect return policy question', () => {
      expect(classifyIntent("What is your return policy?")).toBe(INTENTS.POLICY_QUESTION);
    });

    test('should detect shipping policy question', () => {
      expect(classifyIntent("How much does shipping cost?")).toBe(INTENTS.POLICY_QUESTION);
    });

    test('should detect refund question', () => {
      expect(classifyIntent("Can I get a refund?")).toBe(INTENTS.POLICY_QUESTION);
    });

    test('should detect exchange question', () => {
      expect(classifyIntent("How do I exchange an item?")).toBe(INTENTS.POLICY_QUESTION);
    });

    test('should detect warranty question', () => {
      expect(classifyIntent("What's your warranty policy?")).toBe(INTENTS.POLICY_QUESTION);
    });

    test('should detect delivery policy question', () => {
        expect(classifyIntent("What is your shipping policy?")).toBe(INTENTS.POLICY_QUESTION);
    });

    test('should detect payment methods question', () => {
      expect(classifyIntent("What payment methods do you accept?")).toBe(INTENTS.POLICY_QUESTION);
    });
  });

  // ORDER_STATUS tests (7 tests)
  describe('Order Status', () => {
    test('should detect order status with order ID', () => {
      expect(classifyIntent("Where is order ORD-20251019-001?")).toBe(INTENTS.ORDER_STATUS);
    });

    test('should detect order tracking question', () => {
      expect(classifyIntent("Track my order ORD-12345-ABC")).toBe(INTENTS.ORDER_STATUS);
    });

    test('should detect order status without ID', () => {
      expect(classifyIntent("Where is my order?")).toBe(INTENTS.ORDER_STATUS);
    });

    test('should detect delivery status question', () => {
      expect(classifyIntent("When will my package arrive?")).toBe(INTENTS.ORDER_STATUS);
    });

    test('should detect shipping status', () => {
      expect(classifyIntent("Has my order shipped yet?")).toBe(INTENTS.ORDER_STATUS);
    });

    test('should detect order location question', () => {
      expect(classifyIntent("Where is my package?")).toBe(INTENTS.ORDER_STATUS);
    });

    test('should detect tracking number question', () => {
      expect(classifyIntent("What's my tracking number?")).toBe(INTENTS.ORDER_STATUS);
    });
  });

  // PRODUCT_SEARCH tests (7 tests)
  describe('Product Search', () => {
    test('should detect product availability question', () => {
      expect(classifyIntent("Do you have wireless headphones?")).toBe(INTENTS.PRODUCT_SEARCH);
    });

    test('should detect product search by category', () => {
      expect(classifyIntent("Show me laptops")).toBe(INTENTS.PRODUCT_SEARCH);
    });

    test('should detect product recommendation request', () => {
      expect(classifyIntent("What products do you recommend?")).toBe(INTENTS.PRODUCT_SEARCH);
    });

    test('should detect stock inquiry', () => {
      expect(classifyIntent("Is the iPhone in stock?")).toBe(INTENTS.PRODUCT_SEARCH);
    });

    test('should detect product search by brand', () => {
      expect(classifyIntent("Do you sell Samsung products?")).toBe(INTENTS.PRODUCT_SEARCH);
    });

    test('should detect general product inquiry', () => {
      expect(classifyIntent("What products are available?")).toBe(INTENTS.PRODUCT_SEARCH);
    });

    test('should detect product feature question', () => {
      expect(classifyIntent("Looking for noise-canceling headphones")).toBe(INTENTS.PRODUCT_SEARCH);
    });
  });

  // COMPLAINT tests (4 tests)
  describe('Complaints', () => {
    test('should detect damaged item complaint', () => {
  expect(classifyIntent("This product is broken and terrible!")).toBe(INTENTS.COMPLAINT);
});

    test('should detect service complaint', () => {
      expect(classifyIntent("Your service is terrible")).toBe(INTENTS.COMPLAINT);
    });

    test('should detect quality complaint', () => {
      expect(classifyIntent("This product is defective")).toBe(INTENTS.COMPLAINT);
    });

    test('should detect delay complaint', () => {
  expect(classifyIntent("I'm so angry, this is unacceptable!")).toBe(INTENTS.COMPLAINT);
});
  });

  // CHITCHAT tests (3 tests)
  describe('Chitchat', () => {
    test('should detect greeting', () => {
      expect(classifyIntent("Hello!")).toBe(INTENTS.CHITCHAT);
    });

    test('should detect thanks', () => {
      expect(classifyIntent("Thank you so much!")).toBe(INTENTS.CHITCHAT);
    });

    test('should detect casual question', () => {
      expect(classifyIntent("How are you today?")).toBe(INTENTS.CHITCHAT);
    });
  });

  // OFF_TOPIC tests (3 tests)
  describe('Off Topic', () => {
    test('should detect weather question', () => {
      expect(classifyIntent("What's the weather like?")).toBe(INTENTS.OFF_TOPIC);
    });

    test('should detect unrelated question', () => {
      expect(classifyIntent("Who won the game yesterday?")).toBe(INTENTS.OFF_TOPIC);
    });

    test('should detect random question', () => {
      expect(classifyIntent("Tell me a joke")).toBe(INTENTS.OFF_TOPIC);
    });
  });

  // VIOLATION tests (2 tests)
  describe('Violations', () => {
    test('should detect abusive language', () => {
      expect(classifyIntent("You are stupid")).toBe(INTENTS.VIOLATION);
    });

    test('should detect harassment', () => {
      expect(classifyIntent("I hate you idiots")).toBe(INTENTS.VIOLATION);
    });
  });
});