/**
 * Citation Validator
 * Validates that PolicyID citations in responses exist in knowledge base
 * Prevents hallucinated citations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load knowledge base
let knowledgeBase = null;

/**
 * Load knowledge base from ground-truth.json
 * @returns {array} - Knowledge base policies
 */
function loadKnowledgeBase() {
  if (knowledgeBase) {
    return knowledgeBase;  // Return cached version
  }

  try {
    // Path to ground-truth.json (go up to project root)
const kbPath = path.join(__dirname, '..', '..', '..', '..', 'docs', 'ground-truth.json');
    
    const data = fs.readFileSync(kbPath, 'utf8');
    knowledgeBase = JSON.parse(data);
    
    console.log(`[Citation Validator] Loaded ${knowledgeBase.length} policies from knowledge base`);
    
    return knowledgeBase;
  } catch (error) {
    console.error('[Citation Validator] Error loading knowledge base:', error);
    return [];
  }
}

/**
 * Extract all PolicyID citations from text
 * Matches pattern: [PolicyID] or [Return3.1] etc.
 * @param {string} text - Text to search for citations
 * @returns {array} - Array of extracted PolicyIDs (without brackets)
 */
export function extractCitations(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Regex to match [SomethingX.X] or [PolicyX.X] format
  const citationPattern = /\[([A-Za-z]+\d+\.\d+)\]/g;
  
  const citations = [];
  let match;

  while ((match = citationPattern.exec(text)) !== null) {
    // match[1] contains the PolicyID without brackets
    citations.push(match[1]);
  }

  // Remove duplicates
  return [...new Set(citations)];
}

/**
 * Check if a PolicyID exists in knowledge base
 * @param {string} policyId - PolicyID to check
 * @param {array} kb - Knowledge base (optional, will load if not provided)
 * @returns {boolean} - True if exists
 */
export function policyExists(policyId, kb = null) {
  const knowledgeBase = kb || loadKnowledgeBase();
  
  return knowledgeBase.some(policy => policy.id === policyId);
}

/**
 * Get policy details by ID
 * @param {string} policyId - PolicyID to retrieve
 * @param {array} kb - Knowledge base (optional)
 * @returns {object|null} - Policy object or null
 */
export function getPolicyById(policyId, kb = null) {
  const knowledgeBase = kb || loadKnowledgeBase();
  
  return knowledgeBase.find(policy => policy.id === policyId) || null;
}

/**
 * Validate all citations in text
 * @param {string} text - Text containing citations
 * @param {array} kb - Knowledge base (optional)
 * @returns {object} - Validation report
 */
export function validateCitations(text, kb = null) {
  const knowledgeBase = kb || loadKnowledgeBase();
  
  // Extract all citations
  const citations = extractCitations(text);
  
  if (citations.length === 0) {
    return {
      isValid: true,
      totalCitations: 0,
      validCitations: [],
      invalidCitations: [],
      message: 'No citations found'
    };
  }

  // Check each citation
  const validCitations = [];
  const invalidCitations = [];

  for (const citation of citations) {
    if (policyExists(citation, knowledgeBase)) {
      validCitations.push(citation);
    } else {
      invalidCitations.push(citation);
    }
  }

  const isValid = invalidCitations.length === 0;

  return {
    isValid,
    totalCitations: citations.length,
    validCitations,
    invalidCitations,
    message: isValid 
      ? `All ${citations.length} citation(s) are valid`
      : `Found ${invalidCitations.length} invalid citation(s): ${invalidCitations.join(', ')}`
  };
}

/**
 * Validate citations with detailed report including policy info
 * @param {string} text - Text containing citations
 * @param {array} kb - Knowledge base (optional)
 * @returns {object} - Detailed validation report
 */
export function validateCitationsDetailed(text, kb = null) {
  const knowledgeBase = kb || loadKnowledgeBase();
  const basicValidation = validateCitations(text, knowledgeBase);

  // Add policy details for valid citations
  const citationDetails = basicValidation.validCitations.map(policyId => {
    const policy = getPolicyById(policyId, knowledgeBase);
    return {
      policyId,
      question: policy?.question || 'N/A',
      category: policy?.category || 'N/A',
      exists: true
    };
  });

  // Add details for invalid citations
  const invalidDetails = basicValidation.invalidCitations.map(policyId => ({
    policyId,
    exists: false,
    message: 'Policy not found in knowledge base'
  }));

  return {
    ...basicValidation,
    validCitationDetails: citationDetails,
    invalidCitationDetails: invalidDetails
  };
}

/**
 * Remove invalid citations from text
 * @param {string} text - Text with citations
 * @param {array} kb - Knowledge base (optional)
 * @returns {string} - Text with invalid citations removed
 */
export function removeInvalidCitations(text, kb = null) {
  const validation = validateCitations(text, kb);
  
  if (validation.isValid) {
    return text;  // No changes needed
  }

  let cleanedText = text;

  // Remove each invalid citation
  for (const invalidCitation of validation.invalidCitations) {
    const citationPattern = new RegExp(`\\[${invalidCitation}\\]`, 'g');
    cleanedText = cleanedText.replace(citationPattern, '');
  }

  // Clean up any double spaces created by removal
  cleanedText = cleanedText.replace(/\s{2,}/g, ' ').trim();

  return cleanedText;
}

/**
 * Get all PolicyIDs from knowledge base (for reference)
 * @param {array} kb - Knowledge base (optional)
 * @returns {array} - Array of all valid PolicyIDs
 */
export function getAllPolicyIds(kb = null) {
  const knowledgeBase = kb || loadKnowledgeBase();
  return knowledgeBase.map(policy => policy.id);
}

/**
 * Get citation statistics from knowledge base
 * @param {array} kb - Knowledge base (optional)
 * @returns {object} - Statistics
 */
export function getKnowledgeBaseStats(kb = null) {
  const knowledgeBase = kb || loadKnowledgeBase();
  
  const categories = {};
  knowledgeBase.forEach(policy => {
    categories[policy.category] = (categories[policy.category] || 0) + 1;
  });

  return {
    totalPolicies: knowledgeBase.length,
    policiesByCategory: categories,
    allPolicyIds: knowledgeBase.map(p => p.id)
  };
}

// Export singleton knowledge base loader
export { loadKnowledgeBase };