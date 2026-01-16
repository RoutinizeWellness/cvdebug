/**
 * PHASE 3 - FEATURE 5: RESUME A/B TESTING FRAMEWORK
 *
 * Statistical A/B testing for resume versions to find winners
 *
 * Features:
 * - Compare multiple resume versions
 * - Track application outcomes
 * - Statistical significance testing
 * - Winner recommendation with confidence
 * - Conversion rate optimization
 * - Multivariate testing support
 *
 * COMPETITIVE ADVANTAGE:
 * - Jobscan: No testing framework ❌
 * - Resume Worded: No version comparison ❌
 * - CVDebug: Full A/B testing with stats ✅
 */

import { v } from "convex/values";

/**
 * Resume version for testing
 */
export interface ResumeVersion {
  id: string;
  name: string;
  resumeText: string;
  changes: string[];           // What changed from previous version
  atsScore: number;
  createdAt: number;
}

/**
 * Application outcome
 */
export interface ApplicationOutcome {
  resumeVersionId: string;
  outcome: "interview" | "rejected" | "no_response" | "offer";
  daysToResponse: number;
  jobTitle: string;
  company: string;
  appliedAt: number;
}

/**
 * A/B test results
 */
export interface ABTestResults {
  versions: Array<{
    id: string;
    name: string;
    atsScore: number;
    stats: {
      applications: number;
      interviews: number;
      offers: number;
      rejections: number;
      noResponses: number;
      conversionRate: number;      // % that got interview
      offerRate: number;            // % that got offer
      avgDaysToResponse: number;
    };
  }>;
  winner: {
    versionId: string;
    versionName: string;
    confidence: number;            // 0-100%
    improvementOverBaseline: number; // %
    reasoning: string;
  } | null;
  recommendations: string[];
  statisticalSignificance: {
    achieved: boolean;
    pValue: number;
    sampleSize: number;
    recommendedSampleSize: number;
  };
  testDuration: number;            // Days
  status: "insufficient_data" | "in_progress" | "completed" | "winner_found";
}

/**
 * Calculate conversion rate
 */
function calculateConversionRate(
  interviews: number,
  applications: number
): number {
  if (applications === 0) return 0;
  return (interviews / applications) * 100;
}

/**
 * Calculate statistical significance (Z-test for proportions)
 */
export function calculateSignificance(
  conversionA: number,
  samplesA: number,
  conversionB: number,
  samplesB: number
): {
  pValue: number;
  significant: boolean;
  zScore: number;
} {
  // Convert to proportions
  const p1 = conversionA / 100;
  const p2 = conversionB / 100;

  // Pooled proportion
  const pPooled = ((p1 * samplesA) + (p2 * samplesB)) / (samplesA + samplesB);

  // Standard error
  const se = Math.sqrt(pPooled * (1 - pPooled) * ((1 / samplesA) + (1 / samplesB)));

  // Z-score
  const zScore = (p1 - p2) / se;

  // P-value (two-tailed test)
  // Using approximation for normal CDF
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  // Significant if p < 0.05 (95% confidence)
  const significant = pValue < 0.05;

  return {
    pValue: Math.round(pValue * 10000) / 10000,
    significant,
    zScore: Math.round(zScore * 100) / 100
  };
}

/**
 * Normal cumulative distribution function approximation
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return x > 0 ? 1 - prob : prob;
}

/**
 * Calculate required sample size for statistical power
 */
export function calculateRequiredSampleSize(
  baselineConversion: number,
  minimumDetectableEffect: number = 0.2, // 20% relative improvement
  alpha: number = 0.05,   // 95% confidence
  beta: number = 0.20     // 80% power
): number {
  const p1 = baselineConversion / 100;
  const p2 = p1 * (1 + minimumDetectableEffect);

  // Simplified sample size calculation
  const zAlpha = 1.96;  // Z-score for 95% confidence
  const zBeta = 0.84;   // Z-score for 80% power

  const pPooled = (p1 + p2) / 2;
  const sampleSize = (
    (zAlpha * Math.sqrt(2 * pPooled * (1 - pPooled)) +
     zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
    ) ** 2
  ) / ((p1 - p2) ** 2);

  return Math.ceil(sampleSize);
}

/**
 * Calculate confidence level in winner
 */
function calculateConfidence(
  pValue: number,
  sampleSize: number,
  recommendedSize: number
): number {
  // Base confidence from p-value
  let confidence = (1 - pValue) * 100;

  // Adjust based on sample size adequacy
  const sizeRatio = sampleSize / recommendedSize;
  if (sizeRatio < 1) {
    confidence *= sizeRatio; // Reduce confidence if insufficient samples
  }

  return Math.min(100, Math.max(0, Math.round(confidence)));
}

