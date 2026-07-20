import { Hono } from "hono";
import google from "./google";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    WEB_ORIGIN?: string;
  };
}>()
  .use(
    "*",
    cors({
      origin: (origin, c) => c.env.WEB_ORIGIN ?? origin,
      credentials: true,
    }),
  )
  .get("/", (c) => {
    return c.text("Service Healthy!");
  })
  .route("/google", google);

export type AppType = typeof app;
export default app;
