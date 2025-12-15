import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    users: defineTable({
      tokenIdentifier: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      subscriptionTier: v.union(v.literal("free"), v.literal("single_scan"), v.literal("bulk_pack")),
      credits: v.optional(v.number()),
      endsOn: v.optional(v.number()),
      trialEndsOn: v.optional(v.number()),
      emailVariant: v.optional(v.string()),
      lastSeen: v.optional(v.number()), // Added for Re-Engagement flow
      // Email tracking flags
      activationEmail24hSent: v.optional(v.boolean()),
      activationEmail72hSent: v.optional(v.boolean()),
      winBackEmail30dSent: v.optional(v.boolean()),
    })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_subscription_tier", ["subscriptionTier"]),
  resumes: defineTable({
    userId: v.string(),
    title: v.string(),
    url: v.string(),
    storageId: v.id("_storage"),
    mimeType: v.string(),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("failed"))),
    score: v.optional(v.number()),
    analysis: v.optional(v.string()),
    missingKeywords: v.optional(v.array(v.union(
      v.string(),
      v.object({
        keyword: v.string(),
        priority: v.string(),
        section: v.optional(v.string()),
        context: v.optional(v.string()),
        frequency: v.optional(v.number()),
        impact: v.optional(v.number()),
      })
    ))),
    formatIssues: v.optional(v.array(v.union(
      v.string(),
      v.object({
        issue: v.string(),
        severity: v.optional(v.string()),
        fix: v.optional(v.string()),
        location: v.optional(v.string()),
      })
    ))),
    scoreBreakdown: v.optional(v.object({
      keywords: v.optional(v.number()),
      format: v.optional(v.number()),
      completeness: v.optional(v.number()),
    })),
    ocrText: v.optional(v.string()),
    rewrittenText: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    detailsUnlocked: v.optional(v.boolean()),
    conversionEmail1hSent: v.optional(v.boolean()),
    conversionEmail48hSent: v.optional(v.boolean()),
    conversionEmail7dSent: v.optional(v.boolean()),
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