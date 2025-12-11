"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const createCheckoutSession = action({
  args: { 
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
    origin: v.optional(v.string()) 
  },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized: Please log in.");

    const autumnSecretKey = process.env.AUTUMN_SECRET_KEY;
    if (!autumnSecretKey) {
      console.error("AUTUMN_SECRET_KEY is missing in environment variables");
      throw new Error("Configuration Error: Payment provider is not configured.");
    }

    // Use provided origin (from client) or fallback to env var
    const siteUrl = args.origin || process.env.CONVEX_SITE_URL;
    if (!siteUrl) {
      console.error("CONVEX_SITE_URL is missing and no origin provided");
      throw new Error("Configuration Error: Site URL is not configured.");
    }

    const user = await ctx.runQuery(internal.users.getInternalUser, {});
    if (!user) throw new Error("User not found in database.");
    if (!user.email) throw new Error("User email is required for billing.");

    // Map internal plan names to Autumn Product IDs
    const productId = args.plan;
    // Use the Clerk Subject ID (user_...) as the customer ID for stability
    const customerId = user.subject; 

    console.log(`Initiating Autumn checkout for ${args.plan} (Product: ${productId}, Customer: ${customerId})`);

    try {
      // Create a checkout session with Autumn
      const response = await fetch("https://api.useautumn.com/v1/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${autumnSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          customer_email: user.email,
          customer_id: customerId,
          success_url: `${siteUrl}/dashboard?payment=success&plan=${args.plan}`,
          cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
          metadata: {
            userId: user._id, // This is the Clerk Subject ID based on getInternalUser
            dbId: user.dbUser?._id, // The actual Convex DB ID
            plan: args.plan,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Autumn API Error (${response.status}):`, errorText);
        throw new Error(`Payment provider error: ${errorText}`);
      }

      const data = (await response.json()) as { url?: string; checkout_url?: string };
      
      if (data.url) {
        return data.url;
      } else if (data.checkout_url) {
        return data.checkout_url;
      } else {
        console.error("Unexpected Autumn response format:", data);
        throw new Error("Invalid response from payment provider");
      }
    } catch (error: any) {
      console.error("Billing Action Error:", error);
      // Throw a clean error message to the client
      throw new Error(error.message || "Failed to create checkout session");
    }
  },
});

export const handleAutumnWebhook = internalAction({
  args: { body: v.string(), signature: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("Received Autumn Webhook:", args.body);
    
    try {
      const event = JSON.parse(args.body);
      
      // Handle "payment.succeeded" or similar events
      // Based on Autumn docs (assumed) or standard patterns
      // We look for metadata passed during checkout
      
      if (event.type === "payment.succeeded" || event.type === "checkout.session.completed") {
        const data = event.data;
        const metadata = data.metadata || {};
        const { userId, plan } = metadata;
        
        if (userId && plan) {
          console.log(`Processing successful payment for user ${userId} with plan ${plan}`);
          
          // Update user subscription
          await ctx.runMutation(internal.users.updateSubscription, {
            tokenIdentifier: userId, // This is the Clerk Subject ID
            plan: plan as "single_scan" | "bulk_pack",
          });
          
          return { success: true };
        } else {
          console.warn("Webhook received but missing metadata (userId or plan)", data);
        }
      }
      
      return { success: true }; // Acknowledge other events
    } catch (error) {
      console.error("Error processing webhook:", error);
      return { success: false };
    }
  }
});

export const syncAutumnData = action({
  args: {},
  handler: async (ctx) => {
    const autumnSecretKey = process.env.AUTUMN_SECRET_KEY;
    if (!autumnSecretKey) {
      throw new Error("AUTUMN_SECRET_KEY is not configured");
    }

    // Attempt to fetch recent orders/events to sync
    // Since we don't have exact docs, we'll try to list events or customers
    // This is a best-effort sync
    
    try {
      console.log("Attempting to sync with Autumn...");
      
      let endpoint = "https://api.useautumn.com/v1/events";
      let isEvents = true;
      
      // 1. Try Events Endpoint
      let response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${autumnSecretKey}`,
          "Content-Type": "application/json",
        },
      });

      // 2. Fallback to Customers Endpoint if Events 404s
      if (!response.ok && response.status === 404) {
        console.warn("Autumn Events API endpoint not found (404). Trying customers endpoint...");
        endpoint = "https://api.useautumn.com/v1/customers";
        isEvents = false;
        
        response = await fetch(endpoint, {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${autumnSecretKey}`,
            "Content-Type": "application/json",
            },
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch Autumn data from ${endpoint}:`, errorText);
        return { success: false, message: `Sync failed: Autumn API returned ${response.status}. Please use 'Manual Grant' below.` };
      }

      const data = await response.json();
      let syncedCount = 0;

      if (isEvents) {
          const events = data.events || data.data || [];
          for (const event of events) {
            if (event.type === "payment.succeeded" || event.type === "checkout.session.completed") {
               const metadata = event.data?.metadata || {};
               if (metadata.userId && metadata.plan) {
                 await ctx.runMutation(internal.users.updateSubscription, {
                   tokenIdentifier: metadata.userId,
                   plan: metadata.plan as "single_scan" | "bulk_pack",
                 });
                 syncedCount++;
               }
            }
          }
      } else {
          // Handle Customers
          // Assuming structure: { customers: [ { id, email, metadata: { ... } } ] }
          const customers = data.customers || data.data || [];
          for (const customer of customers) {
              // Check metadata for plan info
              if (customer.metadata?.userId && customer.metadata?.plan) {
                   await ctx.runMutation(internal.users.updateSubscription, {
                       tokenIdentifier: customer.metadata.userId,
                       plan: customer.metadata.plan as "single_scan" | "bulk_pack",
                   });
                   syncedCount++;
              }
          }
      }

      return { success: true, message: `Synced ${syncedCount} records from Autumn` };
    } catch (error: any) {
      console.error("Sync error:", error);
      return { success: false, message: error.message };
    }
  }
});

export const handleCheckoutSuccess = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    // Handle Autumn webhook or success callback here
    console.log("Checkout success for session:", args.sessionId);
  }
});