import { 
  synonymMap,
  getKeywordsForCategory,
  classifyRole,
  type RoleCategory,
  actionVerbs
} from "./config/keywords";
import { getMetricsForCategory, generateSmartMetricSuggestions } from "./config/metricTemplates";
import { checkBuzzwords, checkCapitalization, checkRepetitiveStarts } from "./qualityChecks";
import { analyzeBulletPoints, analyzeSoftSkills } from "./contentAnalysis";

// Enhanced ML-based fallback analysis with adaptive learning
export function generateFallbackAnalysis(
  ocrText: string, 
  jobDescription?: string,
  mlConfig?: {
    keywordWeights?: Record<string, number>;
    categoryWeights?: Record<string, number>;
    scoringAdjustments?: { keywords?: number; format?: number; completeness?: number };
    discoveredKeywords?: string[];
  }
): any {
  console.log("[Fallback Analysis] Generating ML-based analysis with adaptive learning");
  
  const text = ocrText.toLowerCase();
  const hasJD = jobDescription && jobDescription.trim().length > 0;
  const jdLower = hasJD ? jobDescription!.toLowerCase() : "";
  
  // Apply learned adjustments if available
  const scoringMultipliers = {
    keywords: 1.0 + (mlConfig?.scoringAdjustments?.keywords || 0),
    format: 1.0 + (mlConfig?.scoringAdjustments?.format || 0),
    completeness: 1.0 + (mlConfig?.scoringAdjustments?.completeness || 0),
  };
  
  // ===== FEATURE EXTRACTION =====
  
  const emailMatch = ocrText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = ocrText.match(/\+?[\d\s()-]{10,}/);
  const hasLinkedIn = text.includes("linkedin") || text.includes("linked.in");
  
  // ===== ENHANCED ROLE CLASSIFICATION WITH LEARNED WEIGHTS =====
  
  const { category, confidence } = classifyRole(ocrText);
  
  // Apply learned category weights if available
  let adjustedCategory = category;
  if (mlConfig?.categoryWeights) {
    const categoryScores = Object.entries(mlConfig.categoryWeights).map(([cat, weight]) => ({
      category: cat as RoleCategory,
      score: weight as number,
    }));
    
    if (categoryScores.length > 0) {
      const topCategory = categoryScores.sort((a, b) => b.score - a.score)[0];
      if (topCategory.score > confidence) {
        adjustedCategory = topCategory.category;
        console.log(`[ML Learning] Category adjusted from ${category} to ${adjustedCategory} based on learned weights`);
      }
    }
  }
  
  const relevantKeywords = getKeywordsForCategory(adjustedCategory);
  // Add discovered keywords from ML learning
  if (mlConfig?.discoveredKeywords) {
    relevantKeywords.push(...mlConfig.discoveredKeywords);
  }
  
  console.log(`[Role Classification] Category: ${adjustedCategory}, Confidence: ${(confidence * 100).toFixed(1)}%`);
  
  // ===== NEW: CONTENT QUALITY ANALYSIS =====
  const bulletAnalysis = analyzeBulletPoints(ocrText);
  const softSkillsAnalysis = analyzeSoftSkills(ocrText);

  // ===== ENHANCED TF-IDF WITH LEARNED KEYWORD WEIGHTS =====
  
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
    
    // Apply learned keyword weight if available
    if (mlConfig?.keywordWeights && mlConfig.keywordWeights[keyword]) {
      totalMatches = Math.round(totalMatches * mlConfig.keywordWeights[keyword]);
      console.log(`[ML Learning] Keyword "${keyword}" weight adjusted by ${mlConfig.keywordWeights[keyword]}x`);
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
    
    keywordScore = Math.min(40, keywordScore * scoringMultipliers.keywords);
    
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
    
    keywordScore = Math.min(40, keywordScore * scoringMultipliers.keywords);
  }
  
  // ===== FORMAT QUALITY SCORING (ML-based) =====
  
  let formatScore = 0;
  const formatIssues: Array<{issue: string, severity: string, fix: string, location: string, atsImpact: string}> = [];
  
  // Contact info detection (5 points each)
  if (emailMatch) {
    formatScore += 5;
  } else {
    formatIssues.push({
      issue: "Missing email address",
      severity: "high",
      fix: "Add a professional email address at the top of your resume (e.g., firstname.lastname@email.com)",
      location: "Header",
      atsImpact: "ATS cannot contact you without email - automatic rejection"
    });
  }
  
  if (phoneMatch) {
    formatScore += 5;
  } else {
    formatIssues.push({
      issue: "Missing phone number",
      severity: "medium",
      fix: "Add your phone number in the header with proper formatting (e.g., +1-555-123-4567)",
      location: "Header",
      atsImpact: "Reduces contact options for recruiters"
    });
  }
  
  if (hasLinkedIn) {
    formatScore += 3;
  }
  
  // Section header detection (ML pattern matching)
  const hasExperience = /experience|work history|employment/i.test(ocrText);
  const hasEducation = /education|academic|degree/i.test(ocrText);
  const hasSkills = /skills|technical skills|competencies/i.test(ocrText);
  
  if (hasExperience) formatScore += 6;
  else formatIssues.push({
    issue: "Missing 'Experience' section header",
    severity: "high",
    fix: "Add a clear 'Experience' or 'Work History' section header",
    location: "Body",
    atsImpact: "ATS cannot identify your work experience - major parsing failure"
  });
  
  if (hasEducation) formatScore += 4;
  if (hasSkills) formatScore += 4;
  
  // Date format consistency check
  const datePatterns = [
    /\d{1,2}\/\d{4}/g,  // MM/YYYY
    /\d{4}-\d{2}/g,      // YYYY-MM
    /[A-Z][a-z]+ \d{4}/g // Month YYYY
  ];
  
  const dateMatches = datePatterns.map(pattern => (ocrText.match(pattern) || []).length);
  const hasConsistentDates = dateMatches.filter(count => count > 0).length <= 1;
  
  if (hasConsistentDates) {
    formatScore += 3;
  } else {
    formatIssues.push({
      issue: "Inconsistent date formats",
      severity: "medium",
      fix: "Use a single date format throughout (recommended: 'Month YYYY' e.g., 'January 2020')",
      location: "Experience section",
      atsImpact: "Confuses ATS timeline parsing, may misorder your experience"
    });
  }

  // NEW: Capitalization Check
  const capitalizationIssues = checkCapitalization(ocrText);
  if (capitalizationIssues.length > 0) {
    formatIssues.push({
      issue: "Incorrect Technical Capitalization",
      severity: "low",
      fix: `Correct the capitalization of technical terms: ${capitalizationIssues.join(", ")}`,
      location: "Skills/Experience",
      atsImpact: "Indicates lack of attention to detail to human recruiters"
    });
  } else {
    formatScore += 2;
  }

  // NEW: Repetition Check
  const repetitionIssues = checkRepetitiveStarts(ocrText);
  if (repetitionIssues.length > 0) {
    formatIssues.push({
      issue: "Repetitive Sentence Starters",
      severity: "medium",
      fix: `Vary your action verbs. Found repetition: ${repetitionIssues.join(", ")}`,
      location: "Experience Bullets",
      atsImpact: "Reduces readability and engagement"
    });
  } else {
    formatScore += 2;
  }
  
  formatScore = Math.min(30, formatScore * scoringMultipliers.format);
  
  // ===== CONTENT QUALITY & IMPACT SCORING =====
  
  let completenessScore = 0;
  
  // Quantifiable metrics detection (ML pattern recognition)
  const metricPatterns = [
    /\d+%/g,                           // Percentages
    /\$[\d,]+/g,                       // Dollar amounts
    /\d+\+?\s*(users|customers|clients)/gi,  // User counts
    /increased|improved|reduced|optimized/gi, // Impact verbs
    /\d+x\s/g,                         // Multipliers (e.g., "10x faster")
    /\d+\s*(million|billion|thousand)/gi,    // Large numbers
  ];
  
  let metricCount = 0;
  metricPatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) metricCount += matches.length;
  });

  // Score based on metric density (Stricter thresholds for realism)
  if (metricCount >= 12) completenessScore += 15;
  else if (metricCount >= 8) completenessScore += 10;
  else if (metricCount >= 5) completenessScore += 6;
  else if (metricCount >= 2) completenessScore += 3;
  
  // NEW: Integrate Bullet Point Quality Score
  // We blend the bullet analysis score into completeness
  const bulletQualityContribution = (bulletAnalysis.score / 100) * 10; // Max 10 points
  completenessScore += bulletQualityContribution;

  // NEW: Integrate Soft Skills Score
  // Small bonus for soft skills
  const softSkillsContribution = (softSkillsAnalysis.score / 100) * 5; // Max 5 points
  completenessScore += softSkillsContribution;

  // ENHANCED SENTIMENT ANALYSIS
  // 1. Power Phrases (Action + Metric + Result)
  const powerPhrasePatterns = [
    /\b(increased|reduced|improved|grew|saved|generated)\b.{0,30}\b(\d+%|\$\d+)\b/i,
    /\b(achieved|delivered|completed)\b.{0,30}\b(under budget|ahead of schedule)\b/i,
    /\b(led|managed|spearheaded)\b.{0,30}\b(team|project|initiative)\b.{0,30}\b(result|outcome|success)\b/i
  ];
  
  let powerPhraseCount = 0;
  powerPhrasePatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) powerPhraseCount += matches.length;
  });

  // 2. Weak/Passive Language Detection
  const weakPhrases = [
    "responsible for", "duties included", "worked on", "helped with", "assisted in", 
    "attempted to", "tried to", "participated in", "familiar with"
  ];
  
  let weakPhraseCount = 0;
  weakPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = ocrText.match(regex);
    if (matches) weakPhraseCount += matches.length;
  });

  // 3. Growth Mindset Language
  const growthWords = ["learned", "adapted", "upskilled", "certified", "trained", "mentored", "volunteered"];
  let growthCount = 0;
  growthWords.forEach(word => {
    if (text.includes(word)) growthCount++;
  });

  // Sentiment Scoring Logic
  let sentimentScore = 0;
  
  // Base score from strong verbs (existing logic)
  const strongVerbs = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'gi');
  const strongVerbMatches = (ocrText.match(strongVerbs) || []).length;
  
  if (strongVerbMatches >= 8) sentimentScore += 8;
  else if (strongVerbMatches >= 5) sentimentScore += 5;
  else if (strongVerbMatches >= 2) sentimentScore += 2;
  
  // Adjust based on Power Phrases vs Weak Phrases
  sentimentScore += (powerPhraseCount * 1.5); // Bonus for result-oriented phrasing
  sentimentScore -= (weakPhraseCount * 0.5);  // Penalty for passive phrasing
  sentimentScore += (growthCount * 0.5);      // Bonus for growth mindset

  // NEW: Buzzword Penalty
  const foundBuzzwords = checkBuzzwords(ocrText);
  if (foundBuzzwords.length > 0) {
    sentimentScore -= (foundBuzzwords.length * 0.5);
    // Add to format issues as a content warning
    formatIssues.push({
      issue: "Overused Buzzwords Detected",
      severity: "low",
      fix: `Replace clichés with specific examples: ${foundBuzzwords.slice(0, 3).join(", ")}`,
      location: "Summary/Experience",
      atsImpact: "Generic terms fail to differentiate you from other candidates"
    });
  }
  
  // Cap sentiment contribution to completeness score
  const sentimentContribution = Math.max(0, Math.min(15, sentimentScore));
  
  completenessScore += sentimentContribution;
  
  // Resume length analysis
  if (ocrText.length > 1500) completenessScore += 5;
  else if (ocrText.length > 800) completenessScore += 3;
  
  // Professional summary detection
  const hasSummary = /summary|objective|profile/i.test(ocrText);
  if (hasSummary) completenessScore += 2;
  
  completenessScore = Math.max(0, Math.min(30, completenessScore * scoringMultipliers.completeness));
  
  // ===== FINAL SCORE CALCULATION =====
  
  let rawScore = keywordScore + formatScore + completenessScore;

  // Apply "Realism Curve" - harder to get high scores
  // Most resumes naturally fall between 40-70. We compress the top end to make >75 hard.
  if (rawScore > 60) {
    // For every point above 60, you only get 0.6 points
    // Example: Raw 80 -> 60 + (20 * 0.6) = 72
    // Example: Raw 90 -> 60 + (30 * 0.6) = 78
    // Example: Raw 100 -> 60 + (40 * 0.6) = 84
    rawScore = 60 + (rawScore - 60) * 0.6;
  }
  
  const totalScore = Math.round(Math.min(100, Math.max(0, rawScore)));
  
  // ===== ENHANCED METRIC SUGGESTIONS (Role-Specific & Context-Aware) =====
  
  const metricSuggestions = generateSmartMetricSuggestions(ocrText, adjustedCategory, foundKeywords);
  
  // ===== GENERATE DETAILED ANALYSIS WITH ENHANCED SECTIONS =====
  
  const analysis = `
### 🤖 ATS Parsing Report

**Parsing Quality: ${formatScore > 20 ? 'Excellent ✅' : formatScore > 10 ? 'Good ⚠️' : 'Needs Improvement 🚨'}**

${hasJD ? '**Analysis Mode:** 🎯 Tailored to job description with advanced keyword matching' : '**Analysis Mode:** 📊 Industry-standard analysis with intelligent classification'}

**Role Classification:** ${adjustedCategory} (Confidence: ${(confidence * 100).toFixed(0)}%)
**Contact Information:** ${emailMatch && phoneMatch ? '✅ Complete' : '⚠️ Incomplete'}
**Section Headers:** ${hasExperience && hasEducation ? '✅ Present' : '⚠️ Some Missing'}
**Date Formats:** ${hasConsistentDates ? '✅ Consistent' : '⚠️ Inconsistent'}

---

### 📊 Detailed Score Breakdown

**Keywords & Content Match: ${Math.round(keywordScore)}/40 points**
- Found ${foundKeywords.length} relevant keywords with weighted scoring
- Keyword density: ${foundKeywords.length > 0 ? 'Good ✅' : 'Low 🚨'}
${hasJD ? `- Missing ${missingKeywords.length} critical JD keywords` : ''}
${foundKeywords.slice(0, 5).map(k => `  • ${k.keyword} (freq: ${k.frequency}, weight: ${k.weight.toFixed(1)})`).join('\n')}

**Format & Parseability: ${Math.round(formatScore)}/30 points**
- Contact info: ${emailMatch ? '✅' : '❌'} Email, ${phoneMatch ? '✅' : '❌'} Phone, ${hasLinkedIn ? '✅' : '❌'} LinkedIn
- Section headers: ${hasExperience ? '✅' : '❌'} Experience, ${hasEducation ? '✅' : '❌'} Education, ${hasSkills ? '✅' : '❌'} Skills
- Date consistency: ${hasConsistentDates ? '✅' : '❌'}

**Completeness & Impact: ${Math.round(completenessScore)}/30 points**
- **Bullet Point Quality:** ${bulletAnalysis.score > 70 ? 'Strong ✅' : bulletAnalysis.score > 50 ? 'Good ⚠️' : 'Needs Improvement 🚨'}
  - ${bulletAnalysis.strongBullets.length} high-impact bullets found
  - ${bulletAnalysis.weakBullets.length} weak bullets detected
- **Soft Skills:** ${softSkillsAnalysis.found.length} detected (${softSkillsAnalysis.found.slice(0, 3).join(', ')})
- **Quantified achievements:** ${metricCount} metrics found (Target: 8+ for scores >80)
- **Strong action verbs:** ${strongVerbMatches} detected
- **Resume length:** ${ocrText.length > 1500 ? 'Adequate ✅' : 'Could be expanded ⚠️'}

---

### 🔑 Critical Missing Keywords (TF-IDF Weighted)

${missingKeywords.slice(0, 5).map((kw, i) => `
${i + 1}. **${kw.keyword}** (Priority: ${kw.priority.toUpperCase()})
   - Frequency in JD: ${kw.frequency}x
   - Estimated impact: +${kw.impact} points
   - **How to add:** ${kw.context}
   - **Section:** ${kw.section}
   ${kw.synonyms && kw.synonyms.length > 0 ? `- **Related terms:** ${kw.synonyms.slice(0, 3).join(', ')}` : ''}
