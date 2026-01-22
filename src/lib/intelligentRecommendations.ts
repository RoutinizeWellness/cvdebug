/**
 * Intelligent Recommendations Engine v1.0
 *
 * Provides context-aware, actionable recommendations for:
 * - Resume improvement
 * - Career advancement
 * - Interview preparation
 * - Job search optimization
 */

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'resume' | 'career' | 'interview' | 'job_search' | 'skills';
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionable: string;
  impact: number; // 1-100
  estimatedTime?: string; // e.g., "5 minutes", "1 hour"
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  learnMoreUrl?: string;
}

export interface RecommendationContext {
  // Resume data
  atsScore?: number;
  keywordScore?: number;
  formatScore?: number;
  completenessScore?: number;
  missingKeywords?: string[];
  hasMetrics?: boolean;
  sectionsMissing?: string[];

  // User context
  experienceYears?: number;
  seniorityLevel?: string;
  targetRole?: string;
  industry?: string;
  isActiveJobSeeker?: boolean;

  // Goals
  targetCompanies?: string[];
  desiredSalary?: number;
  targetLocation?: string;
}

/**
 * Generate intelligent recommendations based on context
 */
export function generateRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // CRITICAL: ATS Score Issues
  if (context.atsScore !== undefined && context.atsScore < 60) {
    recommendations.push({
      id: 'ats-critical-score',
      title: 'Your ATS score is critically low',
      description: `Your resume scores ${context.atsScore}/100 on ATS compatibility. Most companies use ATS systems, and scores below 70 dramatically reduce your chances of being seen by a human recruiter.`,
      category: 'resume',
      priority: 'critical',
      actionable: 'Run a detailed ATS scan and fix all critical issues first: formatting problems, missing keywords, and parsing errors.',
      impact: 95,
      estimatedTime: '30 minutes',
      difficulty: 'medium',
      tags: ['ats', 'urgent', 'formatting'],
      learnMoreUrl: '/blog/ats-optimization-guide'
    });
  }

  // HIGH: Missing Keywords
  if (context.missingKeywords && context.missingKeywords.length > 5) {
    recommendations.push({
      id: 'keywords-missing',
      title: `Add ${context.missingKeywords.length} critical keywords`,
      description: 'Your resume is missing industry-standard keywords that recruiters and ATS systems are searching for. This is one of the fastest ways to improve your score.',
      category: 'resume',
      priority: 'high',
      actionable: `Start with these: ${context.missingKeywords.slice(0, 3).join(', ')}. Add them naturally to your experience descriptions with specific examples.`,
      impact: 85,
      estimatedTime: '20 minutes',
      difficulty: 'easy',
      tags: ['keywords', 'quick-win', 'ats']
    });
  }

  // HIGH: No Metrics
  if (context.hasMetrics === false) {
    recommendations.push({
      id: 'add-quantifiable-metrics',
      title: 'Add quantifiable achievements',
      description: 'Resumes with metrics get 40% more interview callbacks. Numbers prove impact and make your achievements memorable.',
      category: 'resume',
      priority: 'high',
      actionable: 'For each bullet point, ask: What was the result? Add percentages, dollar amounts, team sizes, time saved, or scale of impact.',
      impact: 80,
      estimatedTime: '45 minutes',
      difficulty: 'medium',
      tags: ['metrics', 'achievements', 'impact'],
      learnMoreUrl: '/blog/quantify-achievements'
    });
  }

  // Format Issues
  if (context.formatScore !== undefined && context.formatScore < 70) {
    recommendations.push({
      id: 'format-issues',
      title: 'Fix formatting problems',
      description: 'ATS systems struggle to parse complex formatting. Simple, clean layouts dramatically improve your chances.',
      category: 'resume',
      priority: 'high',
      actionable: 'Use a single-column layout, standard fonts, clear section headers, and simple bullet points. Remove tables, text boxes, and images.',
      impact: 75,
      estimatedTime: '15 minutes',
      difficulty: 'easy',
      tags: ['formatting', 'ats', 'quick-win']
    });
  }

  // Missing Sections
  if (context.sectionsMissing && context.sectionsMissing.length > 0) {
    recommendations.push({
      id: 'missing-sections',
      title: `Add ${context.sectionsMissing.length} missing sections`,
      description: `Your resume is missing standard sections: ${context.sectionsMissing.join(', ')}. This makes it harder for ATS to categorize your information.`,
      category: 'resume',
      priority: 'medium',
      actionable: `Add clear headers for: ${context.sectionsMissing.join(', ')}. Use all-caps or bold formatting to make them stand out.`,
      impact: 60,
      estimatedTime: '10 minutes',
      difficulty: 'easy',
      tags: ['structure', 'sections']
    });
  }

  // Career Recommendations based on Seniority
  if (context.experienceYears !== undefined) {
    if (context.experienceYears < 2) {
      recommendations.push({
        id: 'junior-skills',
        title: 'Highlight learning and adaptability',
        description: 'As a junior candidate, emphasize your ability to learn quickly, your enthusiasm, and any relevant projects or internships.',
        category: 'career',
        priority: 'medium',
        actionable: 'Add a "Projects" section showcasing 2-3 technical projects. Include technologies used, challenges solved, and outcomes.',
        impact: 65,
        estimatedTime: '30 minutes',
        difficulty: 'easy',
        tags: ['junior', 'projects', 'skills']
      });
    } else if (context.experienceYears >= 5) {
      recommendations.push({
        id: 'senior-leadership',
        title: 'Emphasize leadership and impact',
        description: 'Senior roles require demonstrated leadership, mentorship, and business impact. Make sure these are prominent.',
        category: 'career',
        priority: 'medium',
        actionable: 'Add specific examples of: leading teams, mentoring juniors, influencing technical decisions, or driving business outcomes.',
        impact: 70,
        estimatedTime: '45 minutes',
        difficulty: 'medium',
        tags: ['senior', 'leadership', 'impact']
      });
    }
  }

  // Interview Prep Recommendations
  if (context.isActiveJobSeeker) {
    recommendations.push({
      id: 'interview-prep',
      title: 'Prepare for technical interviews',
      description: 'Once your resume gets through ATS, you need to ace the interview. Start preparing now.',
      category: 'interview',
      priority: 'medium',
      actionable: 'Practice behavioral questions using the STAR method. For technical roles, review system design and coding challenges.',
      impact: 90,
      estimatedTime: '2-4 hours',
      difficulty: 'hard',
      tags: ['interview', 'preparation', 'skills']
    });
  }

  // Job Search Optimization
  if (context.targetRole) {
    recommendations.push({
      id: 'tailor-resume',
      title: `Tailor your resume for ${context.targetRole} roles`,
      description: 'Generic resumes get 3x fewer callbacks than tailored ones. Customize your resume for each role.',
      category: 'job_search',
      priority: 'high',
      actionable: `Research 3-5 ${context.targetRole} job descriptions. Add the most common required skills and keywords to your resume.`,
      impact: 85,
      estimatedTime: '1 hour',
      difficulty: 'medium',
      tags: ['targeting', 'keywords', 'customization']
    });
  }

  // LinkedIn Optimization
  if (context.atsScore && context.atsScore > 70) {
    recommendations.push({
      id: 'optimize-linkedin',
      title: 'Optimize your LinkedIn profile',
      description: 'Recruiters use LinkedIn to find candidates. An optimized profile gets 21x more profile views.',
      category: 'career',
      priority: 'medium',
      actionable: 'Use the same keywords from your resume. Add a professional photo, complete all sections, and get 3+ recommendations.',
      impact: 75,
      estimatedTime: '1 hour',
      difficulty: 'easy',
      tags: ['linkedin', 'visibility', 'networking']
    });
  }

  // Skill Development
  if (context.industry && context.missingKeywords && context.missingKeywords.length > 0) {
    const technicalKeywords = context.missingKeywords.filter(kw =>
      /\b(python|javascript|java|aws|kubernetes|docker|sql|react|node|cloud)\b/gi.test(kw)
    );

    if (technicalKeywords.length > 0) {
      recommendations.push({
        id: 'upskill-technical',
        title: 'Learn in-demand technical skills',
        description: `Your resume is missing ${technicalKeywords.length} in-demand technical skills that could boost your hirability.`,
        category: 'skills',
        priority: 'low',
        actionable: `Consider learning: ${technicalKeywords.slice(0, 3).join(', ')}. Use free resources like Coursera, Udemy, or YouTube.`,
        impact: 50,
        estimatedTime: '2-4 weeks',
        difficulty: 'hard',
        tags: ['skills', 'learning', 'long-term']
      });
    }
  }

  // Networking Recommendations
  if (context.targetCompanies && context.targetCompanies.length > 0) {
    recommendations.push({
      id: 'network-target-companies',
      title: 'Network with employees at target companies',
      description: 'Referrals get 4x higher interview rates than cold applications. Build connections at companies you want to work for.',
      category: 'job_search',
      priority: 'medium',
      actionable: `Find ${context.targetCompanies[0]} employees on LinkedIn. Send thoughtful messages asking about their experience. Attend company events or webinars.`,
      impact: 80,
      estimatedTime: '2 hours',
      difficulty: 'medium',
      tags: ['networking', 'referrals', 'strategy']
    });
  }

  // Completeness Recommendations
  if (context.completenessScore !== undefined && context.completenessScore < 70) {
    recommendations.push({
      id: 'complete-resume',
      title: 'Complete all resume sections',
      description: 'Incomplete resumes look rushed and unprofessional. Make sure every section is thorough and well-crafted.',
      category: 'resume',
      priority: 'medium',
      actionable: 'Review each section. Add missing details, dates, or descriptions. Aim for 3-5 bullet points per role.',
      impact: 65,
      estimatedTime: '30 minutes',
      difficulty: 'easy',
      tags: ['completeness', 'professionalism']
    });
  }

  // Salary Negotiation (for senior folks)
  if (context.experienceYears && context.experienceYears >= 5 && context.atsScore && context.atsScore > 75) {
    recommendations.push({
      id: 'salary-negotiation',
      title: 'Prepare for salary negotiation',
      description: 'With a strong resume and experience, focus on maximizing your offer. Most candidates leave 10-20% on the table.',
      category: 'career',
      priority: 'low',
      actionable: 'Research market rates for your role and location. Practice negotiation scripts. Have a target number and walk-away number.',
      impact: 70,
      estimatedTime: '3 hours',
      difficulty: 'medium',
      tags: ['negotiation', 'compensation', 'strategy']
    });
  }

  // Sort by priority and impact
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.impact - a.impact;
  });

  return recommendations;
}

