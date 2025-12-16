import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

const crons = cronJobs();

// 1. Activation Flow (Email #2: 24h reminder if no scans)
crons.interval("activation_flow", { hours: 1 }, internalAny.crons.runActivationFlow, {});

// 2. Conversion Flow (Email #4 & #5: Post-scan conversion)
crons.interval("conversion_flow", { hours: 1 }, internalAny.crons.runConversionFlow, {});

// 3. Re-Engagement Flow (Email #7: 30-day check-in)
crons.interval("reengagement_flow", { hours: 24 }, internalAny.crons.runReengagementFlow, {});

// --- Activation Flow Logic ---
// Email #2: 24h reminder if no scans
export const runActivationFlow = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    // Email #2: 24h Reminder (if no scans)
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
      // Check if they have scanned (created a resume)
      const resume = await ctx.db
        .query("resumes")
        .withIndex("by_user", q => q.eq("userId", user.tokenIdentifier))
        .first();

      if (!resume && user.email) {
        await ctx.db.patch(user._id, { activationEmail24hSent: true });
        await ctx.scheduler.runAfter(0, internalAny.marketing.sendActivationReminderEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }
  },
});

// --- Conversion Flow Logic ---
// Email #4: 1h after successful scan (if free user)
// Email #5: 48h reminder (if still free)
export const runConversionFlow = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;

    // Email #4: Post-Scan Email (1h after successful scan, free user)
    const resumes1h = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (2 * hour)),
          q.lt(q.field("_creationTime"), now - (1 * hour)),
          q.eq(q.field("postScanEmailSent"), undefined)
        )
      )
      .take(50);

    for (const resume of resumes1h) {
      // Only send if score exists, status is completed, and user is free
      if (resume.score !== undefined && resume.status === "completed" && resume.userId) {
        const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId)).unique();
        if (user && user.email && user.subscriptionTier === "free") {
          await ctx.db.patch(resume._id, { postScanEmailSent: true });
          
          const totalErrors = (resume.missingKeywords?.length || 0) + (resume.formatIssues?.length || 0);
          
          // Extract first error safely handling both string and object types
          const firstKeyword = resume.missingKeywords?.[0];
          const firstFormat = resume.formatIssues?.[0];
          const firstError = (typeof firstKeyword === 'string' ? firstKeyword : firstKeyword?.keyword) 
            || (typeof firstFormat === 'string' ? firstFormat : firstFormat?.issue);

          await ctx.scheduler.runAfter(0, internalAny.marketing.sendRecoveryEmail, {
            email: user.email,
            name: user.name,
            score: resume.score,
            totalErrors,
            firstError,
          });
        }
      }
    }

    // Email #5: Conversion Reminder (48h after scan, still free)
    const resumes48h = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (49 * hour)),
          q.lt(q.field("_creationTime"), now - (48 * hour)),
          q.eq(q.field("conversionReminderEmailSent"), undefined)
        )
      )
      .take(50);

    for (const resume of resumes48h) {
      if (resume.score !== undefined && resume.status === "completed" && resume.userId) {
        const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId)).unique();
        // Only send if user is still on free tier
        if (user && user.email && user.subscriptionTier === "free") {
          await ctx.db.patch(resume._id, { conversionReminderEmailSent: true });
          
          const totalErrors = (resume.missingKeywords?.length || 0) + (resume.formatIssues?.length || 0);

          await ctx.scheduler.runAfter(0, internalAny.marketing.sendValueReminderEmail, {
            email: user.email,
            name: user.name,
            score: resume.score,
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
        await ctx.scheduler.runAfter(0, internalAny.marketing.sendWinBackEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }
  },
});

export default crons;