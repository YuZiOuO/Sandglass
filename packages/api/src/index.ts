import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./shared";

import * as middleware from "./middleware";
import { attendanceTargetRoutes } from "./attendance-target";
import { projectRoutes } from "./project";
import { attendanceRoutes } from "./attendance";
import { cors } from "hono/cors";
import { auth } from "./auth";

const app = factory
  .createApp()

  // health check endpoint
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  .use("*", cors())
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
  .route("/project", projectRoutes);

export default app;
export type AppType = typeof app;
