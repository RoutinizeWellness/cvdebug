import { softSkills } from "./config/keywords";

export interface BulletPointAnalysis {
  score: number;
  strongBullets: string[];
  weakBullets: string[];
  issues: string[];
}

export interface SoftSkillsAnalysis {
  score: number;
  found: string[];
  missing: string[];
}

// Analyze the quality of bullet points (Action + Task + Result)
export function analyzeBulletPoints(text: string): BulletPointAnalysis {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);
  const bulletPoints = lines.filter(l => /^[•\-\*]/.test(l) || /^[A-Z]/.test(l)); // Simple heuristic
  
  const strongBullets: string[] = [];
  const weakBullets: string[] = [];
  const issues: string[] = [];
  
  let totalScore = 0;
  let bulletCount = 0;

  // Strong action verbs to look for at start
  const strongVerbs = /^(led|managed|developed|created|designed|implemented|optimized|increased|reduced|saved|achieved|launched|spearheaded|transformed|built|engineered|architected|orchestrated|accelerated|revitalized|modernized|pioneered|generated|delivered|executed|consolidated|maximized|minimized|streamlined|overhauled|championed|directed|supervised|guided|mentored|coached|established|founded|initiated|instituted|introduced|resolved|solved|negotiated|secured|won|awarded|exceeded|outperformed|surpassed)/i;
  
  // Metrics patterns
  const metrics = /(\d+%|\$\d+|\d+x|\d+\+)/;

  for (const bullet of bulletPoints) {
    // Skip headers or short lines
    if (bullet.length < 40) continue;
    
    bulletCount++;
    let bulletScore = 0;
    const cleanBullet = bullet.replace(/^[•\-\*]\s*/, '');

    // 1. Check for strong action verb start
    if (strongVerbs.test(cleanBullet)) {
      bulletScore += 3;
    } else {
      // Check if it starts with a weak verb
      if (/^(responsible|helped|worked|assisted)/i.test(cleanBullet)) {
        bulletScore -= 1;
      }
    }

    // 2. Check for metrics
    if (metrics.test(cleanBullet)) {
      bulletScore += 4;
    }

    // 3. Check for length/detail (context)
    if (cleanBullet.length > 80) {
      bulletScore += 2;
    } else if (cleanBullet.length < 50) {
      bulletScore -= 1;
    }

    // Categorize
    if (bulletScore >= 5) {
      strongBullets.push(cleanBullet);
      totalScore += 10;
    } else if (bulletScore <= 1) {
      weakBullets.push(cleanBullet);
      totalScore += 2;
    } else {
      totalScore += 5;
    }
  }

  // Normalize score (0-100 scale for this section)
  const finalScore = bulletCount > 0 ? Math.min(100, (totalScore / (bulletCount * 10)) * 100) : 0;

  if (weakBullets.length > 0) {
    issues.push(`Found ${weakBullets.length} weak bullet points lacking metrics or strong action verbs.`);
  }
  if (bulletCount > 0 && strongBullets.length === 0) {
    issues.push("No high-impact bullet points found. Try adding metrics and strong verbs.");
  }

  return {
    score: finalScore,
    strongBullets: strongBullets.slice(0, 3),
    weakBullets: weakBullets.slice(0, 3),
    issues
  };
}

// Analyze soft skills presence
export function analyzeSoftSkills(text: string): SoftSkillsAnalysis {
  const lowerText = text.toLowerCase();
  const found: string[] = [];
  const missing: string[] = [];

  // Check for top 10 most relevant soft skills
  const topSkills = softSkills.slice(0, 15);
  
  for (const skill of topSkills) {
    if (lowerText.includes(skill)) {
      found.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // Score based on presence (diminishing returns)
  let score = 0;
  if (found.length >= 5) score = 100;
  else if (found.length >= 3) score = 75;
  else if (found.length >= 1) score = 40;
  else score = 0;

  return {
    score,
    found,
    missing: missing.slice(0, 5) // Suggest top 5 missing
  };
}