import { httpRouter } from "convex/server";
import { handleWebhook } from "./billing";

const http = httpRouter();

http.route({
  path: "/autumn-webhook",
  method: "POST",
  handler: handleWebhook,
});

export default http;