import { attendanceRecordRoutes } from "./attendance-record";
import { factory } from "./shared";

import * as middleware from "./middleware";

const app = factory
  .createApp()

  // initialize middleware
  .use(middleware.firebaseAuthMiddleware)
  .use(middleware.loggerMiddleware)

  // health check endpoint
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  // load routes
  .route("/attendanceRecord", attendanceRecordRoutes);

export default app;
export type AppType = typeof app;
