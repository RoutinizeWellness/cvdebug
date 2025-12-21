"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

const apiAny: any = require("./_generated/api").api;

export const generateReceipt = action({
  args: {
    transactionId: v.string(),
  },
  handler: async (ctx, args): Promise<{ text: string; data: any }> => {
    const payment: any = await ctx.runQuery(apiAny.billing.getPaymentByTransaction, {
      transactionId: args.transactionId,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    const receiptData: any = {
      orderId: payment.transactionId,
      date: new Date(payment.purchasedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      customerName: payment.userName,
      customerEmail: payment.userEmail,
      plan: payment.plan === "single_scan" ? "Single Scan" : "Interview Sprint (7 Days)",
      amount: `€${payment.amount.toFixed(2)}`,
      status: payment.status,
    };

    // Generate simple text receipt
    const receiptText: string = `
CVDebug - Payment Receipt
========================

Order ID: ${receiptData.orderId}
Date: ${receiptData.date}

Customer Information:
Name: ${receiptData.customerName}
Email: ${receiptData.customerEmail}

Purchase Details:
Plan: ${receiptData.plan}
Amount: ${receiptData.amount}
Status: ${receiptData.status}

Thank you for your purchase!

CVDebug - Stop Getting Auto-Rejected
https://cvdebug.com
    `.trim();

    return {
      text: receiptText,
      data: receiptData,
    };
  },
});
