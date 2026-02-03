import { env } from "bun";
import { factory } from "./shared";
import { google } from "googleapis";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "./db";

const googleOAuthCallbackSchema = z.object({
  code: z.string(), // Authorization Code
  state: z.string(), // contains uid, for convinience and CSRF
  error: z.string().optional(),
});

export const OAuthPublicRoutes = factory
  .createApp()
  .get(
    "/google/callback",
    zValidator("query", googleOAuthCallbackSchema),
    async (c) => {
      const data = c.req.valid("query");
      const uid = data.state;
      if (data.error) {
        return c.json("Error from Google:" + data.error, 400);
      }

      // Retrive RefreshToken
      const { tokens } = await googleOAuthCli.getToken(data.code);
      const refreshToken = tokens.refresh_token!;
      await db.oAuth.upsert({
        where: {
          uid: uid,
        },
        create: {
          uid: uid,
          googleRefreshToken: refreshToken,
        },
        update: {
          uid: uid,
          googleRefreshToken: refreshToken,
        },
      });
    },
  )
  .get("/github/callback");

const googleOAuthCli = new google.auth.OAuth2({
  clientId: env.GApis_OAuth2CliId,
  clientSecret: env.GApis_OAuth2CliSecret,
  redirectUri: env.GApis_RedirectURL,
});

const googleScopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/tasks",
];

export const OAuthRoutes = factory
  .createApp()
  .get("/google/authUrl", async (c) => {
    const uid = c.var.uid;
    const url = googleOAuthCli.generateAuthUrl({
      access_type: "offline",
      scope: googleScopes,
      state: uid,
      response_type: "code",
      prompt: "consent", // Force to retrive refresh token every time.
    });

    return c.json(url);
  })
  .get("/google/token", async (c) => {
    const uid = c.var.uid;

    const OAuthObj = await db.oAuth.findUnique({ where: { uid: uid } });
    const refreshToken = OAuthObj?.googleRefreshToken;
    if (!refreshToken) {
      return c.json(null);
    }

    const localCli = new google.auth.OAuth2(); // in case of race condition
    localCli.setCredentials({ refresh_token: refreshToken });

    const res = await localCli.getAccessToken();
    return c.json(res.token ?? null);
  })
  .get("/github/authUrl")
  .get("/github.token");
