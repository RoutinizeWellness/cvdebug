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
  robotTerminalView: boolean;
  fullKeywordAnalysis: boolean;

  // Analysis Features
  seniorityMatch: boolean;
  missingSignals: boolean;
  fluffDetector: boolean;

  // AI Optimization
  aiRewrite: number; // Number of AI rewrites allowed
  autoInjectKeywords: boolean;
  bulletPointEnhancer: boolean;

  // Export & Templates
  exportOptimizedCV: boolean;
  atsTemplates: boolean;

  // Additional Tools
  coverLetterGenerator: boolean;
  linkedinOptimizer: boolean;
  interviewBattlePlan: boolean;

  // Support
  prioritySupport: boolean;
}

export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  free: {
    // Scanning
    unlimitedScans: false,
    maxScans: 1,

    // Robot View
    robotTerminalView: false, // Blocked/Preview only
    fullKeywordAnalysis: false, // Only top 2 keywords

    // Analysis Features
    seniorityMatch: false, // Preview only
    missingSignals: false,
    fluffDetector: false,

    // AI Optimization
    aiRewrite: 0,
    autoInjectKeywords: false,
    bulletPointEnhancer: false,

    // Export & Templates
    exportOptimizedCV: false,
    atsTemplates: false,

    // Additional Tools
    coverLetterGenerator: false,
    linkedinOptimizer: false,
    interviewBattlePlan: false,

    // Support
    prioritySupport: false,
  },

  single_debug_fix: {
    // Scanning
    unlimitedScans: false,
    maxScans: 1, // 1 deep scan

    // Robot View
    robotTerminalView: true, // Full access
    fullKeywordAnalysis: true, // All keywords shown

    // Analysis Features
    seniorityMatch: true,
    missingSignals: true,
    fluffDetector: true,

    // AI Optimization
    aiRewrite: 1, // 1 complete AI rewrite
    autoInjectKeywords: true,
    bulletPointEnhancer: true,

    // Export & Templates
    exportOptimizedCV: true,
    atsTemplates: true,

    // Additional Tools
    coverLetterGenerator: false,
    linkedinOptimizer: false,
    interviewBattlePlan: false,

    // Support
    prioritySupport: false,
  },

  single_scan: {
    // Scanning
    unlimitedScans: true, // Unlimited for 24h
    maxScans: null,

    // Robot View
    robotTerminalView: true,
    fullKeywordAnalysis: true,

    // Analysis Features
    seniorityMatch: true,
    missingSignals: true,
    fluffDetector: true,

    // AI Optimization
    aiRewrite: 0, // No AI rewrite
    autoInjectKeywords: false,
    bulletPointEnhancer: false,

    // Export & Templates
    exportOptimizedCV: true,
    atsTemplates: true,

    // Additional Tools
    coverLetterGenerator: false,
    linkedinOptimizer: false,
    interviewBattlePlan: true,

    // Support
    prioritySupport: false,
  },

  interview_sprint: {
    // Scanning
    unlimitedScans: true, // Unlimited for 7 days
    maxScans: null,

    // Robot View
    robotTerminalView: true,
    fullKeywordAnalysis: true,

    // Analysis Features
    seniorityMatch: true,
    missingSignals: true,
    fluffDetector: true,

    // AI Optimization
    aiRewrite: 999, // Unlimited rewrites
    autoInjectKeywords: true,
    bulletPointEnhancer: true,

    // Export & Templates
    exportOptimizedCV: true,
    atsTemplates: true,

    // Additional Tools
    coverLetterGenerator: true,
    linkedinOptimizer: true,
    interviewBattlePlan: true,

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
