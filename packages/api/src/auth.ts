import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  trustedOrigins:['http://localhost:5173'],
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
    },
    github: {
      clientId: process.env.GH_clientId,
      scope: ["user","repo:status"],
    },
  },
});
