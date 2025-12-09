import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    users: defineTable({
      tokenIdentifier: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      subscriptionTier: v.union(v.literal("free"), v.literal("single_scan"), v.literal("bulk_pack")),
      credits: v.optional(v.number()), // Added for Pay Per Use credits
      endsOn: v.optional(v.number()),
      trialEndsOn: v.optional(v.number()), // Added for 15-day free trial
      emailVariant: v.optional(v.string()), // Added for A/B testing onboarding emails
    }).index("by_token", ["tokenIdentifier"]),
    resumes: defineTable({
      userId: v.string(), // Clerk User ID
      storageId: v.id("_storage"),
      url: v.string(),
      title: v.string(),
      jobDescription: v.optional(v.string()), // Added for ATS comparison
      category: v.optional(v.string()), // Engineering, Marketing, etc.
      ocrText: v.optional(v.string()),
      analysis: v.optional(v.string()), // AI Feedback/Summary
      rewrittenText: v.optional(v.string()), // Added for AI Rewrite
      score: v.optional(v.number()), // ATS Score 0-100
      scoreBreakdown: v.optional(v.object({
        keywords: v.number(),
        format: v.number(),
        completeness: v.number(),
      })),
      missingKeywords: v.optional(v.array(v.object({
        keyword: v.string(),
        priority: v.string(), // critical, important, nice-to-have
        frequency: v.optional(v.number()), // Added for Jobscan UI
        impact: v.optional(v.number()), // Added for Jobscan UI
      }))), 
      formatIssues: v.optional(v.array(v.string())), // Added for Free Tier Preview
      marketingEmailSent: v.optional(v.boolean()), // Added for 24h follow-up email
      status: v.union(v.literal("processing"), v.literal("completed"), v.literal("error")),
      width: v.number(),
      height: v.number(),
      size: v.number(),
      mimeType: v.string(),
    })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .searchIndex("search_ocr", {
      searchField: "ocrText",
      filterFields: ["userId"],
    }),
    waitlist: defineTable({
      email: v.string(),
    }).index("by_email", ["email"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;