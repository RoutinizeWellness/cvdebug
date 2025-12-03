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
    screenshots: defineTable({
      userId: v.string(), // Clerk User ID
      storageId: v.id("_storage"),
      url: v.string(),
      title: v.string(),
      category: v.optional(v.string()),
      ocrText: v.optional(v.string()),
      status: v.union(v.literal("processing"), v.literal("completed"), v.literal("error")),
      width: v.number(),
      height: v.number(),
      size: v.number(),
      mimeType: v.string(),
    })
    .index("by_user", ["userId"])
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