import { v } from "convex/values";
import { mutation, internalAction, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const join = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if already in waitlist
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) return;

    await ctx.db.insert("waitlist", {
      email: args.email,
    });

    await ctx.scheduler.runAfter(0, internalAny.waitlist.sendWelcomeEmail, {
      email: args.email,
    });
  },
});

export const sendWelcomeEmail = internalAction({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not set, skipping email");
      return;
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: "Screenshot Organizer <onboarding@resend.dev>",
        to: args.email,
        subject: "Welcome to the Waitlist!",
        html: `
          <h1>You're on the list!</h1>
          <p>Thanks for joining the waitlist for Screenshot Organizer. We'll let you know as soon as we have updates.</p>
          <br />
          <p>Best,</p>
          <p>The Team</p>
        `,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  },
});

export const getWaitlist = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("waitlist").order("desc").collect();
  },
});