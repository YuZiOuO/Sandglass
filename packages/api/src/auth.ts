import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { isAPIError } from "better-auth/api";
import { db } from "./db";
import { env } from "./env";
import { passkey } from "@better-auth/passkey";
import { createLogger } from "./log";
import { LOG_SCOPES } from "@sandglass/shared";

export const authBasePath = "/auth";
const log = createLogger(LOG_SCOPES.api);

export const auth = betterAuth({
  appName: "Sandglass",
  logger: {
    level: "warn",
    log(level, message, ...args) {
      const detail = args.length ? (args.length === 1 ? args[0] : args) : undefined;
      log[level](`auth.internal.${message}`, detail === undefined ? undefined : { detail });
    },
  },
  onAPIError: {
    throw: false,
    onError(error) {
      if (isAPIError(error) && error.statusCode < 500) return;
      log.error("auth.api.failed", error instanceof Error ? { err: error } : { detail: error });
    },
  },
  plugins: [
    passkey({
      rpName: "Sandglass",
      rpID: new URL(env.ALLOWED_ORIGINS).hostname,
      origin: env.ALLOWED_ORIGINS,
    }),
  ],
  database: prismaAdapter(db, { provider: "postgresql" }),
  trustedOrigins: [env.ALLOWED_ORIGINS],
  baseURL: env.BETTER_AUTH_BASE_URL,
  basePath: authBasePath,
  account: {
    accountLinking: {
      allowDifferentEmails: true,
      trustedProviders: ["google", "github"],
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
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
      prompt: "select_account",
    },
    github: {
      clientId: env.GH_clientId,
      clientSecret: env.GH_clientSecret,
      scope: ["user", "repo"],
      prompt: "select_account",
    },
  },
});
