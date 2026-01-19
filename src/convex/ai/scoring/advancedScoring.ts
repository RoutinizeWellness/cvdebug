/**
 * ADVANCED ATS SCORING ENGINE
 * Jobscan-level precision with additional ML enhancements
 *
 * Key Improvements:
 * 1. Keyword Density Analysis - Optimal frequency detection (not just presence)
 * 2. Section-Weighted Scoring - Experience > Skills > Summary
 * 3. Hard vs Soft Skills Classification
 * 4. Context-Aware Matching - Keywords in proper context
 * 5. Skill Variation Recognition - React.js = ReactJS = React
 * 6. Keyword Stuffing Penalty System
 */

export interface SectionAnalysis {
  summary: string;
  experience: string;
  skills: string;
  education: string;
  certifications: string;
  projects: string;
  other: string;
}

export interface KeywordDensityResult {
  keyword: string;
  count: number;
  density: number; // percentage
  optimalDensity: number; // ideal percentage
  isOptimal: boolean;
  isOverused: boolean; // keyword stuffing detected
  isUnderused: boolean;
  densityScore: number; // 0-100
}

export interface SectionWeightedScore {
  keyword: string;
  experienceScore: number; // 40% weight
  skillsScore: number; // 30% weight
  summaryScore: number; // 15% weight
  educationScore: number; // 10% weight
  otherScore: number; // 5% weight
  totalWeightedScore: number;
}

export interface SkillClassification {
  hardSkills: string[];
  softSkills: string[];
  technicalSkills: string[];
  industrySpecific: string[];
}

/**
 * JOBSCAN-STYLE SECTION DETECTION
 * Intelligently splits resume into sections based on common headers
 */
export function detectResumeSections(ocrText: string): SectionAnalysis {
  const text = ocrText.toLowerCase();
  const lines = ocrText.split('\n');

  const sections: SectionAnalysis = {
    summary: '',
    experience: '',
    skills: '',
    education: '',
    certifications: '',
    projects: '',
    other: ''
  };

  let currentSection: keyof SectionAnalysis = 'other';

  // Common section headers patterns (case-insensitive)
  const sectionPatterns: Record<keyof SectionAnalysis, RegExp[]> = {
    summary: [
      /^(professional )?summary$/i,
      /^(executive )?overview$/i,
      /^about( me)?$/i,
      /^profile$/i,
      /^objective$/i
    ],
    experience: [
      /^(work )?experience$/i,
      /^(professional )?history$/i,
      /^employment( history)?$/i,
      /^career( history)?$/i,
      /^work$/i
    ],
    skills: [
      /^(technical )?skills$/i,
      /^(core )?competencies$/i,
      /^expertise$/i,
      /^technologies$/i,
      /^tools( & technologies)?$/i
    ],
    education: [
      /^education$/i,
      /^academic( background)?$/i,
      /^qualifications$/i,
      /^degrees?$/i
    ],
    certifications: [
      /^certifications?$/i,
      /^licenses?$/i,
      /^credentials$/i,
      /^professional development$/i
    ],
    projects: [
      /^projects?$/i,
      /^key projects?$/i,
      /^notable work$/i,
      /^portfolio$/i
    ],
    other: []
  };

  // Parse text line by line
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if line is a section header
    let matchedSection: keyof SectionAnalysis | null = null;
    for (const [sectionName, patterns] of Object.entries(sectionPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(trimmedLine)) {
          matchedSection = sectionName as keyof SectionAnalysis;
          break;
        }
      }
      if (matchedSection) break;
    }

    if (matchedSection) {
      currentSection = matchedSection;
    } else {
      // Add line to current section
      sections[currentSection] += line + '\n';
    }
  }

  return sections;
}

/**
 * KEYWORD DENSITY ANALYZER
 * Detects optimal keyword frequency (Jobscan technique)
 *
 * Optimal density rules:
 * - Critical keywords: 2-4 times (0.5-1.5% of total words)
 * - Important keywords: 1-3 times (0.3-1.0%)
 * - Nice-to-have: 1-2 times (0.2-0.7%)
 *
 * Penalties:
 * - Keyword stuffing: > 5 times (red flag)
 * - Underused: 0 times (missed opportunity)
 */
