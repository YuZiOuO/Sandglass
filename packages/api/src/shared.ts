import { type DecodedIdToken } from "firebase-admin/auth";
import { createFactory } from "hono/factory";

/**
 * Metadata for app
 */
type Env = {
  Variables: {
    user: DecodedIdToken;
    uid: string;
  };
};
export const factory = createFactory<Env>();
