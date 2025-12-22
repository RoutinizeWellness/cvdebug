import { synonymMap, getKeywordsForCategory, type RoleCategory } from "../config/keywords";

export interface KeywordResult {
  foundKeywords: Array<{keyword: string, frequency: number, weight: number}>;
  matchedKeywords: string[];
  missingKeywords: Array<{
    keyword: string;
    priority: string;
    frequency: number;
    impact: number;
    section: string;
    context: string;
    synonyms: string[];
  }>;
  keywordScore: number;
}

// Enhanced fuzzy matching with Levenshtein distance
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Enhanced keyword matching with fuzzy logic
function fuzzyMatch(keyword: string, text: string, threshold: number = 0.85): boolean {
  const keywordLower = keyword.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match
  if (textLower.includes(keywordLower)) return true;
  
  // Split into words for partial matching
  const words = textLower.split(/\s+/);
  
  for (const word of words) {
    if (word.length < 3) continue;
    
    const distance = levenshteinDistance(keywordLower, word);
    const similarity = 1 - (distance / Math.max(keywordLower.length, word.length));
    
    // Dynamic threshold: stricter for shorter words to avoid false positives
    const dynamicThreshold = keywordLower.length < 5 ? 0.92 : threshold;
    
    if (similarity >= dynamicThreshold) return true;
  }
  
  return false;
}

