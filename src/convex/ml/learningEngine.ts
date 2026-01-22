/**
 * Continuous Learning Engine v1.0
 *
 * Self-improving ML system that learns from:
 * - User feedback on analysis accuracy
 * - Successful resume outcomes (interviews, offers)
 * - ATS parsing success rates
 * - Industry-specific patterns
 *
 * Uses online learning algorithms to continuously improve predictions
 */

export interface LearningDataPoint {
  resumeId: string;
  userId: string;

  // Input features
  features: {
    keywordDensity: number;
    formatScore: number;
    completenessScore: number;
    industryMatchScore: number;
    atsCompatibilityScore: number;
    experienceYears: number;
    educationLevel: number;
    hasMetrics: boolean;
    actionVerbCount: number;
    technicalSkillsCount: number;
  };

  // Predicted vs actual
  predictedScore: number;
  actualOutcome?: {
    userRating?: number; // 1-5 stars
    gotInterview?: boolean;
    gotOffer?: boolean;
    atsSuccessRate?: number; // % of applications that passed ATS
    timeToInterview?: number; // days
  };

  // Context
  industry: string;
  targetRole?: string;
  timestamp: number;
}

export interface ModelWeights {
  keywordDensity: number;
  formatScore: number;
  completenessScore: number;
  industryMatch: number;
  atsCompatibility: number;
  experienceYears: number;
  educationLevel: number;
  hasMetrics: number;
  actionVerbs: number;
  technicalSkills: number;

  // Industry-specific adjustments
  industryWeights: Record<string, number>;

  // Bias term
  bias: number;

  // Metadata
  trainingExamples: number;
  lastUpdated: number;
  version: number;
}

/**
 * Initialize default model weights
 */
export function initializeModelWeights(): ModelWeights {
  return {
    keywordDensity: 0.25,
    formatScore: 0.20,
    completenessScore: 0.15,
    industryMatch: 0.12,
    atsCompatibility: 0.18,
    experienceYears: 0.05,
    educationLevel: 0.03,
    hasMetrics: 0.08,
    actionVerbs: 0.06,
    technicalSkills: 0.07,
    industryWeights: {
      technology: 1.1,
      healthcare: 1.05,
      finance: 1.08,
      sales: 0.95,
      marketing: 0.98
    },
    bias: 0.5,
    trainingExamples: 0,
    lastUpdated: Date.now(),
    version: 1
  };
}

/**
 * Online learning with Stochastic Gradient Descent
 * Updates model weights based on prediction error
 */
export function updateModelWeights(
  weights: ModelWeights,
  dataPoint: LearningDataPoint,
  learningRate: number = 0.01
): ModelWeights {

  // Calculate prediction error
  const prediction = predictWithWeights(weights, dataPoint.features, dataPoint.industry);
  const actualScore = calculateActualScore(dataPoint.actualOutcome);
  const error = actualScore - prediction;

  console.log(`[Learning] Error: ${error.toFixed(2)}, Prediction: ${prediction.toFixed(2)}, Actual: ${actualScore.toFixed(2)}`);

  // Only update if we have actual outcome data
  if (!dataPoint.actualOutcome || actualScore === prediction) {
    return weights;
  }

  // Gradient descent update: w = w + α * error * feature
  const newWeights = { ...weights };

  newWeights.keywordDensity += learningRate * error * dataPoint.features.keywordDensity;
  newWeights.formatScore += learningRate * error * dataPoint.features.formatScore;
  newWeights.completenessScore += learningRate * error * dataPoint.features.completenessScore;
  newWeights.industryMatch += learningRate * error * dataPoint.features.industryMatchScore;
  newWeights.atsCompatibility += learningRate * error * dataPoint.features.atsCompatibilityScore;
  newWeights.experienceYears += learningRate * error * (dataPoint.features.experienceYears / 10); // Normalize
  newWeights.educationLevel += learningRate * error * (dataPoint.features.educationLevel / 5); // Normalize
  newWeights.hasMetrics += learningRate * error * (dataPoint.features.hasMetrics ? 1 : 0);
  newWeights.actionVerbs += learningRate * error * (dataPoint.features.actionVerbCount / 20); // Normalize
  newWeights.technicalSkills += learningRate * error * (dataPoint.features.technicalSkillsCount / 15); // Normalize
  newWeights.bias += learningRate * error;

  // Update industry weight if applicable
  if (dataPoint.industry && newWeights.industryWeights[dataPoint.industry] !== undefined) {
    newWeights.industryWeights[dataPoint.industry] += learningRate * error * 0.1;
    // Clamp between 0.8 and 1.3
    newWeights.industryWeights[dataPoint.industry] = Math.max(0.8, Math.min(1.3, newWeights.industryWeights[dataPoint.industry]));
  }

  // Ensure weights stay in reasonable bounds
  const weightKeys = [
    'keywordDensity', 'formatScore', 'completenessScore', 'industryMatch',
    'atsCompatibility', 'experienceYears', 'educationLevel', 'hasMetrics',
    'actionVerbs', 'technicalSkills'
  ] as const;

  for (const key of weightKeys) {
    newWeights[key] = Math.max(0, Math.min(1, newWeights[key]));
  }

  // Update metadata
  newWeights.trainingExamples += 1;
  newWeights.lastUpdated = Date.now();

  // Version bump every 100 examples
  if (newWeights.trainingExamples % 100 === 0) {
    newWeights.version += 1;
  }

  console.log(`[Learning] Updated weights - Examples: ${newWeights.trainingExamples}, Version: ${newWeights.version}`);

  return newWeights;
}

