import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./factory";

import * as middleware from "./middleware";
import { attendanceTargetRoutes } from "./attendance-target";
import { projectRoutes, ResourcesRoutes } from "./project";
import { attendanceRoutes } from "./attendance";
import { cors } from "hono/cors";
import { auth, authBasePath } from "./auth";
import { env } from "./env";
import { createLogger } from "./log";
import { LOG_SCOPES } from "@sandglass/shared";

const log = createLogger(LOG_SCOPES.api);
const PRISMA_ERROR_NAME_PREFIX = "PrismaClient";

// Entry-boundary helper: the app only needs to know the error came from Prisma client internals.
const isPrismaClientError = (err: unknown): err is Error => {
  return err instanceof Error && err.name.startsWith(PRISMA_ERROR_NAME_PREFIX);
};

const app = factory
  .createApp()

  // health check endpoint
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  .use(
    "*",
    cors({
      origin: env.ALLOWED_ORIGINS,
      credentials: true,
    }),
  )
  .use(middleware.loggerMiddleware)

  // Delegate auth routes to better-auth. Errors still flow into app.onError.
  .on(["POST", "GET"], authBasePath + "/*", (c) => {
    return auth.handler(c.req.raw);
  })

  // initialize middleware
  .use(middleware.authMiddleware)

  // load routes
  .route("/attendanceRecord", attendanceRecordRoutes)
  .route("/attendanceTarget", attendanceTargetRoutes)
  .route("/attendance", attendanceRoutes)
  .route("/project", projectRoutes)
  .route("/resource", ResourcesRoutes)

  .onError((err, c) => {
    if (isPrismaClientError(err)) {
      log.error("request.failed.db", { err });
      return c.json({ ok: false, error: { code: "INTERNAL_DB" } }, 500);
    }

    log.error("request.failed", { err });
    return c.json({ ok: false, error: { code: "INTERNAL" } }, 500);
  });

export default app;
export type AppType = typeof app;
