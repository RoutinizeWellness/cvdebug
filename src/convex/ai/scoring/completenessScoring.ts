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
  let completenessScore = 0;
  
  const bulletAnalysis = analyzeBulletPoints(ocrText);
  const softSkillsAnalysis = analyzeSoftSkills(ocrText);
  
  const metricPatterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+\+?\s*(users|customers|clients)/gi,
    /increased|improved|reduced|optimized/gi,
    /\d+x\s/g,
    /\d+\s*(million|billion|thousand)/gi,
  ];
  
  let metricCount = 0;
  metricPatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) metricCount += matches.length;
  });

  if (metricCount >= 15) completenessScore += 15;
  else if (metricCount >= 10) completenessScore += 10;
  else if (metricCount >= 6) completenessScore += 6;
  else if (metricCount >= 3) completenessScore += 3;
  
  const bulletQualityContribution = (bulletAnalysis.score / 100) * 10;
  completenessScore += bulletQualityContribution;

  const softSkillsContribution = (softSkillsAnalysis.score / 100) * 5;
  completenessScore += softSkillsContribution;

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

  const growthWords = ["learned", "adapted", "upskilled", "certified", "trained", "mentored", "volunteered"];
  let growthCount = 0;
  const text = ocrText.toLowerCase();
  growthWords.forEach(word => {
    if (text.includes(word)) growthCount++;
  });

  let sentimentScore = 0;
  
  const strongVerbs = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'gi');
  const strongVerbMatches = (ocrText.match(strongVerbs) || []).length;
  
  if (strongVerbMatches >= 8) sentimentScore += 8;
  else if (strongVerbMatches >= 5) sentimentScore += 5;
  else if (strongVerbMatches >= 2) sentimentScore += 2;
  
  sentimentScore += (powerPhraseCount * 1.5);
  sentimentScore -= (weakPhraseCount * 0.5);
  sentimentScore += (growthCount * 0.5);

  const foundBuzzwords = checkBuzzwords(ocrText);
  if (foundBuzzwords.length > 0) {
    sentimentScore -= (foundBuzzwords.length * 0.5);
  }
  
  const sentimentContribution = Math.max(0, Math.min(15, sentimentScore));
  
  completenessScore += sentimentContribution;
  
  if (ocrText.length > 1500) completenessScore += 5;
  else if (ocrText.length > 800) completenessScore += 3;
  
  const hasSummary = /summary|objective|profile/i.test(ocrText);
  if (hasSummary) completenessScore += 2;
  
  const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.completeness || 0);
  completenessScore = Math.max(0, Math.min(30, completenessScore * scoringMultiplier));
  
  return { completenessScore, bulletAnalysis, softSkillsAnalysis };
}
