import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./shared";

import * as middleware from "./middleware";
import { attendanceTargetRoutes } from "./attendance-target";
import { projectRoutes, ResourcesRoutes } from "./project";
import { attendanceRoutes } from "./attendance";
import { cors } from "hono/cors";
import { auth, OAuthRoutes } from "./auth";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@sandglass/schema/generated/prisma/internal/prismaNamespace";

const app = factory
  .createApp()

  // health check endpoint
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  .use(
    "*",
    cors({
      origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }),
  )
  .use(middleware.loggerMiddleware)

  .on(["POST", "GET"], "auth/*", (c) => {
    return auth.handler(c.req.raw);
  })

  // initialize middleware
  .use(middleware.authMiddleware)

  // load routes
  .route("/attendanceRecord", attendanceRecordRoutes)
  .route("/attendanceTarget", attendanceTargetRoutes)
  .route("/attendance", attendanceRoutes)
  .route("/project", projectRoutes)
  .route("oauth", OAuthRoutes)
  .route("/resource", ResourcesRoutes)

  .onError((err, c) => {
    if (
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError ||
      err instanceof PrismaClientRustPanicError ||
      err instanceof PrismaClientInitializationError ||
      err instanceof PrismaClientValidationError
    ) {
      console.error("Database error:", err);
      return c.json({ ok: false, error: { code: "INTERNAL_DB" } }, 500);
    }

    console.error("Unhandled error:", err);
    return c.json({ ok: false, error: { code: "INTERNAL" } }, 500);
  });

export default app;
export type AppType = typeof app;
