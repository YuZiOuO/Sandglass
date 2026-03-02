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
    TZ: z.string().refine(
      (val) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: val });
          return true;
        } catch {
          return false;
        }
      },
      { message: "无效的时区字符串，请使用 Asia/Shanghai 或 UTC 等标准格式" },
    ),
  },
  runtimeEnv: process.env,
  onValidationError: (issue) => {
    console.error("❌ Enviroment Validation Error:");
    console.error(issue);
    process.exit(-1)
  },
});
