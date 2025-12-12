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

    console.log(`Creating checkout session. Success URL: ${siteUrl}/dashboard?payment=success&plan=${args.plan}`);

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

    try {
      console.log("[AUTUMN SYNC] Starting synchronization with Autumn API...");
      
      // Try to fetch payments/transactions from Autumn
      // Autumn typically uses /v1/payments or /v1/transactions endpoint
      const endpoints = [
        "https://api.useautumn.com/v1/payments",
        "https://api.useautumn.com/v1/transactions", 
        "https://api.useautumn.com/v1/orders",
        "https://api.useautumn.com/v1/customers"
      ];

      let syncedCount = 0;
      let foundData = false;
      const syncDetails: string[] = [];

      for (const endpoint of endpoints) {
        try {
          console.log(`[AUTUMN SYNC] Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${autumnSecretKey}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`[AUTUMN SYNC] Success from ${endpoint}:`, JSON.stringify(data).substring(0, 500));
            
            // Handle different response structures
            const items = data.payments || data.transactions || data.orders || data.customers || data.data || [];
            
            if (items.length > 0) {
              foundData = true;
              syncDetails.push(`Found ${items.length} records from ${endpoint.split('/').pop()}`);
              
              for (const item of items) {
                // Extract customer info and metadata
                const metadata = item.metadata || {};
                const customerEmail = item.customer_email || item.email || metadata.email;
                const customerId = item.customer_id || item.customer || metadata.userId;
                const status = item.status || item.payment_status;
                const productId = item.product_id || metadata.plan;
                
                console.log(`[AUTUMN SYNC] Processing item:`, { customerEmail, customerId, status, productId });
                
                // Only process successful payments
                if (status === "succeeded" || status === "completed" || status === "paid") {
                  // Determine plan from product_id or metadata
                  let plan: "single_scan" | "bulk_pack" | null = null;
                  
                  if (productId === "single_scan" || productId === "single-scan") {
                    plan = "single_scan";
                  } else if (productId === "bulk_pack" || productId === "bulk-pack") {
                    plan = "bulk_pack";
                  } else if (metadata.plan) {
                    plan = metadata.plan as "single_scan" | "bulk_pack";
                  }
                  
                  if (plan && (customerId || customerEmail)) {
                    try {
                      // Try to find user by Clerk ID first, then by email
                      const identifier = customerId || customerEmail;
                      
                      await ctx.runMutation(internal.users.updateSubscription, {
                        tokenIdentifier: identifier,
                        plan: plan,
                      });
                      
                      syncedCount++;
                      syncDetails.push(`✅ Synced ${customerEmail || customerId} - ${plan}`);
                    } catch (err: any) {
                      console.error(`[AUTUMN SYNC] Failed to update user:`, err);
                      syncDetails.push(`❌ Failed: ${customerEmail || customerId} - ${err.message}`);
                    }
                  }
                }
              }
            }
          } else {
            console.log(`[AUTUMN SYNC] ${endpoint} returned ${response.status}`);
          }
        } catch (err: any) {
          console.log(`[AUTUMN SYNC] Error with ${endpoint}:`, err.message);
        }
      }

      if (!foundData) {
        return { 
          success: false, 
          message: "Could not retrieve payment data from Autumn API. Please verify API key and use 'Manual Grant' to add credits manually." 
        };
      }

      const detailsMessage = syncDetails.length > 0 ? `\n\nDetails:\n${syncDetails.join('\n')}` : '';
      return { 
        success: true, 
        message: `Synced ${syncedCount} payment(s) from Autumn${detailsMessage}` 
      };
      
    } catch (error: any) {
      console.error("[AUTUMN SYNC] Error:", error);
      return { success: false, message: `Sync error: ${error.message}` };
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