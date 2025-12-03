import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
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