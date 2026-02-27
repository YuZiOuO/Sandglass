import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db";
import { factory } from "./shared";
import { env } from "./env";

export const authBasePath = "/auth";
export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  trustedOrigins: env.ALLOWED_ORIGINS,
  baseURL: env.BETTER_AUTH_BASE_URL,
  basePath: authBasePath,
  account: {
    accountLinking: {
      allowDifferentEmails: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: env.GApis_OAuth2CliId,
      clientSecret: env.GApis_OAuth2CliSecret,
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
      ],
      accessType: "offline",
      prompt: "consent",
    },
    github: {
      clientId: env.GH_clientId,
      clientSecret: env.GH_clientSecret,
      scope: ["user", "repo:status"],
    },
  },
});

export const OAuthRoutes = factory
  .createApp()
  .get("/google/token", async (c) => {
    const uid = c.var.user.id;
    const account = await db.account.findFirst({
      where: {
        userId: uid,
        providerId: "google",
      },
    });

    if (!account) {
      return c.json(null);
    }

    if (
      account.accessTokenExpiresAt &&
      Date.now() > account.accessTokenExpiresAt.getTime()
    ) {
      const refreshed = await auth.api.refreshToken({
        body: {
          providerId: "google",
          accountId: account.accountId,
        },
      });

      return c.json(refreshed.accessToken!);
    }

    return c.json(account.accessToken!);
  })
  .get("/github/token", async (c) => {
    const uid = c.var.user.id;
    const account = await db.account.findFirst({
      where: {
        userId: uid,
        providerId: "github",
      },
    });

    return c.json(account?.accessToken ?? null);
  });