/**
 * Analyze A/B test results
 */
export function analyzeABTest(
  versions: ResumeVersion[],
  outcomes: ApplicationOutcome[]
): ABTestResults {
  // Calculate stats for each version
  const versionStats = versions.map(version => {
    const versionOutcomes = outcomes.filter(o => o.resumeVersionId === version.id);

    const applications = versionOutcomes.length;
    const interviews = versionOutcomes.filter(o => o.outcome === "interview" || o.outcome === "offer").length;
    const offers = versionOutcomes.filter(o => o.outcome === "offer").length;
    const rejections = versionOutcomes.filter(o => o.outcome === "rejected").length;
    const noResponses = versionOutcomes.filter(o => o.outcome === "no_response").length;

    const conversionRate = calculateConversionRate(interviews, applications);
    const offerRate = applications > 0 ? (offers / applications) * 100 : 0;

    const responseTimes = versionOutcomes
      .filter(o => o.daysToResponse > 0)
      .map(o => o.daysToResponse);
    const avgDaysToResponse = responseTimes.length > 0
      ? responseTimes.reduce((sum, d) => sum + d, 0) / responseTimes.length
      : 0;

    return {
      id: version.id,
      name: version.name,
      atsScore: version.atsScore,
      stats: {
        applications,
        interviews,
        offers,
        rejections,
        noResponses,
        conversionRate: Math.round(conversionRate * 10) / 10,
        offerRate: Math.round(offerRate * 10) / 10,
        avgDaysToResponse: Math.round(avgDaysToResponse * 10) / 10
      }
    };
  });

  // Sort by conversion rate
  const sortedVersions = [...versionStats].sort((a, b) =>
    b.stats.conversionRate - a.stats.conversionRate
  );

  // Determine baseline (usually first version or version with most data)
  const baseline = versionStats.reduce((best, current) =>
    current.stats.applications > best.stats.applications ? current : best
  , versionStats[0]);

  // Find best performer
  const bestVersion = sortedVersions[0];

  // Check if we have enough data
  const totalApplications = versionStats.reduce((sum, v) => sum + v.stats.applications, 0);
  const recommendedSampleSize = calculateRequiredSampleSize(baseline.stats.conversionRate);

  let winner: ABTestResults["winner"] = null;
  let status: ABTestResults["status"] = "insufficient_data";

  if (totalApplications >= 10) {
    status = "in_progress";

    // Compare best version vs baseline
    if (bestVersion.id !== baseline.id && bestVersion.stats.applications >= 5 && baseline.stats.applications >= 5) {
      const significance = calculateSignificance(
        bestVersion.stats.conversionRate,
        bestVersion.stats.applications,
        baseline.stats.conversionRate,
        baseline.stats.applications
      );

      const confidence = calculateConfidence(
        significance.pValue,
        Math.min(bestVersion.stats.applications, baseline.stats.applications),
        recommendedSampleSize
      );

      if (significance.significant || confidence >= 80) {
        status = "winner_found";

        const improvement = baseline.stats.conversionRate > 0
          ? ((bestVersion.stats.conversionRate - baseline.stats.conversionRate) / baseline.stats.conversionRate) * 100
          : 0;

        let reasoning = "";
        if (significance.significant) {
          reasoning = `${bestVersion.name} achieves ${bestVersion.stats.conversionRate}% interview rate vs ${baseline.stats.conversionRate}% baseline (p=${significance.pValue}). `;
        } else {
          reasoning = `${bestVersion.name} shows ${bestVersion.stats.conversionRate}% interview rate vs ${baseline.stats.conversionRate}% baseline. `;
        }

        reasoning += `${improvement >= 0 ? "+" : ""}${improvement.toFixed(1)}% relative improvement. `;

        if (bestVersion.stats.applications < recommendedSampleSize) {
          reasoning += `Consider testing with more applications for stronger confidence.`;
        }

        winner = {
          versionId: bestVersion.id,
          versionName: bestVersion.name,
          confidence,
          improvementOverBaseline: Math.round(improvement * 10) / 10,
          reasoning
        };
      }
    }

    if (totalApplications >= recommendedSampleSize && !winner) {
      status = "completed";
    }
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (status === "insufficient_data") {
    recommendations.push(`Apply to ${recommendedSampleSize - totalApplications} more jobs to reach statistical significance`);
  }

  if (bestVersion.stats.conversionRate < 15) {
    recommendations.push("Overall interview rate is low - consider further optimizing resume content and keywords");
  }

  if (winner && winner.confidence >= 90) {
    recommendations.push(`Strong winner identified! Use ${winner.versionName} for future applications`);
  } else if (winner && winner.confidence >= 70) {
    recommendations.push(`Likely winner found, but continue testing to confirm results`);
  }

  // Identify what changed in winner
  if (winner) {
    const winnerVersion = versions.find(v => v.id === winner.versionId);
    if (winnerVersion && winnerVersion.changes.length > 0) {
      recommendations.push(`Key changes that worked: ${winnerVersion.changes.slice(0, 3).join(", ")}`);
    }
  }

  // ATS score vs actual performance
  const atsScoreCorrelation = sortedVersions.every((v, i, arr) =>
    i === 0 || v.atsScore <= arr[i - 1].atsScore
  );

  if (!atsScoreCorrelation && sortedVersions.length >= 2) {
    recommendations.push("Note: Higher ATS score doesn't always mean better interview rate. Real-world testing is crucial!");
  }

  // Test duration
  const firstApplication = outcomes.reduce((earliest, o) =>
    o.appliedAt < earliest ? o.appliedAt : earliest
  , Date.now());
  const testDuration = Math.ceil((Date.now() - firstApplication) / (1000 * 60 * 60 * 24));

  // Statistical significance details
  const hasSignificance = (winner?.confidence ?? 0) >= 80;
  const significanceData = {
    achieved: hasSignificance,
    pValue: winner ? 1 - (winner.confidence / 100) : 1,
    sampleSize: totalApplications,
    recommendedSampleSize
  };

  return {
    versions: versionStats,
    winner,
    recommendations,
    statisticalSignificance: significanceData,
    testDuration,
    status
  };
}

/**
 * Compare two specific resume versions
 */
export function compareTwoVersions(
  versionA: ResumeVersion,
  outcomesA: ApplicationOutcome[],
  versionB: ResumeVersion,
  outcomesB: ApplicationOutcome[]
): {
  versionA: {
    name: string;
    conversionRate: number;
    applications: number;
  };
  versionB: {
    name: string;
    conversionRate: number;
    applications: number;
  };
  winnerName: string | null;
  confidence: number;
  improvement: number;
  pValue: number;
  recommendation: string;
} {
  const statsA = {
    applications: outcomesA.length,
    interviews: outcomesA.filter(o => o.outcome === "interview" || o.outcome === "offer").length
  };

  const statsB = {
    applications: outcomesB.length,
    interviews: outcomesB.filter(o => o.outcome === "interview" || o.outcome === "offer").length
  };

  const conversionRateA = calculateConversionRate(statsA.interviews, statsA.applications);
  const conversionRateB = calculateConversionRate(statsB.interviews, statsB.applications);

  if (statsA.applications < 5 || statsB.applications < 5) {
    return {
      versionA: { name: versionA.name, conversionRate: conversionRateA, applications: statsA.applications },
      versionB: { name: versionB.name, conversionRate: conversionRateB, applications: statsB.applications },
      winnerName: null,
      confidence: 0,
      improvement: 0,
      pValue: 1,
      recommendation: "Need at least 5 applications per version to determine winner"
    };
  }

  const significance = calculateSignificance(
    conversionRateA,
    statsA.applications,
    conversionRateB,
    statsB.applications
  );

  const recommendedSize = calculateRequiredSampleSize(Math.max(conversionRateA, conversionRateB));
  const confidence = calculateConfidence(
    significance.pValue,
    Math.min(statsA.applications, statsB.applications),
    recommendedSize
  );

  const winnerName = conversionRateA > conversionRateB ? versionA.name :
                     conversionRateB > conversionRateA ? versionB.name : null;

  const improvement = winnerName === versionA.name
    ? ((conversionRateA - conversionRateB) / conversionRateB) * 100
    : winnerName === versionB.name
    ? ((conversionRateB - conversionRateA) / conversionRateA) * 100
    : 0;

  let recommendation = "";
  if (!winnerName) {
    recommendation = "Both versions perform equally. Continue testing or try a new variation.";
  } else if (confidence >= 90) {
    recommendation = `Clear winner: ${winnerName} with ${confidence}% confidence. Use this version exclusively.`;
  } else if (confidence >= 70) {
    recommendation = `Likely winner: ${winnerName} with ${confidence}% confidence. Continue testing to confirm.`;
  } else {
    recommendation = `Early indication favors ${winnerName}, but need more data for confidence.`;
  }

  return {
    versionA: {
      name: versionA.name,
      conversionRate: Math.round(conversionRateA * 10) / 10,
      applications: statsA.applications
    },
    versionB: {
      name: versionB.name,
      conversionRate: Math.round(conversionRateB * 10) / 10,
      applications: statsB.applications
    },
    winnerName,
    confidence,
    improvement: Math.round(improvement * 10) / 10,
    pValue: significance.pValue,
    recommendation
  };
}

/**
 * Multivariate testing - test multiple factors simultaneously
 */
export interface TestFactor {
  name: string;
  variations: string[];
}

export function setupMultivariateTest(
  factors: TestFactor[]
): Array<{
  combinationId: string;
  factors: Record<string, string>;
}> {
  // Generate all combinations
  function generateCombinations(factors: TestFactor[]): Array<Record<string, string>> {
    if (factors.length === 0) return [{}];
    if (factors.length === 1) {
      return factors[0].variations.map(v => ({ [factors[0].name]: v }));
    }

    const [first, ...rest] = factors;
    const restCombinations = generateCombinations(rest);

    const allCombinations: Array<Record<string, string>> = [];
    for (const variation of first.variations) {
      for (const restCombo of restCombinations) {
        allCombinations.push({
          [first.name]: variation,
          ...restCombo
        });
      }
    }

    return allCombinations;
  }

  const combinations = generateCombinations(factors);

  return combinations.map((combo, idx) => ({
    combinationId: `combination_${idx + 1}`,
    factors: combo
  }));
}

/**
 * Analyze multivariate test results
 */
export function analyzeMultivariateTest(
  combinations: Array<{ combinationId: string; factors: Record<string, string> }>,
  outcomes: Array<ApplicationOutcome & { combinationId: string }>
): {
  bestCombination: {
    combinationId: string;
    factors: Record<string, string>;
    conversionRate: number;
    confidence: number;
  } | null;
  factorImpact: Array<{
    factor: string;
    variations: Array<{
      value: string;
      avgConversionRate: number;
      impact: "positive" | "negative" | "neutral";
    }>;
  }>;
  recommendations: string[];
} {
  // Calculate conversion rate for each combination
  const combinationStats = combinations.map(combo => {
    const comboOutcomes = outcomes.filter(o => o.combinationId === combo.combinationId);
    const applications = comboOutcomes.length;
    const interviews = comboOutcomes.filter(o => o.outcome === "interview" || o.outcome === "offer").length;
    const conversionRate = calculateConversionRate(interviews, applications);

    return {
      ...combo,
      applications,
      conversionRate
    };
  });

  // Find best combination
  const bestCombo = combinationStats.reduce((best, current) =>
    current.conversionRate > best.conversionRate ? current : best
  );

  const bestCombination = bestCombo.applications >= 5 ? {
    combinationId: bestCombo.combinationId,
    factors: bestCombo.factors,
    conversionRate: bestCombo.conversionRate,
    confidence: Math.min(100, (bestCombo.applications / 10) * 100) // Simple confidence based on sample size
  } : null;

  // Analyze each factor's impact
  const factors = Object.keys(combinations[0].factors);
  const factorImpact = factors.map(factorName => {
    const values = Array.from(new Set(combinations.map(c => c.factors[factorName])));

    const variations = values.map(value => {
      const matchingCombos = combinationStats.filter(c => c.factors[factorName] === value);
      const totalApplications = matchingCombos.reduce((sum, c) => sum + c.applications, 0);
      const weightedSum = matchingCombos.reduce((sum, c) => sum + (c.conversionRate * c.applications), 0);
      const avgConversionRate = totalApplications > 0 ? weightedSum / totalApplications : 0;

      // Determine impact
      const overallAvg = combinationStats.reduce((sum, c) => sum + c.conversionRate, 0) / combinationStats.length;
      const impact: "positive" | "negative" | "neutral" =
        avgConversionRate > overallAvg * 1.1 ? "positive" :
        avgConversionRate < overallAvg * 0.9 ? "negative" : "neutral";

      return {
        value,
        avgConversionRate: Math.round(avgConversionRate * 10) / 10,
        impact
      };
    });

    return {
      factor: factorName,
      variations: variations.sort((a, b) => b.avgConversionRate - a.avgConversionRate)
    };
  });

  // Generate recommendations
  const recommendations: string[] = [];

  if (bestCombination) {
    recommendations.push(`Best combination: ${JSON.stringify(bestCombination.factors)} with ${bestCombination.conversionRate}% interview rate`);
  }

  for (const factor of factorImpact) {
    const best = factor.variations[0];
    if (best.impact === "positive") {
      recommendations.push(`Use "${best.value}" for ${factor.factor} (${best.avgConversionRate}% conversion)`);
    }
  }

  if (combinationStats.every(c => c.applications < 10)) {
    recommendations.push("Need more applications per combination for reliable results");
  }

  return {
    bestCombination,
    factorImpact,
    recommendations
  };
}
