import { createFactory } from "hono/factory";
import { auth } from "./auth";

/**
 * Metadata for app
 */
type Env = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};
export const factory = createFactory<Env>();
