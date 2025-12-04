import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    users: defineTable({
      tokenIdentifier: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      subscriptionTier: v.union(v.literal("free"), v.literal("pro"), v.literal("team")),
      endsOn: v.optional(v.number()),
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
      score: v.optional(v.number()), // ATS Score 0-100
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