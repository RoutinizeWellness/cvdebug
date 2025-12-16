/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as ai from "../ai.js";
import type * as ai_apiClient from "../ai/apiClient.js";
import type * as ai_chatbot from "../ai/chatbot.js";
import type * as ai_linkedinOptimizer from "../ai/linkedinOptimizer.js";
import type * as ai_prompts from "../ai/prompts.js";
import type * as ai_resumeAnalysis from "../ai/resumeAnalysis.js";
import type * as ai_resumeRewrite from "../ai/resumeRewrite.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as billing from "../billing.js";
import type * as billingActions from "../billingActions.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as marketing from "../marketing.js";
import type * as resumes from "../resumes.js";
import type * as testing from "../testing.js";
import type * as unlockResume from "../unlockResume.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  ai: typeof ai;
  "ai/apiClient": typeof ai_apiClient;
  "ai/chatbot": typeof ai_chatbot;
  "ai/linkedinOptimizer": typeof ai_linkedinOptimizer;
  "ai/prompts": typeof ai_prompts;
  "ai/resumeAnalysis": typeof ai_resumeAnalysis;
  "ai/resumeRewrite": typeof ai_resumeRewrite;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  billing: typeof billing;
  billingActions: typeof billingActions;
  crons: typeof crons;
  http: typeof http;
  marketing: typeof marketing;
  resumes: typeof resumes;
  testing: typeof testing;
  unlockResume: typeof unlockResume;
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