/**
 * Get quick wins - easy, high-impact recommendations
 */
export function getQuickWins(recommendations: Recommendation[]): Recommendation[] {
  return recommendations
    .filter(r =>
      r.difficulty === 'easy' &&
      r.impact >= 60 &&
      (r.priority === 'critical' || r.priority === 'high')
    )
    .slice(0, 3);
}

/**
 * Get critical actions - must-do items
 */
export function getCriticalActions(recommendations: Recommendation[]): Recommendation[] {
  return recommendations
    .filter(r => r.priority === 'critical')
    .slice(0, 3);
}

/**
 * Get recommendations by category
 */
export function getRecommendationsByCategory(
  recommendations: Recommendation[],
  category: Recommendation['category']
): Recommendation[] {
  return recommendations.filter(r => r.category === category);
}

/**
 * Calculate overall readiness score
 */
export function calculateReadinessScore(context: RecommendationContext): {
  score: number;
  level: 'not_ready' | 'needs_work' | 'ready' | 'highly_competitive';
  message: string;
} {
  let score = 50; // Base score

  // ATS Score component (30%)
  if (context.atsScore !== undefined) {
    score += (context.atsScore / 100) * 30;
  }

  // Keywords component (20%)
  if (context.keywordScore !== undefined) {
    score += (context.keywordScore / 100) * 20;
  }

  // Format component (20%)
  if (context.formatScore !== undefined) {
    score += (context.formatScore / 100) * 20;
  }

  // Completeness component (15%)
  if (context.completenessScore !== undefined) {
    score += (context.completenessScore / 100) * 15;
  }

  // Metrics bonus (10%)
  if (context.hasMetrics === true) {
    score += 10;
  }

  // Missing sections penalty
  if (context.sectionsMissing && context.sectionsMissing.length > 0) {
    score -= context.sectionsMissing.length * 5;
  }

  // Missing keywords penalty
  if (context.missingKeywords && context.missingKeywords.length > 10) {
    score -= 10;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let level: 'not_ready' | 'needs_work' | 'ready' | 'highly_competitive';
  let message: string;

  if (score < 50) {
    level = 'not_ready';
    message = 'Your resume needs significant work before applying. Focus on critical issues first.';
  } else if (score < 70) {
    level = 'needs_work';
    message = 'Your resume has potential but needs improvements. Address high-priority recommendations.';
  } else if (score < 85) {
    level = 'ready';
    message = 'Your resume is solid and ready for most applications. Polish it further for competitive roles.';
  } else {
    level = 'highly_competitive';
    message = 'Your resume is highly competitive! You\'re well-positioned for top opportunities.';
  }

  return { score, level, message };
}
