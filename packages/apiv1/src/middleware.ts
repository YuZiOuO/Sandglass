import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { logger } from "hono/logger";
import { factory } from "./shared";

const firebase = initializeApp();
const firebaseAuth = getAuth(firebase);

export const loggerMiddleware = factory.createMiddleware(logger());
export const firebaseAuthMiddleware = factory.createMiddleware(
  async (c, next) => {
    const header = c.req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return c.json({ error: "Missing or malformed access token" }, 401);
    }

    const idToken = header.split(" ")[1];
    try {
      const decodedIdToken = await firebaseAuth.verifyIdToken(idToken);
      c.set("user", decodedIdToken);
      c.set("uid", decodedIdToken.uid);
      await next();
    } catch (e) {
      return c.json({ success: false, error: e });
    }
  },
);
