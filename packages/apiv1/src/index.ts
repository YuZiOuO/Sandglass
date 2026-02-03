import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./shared";

import * as middleware from "./middleware";
import { attendaceTargetRoutes } from "./attendace-target";
import { projectRoutes } from "./project";

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
  .route("/attendanceTarget", attendaceTargetRoutes)
  .route("/project", projectRoutes);

export default app;
export type AppType = typeof app;
