/**
 * Plan Features Configuration
 * Defines what each subscription tier can access
 */

export type PlanTier = "free" | "single_debug_fix" | "single_scan" | "interview_sprint";

export interface PlanFeatures {
  // Scanning
  unlimitedScans: boolean;
  maxScans: number | null;

  // Robot View
  robotTerminalView: boolean; // false = partial preview (10 lines), true = full access
  partialRobotView: boolean; // Shows first 10 lines with blur
  fullKeywordAnalysis: boolean;

  // Analysis Features
  seniorityMatch: boolean;
  missingSignals: boolean;
  fluffDetector: boolean;
  invisibilityCheck: boolean; // Binary YES/NO indicator for free tier
  detailedErrorTags: boolean; // Exact fix locations (removed from free)

  // AI Optimization
  aiRewrite: number; // Number of AI rewrites allowed
  autoInjectKeywords: boolean;
  bulletPointEnhancer: boolean;

  // Export & Templates
  exportOptimizedCV: boolean;
  atsTemplates: boolean;

  // Job Matching
  jobDescriptionMatches: number; // Number of job descriptions to match against
  unlimitedTitleScans: boolean; // Unlimited title variation testing

  // Additional Tools
  coverLetterGenerator: boolean | "unlimited"; // Boolean or "unlimited" for 24h pass
  linkedinOptimizer: boolean; // Basic tips
  linkedinDeepAudit: boolean; // Deep audit with detailed recommendations
  recruiterDMTemplates: boolean; // DM templates for reaching out to recruiters
  interviewBattlePlan: boolean;

  // Guarantees
  scoreGuarantee: number | null; // Minimum score guarantee (e.g., 85)

  // Support
  prioritySupport: boolean;
}

