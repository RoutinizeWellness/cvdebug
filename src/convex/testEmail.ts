import { action } from "./_generated/server";
import { v } from "convex/values";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const sendTestWelcomeEmail = action({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email || "tiniboti@gmail.com";
    const name = args.name || "Test User";
    
    await ctx.runAction(internalAny.marketing.sendOnboardingEmail, {
      email,
      name,
      variant: "A",
    });
    
    return { success: true, sentTo: email };
  },
});

export const sendAllTestEmails = action({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email || "nichefinder@outlook.es";
    const name = args.name || "Test User";
    
    const results = [];
    
    // 1. Welcome Email
    try {
      await ctx.runAction(internalAny.marketing.sendOnboardingEmail, {
        email,
        name,
        variant: "A",
      });
      results.push({ email: "Welcome Email", status: "sent" });
    } catch (error: any) {
      results.push({ email: "Welcome Email", status: "failed", error: error.message });
    }
    
    // 2. Parsing Error Email
    try {
      await ctx.runAction(internalAny.marketing.sendParsingErrorEmail, {
        email,
        name,
        resumeId: "test_resume_id" as any,
      });
      results.push({ email: "Parsing Error Email", status: "sent" });
    } catch (error: any) {
      results.push({ email: "Parsing Error Email", status: "failed", error: error.message });
    }
    
    // 3. Purchase Confirmation Email
    try {
      await ctx.runAction(internalAny.marketing.sendPurchaseConfirmationEmail, {
        email,
        name,
        plan: "single_scan",
        credits: 1,
      });
      results.push({ email: "Purchase Confirmation Email", status: "sent" });
    } catch (error: any) {
      results.push({ email: "Purchase Confirmation Email", status: "failed", error: error.message });
    }
    
    // 4. Recovery Email (Post-Scan)
    try {
      await ctx.runAction(internalAny.marketing.sendRecoveryEmail, {
        email,
        name,
        score: 65,
        totalErrors: 8,
        firstError: "Missing keywords: React, TypeScript, Node.js",
      });
      results.push({ email: "Recovery Email", status: "sent" });
    } catch (error: any) {
      results.push({ email: "Recovery Email", status: "failed", error: error.message });
    }
    
    // 5. Activation Reminder Email
    try {
      await ctx.runAction(internalAny.marketing.sendActivationReminderEmail, {
        email,
        name,
      });
      results.push({ email: "Activation Reminder Email", status: "sent" });
    } catch (error: any) {
      results.push({ email: "Activation Reminder Email", status: "failed", error: error.message });
    }
    
    return { 
      success: true, 
      sentTo: email,
      results,
      message: `Sent 5 test emails to ${email}. Check your inbox (and spam folder)!`
    };
  },
});