import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all published blog posts (for listing page)
export const getAllPosts = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let postsQuery = ctx.db
      .query("blogPosts")
      .withIndex("by_published_and_date", (q) =>
        q.eq("published", true)
      )
      .order("desc");

    if (args.category) {
      postsQuery = postsQuery.filter((q) =>
        q.eq(q.field("category"), args.category)
      );
    }

    if (args.limit) {
      return await postsQuery.take(args.limit);
    }

    return await postsQuery.collect();
  },
});

// Get a single post by slug
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return post;
  },
});

// Get recent posts (for sidebar)
export const getRecentPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;

    return await ctx.db
      .query("blogPosts")
      .withIndex("by_published_and_date", (q) =>
        q.eq("published", true)
      )
      .order("desc")
      .take(limit);
  },
});

// Get posts by category
export const getPostsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("blogPosts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

// Increment view count
export const incrementViews = mutation({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return;

    await ctx.db.patch(args.postId, {
      views: (post.views || 0) + 1,
    });
  },
});

// Get all categories with post counts
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    const categoryCounts: Record<string, number> = {};

    for (const post of posts) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    }

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));
  },
});

// Create a new blog post (admin function)
export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    author: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    featuredImage: v.optional(v.string()),
    published: v.boolean(),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.array(v.string()),
    readingTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("blogPosts", {
      ...args,
      publishedAt: args.published ? Date.now() : undefined,
      views: 0,
    });

    return postId;
  },
});