export function analyzeKeywordDensity(
  ocrText: string,
  keywords: string[],
  priority: 'critical' | 'important' | 'nice-to-have'
): KeywordDensityResult[] {
  const text = ocrText.toLowerCase();
  const words = text.split(/\s+/);
  const totalWords = words.length;

  // Optimal density ranges by priority
  const optimalRanges: Record<string, { min: number, max: number, optimal: number }> = {
    critical: { min: 0.5, max: 1.5, optimal: 1.0 },
    important: { min: 0.3, max: 1.0, optimal: 0.6 },
    'nice-to-have': { min: 0.2, max: 0.7, optimal: 0.4 }
  };

  const range = optimalRanges[priority];

  return keywords.map(keyword => {
    const keywordLower = keyword.toLowerCase();
    const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex) || [];
    const count = matches.length;
    const density = (count / totalWords) * 100;

    const isOptimal = density >= range.min && density <= range.max;
    const isOverused = density > range.max * 1.5; // 1.5x over limit = stuffing
    const isUnderused = count === 0;

    // Calculate density score (0-100)
    let densityScore = 0;
    if (isUnderused) {
      densityScore = 0;
    } else if (isOverused) {
      // Penalty for stuffing: score decreases as density increases
      const overage = density - range.max;
      densityScore = Math.max(0, 70 - (overage * 10));
    } else if (isOptimal) {
      // Perfect range: 90-100 score
      const optimalPosition = (density - range.min) / (range.max - range.min);
      densityScore = 90 + (optimalPosition * 10);
    } else {
      // Suboptimal but not stuffing: 50-89
      if (density < range.min) {
        densityScore = 50 + ((density / range.min) * 40);
      } else {
        const excess = (density - range.max) / range.max;
        densityScore = 80 - (excess * 30);
      }
    }

    return {
      keyword,
      count,
      density,
      optimalDensity: range.optimal,
      isOptimal,
      isOverused,
      isUnderused,
      densityScore: Math.round(densityScore)
    };
  });
}

/**
 * SECTION-WEIGHTED SCORING
 * Keywords in Experience section are worth more than in Summary
 * Mirrors real ATS behavior (Jobscan approach)
 *
 * Weight distribution:
 * - Experience: 40% (most important)
 * - Skills: 30%
 * - Summary: 15%
 * - Education: 10%
 * - Other: 5%
 */
export function calculateSectionWeightedScore(
  sections: SectionAnalysis,
  keywords: string[]
): SectionWeightedScore[] {
  const weights = {
    experience: 0.40,
    skills: 0.30,
    summary: 0.15,
    education: 0.10,
    other: 0.05
  };

  return keywords.map(keyword => {
    const keywordLower = keyword.toLowerCase();
    const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

    // Count matches in each section
    const experienceMatches = (sections.experience.match(regex) || []).length;
    const skillsMatches = (sections.skills.match(regex) || []).length;
    const summaryMatches = (sections.summary.match(regex) || []).length;
    const educationMatches = (sections.education.match(regex) || []).length;
    const otherMatches = (
      sections.certifications.match(regex) || []
    ).length + (sections.projects.match(regex) || []).length + (sections.other.match(regex) || []).length;

    // Calculate weighted scores (out of 100)
    const experienceScore = Math.min(100, experienceMatches * 25);
    const skillsScore = Math.min(100, skillsMatches * 33);
    const summaryScore = Math.min(100, summaryMatches * 50);
    const educationScore = Math.min(100, educationMatches * 50);
    const otherScore = Math.min(100, otherMatches * 50);

    // Total weighted score
    const totalWeightedScore =
      (experienceScore * weights.experience) +
      (skillsScore * weights.skills) +
      (summaryScore * weights.summary) +
      (educationScore * weights.education) +
      (otherScore * weights.other);

    return {
      keyword,
      experienceScore,
      skillsScore,
      summaryScore,
      educationScore,
      otherScore,
      totalWeightedScore: Math.round(totalWeightedScore)
    };
  });
}

/**
 * SKILL CLASSIFICATION ENGINE
 * Differentiates between hard skills, soft skills, technical skills
 * ATS systems prioritize hard/technical skills over soft skills
 */
