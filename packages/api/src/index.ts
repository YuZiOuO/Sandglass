import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./factory";

import * as middleware from "./middleware";
import { attendanceTargetRoutes } from "./attendance-target";
import { projectRoutes, ResourcesRoutes } from "./project";
import { attendanceRoutes } from "./attendance";
import { cors } from "hono/cors";
import { auth, authBasePath } from "./auth";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@sandglass/schema/generated/prisma/internal/prismaNamespace";
import { env } from "./env";
import { createLogger } from "./log";
import { LOG_SCOPES } from "@sandglass/shared";

const log = createLogger(LOG_SCOPES.api);

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
    if (
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError ||
      err instanceof PrismaClientRustPanicError ||
      err instanceof PrismaClientInitializationError ||
      err instanceof PrismaClientValidationError
    ) {
      log.error("request.failed.db", { err });
      return c.json({ ok: false, error: { code: "INTERNAL_DB" } }, 500);
    }

    log.error("request.failed", { err });
    return c.json({ ok: false, error: { code: "INTERNAL" } }, 500);
  });

export default app;
export type AppType = typeof app;
