import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { createLogger } from "./log";
import { LOG_SCOPES } from "@sandglass/shared";

const log = createLogger(LOG_SCOPES.env);

export const env = createEnv({
  server: {
    BETTER_AUTH_BASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_URL: z.string(),
    ALLOWED_ORIGINS: z.string(),
    
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
    log.error("env.validation.failed", { issue });
    process.exit(-1);
  },
});
