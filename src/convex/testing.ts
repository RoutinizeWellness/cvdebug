import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const sendTestEmail = mutation({
  args: {
    email: v.string(),
    type: v.string(), // "welcome", "reminder_24h", "last_chance_72h", "post_scan", "value_reminder", "discount", "win_back"
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    const name = user?.name || "Test User";
    const email = args.email;

    console.log(`Sending ${args.type} email to ${email} (${name})`);

    switch (args.type) {
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
      default:
        throw new Error(`Invalid email type: ${args.type}`);
    }
    
    return `Scheduled ${args.type} email for ${email}`;
  },
});

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