export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  free: {
    // Scanning
    unlimitedScans: false,
    maxScans: 1,

    // Robot View
    robotTerminalView: false, // Full view blocked
    partialRobotView: true, // Show first 10 lines with blur
    fullKeywordAnalysis: false, // Only top 2 keywords

    // Analysis Features
    seniorityMatch: false, // Preview only
    missingSignals: false,
    fluffDetector: false,
    invisibilityCheck: true, // Binary YES/NO indicator
    detailedErrorTags: false, // Don't show exact fix locations

    // AI Optimization
    aiRewrite: 0,
    autoInjectKeywords: false,
    bulletPointEnhancer: false,

    // Export & Templates
    exportOptimizedCV: false,
    atsTemplates: false,

    // Job Matching
    jobDescriptionMatches: 0,
    unlimitedTitleScans: false,

    // Additional Tools
    coverLetterGenerator: false,
    linkedinOptimizer: false,
    linkedinDeepAudit: false,
    recruiterDMTemplates: false,
    interviewBattlePlan: false,

    // Guarantees
    scoreGuarantee: null,

    // Support
    prioritySupport: false,
  },

  single_debug_fix: {
    // Scanning
    unlimitedScans: false,
    maxScans: 1, // 1 deep scan

    // Robot View
    robotTerminalView: true, // Full access
    partialRobotView: false, // Not needed - has full access
    fullKeywordAnalysis: true, // All keywords shown

    // Analysis Features
    seniorityMatch: true,
    missingSignals: true,
    fluffDetector: true,
    invisibilityCheck: true,
    detailedErrorTags: true, // Show exact fix locations

    // AI Optimization
    aiRewrite: 1, // 1 complete AI rewrite
    autoInjectKeywords: true,
    bulletPointEnhancer: true,

    // Export & Templates
    exportOptimizedCV: true,
    atsTemplates: true,

    // Job Matching
    jobDescriptionMatches: 1, // Match with 1 job description
    unlimitedTitleScans: false,

    // Additional Tools
    coverLetterGenerator: false,
    linkedinOptimizer: false,
    linkedinDeepAudit: false,
    recruiterDMTemplates: false,
    interviewBattlePlan: false,

    // Guarantees
    scoreGuarantee: 85, // Score 85+ guarantee

    // Support
    prioritySupport: false,
  },

  single_scan: {
    // Scanning
    unlimitedScans: true, // Unlimited for 24h
    maxScans: null,

    // Robot View
    robotTerminalView: true,
    partialRobotView: false, // Not needed - has full access
    fullKeywordAnalysis: true,

    // Analysis Features
    seniorityMatch: true,
    missingSignals: true,
    fluffDetector: true,
    invisibilityCheck: true,
    detailedErrorTags: true,

    // AI Optimization
    aiRewrite: 0, // No AI rewrite
    autoInjectKeywords: false,
    bulletPointEnhancer: false,

    // Export & Templates
    exportOptimizedCV: true,
    atsTemplates: true,

    // Job Matching
    jobDescriptionMatches: 999, // Unlimited job matches
    unlimitedTitleScans: true, // Unlimited title variation testing

    // Additional Tools
    coverLetterGenerator: "unlimited", // ADDED: Unlimited cover letter generation for 24h
    linkedinOptimizer: false, // Removed from 24h plan
    linkedinDeepAudit: false,
    recruiterDMTemplates: false,
    interviewBattlePlan: true,

    // Guarantees
    scoreGuarantee: null,

    // Support
    prioritySupport: false,
  },

  interview_sprint: {
    // Scanning
    unlimitedScans: true, // Unlimited for 7 days
    maxScans: null,

    // Robot View
    robotTerminalView: true,
    partialRobotView: false, // Not needed - has full access
    fullKeywordAnalysis: true,

    // Analysis Features
    seniorityMatch: true,
    missingSignals: true,
    fluffDetector: true,
    invisibilityCheck: true,
    detailedErrorTags: true,

    // AI Optimization
    aiRewrite: 999, // Unlimited rewrites
    autoInjectKeywords: true,
    bulletPointEnhancer: true,

    // Export & Templates
    exportOptimizedCV: true,
    atsTemplates: true,

    // Job Matching
    jobDescriptionMatches: 999, // Unlimited job matches
    unlimitedTitleScans: true, // Unlimited title variation testing

    // Additional Tools
    coverLetterGenerator: "unlimited",
    linkedinOptimizer: false, // Removed - replaced by deep audit
    linkedinDeepAudit: true, // LinkedIn Deep Audit with detailed recommendations
    recruiterDMTemplates: true, // ADDED: DM templates for reaching out to recruiters
    interviewBattlePlan: true,

    // Guarantees
    scoreGuarantee: null,

    // Support
    prioritySupport: true,
  },
};

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(
  tier: PlanTier,
  feature: keyof PlanFeatures
): boolean {
  return PLAN_FEATURES[tier][feature] as boolean;
}

/**
 * Get all features for a plan tier
 */
export function getPlanFeatures(tier: PlanTier): PlanFeatures {
  return PLAN_FEATURES[tier];
}

/**
 * Check if user has premium features (any paid plan)
 */
export function isPremiumTier(tier: PlanTier): boolean {
  return tier !== "free";
}

/**
 * Check if user has access to AI rewrite
 */
export function hasAIRewriteAccess(tier: PlanTier, usedRewrites: number = 0): boolean {
  const features = PLAN_FEATURES[tier];
  return features.aiRewrite > usedRewrites;
}

/**
 * Get remaining AI rewrites for user
 */
export function getRemainingAIRewrites(tier: PlanTier, usedRewrites: number = 0): number {
  const features = PLAN_FEATURES[tier];
  if (features.aiRewrite === 999) return 999; // Unlimited
  return Math.max(0, features.aiRewrite - usedRewrites);
}

/**
 * Check if plan includes unlimited scans
 */
export function hasUnlimitedScans(tier: PlanTier): boolean {
  return PLAN_FEATURES[tier].unlimitedScans;
}

/**
 * Check if user can perform another scan
 */
export function canPerformScan(
  tier: PlanTier,
  usedScans: number,
  sprintExpiresAt?: number
): boolean {
  // Check if sprint has expired
  if (sprintExpiresAt && sprintExpiresAt < Date.now()) {
    return false;
  }

  const features = PLAN_FEATURES[tier];

  // Unlimited scans (within time limit)
  if (features.unlimitedScans) {
    return true;
  }

  // Limited scans
  if (features.maxScans !== null) {
    return usedScans < features.maxScans;
  }

  return false;
}
