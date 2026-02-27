import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_BASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_URL: z.string(),
    ALLOWED_ORIGINS: z
      .string()
      .transform((s) => s.split(",").map((url) => url.trim())),

    GApis_OAuth2CliId: z.string(),
    GApis_OAuth2CliSecret: z.string(),
    GH_clientId: z.string(),
    GH_clientSecret: z.string(),
  },
  runtimeEnv: process.env,
});
