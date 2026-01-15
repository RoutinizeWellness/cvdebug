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
import type * as adminActions from "../adminActions.js";
import type * as ai from "../ai.js";
import type * as ai_apiClient from "../ai/apiClient.js";
import type * as ai_bulletRewriter from "../ai/bulletRewriter.js";
import type * as ai_chatbot from "../ai/chatbot.js";
import type * as ai_config_keywords from "../ai/config/keywords.js";
import type * as ai_config_metricTemplates from "../ai/config/metricTemplates.js";
import type * as ai_contentAnalysis from "../ai/contentAnalysis.js";
import type * as ai_evaluation from "../ai/evaluation.js";
import type * as ai_fallbackAnalysis from "../ai/fallbackAnalysis.js";
import type * as ai_intelligentCache from "../ai/intelligentCache.js";
import type * as ai_intelligentFallback from "../ai/intelligentFallback.js";
import type * as ai_interviewPrep from "../ai/interviewPrep.js";
import type * as ai_linkedinOptimizer from "../ai/linkedinOptimizer.js";
import type * as ai_mlEngine from "../ai/mlEngine.js";
import type * as ai_mlLearning from "../ai/mlLearning.js";
import type * as ai_performOcr from "../ai/performOcr.js";
import type * as ai_prompts from "../ai/prompts.js";
import type * as ai_qualityChecks from "../ai/qualityChecks.js";
import type * as ai_resumeAnalysis from "../ai/resumeAnalysis.js";
import type * as ai_resumeRewrite from "../ai/resumeRewrite.js";
import type * as ai_scoring_analysisFormatter from "../ai/scoring/analysisFormatter.js";
import type * as ai_scoring_completenessScoring from "../ai/scoring/completenessScoring.js";
import type * as ai_scoring_formatScoring from "../ai/scoring/formatScoring.js";
import type * as ai_scoring_keywordScoring from "../ai/scoring/keywordScoring.js";
import type * as ai_serverOcr from "../ai/serverOcr.js";
import type * as aiMonitoring from "../aiMonitoring.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as billing from "../billing.js";
import type * as billingActions from "../billingActions.js";
import type * as blog from "../blog.js";
import type * as blogGenerator from "../blogGenerator.js";
import type * as bulkExport from "../bulkExport.js";
import type * as coverLetters from "../coverLetters.js";
import type * as crons from "../crons.js";
import type * as cvHealthMonitor from "../cvHealthMonitor.js";
import type * as devUsers from "../devUsers.js";
import type * as fluffDetector from "../fluffDetector.js";
import type * as gamification from "../gamification.js";
import type * as http from "../http.js";
import type * as jobTracker from "../jobTracker.js";
import type * as keywordSniper from "../keywordSniper.js";
import type * as linkedinProfile from "../linkedinProfile.js";
import type * as marketing from "../marketing.js";
import type * as migrations_syncClerkUsers from "../migrations/syncClerkUsers.js";
import type * as ml_analyzeResumeML from "../ml/analyzeResumeML.js";
import type * as ml_interviewQuestions from "../ml/interviewQuestions.js";
import type * as ml_resumeScoring from "../ml/resumeScoring.js";
import type * as mlLearning from "../mlLearning.js";
import type * as productHunt from "../productHunt.js";
import type * as projectTimeline from "../projectTimeline.js";
import type * as projects from "../projects.js";
import type * as receipts from "../receipts.js";
import type * as resumes from "../resumes.js";
import type * as retargetingEmail from "../retargetingEmail.js";
import type * as retargetingHelpers from "../retargetingHelpers.js";
import type * as seedBlog from "../seedBlog.js";
import type * as seo_sitemap from "../seo/sitemap.js";
import type * as sprintExpiration from "../sprintExpiration.js";
import type * as testEmail from "../testEmail.js";
import type * as testing from "../testing.js";
import type * as unlockResume from "../unlockResume.js";
import type * as userSettings from "../userSettings.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  abTesting: typeof abTesting;
  abandonmentEmails: typeof abandonmentEmails;
  admin: typeof admin;
  adminActions: typeof adminActions;
  ai: typeof ai;
  "ai/apiClient": typeof ai_apiClient;
  "ai/bulletRewriter": typeof ai_bulletRewriter;
  "ai/chatbot": typeof ai_chatbot;
  "ai/config/keywords": typeof ai_config_keywords;
  "ai/config/metricTemplates": typeof ai_config_metricTemplates;
  "ai/contentAnalysis": typeof ai_contentAnalysis;
  "ai/evaluation": typeof ai_evaluation;
  "ai/fallbackAnalysis": typeof ai_fallbackAnalysis;
  "ai/intelligentCache": typeof ai_intelligentCache;
  "ai/intelligentFallback": typeof ai_intelligentFallback;
  "ai/interviewPrep": typeof ai_interviewPrep;
  "ai/linkedinOptimizer": typeof ai_linkedinOptimizer;
  "ai/mlEngine": typeof ai_mlEngine;
  "ai/mlLearning": typeof ai_mlLearning;
  "ai/performOcr": typeof ai_performOcr;
  "ai/prompts": typeof ai_prompts;
  "ai/qualityChecks": typeof ai_qualityChecks;
  "ai/resumeAnalysis": typeof ai_resumeAnalysis;
  "ai/resumeRewrite": typeof ai_resumeRewrite;
  "ai/scoring/analysisFormatter": typeof ai_scoring_analysisFormatter;
  "ai/scoring/completenessScoring": typeof ai_scoring_completenessScoring;
  "ai/scoring/formatScoring": typeof ai_scoring_formatScoring;
  "ai/scoring/keywordScoring": typeof ai_scoring_keywordScoring;
  "ai/serverOcr": typeof ai_serverOcr;
  aiMonitoring: typeof aiMonitoring;
  applications: typeof applications;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  billing: typeof billing;
  billingActions: typeof billingActions;
  blog: typeof blog;
  blogGenerator: typeof blogGenerator;
  bulkExport: typeof bulkExport;
  coverLetters: typeof coverLetters;
  crons: typeof crons;
  cvHealthMonitor: typeof cvHealthMonitor;
  devUsers: typeof devUsers;
  fluffDetector: typeof fluffDetector;
  gamification: typeof gamification;
  http: typeof http;
  jobTracker: typeof jobTracker;
  keywordSniper: typeof keywordSniper;
  linkedinProfile: typeof linkedinProfile;
  marketing: typeof marketing;
  "migrations/syncClerkUsers": typeof migrations_syncClerkUsers;
  "ml/analyzeResumeML": typeof ml_analyzeResumeML;
  "ml/interviewQuestions": typeof ml_interviewQuestions;
  "ml/resumeScoring": typeof ml_resumeScoring;
  mlLearning: typeof mlLearning;
  productHunt: typeof productHunt;
  projectTimeline: typeof projectTimeline;
  projects: typeof projects;
  receipts: typeof receipts;
  resumes: typeof resumes;
  retargetingEmail: typeof retargetingEmail;
  retargetingHelpers: typeof retargetingHelpers;
  seedBlog: typeof seedBlog;
  "seo/sitemap": typeof seo_sitemap;
  sprintExpiration: typeof sprintExpiration;
  testEmail: typeof testEmail;
  testing: typeof testing;
  unlockResume: typeof unlockResume;
  userSettings: typeof userSettings;
  users: typeof users;
  waitlist: typeof waitlist;
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
