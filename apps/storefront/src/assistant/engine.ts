import { chatWithAssistant } from '../lib/api';

interface SupportResponse {
  answer: string;
  source: string;
  confidence: 'high' | 'medium' | 'low' | 'none';
  intent?: string;
  citations?: string[];
}

/**
 * Ask the AI assistant a question
 * Now calls the real backend API instead of keyword matching
 */
export async function answerQuestion(query: string): Promise<SupportResponse> {
  const cleanQuery = query.trim();
  
  if (!cleanQuery) {
    return {
      answer: 'Please ask a question and I\'ll do my best to help!',
      source: 'System',
      confidence: 'none',
    };
  }

  try {
    // Call the real assistant API
    const response = await chatWithAssistant(cleanQuery);
    
    // Map response to SupportResponse format
    return {
      answer: response.text,
      source: response.citations?.length > 0 
        ? response.citations.join(', ') 
        : response.intent,
      confidence: response.citations?.length > 0 ? 'high' : 'medium',
      intent: response.intent,
      citations: response.citations
    };
  } catch (error) {
    console.error('Assistant error:', error);
    
    return {
      answer: 'I\'m having trouble connecting right now. Please try again or contact support@shoplite.com',
      source: 'System',
      confidence: 'none',
    };
  }
}