`).join('\n')}

${missingKeywords.length === 0 ? '✅ No critical keywords missing - excellent job!' : ''}

---

### 💡 Smart Metric Suggestions (Actionable)

${metricSuggestions.length > 0 ? metricSuggestions.map((suggestion, i) => `
${i + 1}. **${suggestion.tech}**
   - **Current:** ${suggestion.currentUsage}
   - **Suggested:** ${suggestion.suggestedMetric}
   - **Example:** ${suggestion.example}
   - **Why it matters:** ${suggestion.impact}
`).join('\n') : '✅ Your metrics are well-documented!'}

---

### ⚠️ Format & Content Issues

${formatIssues.map((issue, i) => `
${i + 1}. **${issue.issue}** (Severity: ${issue.severity.toUpperCase()})
   - **Location:** ${issue.location}
   - **ATS Impact:** ${issue.atsImpact}
   - **Fix:** ${issue.fix}
`).join('\n')}

${bulletAnalysis.issues.map((issue, i) => `
${formatIssues.length + i + 1}. **Content Quality Issue**
   - **Issue:** ${issue}
   - **Fix:** Use the "Action + Task + Result" formula. Example: "Architected microservices processing 2TB daily, reducing latency by 45%"
`).join('\n')}

${formatIssues.length === 0 && bulletAnalysis.issues.length === 0 ? '✅ No major issues detected!' : ''}

---

### 🎯 ML-Based Recommendations (Prioritized by Impact)

**Priority Actions (Highest Impact First):**

${totalScore < 50 ? `
1. **🚨 CRITICAL: Fix parsing issues** (+${30 - formatScore} points potential)
   - ${!emailMatch ? '📧 Add email address in header' : ''}
   - ${!hasExperience ? '📝 Add "Experience" section header' : ''}
   - ${formatIssues.length > 0 ? formatIssues[0].fix : ''}

