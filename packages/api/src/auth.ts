import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db";
import { factory } from "./shared";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  trustedOrigins: [process.env.ALLOWED_ORIGIN!],
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
      clientId: process.env.GApis_OAuth2CliId,
      clientSecret: process.env.GApis_OAuth2CliSecret,
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
      ],
      accessType: "offline",
      prompt: "consent",
    },
    github: {
      clientId: process.env.GH_clientId,
      clientSecret: process.env.GH_clientSecret,
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
