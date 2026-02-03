import { env } from "bun";
import { factory } from "./shared";
import { google } from "googleapis";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "./db";
import { fetch } from "bun";

const googleOAuthCallbackSchema = z.object({
  code: z.string(), // Authorization Code
  state: z.string(), // contains uid, for convinience and CSRF
  error: z.string().optional(),
});

const githubOAuthCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

const githubOAuthExchangeTokenResponseSchema = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
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
  .get(
    "/github/callback",
    zValidator("query", githubOAuthCallbackSchema),
    async (c) => {
      const data = c.req.valid("query");
      const uid = data.state;
      if (!uid) {
        throw Error("Assertion Error.");
      }

      // Retrive AccessToken
      const endpoint = "https://github.com/login/oauth/access_token";
      const body = {
        ...githubEnvs,
        code: data.code,
      };

      const req = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const res = await githubOAuthExchangeTokenResponseSchema.parseAsync(
        await req.json(),
      );

      // Store to DB
      await db.oAuth.upsert({
        where: {
          uid: uid,
        },
        create: {
          uid: uid,
          githubAccessToken: res.access_token,
        },
        update: {
          uid: uid,
          githubAccessToken: res.access_token,
        },
      });

      return;
    },
  );

const googleOAuthCli = new google.auth.OAuth2({
  clientId: env.GApis_OAuth2CliId,
  clientSecret: env.GApis_OAuth2CliSecret,
  redirectUri: env.GApis_RedirectURL,
});

const githubEnvs = {
  client_id: env.GH_clientId,
  redirect_uri: env.GH_RedirectURL,
};

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
  .get("/github/authUrl", async (c) => {
    const uid = c.var.uid;

    const params = {
      ...githubEnvs,
      scope: "user repo:status",
      state: uid,
    };

    const endpoint = "https://github.com/login/oauth/authorize";
    const url = endpoint + "?" + new URLSearchParams(params);
    return c.json(url);
  })
  .get("/github/token", async (c) => {
    const uid = c.var.uid;
    const res = await db.oAuth.findUnique({
      where: {
        uid: uid,
      },
    });

    const token = res?.githubAccessToken ?? null;
    return c.json(token);
  });
