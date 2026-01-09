import { httpAction, internalMutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const handleWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("autumn-signature");
  const body = await request.text();

  console.log("[Webhook] ====== START WEBHOOK ======");
  console.log("[Webhook] Timestamp:", new Date().toISOString());
  console.log("[Webhook] Signature present:", !!signature);

  if (!signature) {
    console.error("[Webhook] ❌ No signature provided");
    return new Response("No signature", { status: 400 });
  }

  const secretKey = process.env.AUTUMN_SECRET_KEY;
  if (!secretKey) {
    console.error("[Webhook] ❌ AUTUMN_SECRET_KEY not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  try {
    const payload = JSON.parse(body);

    console.log("[Webhook] ✅ Received event:", payload.event);
    console.log("[Webhook] 📦 Payload data:", JSON.stringify(payload.data, null, 2));

    if (payload.event === "checkout.completed") {
      const { customer_id, product_id, metadata, transaction_id, amount } = payload.data;

      console.log(`[Webhook] 🛒 Processing checkout for customer_id: ${customer_id}`);
      console.log(`[Webhook] 📦 Product ID: ${product_id}`);
      console.log(`[Webhook] 💳 Transaction ID: ${transaction_id}`);
      console.log(`[Webhook] 💰 Amount: ${amount}`);

      // customer_id from Autumn is the Clerk tokenIdentifier (identity.subject)
      // Map product_id to plan
      const productSingle = process.env.PRODUCT_SINGLE_SCAN || "single_scan";
      const productSprint = process.env.PRODUCT_INTERVIEW_SPRINT || "interview_sprint";

      let plan: "single_scan" | "interview_sprint";
      if (product_id === productSingle) {
        plan = "single_scan";
      } else if (product_id === productSprint) {
        plan = "interview_sprint";
      } else {
        console.error(`[Webhook] ❌ Unknown product_id: ${product_id}`);
        console.error(`[Webhook] Expected: ${productSingle} or ${productSprint}`);
        return new Response("Unknown product", { status: 400 });
      }

      console.log(`[Webhook] ✅ Mapped product to plan: ${plan}`);

      // STEP 1: Update user subscription FIRST (most critical)
      console.log(`[Webhook] 🔄 STEP 1: Updating user subscription...`);
      try {
        await ctx.runMutation(internalAny.users.updateSubscription, {
          tokenIdentifier: customer_id,
          plan: plan,
        });
        console.log(`[Webhook] ✅ STEP 1 SUCCESS: User subscription updated`);
      } catch (error: any) {
        console.error(`[Webhook] ❌ STEP 1 FAILED: ${error.message}`);
        throw error; // Critical failure, don't continue
      }

      // STEP 2: Store payment record
      console.log(`[Webhook] 💾 STEP 2: Storing payment record...`);
      try {
        await ctx.runMutation(internalAny.billing.storePaymentRecord, {
          tokenIdentifier: customer_id,
          plan,
          transactionId: transaction_id,
          amount: amount || (plan === "single_scan" ? 4.99 : 19.99),
        });
        console.log(`[Webhook] ✅ STEP 2 SUCCESS: Payment record stored`);
      } catch (error: any) {
        console.error(`[Webhook] ⚠️ STEP 2 WARNING: Failed to store payment record - ${error.message}`);
        // Non-critical, continue
      }

      console.log(`[Webhook] 🎉 Credits granted successfully for ${customer_id}`);

      // STEP 3: Unlock specific resume if passed in metadata
      if (metadata?.resumeId) {
        console.log(`[Webhook] 🔓 STEP 3: Unlocking resume ${metadata.resumeId} for ${customer_id}`);
        try {
          await ctx.runMutation(internalAny.resumes.unlockResumeAfterPurchase, {
            resumeId: metadata.resumeId,
            userId: customer_id,
          });
          console.log(`[Webhook] ✅ STEP 3 SUCCESS: Resume unlocked`);
        } catch (error: any) {
          console.error(`[Webhook] ⚠️ STEP 3 WARNING: Resume unlock failed - ${error.message}`);
          // Non-critical, continue
        }
      }

      console.log("[Webhook] ====== END WEBHOOK SUCCESS ======");
      console.log(`[Webhook] Summary: Payment processed for ${customer_id}, Plan: ${plan}, Transaction: ${transaction_id}`);
      return new Response("OK", { status: 200 });
    }

    console.log(`[Webhook] ⚠️ Event not handled: ${payload.event}`);
    return new Response("Event not handled", { status: 200 });
  } catch (error: any) {
    console.error("[Webhook] ❌ CRITICAL ERROR:", error);
    console.error("[Webhook] ❌ Stack:", error.stack);
    console.error("[Webhook] ====== END WEBHOOK ERROR ======");
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});

export const storePaymentRecord = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    plan: v.union(v.literal("single_scan"), v.literal("interview_sprint")),
    transactionId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    console.log(`[storePaymentRecord] ====== START ======`);
    console.log(`[storePaymentRecord] Timestamp: ${new Date().toISOString()}`);
    console.log(`[storePaymentRecord] Looking for user with tokenIdentifier: ${args.tokenIdentifier}`);

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      console.error(`[storePaymentRecord] ❌ User not found with tokenIdentifier: ${args.tokenIdentifier}`);
      console.error(`[storePaymentRecord] This payment CANNOT be recorded. User must exist before payment.`);
      throw new Error(`User not found: ${args.tokenIdentifier}`);
    }

    console.log(`[storePaymentRecord] ✅ Found user: ${user.email} (ID: ${user._id})`);

    // Check if payment already exists (prevent duplicates)
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_transaction_id", (q) => q.eq("transactionId", args.transactionId))
      .first();

    if (existingPayment) {
      console.log(`[storePaymentRecord] ⚠️ Payment already recorded for transaction: ${args.transactionId}`);
      return existingPayment._id;
    }

    const paymentId = await ctx.db.insert("payments", {
      userId: user._id,
      tokenIdentifier: args.tokenIdentifier,
      email: user.email,
      plan: args.plan,
      transactionId: args.transactionId,
      amount: args.amount,
      status: "completed",
      purchasedAt: Date.now(),
    });

    console.log(`[storePaymentRecord] ✅ Payment record stored for ${user.email}`);
    console.log(`[storePaymentRecord] Payment ID: ${paymentId}`);
    console.log(`[storePaymentRecord] Plan: ${args.plan}, Amount: $${args.amount}`);
    console.log(`[storePaymentRecord] ====== END ======`);

    return paymentId;
  },
});

export const getPaymentByTransaction = query({
  args: { transactionId: v.string() },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_transaction_id", (q) => q.eq("transactionId", args.transactionId))
      .unique();

    if (!payment) return null;

    const user = await ctx.db.get(payment.userId);

    return {
      ...payment,
      userName: user?.name || "User",
      userEmail: user?.email || "",
    };
  },
});

export const getUserLatestPayment = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) return null;

    const payment = await ctx.db
      .query("payments")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (!payment) return null;

    return {
      ...payment,
      userName: user.name || "User",
      userEmail: user.email || "",
    };
  },
});

// New: Get all payments for admin view
export const getAllPayments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // Admin check
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      return [];
    }

    const payments = await ctx.db.query("payments").order("desc").take(100);

    // Enhance with user data
    const paymentsWithUsers = await Promise.all(
      payments.map(async (payment) => {
        const user = await ctx.db.get(payment.userId);
        return {
          ...payment,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "Unknown",
        };
      })
    );

    return paymentsWithUsers;
  },
});

// New: Get payment history for a specific user (admin only)
export const getUserPaymentHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // Admin check
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      return [];
    }

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return payments;
  },
});
