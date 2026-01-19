import { actionVerbs } from "../config/keywords";
import { checkBuzzwords } from "../qualityChecks";
import { analyzeBulletPoints, analyzeSoftSkills } from "../contentAnalysis";

export interface CompletenessResult {
  completenessScore: number;
  bulletAnalysis: any;
  softSkillsAnalysis: any;
}

export function calculateCompletenessScore(
  ocrText: string,
  mlConfig?: any
): CompletenessResult {
  // Early exit for empty or too short text
  if (!ocrText || ocrText.trim().length < 50) {
    return {
      completenessScore: 0,
      bulletAnalysis: { score: 0, feedback: "Text too short" },
      softSkillsAnalysis: { score: 0, feedback: "Insufficient text" }
    };
  }

  let completenessScore = 0;
  
  const bulletAnalysis = analyzeBulletPoints(ocrText);
  const softSkillsAnalysis = analyzeSoftSkills(ocrText);
  
  // CRITICAL FIX: Analyze QUALITY of metrics, not just count
  // A CV with "increased by 150%" should score higher than one with "increased by 5%"

  interface MetricQuality {
    pattern: RegExp;
    quality: number; // How impressive is this metric?
  }

  const qualityMetricPatterns: MetricQuality[] = [
    // EXCEPTIONAL metrics (5 points each)
    { pattern: /\b(increased|grew|boosted)\s+[^.]*?(\d{2,3}%|\d+x)/gi, quality: 5 }, // "increased by 150%"
    { pattern: /\b(reduced|saved|decreased)\s+[^.]*?\$([\d,]+(?:K|M|B))/gi, quality: 5 }, // "saved $2M"
    { pattern: /\b(managed|oversaw|led)\s+[^.]*?\$([\d,]+(?:M|B))/gi, quality: 5 }, // "managed $10M budget"
    { pattern: /\b(built|developed|created)\s+[^.]*?(million|billion)\b/gi, quality: 5 }, // "built system serving 10 million users"

    // STRONG metrics (3 points each)
    { pattern: /\b\d{2}%/g, quality: 3 }, // "40%" - double digit percentages
    { pattern: /\$[\d,]+K\b/g, quality: 3 }, // "$50K" - thousands
    { pattern: /\b\d+\+?\s*(thousand|hundred)\b/gi, quality: 3 }, // "10 thousand users"
    { pattern: /\b(team|group)\s+of\s+(\d+)/gi, quality: 3 }, // "team of 8 engineers"

    // MODERATE metrics (2 points each)
    { pattern: /\b\d{1}%/g, quality: 2 }, // "8%" - single digit percentages
    { pattern: /\b\d+\+?\s*(users|customers|clients)/gi, quality: 2 }, // "1000 users"

    // WEAK metrics (1 point each)
    { pattern: /\b(experience|worked)\s+[^.]*?\d+\s*(years?|months?)/gi, quality: 1 }, // Just stating duration
  ];

  let metricQualityScore = 0;
  let totalMetricsMentioned = 0;

  qualityMetricPatterns.forEach(({ pattern, quality }) => {
    const matches = ocrText.match(pattern);
    if (matches) {
      metricQualityScore += matches.length * quality;
      totalMetricsMentioned += matches.length;
    }
  });

  console.log(`[Completeness] Metrics: ${totalMetricsMentioned} total, quality score: ${metricQualityScore}`);

  // STRICT metric scoring based on QUALITY
  // 20+ quality points = exceptional CV with strong metrics
  if (metricQualityScore >= 60) completenessScore += 12; // Exceptional
  else if (metricQualityScore >= 40) completenessScore += 10; // Strong
  else if (metricQualityScore >= 25) completenessScore += 7; // Good
  else if (metricQualityScore >= 15) completenessScore += 5; // Moderate
  else if (metricQualityScore >= 8) completenessScore += 3; // Basic
  else if (metricQualityScore >= 3) completenessScore += 1; // Minimal
  // else: 0 points if quality score < 3 - failing

  const bulletQualityContribution = (bulletAnalysis.score / 100) * 6; // REDUCED from 12
  completenessScore += bulletQualityContribution;

  const softSkillsContribution = (softSkillsAnalysis.score / 100) * 3; // REDUCED from 6
  completenessScore += softSkillsContribution;

  // Enhanced power phrase detection
  const powerPhrasePatterns = [
    /\b(increased|reduced|improved|grew|saved|generated|boosted|maximized|minimized)\b.{0,40}\b(\d+%|\$\d+|\d+x)/i,
    /\b(achieved|delivered|completed|exceeded|surpassed)\b.{0,40}\b(under budget|ahead of schedule|on time|\d+%)/i,
    /\b(led|managed|spearheaded|directed|orchestrated)\b.{0,40}\b(team|project|initiative|program)\b.{0,50}\b(result|outcome|success|impact|\d+)/i,
    /\b(launched|deployed|shipped|released)\b.{0,40}\b(product|feature|service|platform)\b.{0,50}\b(\d+|success|adoption)/i,
  ];
  
  let powerPhraseCount = 0;
  powerPhrasePatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) powerPhraseCount += matches.length;
  });

  // Weak phrases that reduce score
  const weakPhrases = [
    "responsible for", "duties included", "worked on", "helped with", "assisted in", 
    "attempted to", "tried to", "participated in", "familiar with", "exposure to",
    "involved in", "contributed to"
  ];
  
  let weakPhraseCount = 0;
  weakPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = ocrText.match(regex);
    if (matches) weakPhraseCount += matches.length;
  });

  // Growth and learning indicators
  const growthWords = [
    "learned", "adapted", "upskilled", "certified", "trained", "mentored", 
    "volunteered", "developed", "mastered", "acquired", "earned"
  ];
  let growthCount = 0;
  const text = ocrText.toLowerCase();
  growthWords.forEach(word => {
    if (text.includes(word)) growthCount++;
  });

  // Enhanced sentiment scoring
  let sentimentScore = 0;
  
  const strongVerbs = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'gi');
  const strongVerbMatches = (ocrText.match(strongVerbs) || []).length;
  
  // Progressive scoring for action verbs
  if (strongVerbMatches >= 12) sentimentScore += 10;
  else if (strongVerbMatches >= 8) sentimentScore += 8;
  else if (strongVerbMatches >= 5) sentimentScore += 5;
  else if (strongVerbMatches >= 2) sentimentScore += 2;
  
  sentimentScore += (powerPhraseCount * 2.0);
  sentimentScore -= (weakPhraseCount * 0.8);
  sentimentScore += (growthCount * 0.7);

  const foundBuzzwords = checkBuzzwords(ocrText);
  if (foundBuzzwords.length > 0) {
    sentimentScore -= (foundBuzzwords.length * 0.7);
  }
  
  const sentimentContribution = Math.max(0, Math.min(18, sentimentScore));
  
  completenessScore += sentimentContribution;
  
  // Length and structure bonuses
  if (ocrText.length > 2000) completenessScore += 6;
  else if (ocrText.length > 1500) completenessScore += 5;
  else if (ocrText.length > 800) completenessScore += 3;
  
  const hasSummary = /summary|objective|profile|about/i.test(ocrText);
  if (hasSummary) completenessScore += 2;
  
  // Check for section headers
  const sectionHeaders = [
    /\bexperience\b/i,
    /\beducation\b/i,
    /\bskills\b/i,
    /\bprojects\b/i,
    /\bcertifications?\b/i
  ];
  
  const headerCount = sectionHeaders.filter(pattern => pattern.test(ocrText)).length;
  completenessScore += Math.min(4, headerCount);
  
  const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.completeness || 0);
  completenessScore = Math.max(0, Math.min(30, completenessScore * scoringMultiplier)); // Allow up to 30 for complete resumes
  
  return { completenessScore, bulletAnalysis, softSkillsAnalysis };
}