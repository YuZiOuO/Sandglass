import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { env } from "bun";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Hono } from "hono";
import schema from "./schema";

type Env = {
  Variables: {
    user: DecodedIdToken;
    uid: string;
  };
};

const app = new Hono<Env>();
const db = new PrismaClient({
  accelerateUrl: env.DATABASE_URL as string,
});

const firebase = initializeApp();
const firebaseAuth = getAuth(firebase);

app.use(async (c, next) => {
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
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const routes = app.post(
  "/attendanceRecord",
  zValidator(
    "json",
    schema.AttendanceRecordCreateInputObjectZodSchema.omit({
      id: true,
      uid: true,
    }),
  ),
  async (c) => {
    const uid = c.var.uid;
    const data = c.req.valid("json");
    try {
      const dbres = await db.attendanceRecord.create({
        data: { ...data, uid: uid },
      });
    } catch (e) {
      console.log(e);
    }
    return c.json({ success: true, error: null }, 201);
  },
);

export default app;
export type AppType = typeof routes;
