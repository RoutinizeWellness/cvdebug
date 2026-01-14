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
  
  // Enhanced metric detection patterns
  const metricPatterns = [
    /\d+%/g,
    /\$[\d,]+(?:\.\d{2})?[KMB]?/g,
    /\d+\+?\s*(users|customers|clients|employees|projects|applications)/gi,
    /increased|improved|reduced|optimized|enhanced|accelerated|streamlined/gi,
    /\d+x\s/g,
    /\d+\s*(million|billion|thousand|hundred)/gi,
    /\d+[-–]\d+%/g, // Range percentages
    /\d+\s*to\s*\d+/gi, // "10 to 20" format
  ];
  
  let metricCount = 0;
  metricPatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) metricCount += matches.length;
  });

  // STRICT metric scoring - much harder to get points
  // Having metrics is EXPECTED, not exceptional
  if (metricCount >= 20) completenessScore += 8; // REDUCED from 18
  else if (metricCount >= 15) completenessScore += 6; // REDUCED from 15
  else if (metricCount >= 10) completenessScore += 5; // REDUCED from 12
  else if (metricCount >= 6) completenessScore += 3; // REDUCED from 8
  else if (metricCount >= 3) completenessScore += 1; // REDUCED from 4
  // else: 0 points if less than 3 metrics - this is failing

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
  completenessScore = Math.max(0, Math.min(30, completenessScore * scoringMultiplier));
  
  return { completenessScore, bulletAnalysis, softSkillsAnalysis };
}