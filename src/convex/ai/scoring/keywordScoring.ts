import { synonymMap, getKeywordsForCategory, type RoleCategory } from "../config/keywords";

export interface KeywordResult {
  foundKeywords: Array<{keyword: string, frequency: number, weight: number}>;
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
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        totalMatches += matches.length;
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
    const jdWords = jdLower.match(/\b[a-z0-9]+\b/g) || [];
    const jdFrequency: Record<string, number> = {};
    
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
    
    jdWords.forEach(word => {
      if (word.length >= 3 && !stopWords.has(word)) {
        jdFrequency[word] = (jdFrequency[word] || 0) + 1;
      }
    });
    
    for (let i = 0; i < jdWords.length - 1; i++) {
      if (!stopWords.has(jdWords[i]) || !stopWords.has(jdWords[i + 1])) {
        const bigram = `${jdWords[i]} ${jdWords[i + 1]}`;
        if (bigram.length >= 6) {
          jdFrequency[bigram] = (jdFrequency[bigram] || 0) + 1.5;
        }
      }
    }
    
    for (let i = 0; i < jdWords.length - 2; i++) {
      const trigram = `${jdWords[i]} ${jdWords[i + 1]} ${jdWords[i + 2]}`;
      if (trigram.length >= 10 && !stopWords.has(jdWords[i]) && !stopWords.has(jdWords[i + 2])) {
        jdFrequency[trigram] = (jdFrequency[trigram] || 0) + 2.0;
      }
    }
    
    const calculateIDF = (term: string): number => {
      if (stopWords.has(term)) return 0.05;
      if (relevantKeywords.includes(term)) return 3.0;
      if (synonymMap[term] || Object.values(synonymMap).some(syns => syns.includes(term))) {
        return 2.8;
      }
      const wordCount = term.split(' ').length;
      if (wordCount === 2) return 2.2;
      if (wordCount >= 3) return 2.5;
      if (term.length >= 10) return 2.0;
      if (term.length >= 7) return 1.5;
      if (term.length >= 5) return 1.0;
      return 0.5;
    };
    
    const sortedJDKeywords = Object.entries(jdFrequency)
      .map(([term, freq]) => ({
        term,
        freq,
        tf: freq / jdWords.length,
        idf: calculateIDF(term),
        tfidf: (freq / jdWords.length) * calculateIDF(term)
      }))
      .sort((a, b) => b.tfidf - a.tfidf)
      .slice(0, 40);
    
    sortedJDKeywords.forEach(({ term, freq, tfidf }) => {
      if (term.length < 3) return;
      
      let weight = 0;
      let priority = "nice-to-have";
      let impact = 3;
      
      if (tfidf > 0.05 || freq >= 3) {
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
        const contextPatterns = [
          new RegExp(`(experience|project|developed|built|designed|implemented).*${result.matchedTerm}`, 'i'),
          new RegExp(`${result.matchedTerm}.*(experience|project|developed|built|designed|implemented)`, 'i')
        ];
        
        const hasContext = contextPatterns.some(pattern => pattern.test(text));
        const contextMultiplier = hasContext ? 1.5 : 1.0;
        
        const firstThird = ocrText.substring(0, ocrText.length * 0.3);
        const isRecent = findKeywordWithSynonyms(term, firstThird).found;
        const recencyMultiplier = isRecent ? 1.2 : 1.0;
        
        const finalWeight = weight * contextMultiplier * recencyMultiplier;
        
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
    relevantKeywords.forEach(keyword => {
      const result = findKeywordWithSynonyms(keyword, ocrText);
      
      if (result.found) {
        foundKeywords.push({
          keyword,
          frequency: result.matches,
          weight: 1.5
        });
        keywordScore += 1.5;
      }
    });
    
    const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.keywords || 0);
    keywordScore = Math.min(40, keywordScore * scoringMultiplier);
  }
  
  return { foundKeywords, missingKeywords, keywordScore };
}
