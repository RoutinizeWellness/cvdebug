/**
 * Plan Helper Functions
 * Centralized utilities for checking plan access and features
 */

import { getPlanFeatures, hasFeatureAccess } from "./planFeatures";
import type { PlanTier } from "./planFeatures";

/**
 * Check if user has any paid plan
 * Includes: single_debug_fix, single_scan, interview_sprint
 */
export function isPaidUser(tier?: string): boolean {
  if (!tier) return false;
  return (
    tier === "single_debug_fix" ||
    tier === "single_scan" ||
    tier === "interview_sprint"
  );
}

/**
 * Check if user is on free tier
 */
export function isFreeUser(tier?: string): boolean {
  return !tier || tier === "free";
}

/**
 * Check if user has Career Sprint plan (highest tier)
 */
export function hasCareerSprint(tier?: string, sprintExpiresAt?: number): boolean {
  if (tier !== "interview_sprint") return false;
  if (!sprintExpiresAt) return true; // No expiry set means unlimited
  return sprintExpiresAt > Date.now();
}

/**
 * Check if user has access to AI Rewrite feature
 */
export function hasAIRewriteAccess(tier?: string, usedRewrites: number = 0): boolean {
  if (!tier || tier === "free") return false;

  const features = getPlanFeatures(tier as PlanTier);
  return features.aiRewrite > usedRewrites;
}

/**
 * Get remaining AI rewrites
 */
export function getRemainingRewrites(tier?: string, usedRewrites: number = 0): number {
  if (!tier || tier === "free") return 0;

  const features = getPlanFeatures(tier as PlanTier);
  if (features.aiRewrite === 999) return 999; // Unlimited
  return Math.max(0, features.aiRewrite - usedRewrites);
}

/**
 * Check if user has access to specific feature
 */
export function hasAccess(tier: string | undefined, feature: string): boolean {
  if (!tier) return false;
  return hasFeatureAccess(tier as PlanTier, feature as any);
}

/**
 * Check if user can perform another scan
 */
export function canScan(tier?: string, usedScans: number = 0, sprintExpiresAt?: number): boolean {
  if (!tier || tier === "free") return usedScans < 1; // Free gets 1 scan

  // Check expiration for time-limited plans
  if (sprintExpiresAt && sprintExpiresAt < Date.now()) {
    return false;
  }

  const features = getPlanFeatures(tier as PlanTier);

  // Unlimited scans
  if (features.unlimitedScans) return true;

  // Limited scans
  if (features.maxScans !== null) {
    return usedScans < features.maxScans;
  }

  return false;
}

/**
 * Get plan display name
 */
export function getPlanName(tier?: string): string {
  const names: Record<string, string> = {
    free: "Free",
    single_debug_fix: "Single Debug Fix",
    single_scan: "24h Pass",
    interview_sprint: "Career Sprint",
  };
  return names[tier || "free"] || "Free";
}

/**
 * Check if plan has feature based on tier
 * Convenient helper for common feature checks
 */
export function planHas(tier?: string): {
  robotView: boolean;
  allKeywords: boolean;
  aiRewrite: boolean;
  coverLetter: boolean;
  linkedin: boolean;
  battlePlan: boolean;
  export: boolean;
  unlimitedScans: boolean;
} {
  const features = getPlanFeatures((tier || "free") as PlanTier);

  return {
    robotView: features.robotTerminalView,
    allKeywords: features.fullKeywordAnalysis,
    aiRewrite: features.aiRewrite > 0,
    coverLetter: features.coverLetterGenerator,
    linkedin: features.linkedinOptimizer,
    battlePlan: features.interviewBattlePlan,
    export: features.exportOptimizedCV,
    unlimitedScans: features.unlimitedScans,
  };
}
