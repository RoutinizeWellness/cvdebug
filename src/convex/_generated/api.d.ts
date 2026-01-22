/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as abTesting from "../abTesting.js";
import type * as abandonmentEmails from "../abandonmentEmails.js";
import type * as admin from "../admin.js";
import type * as admin_stats from "../admin/stats.js";
import type * as adminActions from "../adminActions.js";
import type * as ai from "../ai.js";
import type * as ai_abTesting from "../ai/abTesting.js";
import type * as ai_advancedATSActions from "../ai/advancedATSActions.js";
import type * as ai_advancedATSEngine from "../ai/advancedATSEngine.js";
import type * as ai_advancedNLP from "../ai/advancedNLP.js";
import type * as ai_advancedScoringActions from "../ai/advancedScoringActions.js";
import type * as ai_advancedScoringEngine from "../ai/advancedScoringEngine.js";
import type * as ai_apiClient from "../ai/apiClient.js";
import type * as ai_autoFix from "../ai/autoFix.js";
import type * as ai_autoTuneEngine from "../ai/autoTuneEngine.js";
import type * as ai_automation_applicationAutomator from "../ai/automation/applicationAutomator.js";
import type * as ai_automation_applicationAutomatorData from "../ai/automation/applicationAutomatorData.js";
import type * as ai_bulletRewriter from "../ai/bulletRewriter.js";
import type * as ai_careerTrajectory from "../ai/careerTrajectory.js";
import type * as ai_chatbot from "../ai/chatbot.js";
import type * as ai_comprehensiveExtractor from "../ai/comprehensiveExtractor.js";
import type * as ai_config_keywords from "../ai/config/keywords.js";
import type * as ai_config_metricTemplates from "../ai/config/metricTemplates.js";
import type * as ai_contactExtractor from "../ai/contactExtractor.js";
import type * as ai_contentAnalysis from "../ai/contentAnalysis.js";
import type * as ai_deepLearningEngine from "../ai/deepLearningEngine.js";
import type * as ai_eliteMatch from "../ai/eliteMatch.js";
import type * as ai_entityExtraction from "../ai/entityExtraction.js";
import type * as ai_evaluation from "../ai/evaluation.js";
import type * as ai_fallbackAnalysis from "../ai/fallbackAnalysis.js";
import type * as ai_feedbackLoop from "../ai/feedbackLoop.js";
import type * as ai_humanizeErrors from "../ai/humanizeErrors.js";
import type * as ai_humanizedMessages from "../ai/humanizedMessages.js";
import type * as ai_intelligence_marketIntelligence from "../ai/intelligence/marketIntelligence.js";
import type * as ai_intelligence_marketIntelligenceData from "../ai/intelligence/marketIntelligenceData.js";
import type * as ai_intelligentCache from "../ai/intelligentCache.js";
import type * as ai_intelligentFallback from "../ai/intelligentFallback.js";
import type * as ai_interviewPrep from "../ai/interviewPrep.js";
import type * as ai_jobMatcher from "../ai/jobMatcher.js";
import type * as ai_lib_scoringHelpers from "../ai/lib/scoringHelpers.js";
import type * as ai_linkedinOptimizer from "../ai/linkedinOptimizer.js";
import type * as ai_ml_advancedScoring from "../ai/ml/advancedScoring.js";
import type * as ai_ml_deepLearning from "../ai/ml/deepLearning.js";
import type * as ai_ml_localNLP from "../ai/ml/localNLP.js";
import type * as ai_ml_localTranslation from "../ai/ml/localTranslation.js";
import type * as ai_ml_successPredictor from "../ai/ml/successPredictor.js";
import type * as ai_ml_transformerLite from "../ai/ml/transformerLite.js";
import type * as ai_ml_vectorEmbeddings from "../ai/ml/vectorEmbeddings.js";
import type * as ai_mlEngine from "../ai/mlEngine.js";
import type * as ai_mlFeedbackLoop from "../ai/mlFeedbackLoop.js";
import type * as ai_mlLearning from "../ai/mlLearning.js";
import type * as ai_multiLanguage_culturalAdaptation from "../ai/multiLanguage/culturalAdaptation.js";
import type * as ai_multiLanguage_languageIntelligence from "../ai/multiLanguage/languageIntelligence.js";
import type * as ai_performOcr from "../ai/performOcr.js";
import type * as ai_predictiveAnalytics from "../ai/predictiveAnalytics.js";
import type * as ai_prompts from "../ai/prompts.js";
import type * as ai_qualityChecks from "../ai/qualityChecks.js";
import type * as ai_recommendations from "../ai/recommendations.js";
import type * as ai_references_referenceManager from "../ai/references/referenceManager.js";
import type * as ai_references_referenceManagerData from "../ai/references/referenceManagerData.js";
import type * as ai_resumeAnalysis from "../ai/resumeAnalysis.js";
import type * as ai_resumeRewrite from "../ai/resumeRewrite.js";
import type * as ai_scoring_advancedScoring from "../ai/scoring/advancedScoring.js";
import type * as ai_scoring_analysisFormatter from "../ai/scoring/analysisFormatter.js";
import type * as ai_scoring_atsSimulation from "../ai/scoring/atsSimulation.js";
import type * as ai_scoring_bm25Scoring from "../ai/scoring/bm25Scoring.js";
import type * as ai_scoring_competitiveBenchmark from "../ai/scoring/competitiveBenchmark.js";
import type * as ai_scoring_completenessScoring from "../ai/scoring/completenessScoring.js";
import type * as ai_scoring_deepLearning from "../ai/scoring/deepLearning.js";
import type * as ai_scoring_formatScoring from "../ai/scoring/formatScoring.js";
import type * as ai_scoring_industryModels from "../ai/scoring/industryModels.js";
import type * as ai_scoring_interviewPredictor from "../ai/scoring/interviewPredictor.js";
import type * as ai_scoring_keywordExamples from "../ai/scoring/keywordExamples.js";
import type * as ai_scoring_keywordScoring from "../ai/scoring/keywordScoring.js";
import type * as ai_scoring_semanticSimilarity from "../ai/scoring/semanticSimilarity.js";
import type * as ai_serverOcr from "../ai/serverOcr.js";
import type * as ai_skillsGapAnalyzer from "../ai/skillsGapAnalyzer.js";
import type * as ai_smartNotifications from "../ai/smartNotifications.js";
import type * as ai_socialIntegration_brandAnalyzer from "../ai/socialIntegration/brandAnalyzer.js";
import type * as ai_socialIntegration_brandAnalyzerData from "../ai/socialIntegration/brandAnalyzerData.js";
import type * as ai_specificRewriter from "../ai/specificRewriter.js";
import type * as ai_video_videoResumeAnalyzer from "../ai/video/videoResumeAnalyzer.js";
import type * as ai_video_videoResumeAnalyzerData from "../ai/video/videoResumeAnalyzerData.js";
import type * as aiMonitoring from "../aiMonitoring.js";
import type * as api_resumeScoringAPI from "../api/resumeScoringAPI.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as autoTune from "../autoTune.js";
import type * as billing from "../billing.js";
import type * as billingActions from "../billingActions.js";
import type * as blog from "../blog.js";
import type * as blogGenerator from "../blogGenerator.js";
import type * as bulkExport from "../bulkExport.js";
import type * as coverLetters from "../coverLetters.js";
import type * as crons from "../crons.js";
import type * as cvHealthMonitor from "../cvHealthMonitor.js";
import type * as devUsers from "../devUsers.js";
import type * as emailPreferences from "../emailPreferences.js";
import type * as feedback from "../feedback.js";
import type * as fluffDetector from "../fluffDetector.js";
import type * as gamification from "../gamification.js";
import type * as http from "../http.js";
import type * as jobTracker from "../jobTracker.js";
import type * as keywordSniper from "../keywordSniper.js";
import type * as linkedinProfile from "../linkedinProfile.js";
import type * as maintenance_cleanup from "../maintenance/cleanup.js";
import type * as marketing from "../marketing.js";
import type * as migrations_syncClerkUsers from "../migrations/syncClerkUsers.js";
import type * as ml_analyzeResumeML from "../ml/analyzeResumeML.js";
import type * as ml_intelligentAnalyzer from "../ml/intelligentAnalyzer.js";
import type * as ml_intelligentKeywordExtractor from "../ml/intelligentKeywordExtractor.js";
import type * as ml_interviewQuestions from "../ml/interviewQuestions.js";
import type * as ml_learningEngine from "../ml/learningEngine.js";
import type * as ml_mlMetrics from "../ml/mlMetrics.js";
import type * as ml_mlMetricsWrapper from "../ml/mlMetricsWrapper.js";
import type * as ml_mlOptimizer from "../ml/mlOptimizer.js";
import type * as ml_optimizedMLEngine from "../ml/optimizedMLEngine.js";
import type * as ml_resumeScoring from "../ml/resumeScoring.js";
import type * as mlLearning from "../mlLearning.js";
import type * as monitoring from "../monitoring.js";
import type * as monitoring_errorTracking from "../monitoring/errorTracking.js";
import type * as newsletter from "../newsletter.js";
import type * as notifications from "../notifications.js";
import type * as productHunt from "../productHunt.js";
import type * as projectTimeline from "../projectTimeline.js";
import type * as projects from "../projects.js";
import type * as receipts from "../receipts.js";
import type * as resumes from "../resumes.js";
import type * as retargetingEmail from "../retargetingEmail.js";
import type * as retargetingHelpers from "../retargetingHelpers.js";
import type * as seedBlog from "../seedBlog.js";
import type * as seo_sitemap from "../seo/sitemap.js";
import type * as smartEmailDispatcher from "../smartEmailDispatcher.js";
import type * as sprintExpiration from "../sprintExpiration.js";
import type * as system_healthCheck from "../system/healthCheck.js";
import type * as testEmail from "../testEmail.js";
import type * as testing from "../testing.js";
import type * as unlockResume from "../unlockResume.js";
import type * as userSettings from "../userSettings.js";
import type * as users from "../users.js";
import type * as utils_queryHelpers from "../utils/queryHelpers.js";
import type * as utils_validation from "../utils/validation.js";
import type * as waitlist from "../waitlist.js";
import type * as webhooks from "../webhooks.js";
import type * as webhooks_testWebhooks from "../webhooks/testWebhooks.js";
import type * as webhooks_webhookSystem from "../webhooks/webhookSystem.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  abTesting: typeof abTesting;
  abandonmentEmails: typeof abandonmentEmails;
  admin: typeof admin;
  "admin/stats": typeof admin_stats;
  adminActions: typeof adminActions;
  ai: typeof ai;
  "ai/abTesting": typeof ai_abTesting;
  "ai/advancedATSActions": typeof ai_advancedATSActions;
  "ai/advancedATSEngine": typeof ai_advancedATSEngine;
  "ai/advancedNLP": typeof ai_advancedNLP;
  "ai/advancedScoringActions": typeof ai_advancedScoringActions;
  "ai/advancedScoringEngine": typeof ai_advancedScoringEngine;
  "ai/apiClient": typeof ai_apiClient;
  "ai/autoFix": typeof ai_autoFix;
  "ai/autoTuneEngine": typeof ai_autoTuneEngine;
  "ai/automation/applicationAutomator": typeof ai_automation_applicationAutomator;
  "ai/automation/applicationAutomatorData": typeof ai_automation_applicationAutomatorData;
  "ai/bulletRewriter": typeof ai_bulletRewriter;
  "ai/careerTrajectory": typeof ai_careerTrajectory;
  "ai/chatbot": typeof ai_chatbot;
  "ai/comprehensiveExtractor": typeof ai_comprehensiveExtractor;
  "ai/config/keywords": typeof ai_config_keywords;
  "ai/config/metricTemplates": typeof ai_config_metricTemplates;
  "ai/contactExtractor": typeof ai_contactExtractor;
  "ai/contentAnalysis": typeof ai_contentAnalysis;
  "ai/deepLearningEngine": typeof ai_deepLearningEngine;
  "ai/eliteMatch": typeof ai_eliteMatch;
  "ai/entityExtraction": typeof ai_entityExtraction;
  "ai/evaluation": typeof ai_evaluation;
  "ai/fallbackAnalysis": typeof ai_fallbackAnalysis;
  "ai/feedbackLoop": typeof ai_feedbackLoop;
  "ai/humanizeErrors": typeof ai_humanizeErrors;
  "ai/humanizedMessages": typeof ai_humanizedMessages;
  "ai/intelligence/marketIntelligence": typeof ai_intelligence_marketIntelligence;
  "ai/intelligence/marketIntelligenceData": typeof ai_intelligence_marketIntelligenceData;
  "ai/intelligentCache": typeof ai_intelligentCache;
  "ai/intelligentFallback": typeof ai_intelligentFallback;
  "ai/interviewPrep": typeof ai_interviewPrep;
  "ai/jobMatcher": typeof ai_jobMatcher;
  "ai/lib/scoringHelpers": typeof ai_lib_scoringHelpers;
  "ai/linkedinOptimizer": typeof ai_linkedinOptimizer;
  "ai/ml/advancedScoring": typeof ai_ml_advancedScoring;
  "ai/ml/deepLearning": typeof ai_ml_deepLearning;
  "ai/ml/localNLP": typeof ai_ml_localNLP;
  "ai/ml/localTranslation": typeof ai_ml_localTranslation;
  "ai/ml/successPredictor": typeof ai_ml_successPredictor;
  "ai/ml/transformerLite": typeof ai_ml_transformerLite;
  "ai/ml/vectorEmbeddings": typeof ai_ml_vectorEmbeddings;
  "ai/mlEngine": typeof ai_mlEngine;
  "ai/mlFeedbackLoop": typeof ai_mlFeedbackLoop;
  "ai/mlLearning": typeof ai_mlLearning;
  "ai/multiLanguage/culturalAdaptation": typeof ai_multiLanguage_culturalAdaptation;
  "ai/multiLanguage/languageIntelligence": typeof ai_multiLanguage_languageIntelligence;
  "ai/performOcr": typeof ai_performOcr;
  "ai/predictiveAnalytics": typeof ai_predictiveAnalytics;
  "ai/prompts": typeof ai_prompts;
  "ai/qualityChecks": typeof ai_qualityChecks;
  "ai/recommendations": typeof ai_recommendations;
  "ai/references/referenceManager": typeof ai_references_referenceManager;
  "ai/references/referenceManagerData": typeof ai_references_referenceManagerData;
  "ai/resumeAnalysis": typeof ai_resumeAnalysis;
  "ai/resumeRewrite": typeof ai_resumeRewrite;
  "ai/scoring/advancedScoring": typeof ai_scoring_advancedScoring;
  "ai/scoring/analysisFormatter": typeof ai_scoring_analysisFormatter;
  "ai/scoring/atsSimulation": typeof ai_scoring_atsSimulation;
  "ai/scoring/bm25Scoring": typeof ai_scoring_bm25Scoring;
  "ai/scoring/competitiveBenchmark": typeof ai_scoring_competitiveBenchmark;
  "ai/scoring/completenessScoring": typeof ai_scoring_completenessScoring;
  "ai/scoring/deepLearning": typeof ai_scoring_deepLearning;
  "ai/scoring/formatScoring": typeof ai_scoring_formatScoring;
  "ai/scoring/industryModels": typeof ai_scoring_industryModels;
  "ai/scoring/interviewPredictor": typeof ai_scoring_interviewPredictor;
  "ai/scoring/keywordExamples": typeof ai_scoring_keywordExamples;
  "ai/scoring/keywordScoring": typeof ai_scoring_keywordScoring;
  "ai/scoring/semanticSimilarity": typeof ai_scoring_semanticSimilarity;
  "ai/serverOcr": typeof ai_serverOcr;
  "ai/skillsGapAnalyzer": typeof ai_skillsGapAnalyzer;
  "ai/smartNotifications": typeof ai_smartNotifications;
  "ai/socialIntegration/brandAnalyzer": typeof ai_socialIntegration_brandAnalyzer;
  "ai/socialIntegration/brandAnalyzerData": typeof ai_socialIntegration_brandAnalyzerData;
  "ai/specificRewriter": typeof ai_specificRewriter;
  "ai/video/videoResumeAnalyzer": typeof ai_video_videoResumeAnalyzer;
  "ai/video/videoResumeAnalyzerData": typeof ai_video_videoResumeAnalyzerData;
  aiMonitoring: typeof aiMonitoring;
  "api/resumeScoringAPI": typeof api_resumeScoringAPI;
  applications: typeof applications;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  autoTune: typeof autoTune;
  billing: typeof billing;
  billingActions: typeof billingActions;
  blog: typeof blog;
  blogGenerator: typeof blogGenerator;
  bulkExport: typeof bulkExport;
  coverLetters: typeof coverLetters;
  crons: typeof crons;
  cvHealthMonitor: typeof cvHealthMonitor;
  devUsers: typeof devUsers;
  emailPreferences: typeof emailPreferences;
  feedback: typeof feedback;
  fluffDetector: typeof fluffDetector;
  gamification: typeof gamification;
  http: typeof http;
  jobTracker: typeof jobTracker;
  keywordSniper: typeof keywordSniper;
  linkedinProfile: typeof linkedinProfile;
  "maintenance/cleanup": typeof maintenance_cleanup;
  marketing: typeof marketing;
  "migrations/syncClerkUsers": typeof migrations_syncClerkUsers;
  "ml/analyzeResumeML": typeof ml_analyzeResumeML;
  "ml/intelligentAnalyzer": typeof ml_intelligentAnalyzer;
  "ml/intelligentKeywordExtractor": typeof ml_intelligentKeywordExtractor;
  "ml/interviewQuestions": typeof ml_interviewQuestions;
  "ml/learningEngine": typeof ml_learningEngine;
  "ml/mlMetrics": typeof ml_mlMetrics;
  "ml/mlMetricsWrapper": typeof ml_mlMetricsWrapper;
  "ml/mlOptimizer": typeof ml_mlOptimizer;
  "ml/optimizedMLEngine": typeof ml_optimizedMLEngine;
  "ml/resumeScoring": typeof ml_resumeScoring;
  mlLearning: typeof mlLearning;
  monitoring: typeof monitoring;
  "monitoring/errorTracking": typeof monitoring_errorTracking;
  newsletter: typeof newsletter;
  notifications: typeof notifications;
  productHunt: typeof productHunt;
  projectTimeline: typeof projectTimeline;
  projects: typeof projects;
  receipts: typeof receipts;
  resumes: typeof resumes;
  retargetingEmail: typeof retargetingEmail;
  retargetingHelpers: typeof retargetingHelpers;
  seedBlog: typeof seedBlog;
  "seo/sitemap": typeof seo_sitemap;
  smartEmailDispatcher: typeof smartEmailDispatcher;
  sprintExpiration: typeof sprintExpiration;
  "system/healthCheck": typeof system_healthCheck;
  testEmail: typeof testEmail;
  testing: typeof testing;
  unlockResume: typeof unlockResume;
  userSettings: typeof userSettings;
  users: typeof users;
  "utils/queryHelpers": typeof utils_queryHelpers;
  "utils/validation": typeof utils_validation;
  waitlist: typeof waitlist;
  webhooks: typeof webhooks;
  "webhooks/testWebhooks": typeof webhooks_testWebhooks;
  "webhooks/webhookSystem": typeof webhooks_webhookSystem;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
