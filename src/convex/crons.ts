import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// 1. Activation Flow (No-Show Users)
// Check every hour for users who signed up 24h or 72h ago
crons.interval("activation_flow", { hours: 1 }, internal.crons.runActivationFlow, {});

// 2. Conversion Flow (Free Users)
// Check every hour for resumes scanned 1h, 48h, or 7d ago
crons.interval("conversion_flow", { hours: 1 }, internal.crons.runConversionFlow, {});

// 3. Re-Engagement Flow (Abandoned Users)
// Check daily for users inactive for 30 days
crons.interval("reengagement_flow", { hours: 24 }, internal.crons.runReengagementFlow, {});

// --- Activation Flow Logic ---
export const runActivationFlow = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    // Email #2: 24h Reminder
    // Look for users created between 24h and 25h ago
    const users24h = await ctx.db
      .query("users")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (25 * hour)),
          q.lt(q.field("_creationTime"), now - (24 * hour)),
          q.eq(q.field("activationEmail24hSent"), undefined)
        )
      )
      .take(50);

    for (const user of users24h) {
      // Check if they have used the product (created a resume)
      const resume = await ctx.db
        .query("resumes")
        .withIndex("by_user", q => q.eq("userId", user.tokenIdentifier))
        .first();

      if (!resume && user.email) {
        await ctx.db.patch(user._id, { activationEmail24hSent: true });
        await ctx.scheduler.runAfter(0, internal.marketing.sendActivationReminderEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }

    // Email #3: 72h Last Chance
    // Look for users created between 72h and 73h ago
    const users72h = await ctx.db
      .query("users")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (73 * hour)),
          q.lt(q.field("_creationTime"), now - (72 * hour)),
          q.eq(q.field("activationEmail72hSent"), undefined)
        )
      )
      .take(50);

    for (const user of users72h) {
      const resume = await ctx.db
        .query("resumes")
        .withIndex("by_user", q => q.eq("userId", user.tokenIdentifier))
        .first();

      if (!resume && user.email) {
        await ctx.db.patch(user._id, { activationEmail72hSent: true });
        await ctx.scheduler.runAfter(0, internal.marketing.sendActivationLastChanceEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }
  },
});

// --- Conversion Flow Logic ---
export const runConversionFlow = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;

    // Email #4: Recovery Email (1h after scan, details not unlocked)
    const resumes1h = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (2 * hour)),
          q.lt(q.field("_creationTime"), now - (1 * hour)),
          q.eq(q.field("conversionEmail1hSent"), undefined)
        )
      )
      .take(50);

    for (const resume of resumes1h) {
      // Only send if score exists and details are NOT unlocked
      if (resume.score !== undefined && !resume.detailsUnlocked && resume.userId) {
        const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId)).unique();
        if (user && user.email) {
          await ctx.db.patch(resume._id, { conversionEmail1hSent: true });
          
          // Get first critical error for preview
          const firstError = resume.missingKeywords?.[0];
          const firstErrorText = firstError 
            ? (typeof firstError === 'string' ? firstError : firstError.keyword)
            : undefined;

          await ctx.scheduler.runAfter(0, internal.marketing.sendRecoveryEmail, {
            email: user.email,
            name: user.name,
            score: resume.score,
            totalErrors: (resume.missingKeywords?.length || 0) + (resume.formatIssues?.length || 0),
            firstError: firstErrorText,
          });
        }
      }
    }

    // Email #5: Value Reminder (48h after scan, no upgrade)
    const resumes48h = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (49 * hour)),
          q.lt(q.field("_creationTime"), now - (48 * hour)),
          q.eq(q.field("conversionEmail48hSent"), undefined)
        )
      )
      .take(50);

    for (const resume of resumes48h) {
      if (resume.score !== undefined && resume.userId) {
        const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId)).unique();
        // Only send if user is still on free tier
        if (user && user.email && user.subscriptionTier === "free") {
          await ctx.db.patch(resume._id, { conversionEmail48hSent: true });
          await ctx.scheduler.runAfter(0, internal.marketing.sendValueReminderEmail, {
            email: user.email,
            name: user.name,
            score: resume.score,
          });
        }
      }
    }

    // Email #6: Discount (7 days after scan, no upgrade)
    const day = 24 * hour;
    const resumes7d = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (7 * day + hour)),
          q.lt(q.field("_creationTime"), now - (7 * day)),
          q.eq(q.field("conversionEmail7dSent"), undefined)
        )
      )
      .take(50);

    for (const resume of resumes7d) {
      if (resume.score !== undefined && resume.userId) {
        const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId)).unique();
        if (user && user.email && user.subscriptionTier === "free") {
          await ctx.db.patch(resume._id, { conversionEmail7dSent: true });
          await ctx.scheduler.runAfter(0, internal.marketing.sendDiscountEmail, {
            email: user.email,
            name: user.name,
          });
        }
      }
    }
  },
});

// --- Re-Engagement Flow Logic ---
export const runReengagementFlow = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - (30 * day);
    const thirtyOneDaysAgo = now - (31 * day);

    // Email #7: Win-Back (30 days inactive)
    // We check users whose lastSeen is between 30 and 31 days ago
    // If lastSeen is undefined, we fall back to _creationTime
    
    // Note: We can't easily query by lastSeen range if it's not indexed and optional.
    // But we can query by creation time for older users and then filter by lastSeen.
    // However, for efficiency in this demo, we'll iterate recent users or just rely on creation time for now if lastSeen is missing.
    // Better approach: We'll just scan users created > 30 days ago who haven't been sent this email.
    // To avoid scanning the whole table, we limit to a window of creation time OR we need an index on lastSeen.
    // Since we just added lastSeen, most users won't have it.
    // Let's use creation time as a proxy for the "cohort" we are checking, then check lastSeen.
    
    const users = await ctx.db
      .query("users")
      .filter(q => 
        q.and(
          q.lt(q.field("_creationTime"), thirtyDaysAgo),
          q.eq(q.field("winBackEmail30dSent"), undefined)
        )
      )
      .take(50);

    for (const user of users) {
      const lastActivity = user.lastSeen || user._creationTime;
      
      // If they have been active recently (after 30 days ago), skip
      if (lastActivity > thirtyDaysAgo) continue;

      // If they have been inactive for > 30 days, send email
      if (user.email) {
        await ctx.db.patch(user._id, { winBackEmail30dSent: true });
        await ctx.scheduler.runAfter(0, internal.marketing.sendWinBackEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }
  },
});

export default crons;