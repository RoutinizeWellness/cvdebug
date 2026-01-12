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
        // MISSING KEYWORD - Generate smart, actionable context based on keyword type
        let section = "Experience";
        let contextExample: string;

        // Detect keyword type for better recommendations
        const isToolOrTech = /[A-Z]/.test(term) || term.includes('.') || term.includes('-') || term.includes('/');
        const isMethodology = /agile|scrum|kanban|waterfall|devops|lean/i.test(term);
        const isSkill = /design|develop|manage|lead|analyz|optimi|implement|architect|deploy/i.test(term);
        const isMultiWord = term.includes(' ');

        if (isToolOrTech) {
          section = "Technical Skills";
          contextExample = `Add "${term}" to your resume with measurable impact. Example: "Utilized ${term} to ${isMultiWord ? 'streamline' : 'build'} [specific system/feature] reducing [problem] by X% or saving $Y"`;
        } else if (isMethodology) {
          section = "Experience & Methodologies";
          contextExample = `Demonstrate "${term}" experience with concrete outcomes. Example: "Applied ${term} practices to ${isMultiWord ? 'transform team workflow' : 'improve delivery'} achieving X% faster releases and Y% fewer defects"`;
        } else if (isSkill) {
          section = "Core Competencies";
          contextExample = `Highlight your "${term}" capabilities with quantifiable achievements. Example: "Successfully ${term.toLowerCase()}ed [project name] for [company/team] resulting in [specific metric: 40% efficiency gain, $100K revenue increase, etc.]"`;
        } else {
          // Default context for domain-specific terms
          contextExample = `Incorporate "${term}" naturally with business impact. Example: "Leveraged ${term} expertise to [solve specific challenge] delivering [measurable result like 25% cost reduction or 50% time savings]"`;
        }

        missingKeywords.push({
          keyword: term,
          priority,
          frequency: freq,
          impact,
          section,
          context: contextExample,
          synonyms: synonymMap[term] || []
        });
      }
    });

    // GUARANTEE: Ensure at least 3-5 high-quality missing keywords even if resume is strong
    if (missingKeywords.length < 3 && sortedJDKeywords.length > 0) {
      console.log(`[Keywords] JD analysis found few missing keywords - enhancing with category keywords`);

      // Add some category-relevant keywords not in JD but valuable for the role
      const categoryKeywords = relevantKeywords.slice(0, 15); // Top 15 from category
      for (const kw of categoryKeywords) {
        const result = findKeywordWithSynonyms(kw, ocrText);
        if (!result.found && missingKeywords.length < 8) {
          missingKeywords.push({
            keyword: kw,
            priority: "important",
            frequency: 1,
            impact: 8,
            section: "Core Skills",
            context: `While not explicitly in the job description, "${kw}" is a valuable skill for this role. Example: "Applied ${kw} to enhance [system/process] improving [key metric] by X%"`,
            synonyms: synonymMap[kw] || []
          });
        }
      }
    }

    // Sort missing keywords by impact and frequency (most valuable first)
    missingKeywords.sort((a, b) => {
      const scoreA = (a.impact || 5) * ((a.frequency || 1) / 10);
      const scoreB = (b.impact || 5) * ((b.frequency || 1) / 10);
      return scoreB - scoreA;
    });

    console.log(`[Keywords] JD-based analysis: ${foundKeywords.length} found, ${missingKeywords.length} missing from ${sortedJDKeywords.length} JD terms`);
    
    const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.keywords || 0);
    keywordScore = Math.min(40, keywordScore * scoringMultiplier);
    
  } else {
    // No JD - use category-based keywords with enhanced matching
    // CRITICAL: Always generate missing keywords list for users who paid!

    // Divide keywords into tiers for better prioritization
    const totalKeywords = relevantKeywords.length;
    const tier1Count = Math.ceil(totalKeywords * 0.25); // Top 25% - Most critical
    const tier2Count = Math.ceil(totalKeywords * 0.35); // Next 35% - Important
    // Rest are nice-to-have (tier 3)

    // Track found and missing by tier
    let tier1Found = 0;
    let tier2Found = 0;
    let tier3Found = 0;

    relevantKeywords.forEach((keyword, index) => {
      const result = findKeywordWithSynonyms(keyword, ocrText);

      // Determine tier
      let tier: 1 | 2 | 3 = 3;
      if (index < tier1Count) tier = 1;
      else if (index < tier1Count + tier2Count) tier = 2;

      if (result.found) {
        // Track tier found
        if (tier === 1) tier1Found++;
        else if (tier === 2) tier2Found++;
        else tier3Found++;

        // Context and recency bonuses
        const hasContext = /experience|project|developed|built|designed|implemented|created|led|managed/i.test(ocrText);
        const contextBonus = hasContext ? 0.3 : 0;

        const firstThird = ocrText.substring(0, ocrText.length * 0.3);
        const isRecent = findKeywordWithSynonyms(keyword, firstThird).found;
        const recencyBonus = isRecent ? 0.2 : 0;

        const baseWeight = tier === 1 ? 2.0 : tier === 2 ? 1.5 : 1.0;
        const finalWeight = baseWeight + contextBonus + recencyBonus;

        foundKeywords.push({
          keyword,
          frequency: result.matches,
          weight: finalWeight
        });
        keywordScore += finalWeight;
      } else {
        // KEYWORD MISSING - Add to missing list with tier-based priority
        let priority: string;
        let impact: number;
        let section: string;

        if (tier === 1) {
          priority = "critical";
          impact = 10;
          section = "Skills & Experience";
        } else if (tier === 2) {
          priority = "important";
          impact = 7;
          section = "Experience";
        } else {
          priority = "nice-to-have";
          impact = 5;
          section = "Skills";
        }

        // Generate context examples based on keyword type
        let contextExample: string;
        const isToolOrTech = /[A-Z]/.test(keyword) || keyword.includes('.') || keyword.includes('-');
        const isSkill = /design|develop|manage|lead|analyz|optimi|implement/i.test(keyword);

        if (isToolOrTech) {
          contextExample = `Add "${keyword}" to your technical skills and experience sections. Example: "Leveraged ${keyword} to build/optimize [specific feature/system] achieving [quantifiable result like 30% faster performance]"`;
        } else if (isSkill) {
          contextExample = `Demonstrate "${keyword}" with concrete examples. Example: "Successfully ${keyword.toLowerCase()}ed [specific project] resulting in [measurable outcome such as $50K cost savings or 40% efficiency gain]"`;
        } else {
          contextExample = `Incorporate "${keyword}" naturally in your experience bullets. Example: "Applied ${keyword} expertise to [solve specific problem] delivering [tangible impact with metrics]"`;
        }

        missingKeywords.push({
          keyword,
          priority,
          frequency: tier === 1 ? 3 : tier === 2 ? 2 : 1,
          impact,
          section,
          context: contextExample,
          synonyms: synonymMap[keyword] || []
        });
      }
    });

    // GUARANTEE: Ensure there are ALWAYS meaningful missing keywords
    // If user has too many keywords (>80%), add advanced/emerging keywords
    const coveragePercent = (foundKeywords.length / relevantKeywords.length) * 100;
    if (coveragePercent > 80 && missingKeywords.length < 5) {
      console.log(`[Keywords] High coverage (${coveragePercent.toFixed(1)}%) - Adding advanced keywords`);

      // Advanced keywords that show expertise growth
      const advancedKeywords = [
        { kw: "CI/CD", ctx: "Implement CI/CD pipelines using tools like GitHub Actions, Jenkins, or GitLab CI to automate deployment and reduce release time by 60%", impact: 9 },
        { kw: "microservices", ctx: "Architect microservices-based systems to improve scalability and enable independent team deployment, reducing downtime by 40%", impact: 9 },
        { kw: "cloud architecture", ctx: "Design cloud-native architecture on AWS/Azure/GCP to optimize costs by 35% while improving system reliability to 99.9% uptime", impact: 9 },
        { kw: "test automation", ctx: "Build automated testing frameworks (Jest, Pytest, Selenium) to increase test coverage from 40% to 90% and catch bugs 3x faster", impact: 8 },
        { kw: "performance optimization", ctx: "Profile and optimize application performance using tools like New Relic, reducing load times by 50% and improving user retention by 25%", impact: 8 },
        { kw: "code review", ctx: "Lead code review practices and establish coding standards, reducing bug density by 30% and improving team code quality scores", impact: 8 },
        { kw: "agile methodology", ctx: "Drive agile/scrum ceremonies (sprint planning, retrospectives) to improve team velocity by 40% and on-time delivery to 95%", impact: 7 },
        { kw: "technical documentation", ctx: "Create comprehensive technical documentation and API specs, reducing onboarding time for new engineers by 50%", impact: 7 },
      ];

      for (const adv of advancedKeywords) {
        const result = findKeywordWithSynonyms(adv.kw, ocrText);
        if (!result.found) {
          missingKeywords.push({
            keyword: adv.kw,
            priority: "important",
            frequency: 2,
            impact: adv.impact,
            section: "Advanced Skills",
            context: adv.ctx,
            synonyms: []
          });
        }
      }
    }

    // Sort missing keywords by impact (highest first) to show most valuable ones first
    missingKeywords.sort((a, b) => (b.impact || 5) - (a.impact || 5));

    console.log(`[Keywords] Category-based analysis: ${foundKeywords.length} found, ${missingKeywords.length} missing`);
    const tier3Total = totalKeywords - tier1Count - tier2Count;
    console.log(`[Keywords] Tier coverage: T1=${tier1Found}/${tier1Count}, T2=${tier2Found}/${tier2Count}, T3=${tier3Found}/${tier3Total}`);

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