2. **🔑 Add missing keywords** (+${Math.min(15, missingKeywords.length * 3)} points potential)
   - Focus on: ${missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')}
   - ${missingKeywords.length > 0 ? missingKeywords[0].context : ''}

3. **📊 Quantify achievements** (+${15 - (completenessScore > 15 ? 15 : completenessScore)} points potential)
   - Add numbers, percentages, and metrics to your bullets
   - Use templates from "Smart Metric Suggestions" above
` : totalScore < 75 ? `
1. **🔑 Enhance keyword coverage** (+${Math.min(10, missingKeywords.length * 2)} points potential)
   - Add: ${missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')}
   - ${missingKeywords.length > 0 ? missingKeywords[0].context : ''}

2. **💪 Strengthen impact statements** (+${Math.min(8, 30 - completenessScore)} points potential)
   - Use more quantifiable metrics (%, $, numbers)
   - Replace weak verbs with strong action verbs
   - **Improve Bullet Points:** ${bulletAnalysis.weakBullets.length > 0 ? `Rewrite weak bullets like "${bulletAnalysis.weakBullets[0].substring(0, 50)}..."` : 'Ensure all bullets have metrics'}

3. **✨ Polish formatting** (+${Math.min(5, 30 - formatScore)} points potential)
   - ${formatIssues.length > 0 ? formatIssues[0].fix : 'Ensure consistent formatting throughout'}
` : `
✅ **Your resume is well-optimized!** Minor improvements:

1. Continue adding quantifiable metrics where possible
2. Keep keywords updated with industry trends
3. Maintain consistent formatting
4. ${metricSuggestions.length > 0 ? `Consider adding metrics for: ${metricSuggestions[0].tech}` : 'Keep up the great work!'}
`}

---

### 💡 Pro Tips for ${adjustedCategory} Roles

${adjustedCategory === "Engineering" ? `
**Engineering Resume Best Practices:**
- ✅ Lead with project scale and impact (e.g., "Designed 6-story, 5,000 m² structure")
- ✅ Include specific codes/standards (IBC, ASCE 7, Eurocode)
- ✅ Quantify results (cost savings, efficiency gains, load capacity)
- ✅ List technical tools (AutoCAD, Revit, ETABS, SAP2000)
- ✅ Show PE/FE certifications prominently
` : adjustedCategory === "Software Engineering" ? `
**Software Engineering Resume Best Practices:**
- ✅ Emphasize scale (users, requests/sec, data volume)
- ✅ Include tech stack in every bullet
- ✅ Show performance improvements (latency, throughput)
- ✅ Highlight system design and architecture decisions
- ✅ Mention CI/CD, testing, and deployment practices
` : adjustedCategory === "Marketing" ? `
**Marketing Resume Best Practices:**
- ✅ Emphasize ROI and conversion metrics
- ✅ Include campaign results (CTR, CPC, conversion rates)
- ✅ Highlight tools (Google Analytics, HubSpot, Salesforce)
- ✅ Show audience growth and engagement metrics
- ✅ Demonstrate A/B testing and data-driven decisions
` : `
**General Best Practices:**
- ✅ Use strong action verbs (Led, Architected, Optimized)
- ✅ Quantify every achievement with numbers
- ✅ Tailor keywords to each job description
- ✅ Keep formatting simple and ATS-friendly
- ✅ Show progression and growth in your career
`}

---

### 📈 Competitive Benchmark

- **Your Score:** ${totalScore}% ${totalScore >= 85 ? '🏆' : totalScore >= 75 ? '🎯' : totalScore >= 62 ? '📊' : '⚠️'}
- **Industry Average:** 62%
- **Top 25% Threshold:** 75%
- **Top 10% Threshold:** 85%

${totalScore >= 85 ? '🎉 **Outstanding!** You\'re in the top 10%!' : totalScore >= 75 ? '🎯 **Great job!** You\'re in the top 25%!' : totalScore >= 62 ? '📊 You\'re above average - keep improving!' : '⚠️ Below average - focus on the priority actions above'}

${hasJD ? `\n**JD Alignment:** ${Math.round((foundKeywords.length / (foundKeywords.length + missingKeywords.length)) * 100)}% keyword match | ${missingKeywords.filter(k => k.priority === 'critical').length} critical skills missing` : ''}

---

### 🚀 Next Steps (Estimated Time)

1. ${totalScore < 50 ? 'Fix critical parsing issues (30 min)' : totalScore < 75 ? 'Add missing keywords (45 min)' : 'Polish and refine (20 min)'}
2. ${totalScore < 50 ? 'Add missing keywords (1 hour)' : totalScore < 75 ? 'Quantify achievements (1 hour)' : 'Update with latest projects (30 min)'}
3. ${totalScore < 50 ? 'Quantify all bullets (2 hours)' : totalScore < 75 ? 'Polish formatting (30 min)' : 'Tailor for specific roles (15 min each)'}

**Total estimated time to reach 80+:** ${totalScore < 50 ? '3-4 hours' : totalScore < 75 ? '2-3 hours' : '1 hour'}
`;

  return {
    title: `${adjustedCategory} Resume`,
    category: adjustedCategory,
    score: totalScore,
    scoreBreakdown: {
      keywords: Math.round(keywordScore),
      format: Math.round(formatScore),
      completeness: Math.round(completenessScore)
    },
    missingKeywords: missingKeywords.slice(0, 10).map(kw => ({
      keyword: kw.keyword,
      priority: kw.priority,
      section: "Experience",
      context: `Add "${kw.keyword}" to relevant experience bullets with specific context and metrics. Example: "Implemented ${kw.keyword} to achieve [specific result with numbers]"`,
      frequency: kw.frequency,
      impact: kw.impact,
      synonyms: synonymMap[kw.keyword] || []
    })),
    formatIssues,
    metricSuggestions,
    analysis
  };
}