/**
 * Predict score using current model weights
 */
function predictWithWeights(
  weights: ModelWeights,
  features: LearningDataPoint['features'],
  industry: string
): number {

  let score = weights.bias;

  score += weights.keywordDensity * features.keywordDensity;
  score += weights.formatScore * features.formatScore;
  score += weights.completenessScore * features.completenessScore;
  score += weights.industryMatch * features.industryMatchScore;
  score += weights.atsCompatibility * features.atsCompatibilityScore;
  score += weights.experienceYears * (features.experienceYears / 10);
  score += weights.educationLevel * (features.educationLevel / 5);
  score += weights.hasMetrics * (features.hasMetrics ? 1 : 0);
  score += weights.actionVerbs * (features.actionVerbCount / 20);
  score += weights.technicalSkills * (features.technicalSkillsCount / 15);

  // Apply industry multiplier
  const industryMultiplier = weights.industryWeights[industry] || 1.0;
  score *= industryMultiplier;

  // Normalize to 0-100 range
  return Math.max(0, Math.min(100, score * 100));
}

/**
 * Calculate actual score from outcome data
 * Weights different outcomes by importance
 */
function calculateActualScore(outcome?: LearningDataPoint['actualOutcome']): number {
  if (!outcome) return 0;

  let score = 50; // Base score

  // User rating (most direct feedback)
  if (outcome.userRating) {
    score = (outcome.userRating / 5) * 100;
  }

  // Interview success (strong signal)
  if (outcome.gotInterview === true) {
    score = Math.max(score, 75);
  } else if (outcome.gotInterview === false) {
    score = Math.min(score, 60);
  }

  // Job offer (strongest signal)
  if (outcome.gotOffer === true) {
    score = Math.max(score, 90);
  }

  // ATS success rate
  if (outcome.atsSuccessRate !== undefined) {
    score = (score * 0.7) + (outcome.atsSuccessRate * 0.3);
  }

  // Time to interview (faster is better)
  if (outcome.timeToInterview !== undefined) {
    if (outcome.timeToInterview <= 7) {
      score += 5; // Quick response is good
    } else if (outcome.timeToInterview > 30) {
      score -= 5; // Slow response might indicate issues
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Batch learning - update weights from multiple data points
 * Uses mini-batch gradient descent for stability
 */
export function batchUpdateWeights(
  weights: ModelWeights,
  dataPoints: LearningDataPoint[],
  learningRate: number = 0.01
): ModelWeights {

  if (dataPoints.length === 0) return weights;

  console.log(`[Learning] Batch update with ${dataPoints.length} examples`);

  let updatedWeights = { ...weights };

  // Process in mini-batches of 10
  const batchSize = 10;
  for (let i = 0; i < dataPoints.length; i += batchSize) {
    const batch = dataPoints.slice(i, i + batchSize);

    for (const point of batch) {
      updatedWeights = updateModelWeights(updatedWeights, point, learningRate);
    }
  }

  return updatedWeights;
}

/**
 * Calculate model performance metrics
 */
export interface ModelPerformance {
  accuracy: number; // % of predictions within 10 points of actual
  meanError: number; // Average absolute error
  rmse: number; // Root mean squared error
  confidenceInterval: [number, number]; // 95% CI for predictions
  samplesAnalyzed: number;
}

export function evaluateModelPerformance(
  weights: ModelWeights,
  testData: LearningDataPoint[]
): ModelPerformance {

  if (testData.length === 0) {
    return {
      accuracy: 0,
      meanError: 0,
      rmse: 0,
      confidenceInterval: [0, 0],
      samplesAnalyzed: 0
    };
  }

  const errors: number[] = [];
  let correctWithin10 = 0;

  for (const point of testData) {
    if (!point.actualOutcome) continue;

    const prediction = predictWithWeights(weights, point.features, point.industry);
    const actual = calculateActualScore(point.actualOutcome);
    const error = Math.abs(prediction - actual);

    errors.push(error);

    if (error <= 10) {
      correctWithin10++;
    }
  }

  const accuracy = (correctWithin10 / testData.length) * 100;
  const meanError = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  const rmse = Math.sqrt(errors.reduce((sum, e) => sum + e * e, 0) / errors.length);

  // Calculate 95% confidence interval (mean ± 1.96 * std)
  const mean = meanError;
  const variance = errors.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / errors.length;
  const std = Math.sqrt(variance);
  const ci: [number, number] = [mean - 1.96 * std, mean + 1.96 * std];

  console.log(`[Learning] Performance - Accuracy: ${accuracy.toFixed(1)}%, Mean Error: ${meanError.toFixed(2)}, RMSE: ${rmse.toFixed(2)}`);

  return {
    accuracy,
    meanError,
    rmse,
    confidenceInterval: ci,
    samplesAnalyzed: testData.length
  };
}

/**
 * Feature importance analysis
 * Identifies which features contribute most to predictions
 */
export interface FeatureImportance {
  feature: string;
  importance: number; // 0-1 scale
  averageImpact: number; // Average contribution to score
}

export function analyzeFeatureImportance(weights: ModelWeights): FeatureImportance[] {
  const features: FeatureImportance[] = [
    { feature: 'Keyword Density', importance: weights.keywordDensity, averageImpact: weights.keywordDensity * 100 },
    { feature: 'Format Score', importance: weights.formatScore, averageImpact: weights.formatScore * 100 },
    { feature: 'Completeness', importance: weights.completenessScore, averageImpact: weights.completenessScore * 100 },
    { feature: 'Industry Match', importance: weights.industryMatch, averageImpact: weights.industryMatch * 100 },
    { feature: 'ATS Compatibility', importance: weights.atsCompatibility, averageImpact: weights.atsCompatibility * 100 },
    { feature: 'Experience Years', importance: weights.experienceYears, averageImpact: weights.experienceYears * 50 },
    { feature: 'Education Level', importance: weights.educationLevel, averageImpact: weights.educationLevel * 50 },
    { feature: 'Has Metrics', importance: weights.hasMetrics, averageImpact: weights.hasMetrics * 100 },
    { feature: 'Action Verbs', importance: weights.actionVerbs, averageImpact: weights.actionVerbs * 60 },
    { feature: 'Technical Skills', importance: weights.technicalSkills, averageImpact: weights.technicalSkills * 70 }
  ];

  // Sort by importance
  features.sort((a, b) => b.importance - a.importance);

  return features;
}

/**
 * Adaptive learning rate scheduler
 * Reduces learning rate as model improves
 */
export function calculateAdaptiveLearningRate(
  baseRate: number,
  trainingExamples: number,
  currentError: number
): number {

  // Decay factor: reduce learning rate as we get more data
  const decayFactor = 1 / (1 + trainingExamples / 1000);

  // Error-based adjustment: increase rate if error is high
  const errorAdjustment = currentError > 15 ? 1.2 : currentError < 5 ? 0.8 : 1.0;

  const adaptiveRate = baseRate * decayFactor * errorAdjustment;

  // Clamp between min and max
  return Math.max(0.001, Math.min(0.05, adaptiveRate));
}
