

import groundTruth from './ground-truth.json';
import { getOrderStatus } from '../lib/api';
import { maskId } from '../lib/format';

interface QA {
  qid: string;
  category: string;
  question: string;
  answer: string;
}

interface SupportResponse {
  answer: string;
  source: string;
  confidence: 'high' | 'medium' | 'low' | 'none';
  orderInfo?: {
    orderId: string;
    status: string;
    maskedId: string;
  };
}

const CONFIDENCE_THRESHOLD = 0.3;
const ORDER_ID_PATTERN = /\b[A-Z0-9]{10,}\b/g;


export async function answerQuestion(query: string): Promise<SupportResponse> {
  const cleanQuery = query.trim().toLowerCase();
  
  if (!cleanQuery) {
    return {
      answer: 'Please ask a question and I\'ll do my best to help!',
      source: 'System',
      confidence: 'none',
    };
  }

  // Step 1: Check for order ID in query
  const orderIds = extractOrderIds(query);
  let orderInfo;
  
  if (orderIds.length > 0) {
    const status = await getOrderStatus(orderIds[0]);
    if (status) {
      orderInfo = {
        orderId: status.orderId,
        status: status.status,
        maskedId: maskId(status.orderId),
      };
    }
  }

  const match = findBestMatch(cleanQuery, groundTruth as QA[]);

  if (match.confidence === 'none' || match.score < CONFIDENCE_THRESHOLD) {
    return {
      answer: 
        'I don\'t have information about that in my knowledge base. ' +
        'Please contact our support team at support@shoplite.com or call 1-800-SHOPLITE for assistance.',
      source: 'System',
      confidence: 'none',
      orderInfo,
    };
  }

  let answer = match.qa.answer;
  
  if (orderInfo) {
    answer = 
      `**Order Status for ...${orderInfo.maskedId}:**\n` +
      `Current Status: ${orderInfo.status}\n\n` +
      `**Related Policy:**\n${answer}`;
  }

  return {
    answer,
    source: `[${match.qa.qid}] ${match.qa.category}`,
    confidence: match.confidence,
    orderInfo,
  };
}


function extractOrderIds(query: string): string[] {
  const matches = query.match(ORDER_ID_PATTERN);
  return matches ? matches : [];
}



function findBestMatch(
  query: string,
  qas: QA[]
): { qa: QA; score: number; confidence: 'high' | 'medium' | 'low' | 'none' } {
  const queryTokens = tokenize(query);
  
  let bestMatch = {
    qa: qas[0],
    score: 0,
  };

  for (const qa of qas) {
    const questionTokens = tokenize(qa.question.toLowerCase());
    const answerTokens = tokenize(qa.answer.toLowerCase());
    
    const questionScore = calculateOverlap(queryTokens, questionTokens) * 2;
    const answerScore = calculateOverlap(queryTokens, answerTokens);
    const categoryScore = query.includes(qa.category.toLowerCase()) ? 0.2 : 0;
    
    const totalScore = questionScore + answerScore + categoryScore;
    
    if (totalScore > bestMatch.score) {
      bestMatch = { qa, score: totalScore };
    }
  }

  let confidence: 'high' | 'medium' | 'low' | 'none';
  if (bestMatch.score >= 0.6) {
    confidence = 'high';
  } else if (bestMatch.score >= 0.4) {
    confidence = 'medium';
  } else if (bestMatch.score >= 0.2) {
    confidence = 'low';
  } else {
    confidence = 'none';
  }

  return { ...bestMatch, confidence };
}


function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') 
    .split(/\s+/)
    .filter(token => token.length > 2) 
    .filter(token => !STOP_WORDS.has(token));
}


function calculateOverlap(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  
  const set2 = new Set(tokens2);
  const matches = tokens1.filter(token => set2.has(token)).length;
  
  return matches / Math.sqrt(tokens1.length * tokens2.length);
}


const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'and', 'or', 'but',
  'in', 'with', 'to', 'for', 'of', 'as', 'by', 'an',
  'be', 'this', 'that', 'from', 'they', 'we', 'you',
  'are', 'can', 'will', 'would', 'should', 'could',
  'have', 'has', 'had', 'been', 'was', 'were', 'does',
  'do', 'did', 'my', 'your', 'their', 'our', 'me',
  'it', 'its', 'about', 'into', 'through', 'there',
  'when', 'where', 'who', 'what', 'why', 'how',
]);