export function calculateKeywordScore(
  ocrText: string,
  category: RoleCategory,
  jobDescription?: string,
  mlConfig?: any
): KeywordResult {
  const text = ocrText.toLowerCase();
  const hasJD = jobDescription && jobDescription.trim().length > 0;
  const jdLower = hasJD ? jobDescription!.toLowerCase() : "";
  
  const relevantKeywords = getKeywordsForCategory(category);
  if (mlConfig?.discoveredKeywords) {
    relevantKeywords.push(...mlConfig.discoveredKeywords);
  }
  
  const findKeywordWithSynonyms = (keyword: string, text: string): { found: boolean, matches: number, matchedTerm: string } => {
    const terms = [keyword, ...(synonymMap[keyword] || [])];
    let totalMatches = 0;
    let matchedTerm = keyword;
    
    for (const term of terms) {
      // Exact match with word boundaries
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        totalMatches += matches.length;
        matchedTerm = term;
      }
      
      // Fuzzy match for typos and variations
      if (totalMatches === 0 && fuzzyMatch(term, text, 0.88)) {
        totalMatches += 1;
        matchedTerm = term;
      }
    }
    
    if (mlConfig?.keywordWeights && mlConfig.keywordWeights[keyword]) {
      totalMatches = Math.round(totalMatches * mlConfig.keywordWeights[keyword]);
    }
    
    return { found: totalMatches > 0, matches: totalMatches, matchedTerm };
  };
  
  let keywordScore = 0;
  const foundKeywords: Array<{keyword: string, frequency: number, weight: number}> = [];
  const missingKeywords: Array<{keyword: string, priority: string, frequency: number, impact: number, section: string, context: string, synonyms: string[]}> = [];
  
  if (hasJD) {
    // Enhanced JD parsing with n-gram extraction
    const jdWords = jdLower.match(/\b[a-z0-9]+\b/g) || [];
    const jdFrequency: Record<string, number> = {};
    
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'we', 'you', 'they', 'our', 'your', 'their']);
    
    // Unigrams
    jdWords.forEach(word => {
      if (word.length >= 3 && !stopWords.has(word)) {
        jdFrequency[word] = (jdFrequency[word] || 0) + 1;
      }
    });
    
    // Bigrams with improved filtering
    for (let i = 0; i < jdWords.length - 1; i++) {
      const word1 = jdWords[i];
      const word2 = jdWords[i + 1];
      
      if (word1.length >= 3 && word2.length >= 3 && (!stopWords.has(word1) || !stopWords.has(word2))) {
        const bigram = `${word1} ${word2}`;
        if (bigram.length >= 6) {
          jdFrequency[bigram] = (jdFrequency[bigram] || 0) + 1.8;
        }
      }
    }
    
    // Trigrams for technical phrases
    for (let i = 0; i < jdWords.length - 2; i++) {
      const word1 = jdWords[i];
      const word2 = jdWords[i + 1];
      const word3 = jdWords[i + 2];
      
      if (word1.length >= 3 && word3.length >= 3) {
        const trigram = `${word1} ${word2} ${word3}`;
        if (trigram.length >= 10 && (!stopWords.has(word1) && !stopWords.has(word3))) {
          jdFrequency[trigram] = (jdFrequency[trigram] || 0) + 2.5;
        }
      }
    }
    
    // Enhanced IDF calculation with domain knowledge
    const calculateIDF = (term: string): number => {
      if (stopWords.has(term)) return 0.05;
      
      // High value for known technical keywords
      if (relevantKeywords.includes(term)) return 3.5;
      
      // High value for synonyms
      if (synonymMap[term] || Object.values(synonymMap).some(syns => syns.includes(term))) {
        return 3.2;
      }
      
      const wordCount = term.split(' ').length;
      
      // Multi-word phrases are more valuable
      if (wordCount === 3) return 3.0;
      if (wordCount === 2) return 2.5;
      
      // Length-based scoring for single words
      if (term.length >= 12) return 2.3;
      if (term.length >= 10) return 2.0;
      if (term.length >= 7) return 1.5;
      if (term.length >= 5) return 1.0;
      
      return 0.5;
    };
    
    // Calculate TF-IDF scores
    const sortedJDKeywords = Object.entries(jdFrequency)
      .map(([term, freq]) => ({
        term,
        freq,
        tf: freq / jdWords.length,
        idf: calculateIDF(term),
        tfidf: (freq / jdWords.length) * calculateIDF(term)
      }))
      .sort((a, b) => b.tfidf - a.tfidf)
      .slice(0, 50); // Increased from 40 to capture more keywords
    
    sortedJDKeywords.forEach(({ term, freq, tfidf }) => {
      if (term.length < 3) return;
      
      let weight = 0;
      let priority = "nice-to-have";
      let impact = 3;
      
      // Enhanced priority classification
      if (tfidf > 0.08 || freq >= 5) {
        weight = 6;
        priority = "critical";
        impact = 10;
      } else if (tfidf > 0.05 || freq >= 3) {
        weight = 5;
        priority = "critical";
        impact = 10;
      } else if (tfidf > 0.02 || freq === 2) {
        weight = 3;
        priority = "important";
        impact = 7;
      } else {
        weight = 1;
        impact = 3;
      }
      
      const result = findKeywordWithSynonyms(term, ocrText);
      
      if (result.found) {
        // Enhanced context detection
        const contextPatterns = [
          new RegExp(`(experience|project|developed|built|designed|implemented|created|led|managed).*${result.matchedTerm}`, 'i'),
          new RegExp(`${result.matchedTerm}.*(experience|project|developed|built|designed|implemented|created|led|managed)`, 'i'),
          new RegExp(`(proficient|expert|skilled|specialized).*${result.matchedTerm}`, 'i'),
          new RegExp(`${result.matchedTerm}.*(proficient|expert|skilled|specialized)`, 'i')
        ];
        
        const hasContext = contextPatterns.some(pattern => pattern.test(text));
        const contextMultiplier = hasContext ? 1.6 : 1.0;
        
        // Recency detection (first 30% of resume)
        const firstThird = ocrText.substring(0, ocrText.length * 0.3);
        const isRecent = findKeywordWithSynonyms(term, firstThird).found;
        const recencyMultiplier = isRecent ? 1.3 : 1.0;
        
        // Frequency bonus
        const frequencyMultiplier = Math.min(1.5, 1.0 + (result.matches * 0.1));
        
        const finalWeight = weight * contextMultiplier * recencyMultiplier * frequencyMultiplier;
        
        foundKeywords.push({
          keyword: term,
          frequency: result.matches,
          weight: finalWeight
        });
        keywordScore += finalWeight;
      } else {
        missingKeywords.push({
          keyword: term,
          priority,
          frequency: freq,
          impact,
          section: "Experience",
          context: `Add "${term}" to relevant experience bullets with specific context and metrics. Example: "Implemented ${term} to achieve [specific result with numbers]"`,
          synonyms: synonymMap[term] || []
        });
      }
    });
    
    const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.keywords || 0);
    keywordScore = Math.min(40, keywordScore * scoringMultiplier);
    
  } else {
    // No JD - use category-based keywords with enhanced matching
    relevantKeywords.forEach(keyword => {
      const result = findKeywordWithSynonyms(keyword, ocrText);
      
      if (result.found) {
        // Context and recency bonuses
        const hasContext = /experience|project|developed|built|designed|implemented/i.test(ocrText);
        const contextBonus = hasContext ? 0.3 : 0;
        
        const firstThird = ocrText.substring(0, ocrText.length * 0.3);
        const isRecent = findKeywordWithSynonyms(keyword, firstThird).found;
        const recencyBonus = isRecent ? 0.2 : 0;
        
        const baseWeight = 1.5;
        const finalWeight = baseWeight + contextBonus + recencyBonus;
        
        foundKeywords.push({
          keyword,
          frequency: result.matches,
          weight: finalWeight
        });
        keywordScore += finalWeight;
      }
    });
    
    const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.keywords || 0);
    keywordScore = Math.min(40, keywordScore * scoringMultiplier);
  }
  
  return { 
    foundKeywords, 
    matchedKeywords: foundKeywords.map(kw => kw.keyword), // Add flat array for UI compatibility
    missingKeywords, 
    keywordScore 
  };
}