export function classifySkills(keywords: string[]): SkillClassification {
  const hardSkillPatterns = [
    // Programming languages
    /^(python|java|javascript|typescript|c\+\+|c#|ruby|go|rust|swift|kotlin|php|r|scala|perl)$/i,
    // Frameworks/Libraries
    /^(react|angular|vue|django|flask|spring|express|next\.?js|gatsby|svelte|ember)$/i,
    // Databases
    /^(mysql|postgresql|mongodb|redis|elasticsearch|cassandra|oracle|sql server|dynamodb)$/i,
    // Cloud/DevOps
    /^(aws|azure|gcp|docker|kubernetes|jenkins|terraform|ansible|git|ci\/cd)$/i,
    // Tools/Software
    /^(photoshop|illustrator|figma|sketch|autocad|solidworks|tableau|power bi|excel)$/i
  ];

  const softSkillPatterns = [
    /\b(leadership|communication|teamwork|collaboration|adaptability|problem[- ]solving)\b/i,
    /\b(time[- ]management|critical[- ]thinking|creativity|emotional[- ]intelligence)\b/i,
    /\b(conflict[- ]resolution|negotiation|presentation|public[- ]speaking)\b/i,
    /\b(interpersonal|organizational|analytical|strategic[- ]thinking)\b/i
  ];

  const technicalSkillPatterns = [
    /\b(machine[- ]learning|artificial[- ]intelligence|data[- ]science|deep[- ]learning)\b/i,
    /\b(natural[- ]language[- ]processing|computer[- ]vision|neural[- ]networks)\b/i,
    /\b(api[- ]design|rest|graphql|microservices|distributed[- ]systems)\b/i,
    /\b(agile|scrum|devops|ci\/cd|test[- ]driven[- ]development)\b/i,
    /\b(system[- ]architecture|software[- ]design|database[- ]design)\b/i
  ];

  const classification: SkillClassification = {
    hardSkills: [],
    softSkills: [],
    technicalSkills: [],
    industrySpecific: []
  };

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();

    // Check hard skills
    if (hardSkillPatterns.some(pattern => pattern.test(keywordLower))) {
      classification.hardSkills.push(keyword);
    }
    // Check soft skills
    else if (softSkillPatterns.some(pattern => pattern.test(keywordLower))) {
      classification.softSkills.push(keyword);
    }
    // Check technical skills
    else if (technicalSkillPatterns.some(pattern => pattern.test(keywordLower))) {
      classification.technicalSkills.push(keyword);
    }
    // Everything else is industry-specific
    else {
      classification.industrySpecific.push(keyword);
    }
  }

  return classification;
}

/**
 * SKILL VARIATION DETECTOR
 * Recognizes different forms of the same skill
 * Examples: React.js = ReactJS = React = React Native (partial)
 */
export function normalizeSkillVariations(skill: string): string[] {
  const skillLower = skill.toLowerCase().trim();

  const variationMap: Record<string, string[]> = {
    // JavaScript ecosystem
    'react': ['react', 'react.js', 'reactjs', 'react js'],
    'vue': ['vue', 'vue.js', 'vuejs', 'vue js'],
    'angular': ['angular', 'angular.js', 'angularjs', 'angular js'],
    'node': ['node', 'node.js', 'nodejs', 'node js'],
    'next': ['next', 'next.js', 'nextjs', 'next js'],

    // Programming languages
    'javascript': ['javascript', 'js', 'ecmascript', 'es6', 'es2015', 'es2020'],
    'typescript': ['typescript', 'ts'],
    'c++': ['c++', 'cpp', 'c plus plus'],
    'c#': ['c#', 'csharp', 'c sharp'],

    // Cloud providers
    'aws': ['aws', 'amazon web services'],
    'gcp': ['gcp', 'google cloud platform', 'google cloud'],
    'azure': ['azure', 'microsoft azure'],

    // Databases
    'postgresql': ['postgresql', 'postgres', 'psql'],
    'mongodb': ['mongodb', 'mongo'],
    'mysql': ['mysql', 'my sql'],

    // DevOps
    'kubernetes': ['kubernetes', 'k8s'],
    'docker': ['docker', 'containerization'],
    'ci/cd': ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment']
  };

  // Find matching variation set
  for (const [canonical, variations] of Object.entries(variationMap)) {
    if (variations.some(v => skillLower === v || skillLower.includes(v))) {
      return variations;
    }
  }

  // If no match, return original skill
  return [skill];
}

/**
 * KEYWORD STUFFING DETECTOR
 * Penalizes resumes that overuse keywords unnaturally
 * Real ATS systems flag this as manipulation
 */
export function detectKeywordStuffing(
  ocrText: string,
  keywords: string[]
): {
  isStuffing: boolean;
  stuffedKeywords: string[];
  penalty: number; // 0-30 point penalty
  explanation: string;
} {
  const densityResults = analyzeKeywordDensity(ocrText, keywords, 'critical');

  const stuffedKeywords = densityResults
    .filter(result => result.isOverused)
    .map(result => result.keyword);

  const isStuffing = stuffedKeywords.length >= 3; // 3+ stuffed keywords = red flag

  // Calculate penalty based on severity
  let penalty = 0;
  let explanation = '';

  if (isStuffing) {
    penalty = Math.min(30, stuffedKeywords.length * 5);
    explanation = `Detected keyword stuffing: ${stuffedKeywords.length} keywords appear unnaturally frequently. ATS systems may flag this as manipulation.`;
  } else if (stuffedKeywords.length === 2) {
    penalty = 10;
    explanation = `Warning: 2 keywords appear overused. Consider natural phrasing.`;
  } else if (stuffedKeywords.length === 1) {
    penalty = 5;
    explanation = `Minor: 1 keyword appears slightly overused.`;
  } else {
    explanation = 'No keyword stuffing detected. Natural keyword distribution.';
  }

  return {
    isStuffing,
    stuffedKeywords,
    penalty,
    explanation
  };
}

