import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./shared";

import * as middleware from "./middleware";
import { attendanceTargetRoutes } from "./attendance-target";
import { projectRoutes } from "./project";
import { OAuthPublicRoutes, OAuthRoutes } from "./oauth";
import { attendanceRoutes } from "./attendance";

const app = factory
  .createApp()

  // initialize middleware
  .use(middleware.loggerMiddleware)
  .use(middleware.firebaseAuthMiddleware)

  // health check endpoint
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  // load routes
  .route("/attendanceRecord", attendanceRecordRoutes)
  .route("/attendanceTarget", attendanceTargetRoutes)
  .route('/attendance',attendanceRoutes)
  .route("/project", projectRoutes)
  .route("/oauth", OAuthRoutes)
  .route("/oauth", OAuthPublicRoutes);

export default app;
export type AppType = typeof app;
