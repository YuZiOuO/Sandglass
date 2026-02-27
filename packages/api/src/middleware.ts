import { logger } from "hono/logger";
import { factory } from "./factory";
import { auth } from "./auth";

export const loggerMiddleware = factory.createMiddleware(logger());

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.body(null, 401);
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
