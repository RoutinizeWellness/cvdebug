import { httpRouter } from "convex/server";
import { handleWebhook } from "./billing";

const http = httpRouter();

// Autumn webhook for payments
http.route({
  path: "/autumn-webhook",
  method: "POST",
  handler: handleWebhook,
});

// Clerk webhook routes (if needed for user sync)
// Add here if you need to handle Clerk webhooks

export default http;