import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const sendTestEmail = mutation({
  args: {
    email: v.string(),
    type: v.string(), // "welcome", "reminder_24h", "last_chance_72h", "post_scan", "value_reminder", "discount", "win_back", "all"
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    const name = user?.name || "Test User";
    const email = args.email;
    const type = args.type.trim();

    const validTypes = ["welcome", "reminder_24h", "last_chance_72h", "post_scan", "value_reminder", "discount", "win_back"];

    if (type === "all") {
      for (const t of validTypes) {
        await scheduleEmail(ctx, t, email, name);
      }
      return `Scheduled all ${validTypes.length} emails for ${email}`;
    }

    if (!validTypes.includes(type)) {
      throw new Error(`Invalid email type: "${type}". Valid types are: ${validTypes.join(", ")}, or "all"`);
    }

    await scheduleEmail(ctx, type, email, name);
    return `Scheduled ${type} email for ${email}`;
  },
});

async function scheduleEmail(ctx: any, type: string, email: string, name: string) {
  console.log(`Scheduling ${type} email for ${email}`);
  switch (type) {
    case "welcome":
      await ctx.scheduler.runAfter(0, internal.marketing.sendOnboardingEmail, { email, name, variant: "A" });
      break;
    case "reminder_24h":
      await ctx.scheduler.runAfter(0, internal.marketing.sendActivationReminderEmail, { email, name });
      break;
    case "last_chance_72h":
      await ctx.scheduler.runAfter(0, internal.marketing.sendActivationLastChanceEmail, { email, name });
      break;
    case "post_scan":
      await ctx.scheduler.runAfter(0, internal.marketing.sendPostScanEmail, { email, name, score: 65 });
      break;
    case "value_reminder":
      await ctx.scheduler.runAfter(0, internal.marketing.sendValueReminderEmail, { email, name, score: 65 });
      break;
    case "discount":
      await ctx.scheduler.runAfter(0, internal.marketing.sendDiscountEmail, { email, name });
      break;
    case "win_back":
      await ctx.scheduler.runAfter(0, internal.marketing.sendWinBackEmail, { email, name });
      break;
  }
}

export const resetUserFlags = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) return "User not found";

    await ctx.db.patch(user._id, {
      activationEmail24hSent: undefined,
      activationEmail72hSent: undefined,
      winBackEmail30dSent: undefined,
    });

    return "Reset user email flags";
  },
});

export const simulatePurchase = mutation({
  args: { 
    email: v.string(), 
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")) 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) return "User not found";

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;
    const currentCredits = user.credits ?? 0;

    await ctx.db.patch(user._id, {
      credits: currentCredits + creditsToAdd,
      subscriptionTier: args.plan,
    });

    return `Updated ${user.email}: Plan=${args.plan}, Credits=${currentCredits} -> ${currentCredits + creditsToAdd}`;
  },
});