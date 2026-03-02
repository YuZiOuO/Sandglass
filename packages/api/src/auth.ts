import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db";
import { env } from "./env";
import { passkey } from "@better-auth/passkey";

export const authBasePath = "/auth";
export const auth = betterAuth({
  plugins: [passkey()],
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
