import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

export const generateUploadUrl = mutation(async (ctx) => {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});

export const createScreenshot = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    width: v.number(),
    height: v.number(),
    size: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    const screenshotId = await ctx.db.insert("screenshots", {
      userId: user._id, // This is now the Clerk ID (string)
      storageId: args.storageId,
      url,
      title: args.title,
      status: "processing",
      width: args.width,
      height: args.height,
      size: args.size,
      mimeType: args.mimeType,
    });

    return screenshotId;
  },
});

export const updateScreenshotOcr = mutation({
  args: {
    id: v.id("screenshots"),
    ocrText: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const screenshot = await ctx.db.get(args.id);
    if (!screenshot || screenshot.userId !== user._id) {
      throw new Error("Screenshot not found or unauthorized");
    }

    await ctx.db.patch(args.id, {
      ocrText: args.ocrText,
    });

    await ctx.scheduler.runAfter(0, internal.ai.analyzeScreenshot, {
      id: args.id,
      ocrText: args.ocrText,
    });
  },
});

export const updateScreenshotMetadata = internalMutation({
  args: {
    id: v.id("screenshots"),
    title: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      category: args.category,
      status: "completed",
    });
  },
});

export const getScreenshots = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    let q = ctx.db
      .query("screenshots")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (args.search) {
       return await ctx.db
        .query("screenshots")
        .withSearchIndex("search_ocr", (q) => 
          q.search("ocrText", args.search!).eq("userId", user._id)
        )
        .take(20);
    }

    return await q.order("desc").take(50);
  },
});

export const deleteScreenshot = mutation({
  args: { id: v.id("screenshots") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const screenshot = await ctx.db.get(args.id);
    if (!screenshot || screenshot.userId !== user._id) {
      throw new Error("Screenshot not found or unauthorized");
    }

    await ctx.storage.delete(screenshot.storageId);
    await ctx.db.delete(args.id);
  },
});