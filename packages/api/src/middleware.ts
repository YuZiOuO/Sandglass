import { factory } from "./factory";
import { auth } from "./auth";
import { createLogger, updateRequestContext, withRequestContext } from "./log";

const log = createLogger("http");

const getPathname = (url: string) => {
  return new URL(url).pathname;
};

const getHeader = (value: string | undefined) => {
  return value?.trim() || undefined;
};

export const loggerMiddleware = factory.createMiddleware(async (c, next) => {
  const requestId = getHeader(c.req.header("x-request-id")) ?? crypto.randomUUID();
  const cfRay = getHeader(c.req.header("cf-ray"));
  const method = c.req.method;
  const path = getPathname(c.req.url);
  const startedAt = performance.now();

  c.set("requestId", requestId);
  if (cfRay) {
    c.set("cfRay", cfRay);
  }
  c.header("x-request-id", requestId);

  await withRequestContext({ requestId, cfRay, method, path }, async () => {
    try {
      await next();
    } finally {
      const durationMs = Number((performance.now() - startedAt).toFixed(1));
      c.header("server-timing", `app;dur=${durationMs}`);

      const userId = (c.var as { user?: { id?: string } }).user?.id;
      if (userId) {
        updateRequestContext({ userId });
      }

      const status = c.res.status;
      if (status >= 500) {
        log.error("request.completed", { status, durationMs });
      } else if (status >= 400) {
        log.warn("request.completed", { status, durationMs });
      } else {
        log.info("request.completed", { status, durationMs });
      }
    }
  });
});

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.body(null, 401);
  }
  c.set("user", session.user);
  c.set("session", session.session);
  updateRequestContext({ userId: session.user.id });
  await next();
});
