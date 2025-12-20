import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// Run ML learning update every 24 hours to refine weights and discover synonyms
// @ts-ignore
crons.interval("ml learning update", { hours: 24 }, (internal as any).mlLearning.processLearningData, {});

// Run Role Classification Evaluation weekly (168 hours) to monitor accuracy
// @ts-ignore
crons.interval("role classification eval", { hours: 168 }, (internal as any).ai.evaluation.evaluateRoleClassification, {});

// 1. Activation Flow (Email #2: 24h reminder if no scans)
crons.interval("activation_flow", { hours: 1 }, internal.crons.runActivationFlow, {});

// 2. Conversion Flow (Email #4 & #5: Post-scan conversion)
crons.interval("conversion_flow", { hours: 1 }, internal.crons.runConversionFlow, {});

// 3. Re-Engagement Flow (Email #7: 30-day check-in)
crons.interval("reengagement_flow", { hours: 24 }, internal.crons.runReengagementFlow, {});

// 4. Conversion Follow-up (Email: 5 days after scan if still free)
crons.interval("conversion_followup", { hours: 1 }, internal.crons.runConversionFollowUp, {});

// NEW: Abandoner Flow (Email: 1h after signup, no scans)
crons.interval("abandoner_flow", { hours: 1 }, internal.crons.runAbandonerFlow, {});

// NEW: Power User FOMO (Email: 24h after scan, no purchase)
crons.interval("power_user_fomo", { hours: 1 }, internal.crons.runPowerUserFomo, {});

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
        await ctx.scheduler.runAfter(0, internal.marketing.sendActivationReminderEmail, {
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

          await ctx.scheduler.runAfter(0, internal.marketing.sendRecoveryEmail, {
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

          await ctx.scheduler.runAfter(0, internal.marketing.sendValueReminderEmail, {
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
        await ctx.scheduler.runAfter(0, internal.marketing.sendWinBackEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }
  },
});

// --- Conversion Follow-up Logic ---
export const runConversionFollowUp = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    // Look for resumes created between 5 days and 5 days + 1 hour ago
    const fiveDaysAgoStart = now - (5 * day) - (60 * 60 * 1000);
    const fiveDaysAgoEnd = now - (5 * day);

    const resumes = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), fiveDaysAgoStart),
          q.lt(q.field("_creationTime"), fiveDaysAgoEnd)
        )
      )
      .take(50);

    for (const resume of resumes) {
      if (!resume.userId) continue;

      const user = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId))
        .unique();

      // Send if user exists, is free, hasn't received this email, and resume is completed
      if (user && user.email && user.subscriptionTier === "free" && !user.conversionFollowUpSent && resume.status === "completed") {
        
        await ctx.db.patch(user._id, { conversionFollowUpSent: true });
        
        const errorCount = (resume.missingKeywords?.length || 0) + (resume.formatIssues?.length || 0);
        
        await ctx.scheduler.runAfter(0, internal.marketing.sendConversionFollowUpEmail, {
          email: user.email,
          name: user.name,
          score: resume.score || 0,
          errorCount,
        });
      }
    }
  },
});

// --- Abandoner Flow Logic ---
export const runAbandonerFlow = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    // Find users who signed up 1-2 hours ago with 0 scans
    const users = await ctx.db
      .query("users")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (2 * hour)),
          q.lt(q.field("_creationTime"), now - (1 * hour)),
          q.eq(q.field("invisibilityAlertSent"), undefined)
        )
      )
      .take(50);

    for (const user of users) {
      // Check if they have any scans
      const resume = await ctx.db
        .query("resumes")
        .withIndex("by_user", q => q.eq("userId", user.tokenIdentifier))
        .first();

      // If no scans and still have credits, send abandoner email
      if (!resume && user.email && (user.credits ?? 0) > 0) {
        await ctx.db.patch(user._id, { invisibilityAlertSent: true });
        await ctx.scheduler.runAfter(0, internal.marketing.sendInvisibilityAlertEmail, {
          email: user.email,
          name: user.name,
        });
      }
    }
  },
});

// --- Power User FOMO Flow Logic ---
export const runPowerUserFomo = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    // Find resumes scanned 24-25 hours ago
    const resumes = await ctx.db
      .query("resumes")
      .filter(q => 
        q.and(
          q.gt(q.field("_creationTime"), now - (25 * hour)),
          q.lt(q.field("_creationTime"), now - (24 * hour))
        )
      )
      .take(50);

    for (const resume of resumes) {
      if (!resume.userId || resume.score === undefined) continue;

      const user = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", resume.userId))
        .unique();

      // Send if: user is free tier, has 0 credits, hasn't received email, resume completed
      if (user && user.email && user.subscriptionTier === "free" && 
          (user.credits ?? 0) === 0 && !user.fomoGapEmailSent && 
          resume.status === "completed") {
        
        await ctx.db.patch(user._id, { fomoGapEmailSent: true });
        
        const missingKeywords = resume.missingKeywords?.length || 0;
        
        await ctx.scheduler.runAfter(0, internal.marketing.sendFomoGapEmail, {
          email: user.email,
          name: user.name,
          score: resume.score,
          missingKeywords,
        });
      }
    }
  },
});

export default crons;