/**
 * CONTEXT-AWARE KEYWORD MATCHING
 * Ensures keywords appear in meaningful context, not just listed
 * Example: "Python" in "Developed Python application" > "Python" in "Skills: Python"
 */
export function analyzeKeywordContext(
  ocrText: string,
  keyword: string
): {
  inActionContext: boolean; // Near action verbs (developed, built, managed)
  inMetricContext: boolean; // Near quantifiable metrics
  inListOnly: boolean; // Only in skill lists (lower value)
  contextScore: number; // 0-100
} {
  const text = ocrText.toLowerCase();
  const keywordLower = keyword.toLowerCase();

  // Find all occurrences of keyword
  const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = text.matchAll(regex);

  let inActionContext = false;
  let inMetricContext = false;
  let inListOnly = true;

  // Action verbs that indicate meaningful use
  const actionVerbs = [
    'developed', 'built', 'created', 'designed', 'implemented', 'architected',
    'led', 'managed', 'coordinated', 'optimized', 'improved', 'increased',
    'reduced', 'achieved', 'delivered', 'launched', 'deployed', 'migrated'
  ];

  // Metric patterns that indicate quantifiable impact
  const metricPatterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+[kKmMbB]/g, // 10k, 5M, 2B
    /\d+\s*(users?|customers?|clients?)/gi
  ];

  for (const match of matches) {
    const matchIndex = match.index || 0;

    // Get surrounding context (50 chars before and after)
    const contextStart = Math.max(0, matchIndex - 50);
    const contextEnd = Math.min(text.length, matchIndex + keyword.length + 50);
    const context = text.substring(contextStart, contextEnd);

    // Check for action verbs nearby
    if (actionVerbs.some(verb => context.includes(verb))) {
      inActionContext = true;
      inListOnly = false;
    }

    // Check for metrics nearby
    if (metricPatterns.some(pattern => pattern.test(context))) {
      inMetricContext = true;
      inListOnly = false;
    }
  }

  // Calculate context score
  let contextScore = 50; // Base score
  if (inActionContext) contextScore += 30;
  if (inMetricContext) contextScore += 20;
  if (inListOnly) contextScore -= 20;

  return {
    inActionContext,
    inMetricContext,
    inListOnly,
    contextScore: Math.max(0, Math.min(100, contextScore))
  };
}

/**
 * MASTER SCORING FUNCTION
 * Combines all advanced techniques into final precision score
 */
export function calculateAdvancedATSScore(
  ocrText: string,
  keywords: string[],
  priority: 'critical' | 'important' | 'nice-to-have' = 'critical'
): {
  totalScore: number;
  densityScore: number;
  sectionScore: number;
  contextScore: number;
  stuffingPenalty: number;
  breakdown: {
    densityResults: KeywordDensityResult[];
    sectionScores: SectionWeightedScore[];
    stuffingAnalysis: ReturnType<typeof detectKeywordStuffing>;
  };
} {
  // 1. Detect sections
  const sections = detectResumeSections(ocrText);

  // 2. Analyze keyword density
  const densityResults = analyzeKeywordDensity(ocrText, keywords, priority);
  const avgDensityScore = densityResults.reduce((sum, r) => sum + r.densityScore, 0) / densityResults.length;

  // 3. Calculate section-weighted scores
  const sectionScores = calculateSectionWeightedScore(sections, keywords);
  const avgSectionScore = sectionScores.reduce((sum, s) => sum + s.totalWeightedScore, 0) / sectionScores.length;

  // 4. Analyze context for each keyword
  const contextScores = keywords.map(kw => analyzeKeywordContext(ocrText, kw).contextScore);
  const avgContextScore = contextScores.reduce((sum, s) => sum + s, 0) / contextScores.length;

  // 5. Detect keyword stuffing
  const stuffingAnalysis = detectKeywordStuffing(ocrText, keywords);

  // 6. Calculate total score (weighted average)
  const baseScore = (
    (avgDensityScore * 0.30) +  // 30% weight on optimal density
    (avgSectionScore * 0.40) +   // 40% weight on section placement
    (avgContextScore * 0.30)     // 30% weight on context quality
  );

  const totalScore = Math.max(0, Math.min(100, baseScore - stuffingAnalysis.penalty));

  return {
    totalScore: Math.round(totalScore),
    densityScore: Math.round(avgDensityScore),
    sectionScore: Math.round(avgSectionScore),
    contextScore: Math.round(avgContextScore),
    stuffingPenalty: stuffingAnalysis.penalty,
    breakdown: {
      densityResults,
      sectionScores,
      stuffingAnalysis
    }
  };
}
