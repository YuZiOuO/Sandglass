import { AsyncLocalStorage } from "node:async_hooks";
import pino from "pino";
import type { LogScope, RequestTraceContext } from "@sandglass/shared";
import { LOG_SERVICES } from "@sandglass/shared";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogFields = Record<string, unknown> & {
  err?: unknown;
};

const requestContextStorage = new AsyncLocalStorage<RequestTraceContext>();
const rootLogger = pino({
  base: {
    service: LOG_SERVICES.api,
    env: process.env.NODE_ENV,
  },
}, process.env.NODE_ENV === "production" ? process.stdout : pino.transport({
  target: "pino-pretty",
}));

// Public request-scoped context helpers used by middleware.
export const withRequestContext = <T>(context: RequestTraceContext, fn: () => T) => {
  return requestContextStorage.run(context, fn);
};

export const updateRequestContext = (patch: Partial<RequestTraceContext>) => {
  const current = requestContextStorage.getStore();
  if (!current) return;
  Object.assign(current, patch);
};

// Public logger factory used by API modules.
export const createLogger = (scope: LogScope) => {
  const logger = rootLogger.child({ scope });
  const write = (level: LogLevel, message: string, fields?: LogFields) => {
    const payload = {
      ...requestContextStorage.getStore(),
      ...fields,
    };

    if (Object.keys(payload).length) {
      logger[level](payload, message);
      return;
    }

    logger[level](message);
  };

  return {
    debug: (message: string, fields?: LogFields) => write("debug", message, fields),
    info: (message: string, fields?: LogFields) => write("info", message, fields),
    warn: (message: string, fields?: LogFields) => write("warn", message, fields),
    error: (message: string, fields?: LogFields) => write("error", message, fields),
  };
};
