import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/autumn-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const bodyString = await request.text();
    const signature = request.headers.get("x-autumn-signature");

    try {
      const result = await ctx.runAction(internal.billing.handleAutumnWebhook, {
        body: bodyString,
        signature: signature ?? undefined,
      });

      if (result.success) {
        return new Response("Webhook processed", { status: 200 });
      } else {
        return new Response("Webhook processing failed", { status: 400 });
      }
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;